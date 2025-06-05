# Email Service và Event System trong DDD Architecture

## Tổng quan

Hệ thống email service đã được tích hợp vào kiến trúc DDD với các tính năng:
- Gửi email chào mừng khi đăng ký tài khoản
- Gửi email xác nhận khi tạo đơn hàng thành công
- Gửi email thông báo khi hủy đơn hàng

## Cấu trúc files đã tạo

### 1. Email Service
- `Application/Common/Interfaces/IEmailService.cs` - Interface cho email service
- `Infrastructure/Services/EmailService.cs` - Implementation của email service

### 2. Domain Events
- `Domain/Common/IDomainEvent.cs` - Base interface cho domain events
- `Application/Common/Events/UserRegisteredEvent.cs` - Event đăng ký user
- `Application/Common/Events/OrderCreatedEvent.cs` - Event tạo đơn hàng
- `Application/Common/Events/OrderCancelledEvent.cs` - Event hủy đơn hàng

### 3. Event Handlers
- `Application/Common/Events/Handlers/UserRegisteredEventHandler.cs` - Xử lý event đăng ký
- `Application/Common/Events/Handlers/OrderCreatedEventHandler.cs` - Xử lý event tạo đơn hàng
- `Application/Common/Events/Handlers/OrderCancelledEventHandler.cs` - Xử lý event hủy đơn hàng

### 4. Command Handlers đã được cập nhật
- `Application/Identities/Commands/SignUp/CreateSignUpCommandHandler.cs` - Thêm event publishing
- `Application/SaleBill/Commands/Create/CreateSaleBill.cs` - Thêm event publishing
- `Application/SaleBill/Commands/UpdateStatus/UpdateStatusBillHandler.cs` - Thêm event publishing

## Cấu hình Email

### 1. Cập nhật appsettings.json
```json
{
  "Email": {
    "SmtpHost": "smtp.gmail.com",
    "SmtpPort": "587",
    "FromEmail": "your-email@gmail.com",
    "FromPassword": "your-app-password"
  }
}
```

### 2. Cấu hình Gmail
- Bật 2-Factor Authentication
- Tạo App Password trong Google Account
- Sử dụng App Password thay vì mật khẩu thường

## Sử dụng

### 1. Đăng ký tài khoản (có email)
```json
POST /api/identity/signup
{
  "username": "user123",
  "password": "password123",
  "email": "user@example.com"
}
```

### 2. Tạo đơn hàng
```json
POST /api/salebill
{
  "seller_id": "seller-id",
  "total_bill": 100000,
  "pay_method": "COD",
  "address_delivery_id": "address-id",
  "list_order_item": ["item1", "item2"],
  "list_bill_detail": [...],
  "list_voucher": [...]
}
```

### 3. Cập nhật trạng thái đơn hàng (hủy)
```json
PUT /api/salebill/status
{
  "id": "bill-id",
  "status": "CANCELLED"
}
```

## Flow hoạt động

### 1. User Registration Flow
1. User gửi request đăng ký với email
2. `CreateSignUpHandler` tạo account mới
3. Publish `UserRegisteredEvent`
4. `UserRegisteredEventHandler` nhận event và gửi welcome email

### 2. Order Creation Flow
1. User tạo đơn hàng
2. `CreateSaleBillCommandHandler` tạo bill mới
3. Lấy thông tin buyer từ database
4. Publish `OrderCreatedEvent`
5. `OrderCreatedEventHandler` nhận event và gửi confirmation email

### 3. Order Cancellation Flow
1. Cập nhật trạng thái đơn hàng thành "CANCELLED"
2. `UpdateStatusBillHandler` kiểm tra status change
3. Nếu chuyển sang CANCELLED, publish `OrderCancelledEvent`
4. `OrderCancelledEventHandler` nhận event và gửi cancellation email

## Lợi ích của pattern này

### 1. Separation of Concerns
- Business logic tách biệt khỏi email sending logic
- Event handlers có thể thêm logic khác (logging, notifications, etc.)

### 2. Scalability
- Email sending không block main business flow
- Có thể dễ dàng thêm handlers khác cho cùng event

### 3. Testability
- Có thể mock IEmailService trong unit tests
- Event handlers có thể test độc lập

### 4. Maintainability
- Thêm/sửa email templates dễ dàng
- Thêm loại email mới không ảnh hưởng code cũ

## Lưu ý

1. Email service sử dụng SMTP nên cần internet connection
2. Cần cấu hình email credentials đúng
3. Event handlers có try-catch để không break main flow nếu email fail
4. Cần tạo migration để thêm email field vào AccountEntity
5. Cần cập nhật validation cho email field trong SignUp command

## Migration cần thiết

Để thêm email field vào database:
```bash
dotnet ef migrations add AddEmailToAccount
dotnet ef database update
```

## Production considerations

1. Sử dụng email service provider chuyên nghiệp (SendGrid, AWS SES)
2. Implement email queue để xử lý volume lớn
3. Add email templates từ database thay vì hardcode
4. Add retry mechanism cho failed emails
5. Add email tracking và analytics