#!/usr/bin/env python3
"""Download public course-images from Supabase into assets/images/uploads/."""
from __future__ import annotations

import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "assets" / "images" / "uploads"
CONFIG = ROOT / "supabase" / "config.js"
PATH_RE = re.compile(r"/storage/v1/object/public/course-images/([^?\"']+)")


def load_config():
    text = CONFIG.read_text()
    url = re.search(r"url:\s*['\"]([^'\"]+)['\"]", text)
    key = re.search(r"anonKey:\s*['\"]([^'\"]+)['\"]", text)
    if not url or not key:
        raise SystemExit("找不到 Supabase 設定")
    return url.group(1).rstrip("/"), key.group(1)


def api(url, key, path, body=None):
    data = None if body is None else json.dumps(body).encode()
    req = urllib.request.Request(
        f"{url}{path}",
        data=data,
        headers={
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
        },
        method="POST" if body is not None else "GET",
    )
    with urllib.request.urlopen(req, timeout=60) as response:
        return json.loads(response.read().decode() or "[]")


def walk_urls(value, paths):
    if isinstance(value, str):
        match = PATH_RE.search(value)
        if match:
            paths.add(urllib.parse.unquote(match.group(1)))
    elif isinstance(value, list):
        for item in value:
            walk_urls(item, paths)
    elif isinstance(value, dict):
        for item in value.values():
            walk_urls(item, paths)


def collect_from_db(url, key):
    paths = set()
    try:
        courses = api(url, key, "/rest/v1/courses?select=image_url,teacher_works,student_works,tracks")
        walk_urls(courses, paths)
    except urllib.error.HTTPError as error:
        print(f"讀取課程圖片失敗：HTTP {error.code}", file=sys.stderr)
    try:
        photos = api(url, key, "/rest/v1/site_photos?select=image_url")
        walk_urls(photos, paths)
    except urllib.error.HTTPError as error:
        print(f"讀取主頁照片失敗：HTTP {error.code}", file=sys.stderr)
    return paths


def list_objects(url, key, prefix=""):
    rows = api(
        url,
        key,
        "/storage/v1/object/list/course-images",
        {"prefix": prefix, "limit": 1000, "offset": 0},
    )
    files = []
    for row in rows or []:
        name = row.get("name")
        if not name or name in {".emptyFolderPlaceholder"}:
            continue
        rel = f"{prefix}{name}" if prefix else name
        if row.get("id") and row.get("metadata"):
            files.append(rel)
        else:
            files.extend(list_objects(url, key, f"{rel}/"))
    return files


def download(url, key, rel):
    dest = DEST / rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    req = urllib.request.Request(
        f"{url}/storage/v1/object/public/course-images/{urllib.parse.quote(rel)}",
        headers={"apikey": key, "Authorization": f"Bearer {key}"},
    )
    with urllib.request.urlopen(req, timeout=60) as response:
        dest.write_bytes(response.read())
    print(rel)


def main():
    url, key = load_config()
    DEST.mkdir(parents=True, exist_ok=True)
    files = collect_from_db(url, key)
    try:
        files.update(list_objects(url, key))
    except urllib.error.HTTPError as error:
        print(f"無法列出 Storage：HTTP {error.code}", file=sys.stderr)
        if not files:
            raise SystemExit(f"無法列出圖片：HTTP {error.code}") from error
    if not files:
        print("沒有可同步的圖片")
        return
    failed = 0
    for rel in sorted(files):
        try:
            download(url, key, rel)
        except urllib.error.HTTPError as error:
            failed += 1
            print(f"略過 {rel}：HTTP {error.code}", file=sys.stderr)
    print(f"同步 {len(files) - failed}/{len(files)} 張圖片")
    if failed and failed == len(files):
        raise SystemExit("全部圖片下載失敗")


if __name__ == "__main__":
    main()
