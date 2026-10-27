# Kiểm tra bàn giao — 28/10/2026

## Đã kiểm tra

| Nhóm | Kết quả | Phạm vi |
|---|---|---|
| Đóng gói production | PASS | `npm run build`, React/Vite tạo `dist` |
| Xử lý API | 7 PASS | `npm test`: login envelope, bearer/401, suspended, forbidden, network/JSON, cancellation, public URLs |
| Landing desktop | PASS | Xem giao diện ở viewport 1440 px; không tràn ngang |
| Landing điện thoại | PASS | Viewport 390 px; menu mở/đóng; anchor cuộn tới đúng phần; không tràn ngang |
| FAQ | PASS | Mở câu trả lời, `aria-expanded` cập nhật |
| Dashboard QA | PASS | Đăng nhập QA → xác minh `/me` → tổng quan; báo cáo tuần và biểu đồ danh mục |
| Danh sách QA | PASS | Phiên nghi vấn, tranh chấp, người dùng, tài khoản nội bộ |
| Chi tiết QA | PASS | Bằng chứng nghi vấn, lịch sử tranh chấp, mở/đóng hộp chi tiết |
| Tìm kiếm/phân trang QA | PASS | Trang đầu 20 người dùng, trang tiếp theo rỗng, trở về; lọc vai trò và tìm email |
| Sai quyền QA | PASS | Tài khoản trả role Seller bị từ chối trước khi vào dashboard |
| Đăng xuất QA | PASS | Quay về form đăng nhập |
| Dashboard điện thoại QA | PASS | Tổng quan 2 cột; bảng cuộn trong vùng riêng, không làm tràn toàn trang |
| Backend thật — login sai | PASS | Gửi email giả không tồn tại; nhận thông báo “Email hoặc mật khẩu không đúng” từ backend Render |
| APK | PASS | Bản public trùng SHA-256 với APK người dùng gửi, 57.338.415 byte |

SHA-256 APK:

```text
27B426A8492DA1508A3E4CF3B4EBEADB04B54D78D22B58D2721FC8F4CD6260BE
```

## Giới hạn

- Đăng nhập thành công và số liệu dashboard được kiểm tra qua fixture API cục bộ riêng (`tests/ui-fixture.mjs`), theo cấu trúc phản hồi đã đọc trong backend. Chưa đăng nhập bằng tài khoản Admin thật trong đợt này, nên chưa xác nhận số liệu trên database thật.
- Bản chạy thông thường dùng backend Render, không dùng fixture. Dữ liệu QA không được trộn vào dashboard thật và không được dùng khi build production.
- Chưa deploy landing page hoặc tạo/push repo GitHub. CORS của domain deploy mới cần kiểm tra sau deploy.
- Đã đưa đúng APK vào website; chưa cài lại APK hoặc kiểm thử app Android trong phạm vi công việc landing page này.
- Chưa chạy luồng thay đổi tiền, phiên, tài khoản hoặc tranh chấp trên database thật. Bản bàn giao ban đầu chỉ theo dõi và xem chi tiết; bản nâng cấp đã bổ sung thao tác quản trị, xem ADMIN_KIEM_THU.md.
- Kiểm tra giao diện bằng trình duyệt trên máy; chưa kiểm tra trên điện thoại vật lý hoặc toàn bộ các trình duyệt khác nhau.
