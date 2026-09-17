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
3. `site-photos.sql`：加入主頁輪播和歡迎區塊照片。
4. `notify-registration.sql`：報名成功後寄信到管理員信箱。

## 報名通知郵件

報名寫入資料庫後會自動寄信，不經過前端。

報名寫入資料庫後會自動寄信，不經過前端。收件人是 `inkhouse.macao@gmail.com`，寄件人是 `Ink House <noreply@inkhouse-macao.com>`。

1. 用這個 Gmail 到 [resend.com](https://resend.com) 註冊（免費）。
2. 建立 API key。
3. Dashboard → Database → Extensions，打開 `pg_net`。
4. 打開 `notify-registration.sql`，把檔案裡的 `re_xxxxxxxx` 換成你的 API key。
5. 整份在 SQL Editor 執行。
6. 再執行 `select public.test_registration_email();`，結果應為 `"ok": true`。
7. 檢查 Gmail（含垃圾郵件）。若沒收到，執行：

```sql
select * from public.email_log order by created_at desc limit 5;
select id, status_code, content, error_msg from net._http_response order by created desc limit 5;
```

寄件人必須是已在 Resend 驗證的網域。請到 [resend.com/domains](https://resend.com/domains) 加入 `inkhouse-macao.com`，把顯示的 DNS 紀錄加到網域商，驗證通過後即可寄信。

改收件人：

```sql
update public.site_settings set value = 'inkhouse.macao@gmail.com' where key = 'notify_email';
```

把中心正式微信 QR Code 命名為 `wechat-qr.png`，放到網站的 `assets` 資料夾。報名成功後系統會自動顯示這張圖片及付款提示。

課程圖片和主頁照片会上传到 Supabase Storage 的 `course-images` bucket，限制为每张最多 5MB。

不要把 `service_role` key 放在网页程式码中。前端只能使用公开的 anon key；安全权限由 Row Level Security 管理。

課程、排課、報名表和後台登入目前均已連接 Supabase。
