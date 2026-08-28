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

## Supabase

全新项目依次执行：

1. `supabase/schema.sql`
2. `supabase/seed.sql`
3. `supabase/storage.sql`

旧项目再按需要执行：

1. `supabase/registration-upgrade.sql`
2. `supabase/course-fields-upgrade.sql`

前端只使用 Supabase anon key，数据权限由 Row Level Security 控制。不要在仓库或浏览器代码中使用 `service_role` key。

## 微信 QR Code

把中心正式 QR 图片命名为 `wechat-qr.png`，放到 `assets/`。报名成功页面会自动显示；图片尚未提供时会显示占位提示。

## 部署

这是纯静态网站，可部署到 GitHub Pages、Cloudflare Pages 或 Netlify。GitHub Pages 的发布目录使用仓库根目录。
