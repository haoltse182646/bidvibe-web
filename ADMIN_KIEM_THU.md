# Kiểm tra bản nâng cấp quản trị — 28/10/2026

## Kết quả

- `npm run build`: PASS, bản production tạo thành công.
- `npm test`: **17 PASS, 0 FAIL** (7 ca xử lý kết nối và 10 ca dữ liệu thao tác/biểu đồ).
- Mọi thao tác ghi được thử trên fixture cục bộ riêng; không thay đổi backend thật.

| Kiểm tra qua giao diện | Kết quả |
|---|---|
| Đăng nhập QA, tổng quan và báo cáo tuần | PASS |
| Thêm nhân sự và xuất hiện trong danh sách | PASS |
| Sửa tên, vai trò và trạng thái nhân sự | PASS |
| Email giữ nguyên, mật khẩu trống không gửi khi sửa | PASS qua dữ liệu request và biểu mẫu |
| Không thể đổi vai trò/trạng thái của chính Admin đang dùng | PASS |
| Tạm khóa rồi mở khóa người dùng | PASS |
| Tạm dừng rồi yêu cầu xác minh phiên | PASS |
| Đánh dấu an toàn phiên | PASS |
| Chấm dứt phiên, bắt buộc nhập lý do | PASS |
| Phán quyết hoàn tiền và giữ giao dịch | PASS |
| Tranh chấp đã đóng không còn nút phán quyết | PASS |
| Email tạo trùng hiển thị lỗi, giữ nội dung đang nhập | PASS |
| Bốn biểu đồ tròn mới hiển thị đúng dữ liệu và tương tác chú thích | PASS |
| Nội dung báo cáo đang hiển thị không có từ “API” | PASS |
| Biểu đồ điện thoại 390 px không tràn toàn trang | PASS |
| Biểu mẫu điện thoại 390 px nằm trong khung 360 px, đầy đủ nút | PASS sau khi sửa độ rộng |

Các endpoint ghi đã được gọi thành công trên fixture:

```text
POST  /api/admin/ops-accounts
PATCH /api/admin/ops-accounts/:id
PATCH /api/admin/accounts/:id
POST  /api/admin/flags/:id/action
POST  /api/admin/disputes/:id/resolve
```

## Phạm vi và giới hạn

Đã đối chiếu dữ liệu gửi với routes và service backend tham chiếu. Fixture dùng bản ghi giả trong bộ nhớ và không gọi backend thật. Vì vậy các kết quả trên xác nhận giao diện, validation, xử lý phản hồi và contract request, chưa xác nhận giao dịch database, hoàn tiền, phát thông báo hoặc ngắt socket trên môi trường thật.

Chưa thay đổi tài khoản, phiên hoặc tiền trên database chung; chưa deploy hay push GitHub trong đợt này. Chạy ứng dụng thông thường vẫn dùng backend cấu hình trong `.env`. Môi trường QA cổng 5174 đã dừng sau kiểm tra.

Nguồn cũ `KIEM_THU.md` ghi kết quả bản bàn giao đầu tiên; tài liệu này áp dụng cho bản nâng cấp chức năng quản trị.
