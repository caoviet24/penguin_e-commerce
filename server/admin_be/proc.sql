use penguin_ecommerce


--Account
--
CREATE OR ALTER PROCEDURE sp_create_account 
    @acc_id NVARCHAR(50),
    @username NVARCHAR(MAX), 
    @password NVARCHAR(MAX),
    @role NVARCHAR(MAX),
    @is_banned BIT,
    @created_at DATETIME2,
    @updated_at DATETIME2,

    @user_id NVARCHAR(50),
    @full_name NVARCHAR(MAX),
    @nick_name NVARCHAR(MAX),
    @gender NVARCHAR(MAX),
    @birth DATETIME2,
    @avatar NVARCHAR(MAX), 
    @address NVARCHAR(MAX), 
    @phone NVARCHAR(MAX),
    @last_updated DATETIME2,
    @updated_by NVARCHAR(50)
AS
BEGIN
    BEGIN TRANSACTION;

    INSERT INTO Account
    VALUES (@acc_id, @username, @password, @role, @is_banned, @created_at, @updated_at);
    
    INSERT INTO [User]
    VALUES (@user_id, @full_name, @nick_name, @gender, @birth, @avatar, @address, @phone, @created_at, @acc_id, @last_updated, @updated_by);

    SELECT acc.Id, acc.password, acc.username, acc.role, acc.is_banned, acc.created_at, acc.updated_at,
        us.Id, us.full_name, us.nick_name, us.gender, us.birth, us.avatar, us.address, us.phone
    FROM Account acc
    INNER JOIN [User] us ON acc.Id = us.created_by
    WHERE us.created_by = @acc_id;

    COMMIT TRANSACTION;
END

-- 
CREATE  OR ALTER  PROCEDURE  sp_find_account_by_id @acc_id NVARCHAR(50)
AS  
BEGIN 
	 SELECT acc.Id, acc.username, acc.role, acc.is_banned, acc.created_at, acc.updated_at,
        us.Id, us.full_name, us.nick_name, us.gender, us.birth, us.avatar, us.address, us.phone
    FROM Account acc
    INNER JOIN [User] us ON acc.Id = us.created_by
    WHERE acc.Id = @acc_id;
END

EXEC sp_find_account_by_id @acc_id = '6d146333-8268-4f6d-8610-f6d5003bb28a'

-- 
CREATE  OR ALTER  PROCEDURE  sp_find_account_by_username @username NVARCHAR(MAX) 
AS  
BEGIN 
	SELECT * FROM Account WHERE  username = @username
END


--User
--



--Category
--
CREATE OR ALTER PROCEDURE sp_create_category
    @category_id NVARCHAR(50),
    @category_name NVARCHAR(MAX),
    @created_at DATETIME2,
    @created_by NVARCHAR(50),
    @last_updated DATETIME2,
    @updated_by NVARCHAR(50)
AS
BEGIN
    BEGIN TRANSACTION;
	
	INSERT INTO Category
    VALUES (@category_id, @category_name, @created_at, @created_by, @last_updated, @updated_by);

    SELECT * FROM Category WHERE Id = @category_id;
   
   COMMIT TRANSACTION;
END

--
CREATE OR ALTER PROCEDURE sp_find_category_by_id @category_id NVARCHAR(50)
AS
BEGIN
    SELECT cg.Id, cg.category_name, cg.created_at, cg.created_by, cg.last_updated, cg.updated_by,
            cgd.Id, cgd.category_detail_name, cgd.created_at, cgd.updated_at
    FROM Category cg
    INNER JOIN CategoryDetail cgd ON cg.Id = cgd.category_id
    WHERE cg.Id = @category_id
END


--
CREATE OR ALTER PROCEDURE sp_find_category_by_name @category_name NVARCHAR(MAX)
AS
BEGIN
    SELECT cg.Id, cg.category_name, cg.created_at, cg.created_by, cg.last_updated, cg.updated_by,
            cgd.Id, cgd.category_detail_name, cgd.created_at, cgd.updated_at
    FROM Category cg
    INNER JOIN CategoryDetail cgd ON cg.Id = cgd.category_id
    WHERE category_name = @category_name;
END

--
CREATE OR ALTER PROCEDURE sp_get_categories_pagination
    @page_number INT,       
    @page_size INT
AS
BEGIN
    SET NOCOUNT ON;
  
    DECLARE @offset INT = (@page_number - 1) * @page_size;
   
    SELECT cg.Id , cg.category_name, cg.created_at, cg.created_by, cg.last_updated, cg.updated_by,
             cgd.category_id, cgd.Id ,cgd.category_detail_name, cgd.created_at, cgd.updated_at
    FROM Category cg
    INNER JOIN CategoryDetail cgd ON cg.Id = cgd.category_id
    ORDER BY cg.Id
    OFFSET @offset ROWS FETCH NEXT @page_size ROWS ONLY;
   
   SELECT COUNT(*) AS [total_records] FROM Category;
END;


EXEC sp_get_categories_pagination @page_number = 1, @page_size = 10;


--CategoryDetail
--
CREATE OR ALTER PROCEDURE sp_create_category_detail
	@category_detail_id NVARCHAR(50),
	@category_detail_name NVARCHAR(MAX),
	@created_at DATETIME2,
	@updated_at DATETIME2,
	@category_id NVARCHAR(50)
AS 
BEGIN 
	BEGIN TRANSACTION;
	INSERT INTO CategoryDetail
	VALUES (@category_detail_id, @category_detail_name, @created_at, @updated_at, @category_id)
	
	SELECT cg.Id, cg.category_name, cg.created_at, cg.created_by,
			cgd.Id, cgd.category_id,cgd.category_detail_name
	FROM Category cg 
	INNER JOIN CategoryDetail cgd ON cg.Id = cgd.category_id
	WHERE cg.Id = @category_id

    COMMIT TRANSACTION;
END




--Product
--
CREATE OR ALTER PROCEDURE sp_get_products_pagination
    @page_number INT,       
    @page_size INT
AS
BEGIN
    SET NOCOUNT ON;
  
    DECLARE @offset INT = (@page_number - 1) * @page_size;
   
    SELECT  pro.Id, pro.product_desc, pro.status, pro.created_at, pro.created_by, pro.last_updated, pro.updated_by,
    		prod.product_id, prod.Id, prod.product_name, prod.color, prod.size, prod.sale_price , prod.promotional_price, prod.created_at, prod.updated_at
    FROM Product pro
    INNER JOIN CategoryDetail cgd ON cgd.Id = pro.category_detail_id 
    INNER JOIN ProductDetail prod ON pro.Id = prod.product_id
    ORDER BY pro.created_at DESC
    OFFSET @offset ROWS FETCH NEXT @page_size ROWS ONLY;
   
   SELECT COUNT(*) AS [total_records] FROM Product;
END;

--
CREATE OR ALTER PROCEDURE sp_get_products_pagination_by_desc
    @page_number INT,       
    @page_size INT,
    @product_desc NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
  
    DECLARE @offset INT = (@page_number - 1) * @page_size;
   
    SELECT  pro.Id, pro.product_desc, pro.status, pro.created_at, pro.created_by, pro.last_updated, pro.updated_by,
    		prod.product_id, prod.Id, prod.product_name, prod.color, prod.size, prod.price_sale, prod.promotional_price, prod.created_at, prod.updated_at
    FROM Product pro
    INNER JOIN ProductDetail prod ON pro.Id = prod.product_id
    WHERE pro.product_desc LIKE '%' + @product_desc + '%'
    ORDER BY pro.created_at DESC
    OFFSET @offset ROWS FETCH NEXT @page_size ROWS ONLY;
   
   SELECT COUNT(*) AS [total_records] FROM Product;
  
END;


--
CREATE OR ALTER PROCEDURE sp_get_product_by_id
    @product_id NVARCHAR(50)
AS
BEGIN
    SELECT  pro.Id, pro.product_desc, pro.status, pro.created_at, pro.created_by, pro.last_updated, pro.updated_by,
    		prod.product_id, prod.Id, prod.product_name, prod.color, prod.size, prod.price_sale, prod.promotional_price, prod.created_at, prod.updated_at
    FROM Product pro
    INNER JOIN ProductDetail prod ON pro.Id = prod.product_id
    WHERE pro.Id = @product_id
END;

--
CREATE OR ALTER PROCEDURE sp_get_product_by_created_by_and_desc
	@created_by NVARCHAR(50),
	@product_desc NVARCHAR(MAX)
AS
BEGIN 
	 SELECT * FROM Product p 
	 WHERE created_by = @created_by AND product_desc = @product_desc
END


--
CREATE OR ALTER PROCEDURE sp_create_product
	@product_id NVARCHAR(50),
	@product_desc NVARCHAR(MAX),
	@status INT,
	@category_detail_id NVARCHAR(50),
	@created_at DATETIME2,
	@created_by NVARCHAR(50),
	@last_updated DATETIME2,
	@updated_by NVARCHAR(50)
AS 
BEGIN 
	BEGIN TRANSACTION;

	INSERT INTO Product
	VALUES (@product_id, @product_desc, @status, @category_detail_id, @created_at, @created_by, @last_updated, @updated_by)

    SELECT cgd.Id, cgd.category_detail_name,
            pro.Id, pro.product_desc, pro.status, pro.created_at, pro.created_by, pro.updated_by
    FROM CategoryDetail cgd 
    INNER JOIN Product pro ON cgd.Id = pro.category_detail_id
    WHERE pro.Id = @product_id;

    COMMIT TRANSACTION;

END


--
use shoppe

--ProductDetail
--
CREATE OR ALTER PROCEDURE sp_create_product_detail
    @product_detail_id NVARCHAR(450),
    @product_id NVARCHAR(450),
    @product_name NVARCHAR(MAX),
    @image NVARCHAR(MAX),
    @color NVARCHAR(MAX),
    @size NVARCHAR(MAX),
    @sale_price FLOAT,
    @promotional_price FLOAT,
    @sale_quantity INT,
    @stock_quantity INT,
    @created_at DATETIME2,
    @updated_at DATETIME2
AS 
BEGIN
    BEGIN TRANSACTION;

    INSERT INTO ProductDetail 
    VALUES (@product_detail_id, @product_name, @color, @size, @sale_price, @promotional_price, @sale_quantity, @stock_quantity, @created_at, @updated_at, @product_id, @image);

    SELECT Id, product_name, image, color, size, sale_price, promotional_price, sale_quantity, stock_quantity, created_at, updated_at, product_id
    FROM ProductDetail
    WHERE Id = @product_detail_id;

    COMMIT TRANSACTION;
END;


--
CREATE OR ALTER PROCEDURE sp_get_detail_products_pagination_by_name
    @page_number INT,       
    @page_size INT,
    @product_name NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
  
    DECLARE @offset INT = (@page_number - 1) * @page_size;
   
    SELECT  pro.Id, pro.product_desc, pro.status, pro.created_at, pro.created_by, pro.last_updated, pro.updated_by,
    		prod.product_id, prod.Id, prod.product_name, prod.color, prod.size, prod.price_sale, prod.promotional_price, prod.sale_quantity, prod.stock_quantity, prod.created_at, prod.updated_at
    FROM  ProductDetail
    WHERE pro.product_desc LIKE '%' + @product_desc + '%'
    ORDER BY prod.created_at DESC
    OFFSET @offset ROWS FETCH NEXT @page_size ROWS ONLY;
   
   SELECT COUNT(*) AS [total_records] FROM Product;
  
END;



--Voucher
--
CREATE OR ALTER PROCEDURE sp_get_voucher_inactive_pagination
	@page_number INT,       
    @page_size INT
AS 
BEGIN 
	SET NOCOUNT ON;
  
    DECLARE @offset INT = (@page_number - 1) * @page_size;
   
    SELECT  * FROM Voucher
    ORDER BY created_at DESC
    OFFSET @offset ROWS FETCH NEXT @page_size ROWS ONLY;
   
   SELECT COUNT(*) AS [total_records] FROM Product;
END


--
CREATE OR ALTER PROCEDURE sp_create_voucher
    @voucher_id NVARCHAR(50),
    @voucher_type NVARCHAR(50),
    @voucher_name NVARCHAR(50),
    @voucher_code NVARCHAR(50),
    @apply_for NVARCHAR(50),
    @expiry_date DATETIME2,
    @quantity_remain INT,
    @quantity_used INT,
    @discount DECIMAL(10, 2),
    @type_discount NVARCHAR(50),
    @status_voucher INT,
    @created_at DATETIME2,
    @created_by NVARCHAR(50),
    @last_updated DATETIME2,
    @updated_by NVARCHAR(50)
AS
BEGIN
    BEGIN TRANSACTION;
	
        INSERT INTO Voucher
        VALUES (@voucher_id, @voucher_name, @voucher_code, @expiry_date, @quantity_remain, @quantity_used, @discount, @status_voucher, @created_at, @created_by, @last_updated, @updated_by, @type_discount, @apply_for, @voucher_type);

        SELECT * FROM Voucher WHERE Id = @voucher_id;

        COMMIT TRANSACTION;
  
END


--OrderItem
-- 
CREATE OR ALTER PROCEDURE sp_get_order_item_status_waitting_by_seller_id
	@page_number INT,
	@page_size INT,
	@seller_id NVARCHAR(50)
AS 
BEGIN 
	
	SET NOCOUNT ON;

	DECLARE @offset INT = (@page_number - 1) * @page_size;
   
    SELECT oi.Id, oi.status_order, oi.pay_method, oi.total_order, oi.seller_id,  oi.buyer_id,  oi.created_at,
    		oid.Id, oid.product_detail_id, prod.product_name, prod.sale_price, oid.quantity, oid.size, oid.color
    FROM Account acc
    INNER JOIN OrderItem oi ON acc.Id = oi.seller_id 
    INNER JOIN OrderItemDetail oid ON oid.order_id = oi.Id 
    INNER JOIN ProductDetail prod ON prod.Id = oid.product_detail_id 
    WHERE oi.seller_id = @seller_id
    ORDER BY oi.created_at DESC
    OFFSET @offset ROWS FETCH NEXT @page_size ROWS ONLY;
   
   SELECT
	COUNT(*) AS [total_records]
FROM
	OrderItem;
END


--
CREATE OR ALTER PROCEDURE sp_create_order_item_to_cart
	@order_id NVARCHAR(50),
	@status_order INT,
	@pay_method NVARCHAR(MAX),
	@total_order FLOAT,
	@seller_id NVARCHAR(50),
	@buyer_id NVARCHAR(50),
	@updated_by NVARCHAR(50),
	@created_at DATETIME2,
	@last_updated DATETIME2
AS 
BEGIN 
	BEGIN TRANSACTION;

	INSERT INTO OrderItem 
	VALUES (@order_id, @status_order, @pay_method, @total_order, @seller_id, @created_at, @buyer_id, @last_updated, @updated_by)
	
	SELECT * FROM OrderItem 
	WHERE Id = @order_id


	COMMIT TRANSACTION;
END


--
CREATE OR ALTER PROCEDURE sp_update_total_order_by_Id
	@order_id NVARCHAR(50),
	@total_order FLOAT
AS 
BEGIN 
	BEGIN TRANSACTION;
	UPDATE OrderItem 
	SET total_order = @total_order 
	WHERE Id = @order_id
	COMMIT TRANSACTION;
END



--OrderDetailItem
--
CREATE OR ALTER PROCEDURE sp_create_order_detail_item
	@order_detail_id NVARCHAR(50),
	@product_detail_id NVARCHAR(50),
	@quantity INT,
	@size NVARCHAR(50),
	@color NVARCHAR(50),
	@order_id NVARCHAR(50)
AS 
BEGIN 
	BEGIN TRANSACTION;

	INSERT INTO OrderItemDetail 
	VALUES (@order_detail_id, @product_detail_id, @quantity, @size, @color, @order_id)
	
	SELECT * FROM OrderItem 
	WHERE Id = @order_detail_id


	COMMIT TRANSACTION;
END









