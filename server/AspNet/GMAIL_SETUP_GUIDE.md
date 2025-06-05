# Hướng dẫn cài đặt Gmail cho Email Service

## Vấn đề hiện tại
Lỗi: `The SMTP server requires a secure connection or the client was not authenticated. The server response was: 5.7.0 Authentication Required`

## Nguyên nhân
Gmail không cho phép sử dụng mật khẩu thông thường cho ứng dụng bên ngoài khi đã bật 2-Factor Authentication.

## Giải pháp: Tạo App Password

### Bước 1: Kiểm tra 2-Factor Authentication
1. Đăng nhập vào [Google Account](https://myaccount.google.com/)
2. Vào **Security** > **2-Step Verification**
3. Đảm bảo 2-Step Verification đã được bật (bạn đã bật từ 10/3)

### Bước 2: Tạo App Password
1. Trong **Security**, tìm **App passwords**
2. Click **App passwords** (nếu không thấy, có thể cần search "App passwords")
3. Select app: **Mail**
4. Select device: **Other (custom name)**
5. Nhập tên: `Penguin E-commerce API`
6. Click **Generate**
7. Copy mật khẩu 16 ký tự được tạo ra (ví dụ: `abcd efgh ijkl mnop`)

### Bước 3: Cập nhật appsettings.json
```json
{
  "Email": {
    "SmtpHost": "smtp.gmail.com",
    "SmtpPort": "587",
    "FromEmail": "example@gmail.com",
    "FromPassword": "abcd efgh ijkl mnop"
  }
}
```

**Lưu ý:** Sử dụng App Password (16 ký tự), KHÔNG phải mật khẩu Gmail thông thường
