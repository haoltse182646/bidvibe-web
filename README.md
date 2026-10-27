# BidVibe Web

Landing page tiếng Việt và dashboard Admin cho BidVibe. Project React + Vite riêng với app Flutter, có animation, bố cục desktop/mobile, nút mở app web và tải APK Android.

## 1. Mở project đã tạo

Bạn không cần tạo lại bằng `npm create vite`: project này đã có đầy đủ code và cấu hình.

Nên chép **toàn bộ thư mục `bidvibe-web`** hoặc giải nén gói bàn giao vào một thư mục làm việc riêng, ví dụ:

```text
C:\Users\haolu\Documents\reactjs\bidvibe-web
```

Không chép `node_modules`, `dist` từ nơi khác. Không đặt project mới vào bên trong repo Flutter `bidvibe_fe`.

Mở thư mục mới bằng VS Code, mở Terminal và chạy:

```powershell
cd C:\Users\haolu\Documents\reactjs\bidvibe-web
npm.cmd ci
Copy-Item .env.example .env
npm.cmd run dev
```

Yêu cầu Node.js 22.12 trở lên. Dùng `npm.cmd` trên Windows nếu PowerShell chặn `npm.ps1`.

Mở **http://127.0.0.1:5173/**. Bấm **Đăng nhập Admin** hoặc vào **http://127.0.0.1:5173/#/admin**. Dùng tài khoản Admin nội bộ hiện có; project không chứa tài khoản hoặc mật khẩu thật.

Nhấn `Ctrl+C` trong Terminal để dừng website.

Nếu cần học cách tạo khung React từ đầu cho một project khác:

```powershell
npm.cmd create vite@latest ten-project-khac -- --template react
```

Không chạy lệnh tạo mới để ghi đè project BidVibe đã bàn giao. Tham khảo [Vite](https://vite.dev/guide/).

## 2. Cấu hình ứng dụng

File `.env` (chép từ `.env.example`):

```dotenv
VITE_API_BASE_URL=https://bidvibe-be.onrender.com
VITE_APP_WEB_URL=https://bidvibe.netlify.app/
VITE_APP_DOWNLOAD_URL=
```

- API base không thêm `/api` ở cuối. Code tự thêm tiền tố này.
- Link mở app đã trỏ tới bản web bạn cung cấp.
- Khi để trống `VITE_APP_DOWNLOAD_URL`, nút Android tải file `public/downloads/bidvibe.apk`. File này là bản sao APK bạn gửi, dung lượng khoảng 57,3 MB.
- Có thể thay biến download bằng link HTTPS trực tiếp tới GitHub Releases hoặc nơi lưu APK; khi đó trình duyệt mở/tải theo cấu hình của dịch vụ đó. Thuộc tính `download` có thể không áp dụng cho link khác domain.
- Khi cập nhật APK, thay đúng file `public/downloads/bidvibe.apk`, rồi build/deploy lại.
- Thay `.env` thì khởi động lại `npm run dev`; nếu đã deploy cần build lại.
- Các biến `VITE_*` là thông tin công khai trong trình duyệt. Không dùng chúng để chứa JWT secret, mật khẩu hoặc chuỗi kết nối database.

## 3. Landing page và animation

- Hero với mô hình app và đồng hồ minh họa tự vẽ bằng SVG.
- Nhãn nổi chuyển động, vòng quỹ đạo, thanh chữ chạy, hiệu ứng hiện khi cuộn, hover và FAQ.
- Các phần: trải nghiệm, cách hoạt động, niềm tin, câu hỏi thường gặp, mở ứng dụng/tải Android.
- Menu thu gọn cho điện thoại, hỗ trợ bàn phím và tùy chọn giảm chuyển động của hệ điều hành.
- Giao diện điện thoại và giá trong hero được ghi rõ là minh họa. Landing page không lấy dữ liệu phiên thật.
- Google Fonts được tải qua mạng; khi không có mạng, trình duyệt dùng font dự phòng.

Sửa nội dung tại `src/Landing.jsx`, giao diện tại `src/styles.css`.

## 4. API Admin đã tích hợp

Đối chiếu trực tiếp `bidvibe_be_review/src/routes/admin.routes.js`, `src/services/admin_service.js`, `src/services/auth_service.js`, `src/services/dispute_service.js` và bộ Postman trong bản tham chiếu project.

| Chức năng | API | Dữ liệu dùng |
|---|---|---|
| Đăng nhập nội bộ | `POST /api/auth/ops/login` | `{ email, password }`; lấy `data.token`, `data.role` |
| Xác minh tài khoản | `GET /api/me` | Kiểm tra `role=admin`, `kind=ops`, `status=active` |
| Tổng quan | `GET /api/admin/dashboard` | auctions, appraisal, orders, flags, disputes, users, escrowHeld |
| Báo cáo tuần | `GET /api/admin/report/weekly` | GMV, phí ước tính, topCategories, tài khoản mới, nạp ví |
| Phiên nghi vấn | `GET /api/admin/flags` | Trạng thái, mức độ, chi tiết, bằng chứng |
| Tranh chấp | `GET /api/admin/disputes` | Danh sách, ký quỹ, các bên, lịch sử |
| Người dùng | `GET /api/admin/accounts` | Tìm tên/email, lọc vai trò/trạng thái, phân trang |
| Tài khoản nội bộ | `GET /api/admin/ops-accounts` | Lọc vai trò/trạng thái |

Phản hồi đúng contract `{ success, data, error }`. Gửi `Authorization: Bearer <token>` với request có bảo vệ. Mỗi request giới hạn chờ 60 giây. Có loading, lỗi kết nối, nút thử lại, trang trống và phân trang 20 bản ghi cho danh sách API có hỗ trợ.

**Admin đã hỗ trợ cả 11 endpoint quản trị:** 6 đọc và 5 ghi. Có tạo/sửa nhân sự, khóa/mở người dùng, xử lý cờ nghi vấn và phán quyết tranh chấp, cùng 4 biểu đồ tròn mới. Xem [ADMIN_CHUC_NANG.md](ADMIN_CHUC_NANG.md) để biết chi tiết, hệ quả của thao tác và phạm vi kiểm tra.

Biểu đồ thể hiện trạng thái đơn hàng và GMV theo danh mục; backend hiện chưa trả chuỗi doanh thu theo ngày. Không tạo số tăng trưởng hoặc doanh thu giả.

JWT chỉ được giữ trong bộ nhớ trang, không lưu localStorage/sessionStorage/cookie. F5 hoặc đóng tab sẽ cần đăng nhập lại. Đăng xuất, lỗi 401 hoặc `ACCOUNT_SUSPENDED` sẽ xóa phiên. Backend vẫn là nơi kiểm tra quyền thật.

## 5. Kiểm tra

```powershell
npm.cmd test
npm.cmd run build
npm.cmd run preview
```

`npm test` kiểm tra request đăng nhập, bearer token, hết phiên, tài khoản bị khóa, lỗi quyền, lỗi mạng/JSON, hủy request và link an toàn. `npm run build` tạo bản deploy trong `dist`.

Công cụ kiểm tra giao diện bằng dữ liệu giả riêng, không kết nối backend thật:

```powershell
node tests/ui-fixture.mjs
```

Mở `http://127.0.0.1:5174/#/admin`, dùng **qa@example.test / qa-only**. Chỉ đây là thông tin QA giả. Chạy bằng lệnh riêng; `npm run dev` và `npm run build` mặc định vẫn dùng backend thật. Dừng fixture bằng Ctrl+C. Không deploy fixture server.

Đọc `KIEM_THU.md` để biết các kiểm tra đã thực hiện và giới hạn xác minh.

## 6. Đưa code lên GitHub

Thực hiện trong thư mục làm việc riêng ở bước 1, **không chạy tại thư mục gốc project ChatGPT hoặc thư mục Flutter**.

1. Vào GitHub → New repository → đặt tên `bidvibe-web` → chọn Private/Public theo nhu cầu → không tạo sẵn README, .gitignore, license → Create repository.
2. Trong Terminal của thư mục `bidvibe-web`:

```powershell
git init -b main
git add .
git status
git commit -m "Create BidVibe landing page and admin dashboard"
```

3. Chép URL **repo vừa tạo của bạn** vào lệnh dưới. Thay `TEN_GITHUB_CUA_BAN` trước khi chạy:

```powershell
git remote add origin https://github.com/TEN_GITHUB_CUA_BAN/bidvibe-web.git
git push -u origin main
```

Git có thể yêu cầu đăng nhập GitHub trên trình duyệt. Không nhập mật khẩu GitHub vào code.

`.gitignore` đã loại `node_modules`, `dist`, `.env`, log. `.env.example` được đưa lên repo. APK gốc đã nằm trong thư mục public nên đi cùng repo, khoảng 57,3 MB, có thể khiến lần push đầu lâu hơn. Nếu nhóm muốn repo nhẹ, đưa APK lên GitHub Releases, điền URL download, rồi bỏ APK khỏi phần source trước khi commit; giữ bản APK gốc trong Downloads.

Nếu `origin` đã tồn tại, kiểm tra `git remote -v` trước; không đổi remote hoặc force push khi chưa xác minh repo đích.

Khi làm tiếp:

```powershell
git switch -c feature/update-landing
```

Sửa code, chạy test/build, commit và push nhánh rồi tạo PR vào `main` (hoặc `develop` nếu nhóm dùng quy trình này).

**Gói bàn giao chưa tự tạo repo GitHub, push hoặc deploy.** Các bước trên để bạn thực hiện với đúng tài khoản và repo mong muốn.

## 7. Deploy bằng Netlify

Có thể deploy thành website mới để giữ link app `bidvibe.netlify.app` hiện tại.

Cách nhanh: `npm.cmd run build`, rồi upload **thư mục `dist`** lên Netlify. Không upload cả project hoặc thư mục `public`.

Cách kết nối GitHub: chọn repo `bidvibe-web`, cấu hình:

```text
Build command: npm run build
Publish directory: dist
```

Trong Netlify, khai báo các biến môi trường từ `.env.example` nếu cần thay giá trị. Project có `netlify.toml`. Trang Admin dùng `/#/admin`, nên tải lại link không cần rewrite server.

Nếu đăng nhập báo lỗi kết nối/CORS, phía BE cần cho phép origin của landing page mới và `http://127.0.0.1:5173` khi phát triển. Bản BE tham chiếu sử dụng `CORS_ORIGIN`; phải đối chiếu cách backend parse biến trước khi cấu hình nhiều domain. Chỉ đổi frontend không thể tự sửa CORS của server.

Tài liệu chính thức: [Vite — Build](https://vite.dev/guide/build.html), [Netlify — Deploy](https://docs.netlify.com/deploy/create-deploys/), [GitHub — Thêm code local](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github).
