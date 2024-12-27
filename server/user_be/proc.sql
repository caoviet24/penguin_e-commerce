use penguin


--Account
CREATE OR ALTER PROCEDURE sp_get_accounts_pagination
    @page_number INT,       
    @page_size INT
AS
BEGIN
    SET NOCOUNT ON;
  
    DECLARE @offset INT = (@page_number - 1) * @page_size;
   
    SELECT * FROM Account
    ORDER BY created_at DESC
    OFFSET @offset ROWS FETCH NEXT @page_size ROWS ONLY;
   
   SELECT COUNT(*) AS [total_records] FROM Account;
END;

-- 
CREATE  OR ALTER  PROCEDURE  sp_get_account_by_username 
	@username NVARCHAR(MAX) 
AS  
BEGIN 
	SELECT * FROM Account WHERE  username = @username
END

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
        us.Id as [user_id], us.full_name, us.nick_name, us.gender, us.birth, us.avatar, us.address, us.phone
    FROM Account acc
    INNER JOIN [User] us ON acc.Id = us.created_by
    WHERE us.created_by = @acc_id;

    COMMIT TRANSACTION;
END

--
CREATE OR ALTER PROCEDURE  sp_ban_account_by_id
	@acc_id NVARCHAR(50)
AS 
BEGIN 
		
	BEGIN TRANSACTION;

	UPDATE Account
	SET is_banned = 1
	WHERE Id = @acc_id;

	SELECT acc.Id, acc.password, acc.username, acc.role, acc.is_banned, acc.created_at, acc.updated_at,
        us.Id as [user_id], us.full_name, us.nick_name, us.gender, us.birth, us.avatar, us.address, us.phone
    FROM Account acc
    INNER JOIN [User] us ON acc.Id = us.created_by
    WHERE us.created_by = @acc_id;
   
   COMMIT TRANSACTION;
END

-- 
CREATE OR ALTER PROCEDURE sp_update_role_by_acc_id 
	@acc_id NVARCHAR(50),
	@role NVARCHAR(MAX)
AS 
BEGIN 
	
	BEGIN TRANSACTION;

	UPDATE Account
	SET role = @role
	WHERE Id = @acc_id;

	SELECT acc.Id, acc.password, acc.username, acc.role, acc.is_banned, acc.created_at, acc.updated_at,
        us.Id as [user_id], us.full_name, us.nick_name, us.gender, us.birth, us.avatar, us.address, us.phone
    FROM Account acc
    INNER JOIN [User] us ON acc.Id = us.created_by
    WHERE us.created_by = @acc_id;
   
   COMMIT TRANSACTION;
END

--
CREATE OR ALTER PROCEDURE sp_delete_account_by_id 
	@acc_id NVARCHAR(50)
AS 
BEGIN 
	
	BEGIN TRANSACTION
	
END

--User
--
CREATE OR ALTER PROCEDURE sp_update_user_by_id
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
 	
	 BEGIN TRANSACTION
	 
	 UPDATE [User]
	 SET 
	 	full_name = @full_name,
	 	nick_name = @nick_name,
   		gender = @gender,
    	birth = @birth,
    	avatar = @avatar, 
    	address = @address, 
    	phone = @phone,
    	last_updated = @last_updated,
    	updated_by = @updated_by
     WHERE Id = @user_id
	 
	 COMMIT
	 
	 SELECT * FROM [User] WHERE Id = @user_id
	 
 END
 


--Booth
--
CREATE OR ALTER PROCEDURE sp_get_booth_inactive_pagination
	@page_number INT,
	@page_size INT
AS 
BEGIN 
	SET NOCOUNT ON;
	DECLARE @offset INT = (@page_number - 1) * @page_size;

	SELECT * FROM MyBooth
	WHERE is_active = 0
	ORDER BY created_at DESC 
	OFFSET @offset ROWS FETCH NEXT @page_size ROWS ONLY;
END

--
CREATE OR ALTER PROCEDURE sp_get_booth_by_acc_id
	@acc_id NVARCHAR(50)
AS 
BEGIN 
	
	SELECT acc.Id, mb.*
	FROM Account acc
	INNER JOIN MyBooth mb ON acc.Id = mb.created_by
	WHERE acc.Id = @acc_id
	
END

--
CREATE OR ALTER PROCEDURE sp_get_booth_by_id
	@booth_id NVARCHAR(50)
AS 
BEGIN 
	SELECT * FROM MyBooth WHERE Id = @booth_id
END

--
CREATE OR ALTER PROCEDURE sp_create_my_booth
	@booth_id NVARCHAR(50),
	@booth_name NVARCHAR(MAX),
	@booth_description  NVARCHAR(MAX),
	@avatar NVARCHAR(MAX),
	@is_banned BIT,
	@is_active BIT,
	@created_at DATETIME2,
    @created_by NVARCHAR(50),
    @last_updated DATETIME2,
    @updated_by NVARCHAR(50)
AS
BEGIN 
	BEGIN TRANSACTION;
	
	INSERT INTO MyBooth
	VALUES (@booth_id, @booth_name, @booth_description, @avatar, @is_banned, @is_active, @created_at, @created_by, @last_updated, @updated_by)
	
	COMMIT
	SELECT * FROM MyBooth WHERE Id = @booth_id
	
END

--
CREATE OR ALTER PROCEDURE sp_delete_booth_by_id
	@booth_id NVARCHAR(50)
AS 
BEGIN 
	BEGIN TRANSACTION;

	DELETE FROM MyBoot OUTPUT Id
	WHERE Id = @booth_id;

	SELECT * FROM MyBooth WHERE Id = @booth_id
	COMMIT;
END


--
CREATE OR ALTER PROCEDURE sp_ban_booth_by_id
	@booth_id NVARCHAR(50)
AS 
BEGIN 
	BEGIN TRANSACTION;

	UPDATE MyBooth
	SET is_banned = 1
	WHERE Id = @booth_id;

	SELECT * FROM MyBooth WHERE Id = @booth_id
	COMMIT;
END



--Category
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

--
CREATE OR ALTER PROCEDURE sp_get_category_by_id @category_id NVARCHAR(50)
AS
BEGIN
    SELECT cg.Id, cg.category_name, cg.created_at, cg.created_by, cg.last_updated, cg.updated_by,
            cgd.Id, cgd.category_detail_name, cgd.created_at, cgd.updated_at
    FROM Category cg
    INNER JOIN CategoryDetail cgd ON cg.Id = cgd.category_id
    WHERE cg.Id = @category_id
END


--
CREATE OR ALTER PROCEDURE sp_get_category_by_name_pagination
	@page_number INT,
	@page_size INT,
	@category_name NVARCHAR(MAX)
AS
BEGIN
    
	SET NOCOUNT ON;
	
	DECLARE @offset INT = (@page_number - 1) * @page_size;
	
	SELECT cg.Id, cg.category_name, cg.created_at, cg.created_by, cg.last_updated, cg.updated_by,
            cgd.Id, cgd.category_detail_name, cgd.created_at, cgd.updated_at
    FROM Category cg
    INNER JOIN CategoryDetail cgd ON cg.Id = cgd.category_id
    WHERE category_name LIKE '%' + @category_name + '%'
    ORDER BY cg.created_at DESC 
    OFFSET @offset ROWS FETCH NEXT @page_size ROWS ONLY;
   
    SELECT COUNT(*) AS [total_records] FROM Category
    WHERE category_name LIKE '%' + @category_name + '%'
   
END

--
CREATE OR ALTER PROCEDURE sp_create_category
    @category_id NVARCHAR(50),
    @category_name NVARCHAR(MAX),
    @image NVARCHAR(MAX),
    @created_at DATETIME2,
    @created_by NVARCHAR(50),
    @last_updated DATETIME2,
    @updated_by NVARCHAR(50)
AS
BEGIN
    BEGIN TRANSACTION;
	
	INSERT INTO Category
    VALUES (@category_id, @category_name, @created_at, @created_by, @last_updated, @updated_by, @image);

    SELECT * FROM Category WHERE Id = @category_id;
   
   COMMIT TRANSACTION;
END




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
   
    SELECT 
    		mb.Id, mb.booth_name,
    		pro.Id, pro.product_desc, pro.status, pro.created_at, pro.created_by, pro.last_updated, pro.updated_by,
    		prod.product_id, prod.Id, prod.product_name, prod.color, prod.size, prod.sale_price , prod.promotional_price, prod.created_at, prod.updated_at
    FROM MyBooth mb 
    INNER JOIN Product pro ON mb.Id = pro.created_by
    INNER JOIN ProductDetail prod ON pro.Id = prod.product_id
    ORDER BY pro.created_at DESC
    OFFSET @offset ROWS FETCH NEXT @page_size ROWS ONLY;
   
   SELECT COUNT(*) AS [total_records] FROM Product;
END;

--
CREATE OR ALTER PROCEDURE sp_get_product_active_pagination 
    @page_number INT,       
    @page_size INT
AS
BEGIN
    SET NOCOUNT ON;
  
    DECLARE @offset INT = (@page_number - 1) * @page_size;
   
    SELECT 
    		mb.Id, mb.booth_name,
    		pro.Id, pro.product_desc, pro.status, pro.created_at, pro.created_by, pro.last_updated, pro.updated_by,
    		prod.product_id, prod.Id, prod.product_name, prod.color, prod.size, prod.sale_price , prod.promotional_price, prod.created_at, prod.updated_at
    FROM MyBooth mb 
    INNER JOIN Product pro ON mb.Id = pro.created_by
    INNER JOIN ProductDetail prod ON pro.Id = prod.product_id
    WHERE pro.status = 1
    ORDER BY pro.created_at DESC
    OFFSET @offset ROWS FETCH NEXT @page_size ROWS ONLY;
   
   SELECT COUNT(*) AS [total_records] FROM Product;
END;

--
CREATE OR ALTER PROCEDURE sp_get_product_inactive_pagination 
    @page_number INT,       
    @page_size INT
AS
BEGIN
    SET NOCOUNT ON;
  
    DECLARE @offset INT = (@page_number - 1) * @page_size;
   
    SELECT 
    		mb.Id, mb.booth_name,
    		pro.Id, pro.product_desc, pro.status, pro.created_at, pro.created_by, pro.last_updated, pro.updated_by,
    		prod.product_id, prod.Id, prod.product_name, prod.color, prod.size, prod.sale_price , prod.promotional_price, prod.created_at, prod.updated_at
    FROM MyBooth mb 
    INNER JOIN Product pro ON mb.Id = pro.created_by
    INNER JOIN ProductDetail prod ON pro.Id = prod.product_id
    WHERE pro.status = 0
    ORDER BY pro.created_at DESC
    OFFSET @offset ROWS FETCH NEXT @page_size ROWS ONLY;
   
   SELECT COUNT(*) AS [total_records] FROM Product;
END;


--
CREATE OR ALTER PROCEDURE sp_get_products_by_user_pagination
	@page_number INT,
	@page_size INT,
	@id NVARCHAR(50)
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
	
END

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
    		prod.product_id, prod.Id, prod.product_name, prod.color, prod.size, prod.sale_price, prod.promotional_price, prod.created_at, prod.updated_at
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
    		prod.product_id, prod.Id, prod.product_name, prod.color, prod.size, prod.sale_price, prod.promotional_price, prod.created_at, prod.updated_at
    FROM Product pro
    INNER JOIN ProductDetail prod ON pro.Id = prod.product_id
    WHERE pro.Id = @product_id
END;


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
    VALUES (@product_detail_id, @product_name, @image, @color, @size, @sale_price, @promotional_price, @sale_quantity, @stock_quantity, @created_at, @updated_at, @product_id);

    SELECT Id, product_name, image, color, size, sale_price, promotional_price, sale_quantity, stock_quantity, created_at, updated_at, product_id
    FROM ProductDetail
    WHERE Id = @product_detail_id;

    COMMIT TRANSACTION;
END;

--
CREATE OR ALTER PROCEDURE sp_update_detail_product_by_id
	@product_detail_id NVARCHAR(50),
    @product_name NVARCHAR(MAX),
    @image NVARCHAR(MAX),
    @color NVARCHAR(MAX),
    @size NVARCHAR(MAX),
    @sale_price FLOAT,
    @promotional_price FLOAT,
    @sale_quantity INT,
    @stock_quantity INT,
    @updated_at DATETIME2
AS 
BEGIN 
	BEGIN TRANSACTION;

    UPDATE ProductDetail
    SET  
    	product_name = @product_name,
    	image = @image,
    	color = @color,
    	size = @size,
    	sale_price = @sale_price,
    	promotional_price = @promotional_price,
    	sale_quantity = @sale_quantity,
    	stock_quantity = @stock_quantity,
    	updated_at = updated_at
    WHERE Id = @product_detail_id;
    
	COMMIT TRANSACTION;

    SELECT Id, product_name, image, color, size, sale_price, promotional_price, sale_quantity, stock_quantity, created_at, updated_at, product_id
    FROM ProductDetail
    WHERE Id = @product_detail_id;

END


--
CREATE OR ALTER PROCEDURE sp_update_quantity_product_detail_by_id
	@product_detail_id NVARCHAR(50),
    @sale_quantity INT,
    @stock_quantity INT
 AS
 BEGIN 
 	BEGIN TRANSACTION;

    UPDATE ProductDetail
    SET sale_quantity = @sale_quantity,
    	stock_quantity = @stock_quantity
    WHERE Id = @product_detail_id;
    
	COMMIT TRANSACTION;

    SELECT Id, product_name, image, color, size, sale_price, promotional_price, sale_quantity, stock_quantity, created_at, updated_at, product_id
    FROM ProductDetail
    WHERE Id = @product_detail_id;
 END
 


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
    WHERE status_voucher = 0
    ORDER BY created_at DESC
    OFFSET @offset ROWS FETCH NEXT @page_size ROWS ONLY;
   
   SELECT COUNT(*) AS [total_records] FROM Voucher WHERE status_voucher = 0;
END

--
CREATE OR ALTER PROCEDURE sp_get_voucher_active_pagination
	@page_number INT,       
    @page_size INT
AS 
BEGIN 
	SET NOCOUNT ON;
  
    DECLARE @offset INT = (@page_number - 1) * @page_size;
   
    SELECT  * FROM Voucher
    WHERE status_voucher = 1
    ORDER BY created_at DESC
    OFFSET @offset ROWS FETCH NEXT @page_size ROWS ONLY;
   
   SELECT COUNT(*) AS [total_records] FROM Voucher WHERE status_voucher = 1;
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
        VALUES (@voucher_id, @voucher_type, @voucher_name, @voucher_code, @apply_for, @expiry_date, @quantity_remain, @quantity_used, @type_discount, @discount, @status_voucher, @created_at, @created_by, @last_updated, @updated_by);

        SELECT * FROM Voucher WHERE Id = @voucher_id;

        COMMIT TRANSACTION;
  
END

--
CREATE OR ALTER PROCEDURE sp_active_voucher_by_id 
	@voucher_id NVARCHAR(50)
AS 
BEGIN 
	BEGIN TRANSACTION
	
	UPDATE Voucher
	SET status_voucher = 1
	WHERE Id = @voucher_id
	
	COMMIT TRANSACTION
	
	SELECT * FROM Voucher WHERE Id = @voucher_id
END

--
CREATE OR ALTER PROCEDURE sp_inactive_voucher_by_id 
	@voucher_id NVARCHAR(50)
AS 
BEGIN 
	BEGIN TRANSACTION
	
	UPDATE Voucher
	SET status_voucher = 0
	WHERE Id = @voucher_id
	
	COMMIT TRANSACTION
	
	SELECT * FROM Voucher WHERE Id = @voucher_id
END


--
CREATE OR ALTER PROCEDURE sp_update_quantity_voucher_by_id
	@voucher_id NVARCHAR(50),
	@quantity_remain INT,
	@quantity_used INT
AS 
BEGIN 
	BEGIN TRANSACTION
	
	UPDATE Voucher
	SET quantity_remain -= @quantity_remain,
		quantity_used += @quantity_used
	WHERE Id = @voucher_id
	
	COMMIT TRANSACTION
	
	SELECT * FROM Voucher WHERE Id = @voucher_id
END




--OrderItem
-- 
CREATE OR ALTER PROCEDURE sp_get_order_item_by_buyer_id
	@buyer_id NVARCHAR(50)
AS 
BEGIN 
    SELECT od.Id, od.buyer_id, od.product_detail_id, prod.product_name, prod.image, prod.sale_price, prod.promotional_price, od.quantity, od.size, od.color
    FROM OrderItem od
    INNER JOIN ProductDetail prod ON prod.Id = od.product_detail_id
    WHERE od.buyer_id = @buyer_id
 END

--
CREATE OR ALTER PROCEDURE sp_create_order_item_to_cart
	@order_id NVARCHAR(50),
	@seller_id NVARCHAR(50),
	@buyer_id NVARCHAR(50),
	@product_detail_id NVARCHAR(50),
	@quantity INT,
	@size NVARCHAR(10),
	@color NVARCHAR(30),
	@updated_by NVARCHAR(50),
	@created_at DATETIME2,
	@last_updated DATETIME2
AS 
BEGIN 
	BEGIN TRANSACTION;

	INSERT INTO OrderItem 
	VALUES (@order_id, @quantity, @size, @seller_id, @created_at, @buyer_id, @last_updated, @updated_by, @color, @product_detail_id)
	

	COMMIT TRANSACTION;

	SELECT * FROM OrderItem 
	WHERE Id = @order_id
END


--
CREATE OR ALTER PROCEDURE sp_detele_order_item_by_id 
	@order_id NVARCHAR(50)
AS 
BEGIN 

	BEGIN TRANSACTION;

	DELETE FROM OrderItem OUTPUT DELETED.Id
	WHERE Id = @order_id
	
	COMMIT TRANSACTION;
END
