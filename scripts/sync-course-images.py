#!/usr/bin/env python3
"""Download public course-images from Supabase into assets/images/uploads/."""
from __future__ import annotations

import json
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "assets" / "images" / "uploads"
CONFIG = ROOT / "supabase" / "config.js"


def load_config():
    text = CONFIG.read_text()
    url = re.search(r"url:\s*'([^']+)'", text)
    key = re.search(r"anonKey:\s*'([^']+)'", text)
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
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode() or "[]")


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
        f"{url}/storage/v1/object/public/course-images/{rel}",
        headers={"apikey": key, "Authorization": f"Bearer {key}"},
    )
    with urllib.request.urlopen(req) as response:
        dest.write_bytes(response.read())
    print(rel)


def main():
    url, key = load_config()
    DEST.mkdir(parents=True, exist_ok=True)
    try:
        files = list_objects(url, key)
    except urllib.error.HTTPError as error:
        raise SystemExit(f"無法列出圖片：HTTP {error.code}") from error
    if not files:
        print("沒有可同步的圖片")
        return
    for rel in files:
        try:
            download(url, key, rel)
        except urllib.error.HTTPError as error:
            print(f"略過 {rel}：HTTP {error.code}", file=sys.stderr)


if __name__ == "__main__":
    main()
