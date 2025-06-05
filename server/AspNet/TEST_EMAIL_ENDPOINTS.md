# Test Email Service Endpoints

## 1. Test User Registration with Email

### Request:
```http
POST http://localhost:5000/api/identity/signup
Content-Type: application/json

{
  "username": "testuser123",
  "password": "Test123456!",
  "email": "test@example.com"
}
```

### Expected Response:
```json
{
  "id": "generated-user-id",
  "username": "testuser123",
  "email": "test@example.com",
  "role": "User",
  "is_banned": false,
  "is_deleted": false,
  ...
}
```

### Email Event:
- UserRegisteredEvent should be published
- Welcome email should be sent to test@example.com

## 2. Test Order Creation

### Request:
```http
POST http://localhost:5000/api/salebill
Content-Type: application/json
Authorization: Bearer <your-jwt-token>

{
  "seller_id": "seller-id",
  "total_bill": 100000,
  "pay_method": "COD",
  "address_delivery_id": "address-id",
  "list_order_item": [],
  "list_bill_detail": [
    {
      "product_detail_id": "product-detail-id",
      "quantity": 1,
      "size": "M",
      "color": "Red"
    }
  ],
  "list_voucher": []
}
```

### Expected Response:
```json
{
  "id": "generated-bill-id",
  "seller_id": "seller-id",
  "total_bill": 100000,
  "status": "PENDING",
  ...
}
```

### Email Event:
- OrderCreatedEvent should be published
- Order confirmation email should be sent to buyer's email

## 3. Test Order Cancellation

### Request:
```http
PUT http://localhost:5000/api/salebill/status
Content-Type: application/json
Authorization: Bearer <your-jwt-token>

{
  "id": "bill-id",
  "status": "CANCELLED"
}
```

### Expected Response:
```json
{
  "id": "bill-id",
  "status": "CANCELLED",
  ...
}
```

### Email Event:
- OrderCancelledEvent should be published
- Order cancellation email should be sent to buyer's email

## Configuration Checklist

Before testing, ensure:

1. ✅ Email configuration in appsettings.json is correct
2. ✅ SMTP credentials are valid
3. ✅ Database migration has been applied
4. ✅ Email service is registered in DI container
5. ✅ Event handlers are registered automatically by MediatR

## Email Templates

The system sends these email types:

### Welcome Email (User Registration)
- Subject: "Chào mừng bạn đến với Penguin E-commerce!"
- Contains: Username, welcome message

### Order Confirmation Email
- Subject: "Xác nhận đơn hàng thành công"
- Contains: Order ID, total amount, order status

### Order Cancellation Email
- Subject: "Thông báo hủy đơn hàng"
- Contains: Order ID, cancellation notice

## Debugging Tips

1. Check application logs for email service messages
2. Verify email configuration in appsettings.json
3. Test SMTP connection separately if needed
4. Check event handler execution in logs
5. Ensure email field is properly saved in database

## Common Issues

1. **Email not sent**: Check SMTP configuration and credentials
2. **Event not triggered**: Verify event publishing in command handlers
3. **Email field missing**: Run database migration
4. **Authentication failed**: Use App Password for Gmail