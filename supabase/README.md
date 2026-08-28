# Supabase 設定

1. 在 Supabase 建立免費專案。
2. 打開 SQL Editor，先執行 `schema.sql`，再執行 `seed.sql`。
3. 執行 `storage.sql`，建立課程圖片儲存桶及安全權限。
4. 在 Authentication 建立管理員帳號。
5. 到 Table Editor 的 `profiles`，把該使用者的 `role` 改為 `admin`。
6. 在 `config.js` 填入 Project URL 和 anon key。

如果專案已經執行過舊版 `schema.sql`，請再到 SQL Editor 依次執行：

1. `registration-upgrade.sql`：加入多選課程和微信欄位。
2. `course-fields-upgrade.sql`：加入老師、日期、每週上課日和上下課時間，并把課程類別改为自由输入。

把中心正式微信 QR Code 命名為 `wechat-qr.png`，放到網站的 `assets` 資料夾。報名成功後系統會自動顯示這張圖片及付款提示。

課程圖片会上传到 Supabase Storage 的 `course-images` bucket，限制为每张最多 5MB。

不要把 `service_role` key 放在网页程式码中。前端只能使用公开的 anon key；安全权限由 Row Level Security 管理。

課程、排課、報名表和後台登入目前均已連接 Supabase。
