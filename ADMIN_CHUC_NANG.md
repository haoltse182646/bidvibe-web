# Chức năng quản trị BidVibe

Nhóm `/api/admin` trong backend tham chiếu có **11 endpoint: 6 đọc dữ liệu và 5 ghi dữ liệu**. Website hiện đã có giao diện cho cả 11. Đăng nhập nội bộ và xác minh danh tính dùng thêm hai endpoint chung; không tính chúng vào nhóm 11 endpoint quản trị.

| Nhóm | Chức năng trong website | Endpoint backend |
|---|---|---|
| Tổng quan | Chỉ số hoạt động, hàng chờ, đơn hàng và tiền đang giữ | `GET /api/admin/dashboard` |
| Báo cáo tuần | Giá trị đơn hàng, phí ước tính, nạp ví và kết quả trong kỳ | `GET /api/admin/report/weekly` |
| Phiên nghi vấn | Lọc, xem bằng chứng và chi tiết phiên | `GET /api/admin/flags` |
| Phiên nghi vấn | Tạm dừng, yêu cầu xác minh, đánh dấu an toàn, chấm dứt | `POST /api/admin/flags/:id/action` |
| Tranh chấp | Xem các bên, ký quỹ và lịch sử | `GET /api/admin/disputes` |
| Tranh chấp | Hoàn tiền người mua hoặc giữ giao dịch | `POST /api/admin/disputes/:id/resolve` |
| Người dùng | Tìm kiếm, lọc vai trò/trạng thái, phân trang | `GET /api/admin/accounts` |
| Người dùng | Tạm khóa hoặc mở khóa tài khoản | `PATCH /api/admin/accounts/:id` |
| Nhân sự | Xem và lọc nhân sự nội bộ | `GET /api/admin/ops-accounts` |
| Nhân sự | Tạo tài khoản thẩm định, kho hoặc quản trị | `POST /api/admin/ops-accounts` |
| Nhân sự | Sửa tên, vai trò, trạng thái và mật khẩu | `PATCH /api/admin/ops-accounts/:id` |

Không có endpoint DELETE trong nhóm này. Email tài khoản nội bộ được giữ nguyên khi chỉnh sửa theo contract backend.

## Các thao tác mới

- **Tài khoản nội bộ → Thêm nhân sự:** nhập tên, email, vai trò và mật khẩu.
- **Tài khoản nội bộ → Chỉnh sửa:** cập nhật tên, vai trò, trạng thái; mật khẩu mới có thể để trống. Không thể tự khóa hoặc tự bỏ quyền Admin. Nếu đổi mật khẩu của chính mình, website yêu cầu đăng nhập lại.
- **Người dùng → Tạm khóa/Mở khóa:** hiển thị tài khoản đích và hệ quả trước khi xác nhận.
- **Phiên nghi vấn → Xem & xử lý:** xem bằng chứng rồi chọn hành động. Chấm dứt bắt buộc có lý do. Cờ đã an toàn/chấm dứt không thể sửa tiếp. Đánh dấu an toàn hoặc yêu cầu xác minh sẽ bỏ chặn nếu phiên đang tạm dừng, theo cách backend hiện thực hiện.
- **Tranh chấp → Xem & xử lý:** xem các bên và lịch sử trước khi hoàn tiền hoặc giữ giao dịch. Hiển thị số tiền và hệ quả; không xử lý lại tranh chấp đã đóng.

Biểu mẫu ngăn gửi lặp khi đang lưu và giữ lại dữ liệu nhập nếu máy chủ trả lỗi. Khi kết quả chưa rõ do mất kết nối/lỗi máy chủ, người dùng được hướng dẫn kiểm tra lại danh sách trước khi thực hiện lần nữa. Không tự gửi lại thao tác ghi.

## Biểu đồ

Tổng cộng sáu biểu đồ dùng dữ liệu được trả về từ hệ thống:

1. Hành trình đơn hàng: thanh ngang theo trạng thái (đã có).
2. Giá trị đơn theo danh mục: thanh ngang trong báo cáo tuần (đã có).
3. Cơ cấu thành viên: người đấu giá, người bán, nhân sự nội bộ.
4. Hàng chờ thẩm định: chờ thẩm định và cần bổ sung.
5. Kết quả phiên trong tuần: bán thành công, kết thúc chưa bán, đã hủy.
6. Kết quả thanh toán: đã thanh toán và hết hạn; không bao gồm đơn còn đang chờ.

Bấm các dòng chú thích của biểu đồ tròn để xem giá trị và tỷ lệ của từng nhóm. Trường hợp toàn bộ giá trị bằng 0 có trạng thái riêng. Không cộng tài khoản tạm khóa thành một nhóm thành viên riêng vì đã nằm trong các vai trò. Không dựng chuỗi doanh thu theo ngày từ dữ liệu tổng hợp tuần.

## Nội dung giao diện

- “Kết nối API BidVibe” → “Đồng bộ cùng BidVibe”.
- “Số liệu từ API” → “Dữ liệu từ hệ thống”.
- Chú thích kỹ thuật dưới biểu đồ → mô tả ý nghĩa số liệu.
- Trạng thái kết nối đổi theo kết quả thực tế khi đang tải hoặc gặp lỗi.
- Lỗi kết nối được diễn đạt bằng ngôn ngữ người dùng.

Các tên kỹ thuật vẫn được giữ trong code và tài liệu cho việc bảo trì.

## Kiểm tra riêng

`npm test` có 17 ca kiểm tra xử lý kết nối, dữ liệu gửi đi, quyền tự bảo vệ tài khoản, các trường hợp đã xử lý, và dữ liệu biểu đồ.

`node tests/ui-fixture.mjs` mở môi trường QA cục bộ tại `http://127.0.0.1:5174/#/admin`, tài khoản giả `qa@example.test / qa-only`. Các thao tác ghi chỉ tác động dữ liệu giả trong bộ nhớ của tiến trình QA. Khởi động lại để reset. Không gửi thông tin đăng nhập thật vào môi trường này.

Backend thật vẫn được sử dụng khi chạy `npm run dev` bình thường. Quyền cuối cùng và việc cập nhật giao dịch thuộc backend.
