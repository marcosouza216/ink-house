# 賞心學堂 Ink House

澳門藝術課程網站，包含兒童／成人課程、動態月曆、線上報名及 Supabase 管理後台。

## 專案結構

```text
.
├── index.html              # 主頁
├── courses.html            # 課程列表
├── course.html             # 課程詳情
├── schedule.html           # 成人／兒童課程月曆
├── signup.html             # 多課程報名表
├── contact.html            # 聯絡資料
├── admin.html              # 管理後台
├── css/                    # 前台、後台及品牌樣式
├── js/                     # 網站、資料層及後台程式
├── assets/
│   ├── images/             # Logo、網站及課程圖片
│   ├── fonts/              # 阿里巴巴普惠體
│   └── brand/              # VI 與 Illustrator 品牌源文件
└── supabase/               # Schema、Storage 與升級 SQL
```

## 本機預覽

```bash
python3 -m http.server 8080
```

打开 `http://localhost:8080`。管理后台位于 `/admin.html`。

圖文使用說明（手機版截圖）：打開 `docs/使用說明.html`。

## Supabase

全新项目依次执行：

1. `supabase/schema.sql`
2. `supabase/seed.sql`
3. `supabase/storage.sql`

旧项目再按需要执行：

1. `supabase/registration-upgrade.sql`
2. `supabase/course-fields-upgrade.sql`
3. `supabase/site-photos.sql`
4. `supabase/notify-registration.sql`
5. `supabase/site-redesign.sql`（兒童三班、名額與作品）
6. `supabase/adult-class-dates.sql`（班級、逐日上課日期、學費／持教）
7. `supabase/kids-enlighten.sql`（啟蒙恆常班文案、學習內容與重點）
8. `supabase/adult-oct-nov.sql`（10～11 月成人班與兒童報名費 MOP 100）
9. `supabase/other-works.sql`（課程「其他照片」）

前端只使用 Supabase anon key，数据权限由 Row Level Security 控制。不要在仓库或浏览器代码中使用 `service_role` key。

## 圖片上傳（Supabase → GitHub）

後台上傳會先存到 Supabase，網站可立刻顯示。同步進 GitHub 後，頁面會優先讀 `assets/images/uploads/`，不再消耗 Supabase 流量。

1. 確認 GitHub 倉庫已開啟 Actions。
2. 在 GitHub 建立 classic PAT（勾選 `repo`），在 SQL Editor 執行 `supabase/github-image-sync.sql`，再把 token 填入：

   ```sql
   update public.site_settings set value = 'ghp_你的token' where key = 'github_token';
   ```

3. 之後每次後台上傳，會觸發 Action `Sync course images`，把檔案提交到 `assets/images/uploads/`。也可在 Actions 頁手動 Run workflow。沒觸發時，Action 每小時仍會自動同步一次。

## 微信 QR Code

把中心正式 QR 圖片命名為 `wechat_qrcode.jpg`，放到 `assets/images/`。報名成功頁面會自動顯示；圖片尚未提供時會顯示佔位提示。

## 部署

这是纯静态网站，可部署到 GitHub Pages、Cloudflare Pages 或 Netlify。GitHub Pages 的发布目录使用仓库根目录。
