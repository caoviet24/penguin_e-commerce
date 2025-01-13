use penguin


--Account
CREATE OR ALTER PROCEDURE sp_get_accounts_pagination
    @page_number INT,       
    @page_size INT
AS
BEGIN
    SET NOCOUNT ON;
  
    DECLARE @offset INT = (@page_number - 1) * @page_size;
   
    SELECT * FROM Account WHERE is_deleted = 0 AND is_banned = 0
    ORDER BY created_at DESC
    OFFSET @offset ROWS FETCH NEXT @page_size ROWS ONLY;
   
   SELECT COUNT(*) AS [total_records] FROM Account WHERE is_deleted = 0 AND is_banned = 0;
END;

--
CREATE OR ALTER PROCEDURE sp_get_accounts_banned
    @page_number INT,       
    @page_size INT
AS
BEGIN
    SET NOCOUNT ON;
  
    DECLARE @offset INT = (@page_number - 1) * @page_size;
   
    SELECT * FROM Account WHERE is_deleted = 0 AND is_banned = 1
    ORDER BY created_at DESC
    OFFSET @offset ROWS FETCH NEXT @page_size ROWS ONLY;
   
   SELECT COUNT(*) AS [total_records] FROM Account WHERE is_deleted = 0 AND is_banned = 1;
END;

--
CREATE OR ALTER PROCEDURE sp_get_accounts_deleted
    @page_number INT,       
    @page_size INT
AS
BEGIN
    SET NOCOUNT ON;
  
    DECLARE @offset INT = (@page_number - 1) * @page_size;
   
    SELECT * FROM Account WHERE is_deleted = 1
    ORDER BY created_at DESC
    OFFSET @offset ROWS FETCH NEXT @page_size ROWS ONLY;
   
   SELECT COUNT(*) AS [total_records] FROM Account WHERE is_deleted = 1;
END;



-- 
CREATE  OR ALTER  PROCEDURE  sp_get_account_by_id
	@Id NVARCHAR(50) 
AS  
BEGIN 
	 SELECT acc.Id, acc.password, acc.username, acc.role, acc.is_banned, acc.created_at, acc.updated_at, acc.is_deleted
        us.Id as [user_id], us.full_name, us.nick_name, us.gender, us.birth, us.avatar, us.address, us.phone
    FROM Account acc
    INNER JOIN [User] us ON acc.Id = us.created_by
    WHERE acc.Id = @Id;
END

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
    @is_deleted BIT,

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

    INSERT INTO [Account]
    VALUES (@acc_id, @username, @password, @role, @is_banned, @created_at, @updated_at, @is_deleted);
    
    INSERT INTO [User]
    VALUES (@user_id, @full_name, @nick_name, @gender, @birth, @avatar, @address, @phone, @created_at, @acc_id, @last_updated, @updated_by, @is_deleted);

    SELECT acc.Id, acc.password, acc.username, acc.role, acc.is_banned, acc.created_at, acc.updated_at,
        us.Id as [user_id], us.full_name, us.nick_name, us.gender, us.birth, us.avatar, us.address, us.phone
    FROM Account acc
    INNER JOIN [User] us ON acc.Id = us.created_by
    WHERE us.created_by = @acc_id;

    COMMIT TRANSACTION;
END

--
CREATE OR ALTER PROCEDURE  sp_delete_account_by_id
	@acc_id NVARCHAR(50)
AS 
BEGIN 
		
	BEGIN TRANSACTION;

	UPDATE Account
	SET is_deleted = 1
	WHERE Id = @acc_id;

	SELECT * FROM Account WHERE Id = @acc_id
   
   COMMIT TRANSACTION;
END

--
CREATE OR ALTER PROCEDURE sp_update_account_by_id
	@acc_id NVARCHAR(50),
    @username NVARCHAR(MAX), 
    @password NVARCHAR(MAX),
    @role NVARCHAR(MAX),
    @is_banned BIT,
    @updated_at DATETIME2
AS 
BEGIN 
	
	BEGIN TRANSACTION
	UPDATE Account 
	SET 
		Id = @acc_id,
		username = @username,
		password = @password,
		role = @role,
		is_banned = @is_banned,
		updated_at = @updated_at
		WHERE Id = @acc_id
		
		SELECT * FROM Account WHERE Id = @acc_id
	COMMIT
END


--
CREATE OR ALTER PROCEDURE sp_ban_account_by_id
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
CREATE OR ALTER PROCEDURE sp_unban_account_by_id
	@acc_id NVARCHAR(50)
AS 
BEGIN 
		
	BEGIN TRANSACTION;

	UPDATE Account
	SET is_banned = 0
	WHERE Id = @acc_id;

	SELECT acc.Id, acc.password, acc.username, acc.role, acc.is_banned, acc.created_at, acc.updated_at,
        us.Id as [user_id], us.full_name, us.nick_name, us.gender, us.birth, us.avatar, us.address, us.phone
    FROM Account acc
    INNER JOIN [User] us ON acc.Id = us.created_by
    WHERE us.created_by = @acc_id;
   
   COMMIT TRANSACTION;
END

--
CREATE OR ALTER PROCEDURE sp_restore_account_by_id
	@Id NVARCHAR(50)
AS 
BEGIN 
		
	BEGIN TRANSACTION;

	UPDATE Account
	SET is_deleted = 0
	WHERE Id = @Id;

	SELECT * FROM Account WHERE Id = @Id
   
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
CREATE OR ALTER PROCEDURE sp_get_booth_active_pagination
	@page_number INT,
	@page_size INT
AS 
BEGIN 
	SET NOCOUNT ON;
	DECLARE @offset INT = (@page_number - 1) * @page_size;

	SELECT * FROM MyBooth
	WHERE is_active = 1
	ORDER BY created_at DESC 
	OFFSET @offset ROWS FETCH NEXT @page_size ROWS ONLY;


	SELECT COUNT(*) FROM MyBooth WHERE is_active = 1
END
 
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


	SELECT COUNT(*) FROM MyBooth WHERE is_active = 0
END


--
CREATE OR ALTER PROCEDURE sp_get_booth_banned_pagination
	@page_number INT,
	@page_size INT
AS 
BEGIN 
	SET NOCOUNT ON;
	DECLARE @offset INT = (@page_number - 1) * @page_size;

	SELECT * FROM MyBooth
	WHERE is_banned = 1
	ORDER BY created_at DESC 
	OFFSET @offset ROWS FETCH NEXT @page_size ROWS ONLY;


	SELECT COUNT(*) FROM MyBooth WHERE is_banned = 1
END



--
CREATE OR ALTER PROCEDURE sp_get_booth_by_acc_id
	@acc_id NVARCHAR(50)
AS 
BEGIN 
	SELECT * FROM MyBooth WHERE created_by = @acc_id
END


--
CREATE OR ALTER PROCEDURE sp_get_booth_by_id
	@booth_id NVARCHAR(50)
AS 
BEGIN 
	SELECT * FROM MyBooth WHERE Id = @booth_id
END


--
CREATE OR ALTER PROCEDURE sp_get_booth_by_name_pagination
	@page_number INT,
	@page_size INT,
	@booth_name NVARCHAR(50)
AS 
BEGIN 
	
	SET NOCOUNT ON;

	DECLARE @offset INT = (@page_number - 1) * @page_size
	
	SELECT * FROM MyBooth
	WHERE booth_name LIKE '%' + @booth_name + '%' 
	ORDER BY created_at DESC
	OFFSET @offset ROWS FETCH NEXT @page_size ROWS ONLY 
	
	
	SELECT COUNT(*) FROM MyBooth
	WHERE booth_name LIKE '%' + @booth_name + '%' 
END


--
CREATE OR ALTER PROCEDURE sp_get_products_by_booth_id_pagination
	@page_number INT,
	@page_size INT,
	@id NVARCHAR(50)
AS 
BEGIN 
	
	SET NOCOUNT ON;
	
	DECLARE @offset INT = (@page_number - 1) * @page_size;

	SELECT  pro.Id, pro.product_desc, pro.status, pro.created_at, pro.booth_id, pro.last_updated, pro.updated_by,
    		prod.product_id, prod.Id, prod.product_name, prod.image, prod.color, prod.size, prod.sale_price , prod.promotional_price, prod.created_at, prod.updated_at
    FROM Product pro
    INNER JOIN ProductDetail prod ON pro.Id = prod.product_id
    WHERE pro.booth_id = @id
    ORDER BY pro.created_at DESC
    OFFSET @offset ROWS FETCH NEXT @page_size ROWS ONLY;
	
   	SELECT  COUNT(pro.Id) AS [total_records]
    FROM Product pro
    WHERE pro.booth_id = @id
   
END

EXECUTE sp_get_products_by_booth_id_pagination @page_number = 1, @page_size = 10, @id = 'c2d21f30-6cf6-4994-bdf0-5c9f1e7651f4'

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
    @updated_by NVARCHAR(50),
    @is_deleted BIT
AS
BEGIN 
	BEGIN TRANSACTION;
	
	INSERT INTO MyBooth
	VALUES (@booth_id, @booth_name, @booth_description, @avatar, @is_banned, @is_active, @created_at, @created_by, @last_updated, @updated_by, @is_deleted)
	
	COMMIT
	SELECT * FROM MyBooth WHERE Id = @booth_id
	
END

--
CREATE OR ALTER PROCEDURE sp_update_booth_by_id
	@booth_id NVARCHAR(50),
	@booth_name NVARCHAR(MAX),
	@booth_description NVARCHAR(MAX),
	@avatar NVARCHAR(MAX),
    @last_updated DATETIME2,
    @updated_by NVARCHAR(50)
AS 
BEGIN 
	
	BEGIN TRANSACTION;

	UPDATE MyBooth
	SET booth_name = @booth_name,
		booth_description = @booth_description,
		booth_avatar = @avatar,
		updated_by = @updated_by,
		last_updated = @last_updated
	WHERE Id = @booth_id;


	
	COMMIT;
	
	SELECT * FROM MyBooth WHERE Id = @booth_id
END


--
CREATE OR ALTER PROCEDURE sp_delete_booth_by_id
	@booth_id NVARCHAR(50)
AS 
BEGIN 
	BEGIN TRANSACTION;

	UPDATE MyBooth
	SET is_deleted = 1
	WHERE Id = @booth_id;

	SELECT * FROM MyBooth WHERE Id = @booth_id
	
	COMMIT;
END

--
CREATE OR ALTER PROCEDURE sp_ban_booth_by_id
	@booth_id NVARCHAR(50),
	@updated_by NVARCHAR(50),
	@last_updated DATETIME2
AS 
BEGIN 
	BEGIN TRANSACTION;

	UPDATE MyBooth
	SET is_banned = 1,
		updated_by = @updated_by,
		last_updated = @last_updated
	WHERE Id = @booth_id;

	SELECT * FROM MyBooth WHERE Id = @booth_id
	
	COMMIT;
END

--
CREATE OR ALTER PROCEDURE sp_active_booth_by_id 
	@booth_id NVARCHAR(50),
	@updated_by NVARCHAR(50),
	@last_updated DATETIME2
AS 
BEGIN 
	
	BEGIN TRANSACTION
	
	UPDATE MyBooth
	SET 
		is_active = 1,
		updated_by = @updated_by,
		last_updated = @last_updated
	WHERE Id = @booth_id
	
	COMMIT TRANSACTION
	
	SELECT * FROM MyBooth WHERE Id = @booth_id
	
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
   
    SELECT cg.Id, cg.category_name, cg.image, cg.created_at, cg.created_by, cg.last_updated, cg.updated_by, cg.is_deleted,
           cgd.category_id, cgd.Id , cgd.category_detail_name, cgd.created_at , cgd.updated_at, cgd.is_deleted 
    FROM Category cg
    INNER JOIN CategoryDetail cgd ON cg.Id = cgd.category_id
    WHERE cg.is_deleted = 0
    ORDER BY cg.created_at DESC
    OFFSET @offset ROWS FETCH NEXT @page_size ROWS ONLY;
   
    SELECT COUNT(*) AS [total_records]
    FROM Category
    WHERE is_deleted = 0;
END;


--
CREATE OR ALTER PROCEDURE sp_get_categories_deleted_pagination
    @page_number INT,
    @page_size INT
AS
BEGIN
    SET NOCOUNT ON;
  
    DECLARE @offset INT = (@page_number - 1) * @page_size;
   
    SELECT cg.Id, cg.category_name, cg.image, cg.created_at, cg.created_by, cg.last_updated, cg.updated_by, cg.is_deleted,
           cgd.category_id, cgd.Id , cgd.category_detail_name, cgd.created_at , cgd.updated_at, cgd.is_deleted 
    FROM Category cg
    INNER JOIN CategoryDetail cgd ON cg.Id = cgd.category_id
    WHERE cg.is_deleted = 1
    ORDER BY cg.created_at DESC
    OFFSET @offset ROWS FETCH NEXT @page_size ROWS ONLY;
   
    SELECT COUNT(*) AS [total_records]
    FROM Category
    WHERE is_deleted = 1;
END;


--
CREATE OR ALTER PROCEDURE sp_get_category_by_id @category_id NVARCHAR(50)
AS
BEGIN
    SELECT cg.Id, cg.category_name, cg.image, cg.created_at, cg.created_by, cg.last_updated, cg.updated_by, cg.is_deleted,
            cgd.category_id, cgd.Id, cgd.category_detail_name, cgd.created_at, cgd.updated_at, cgd.is_deleted
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
	
	SELECT cg.Id, cg.category_name, cg.image, cg.created_at, cg.created_by, cg.last_updated, cg.updated_by,cg.is_deleted,
            cgd.category_id, cgd.Id, cgd.category_detail_name, cgd.created_at, cgd.updated_at, cgd.is_deleted
    FROM Category cg
    INNER JOIN CategoryDetail cgd ON cg.Id = cgd.category_id
    WHERE category_name LIKE '%' + @category_name + '%'
    ORDER BY cg.created_at DESC 
    OFFSET @offset ROWS FETCH NEXT @page_size ROWS ONLY;
   
    SELECT COUNT(*) AS [total_records] FROM Category
    WHERE category_name LIKE '%' + @category_name + '%'
   
END

--
CREATE OR ALTER PROCEDURE sp_get_category_by_name
	@category_name NVARCHAR(MAX)
AS
BEGIN
	SELECT * FROM Category WHERE category_name = @category_name 
END


--
CREATE OR ALTER PROCEDURE sp_create_category
    @category_id NVARCHAR(50),
    @category_name NVARCHAR(MAX),
    @image NVARCHAR(MAX),
    @created_at DATETIME2,
    @created_by NVARCHAR(50),
    @last_updated DATETIME2,
    @updated_by NVARCHAR(50),
    @is_deleted BIT
AS
BEGIN
    BEGIN TRANSACTION;
    
    INSERT INTO Category
    VALUES (@category_id, @category_name, @image, @created_at,@created_by, @last_updated, @updated_by, @is_deleted);

    SELECT * FROM Category WHERE Id = @category_id;
   
    COMMIT TRANSACTION;
END


--
CREATE OR ALTER PROCEDURE sp_update_category_by_id
	@Id NVARCHAR(50),
	@cg_name NVARCHAR(MAX),
	@image NVARCHAR(MAX)
AS
BEGIN
    BEGIN TRANSACTION;
    
    UPDATE Category
    SET category_name = @cg_name,
    	[image] = @image
    WHERE Id = @Id;
   
   SELECT cg.Id, cg.category_name, cg.image, cg.created_at, cg.created_by, cg.last_updated, cg.updated_by, cg.is_deleted,
            cgd.category_id, cgd.Id, cgd.category_detail_name, cgd.created_at, cgd.updated_at, cgd.is_deleted
    FROM Category cg
    INNER JOIN CategoryDetail cgd ON cg.Id = cgd.category_id
    WHERE cg.Id = @Id
    
    COMMIT TRANSACTION;
END;


--
CREATE OR ALTER PROCEDURE sp_delete_category_by_id
	@Id NVARCHAR(50)
AS
BEGIN
    BEGIN TRANSACTION;
    
    UPDATE Category
    SET is_deleted = 1
    WHERE Id = @Id;
   
   SELECT * FROM Category WHERE Id = @Id
    
    COMMIT TRANSACTION;
END;

--
CREATE OR ALTER PROCEDURE sp_restore_category_by_id
	@Id NVARCHAR(50)
AS
BEGIN
    BEGIN TRANSACTION;
    
    UPDATE Category
    SET is_deleted = 0
    WHERE Id = @Id;
   
   SELECT * FROM Category WHERE Id = @Id
    
    COMMIT TRANSACTION;
END;








--CategoryDetail

--
CREATE OR ALTER PROCEDURE sp_get_category_detail_by_cg_id
	@cg_id NVARCHAR(50)
AS
BEGIN 
	
	SELECT * FROM CategoryDetail 
	WHERE category_id = @cg_id
	
END


--
CREATE OR ALTER PROCEDURE sp_create_category_detail
	@category_detail_id NVARCHAR(50),
	@category_detail_name NVARCHAR(MAX),
	@created_at DATETIME2,
	@updated_at DATETIME2,
	@category_id NVARCHAR(50),
	@is_deleted BIT
AS 
BEGIN 
	BEGIN TRANSACTION;
	INSERT INTO CategoryDetail
	VALUES (@category_detail_id, @category_detail_name, @created_at, @updated_at, @category_id, @is_deleted)
	
	SELECT cg.Id, cg.category_name, cg.image, cg.created_at, cg.created_by,
			cgd.Id, cgd.category_id,cgd.category_detail_name
	FROM Category cg 
	INNER JOIN CategoryDetail cgd ON cg.Id = cgd.category_id
	WHERE cg.Id = @category_id

    COMMIT TRANSACTION;
END

--
CREATE OR ALTER PROCEDURE sp_delete_category_detail_2
    @Id NVARCHAR(50)
AS
BEGIN
    BEGIN TRANSACTION;
    
    UPDATE CategoryDetail 
    SET is_deleted = 1
    WHERE Id = @Id;
   
   SELECT * FROM CategoryDetail WHERE Id = @Id
    
    COMMIT TRANSACTION;
END;

--
CREATE OR ALTER PROCEDURE sp_delete_category_detail
    @Id NVARCHAR(50)
AS
BEGIN
    BEGIN TRANSACTION;
    
    DELETE FROM CategoryDetail
    OUTPUT DELETED.*
    WHERE Id = @Id;
    
    COMMIT TRANSACTION;
END;

--
CREATE OR ALTER PROCEDURE sp_restore_category_detail
    @Id NVARCHAR(50)
AS
BEGIN
    BEGIN TRANSACTION;
    
    UPDATE CategoryDetail 
    SET is_deleted = 0
    WHERE Id = @Id;
   
   SELECT * FROM CategoryDetail WHERE Id = @Id
    
    COMMIT TRANSACTION;
END;



--Product
--
CREATE OR ALTER PROCEDURE sp_get_products_pagination
    @page_number INT,       
    @page_size INT
AS
BEGIN
    SET NOCOUNT ON;
  
    DECLARE @offset INT = (@page_number - 1) * @page_size;
   
    SELECT pro.Id, pro.product_desc, pro.status, pro.created_at, pro.booth_id, pro.last_updated, pro.updated_by,
    		prod.product_id, prod.Id, prod.product_name, prod.image, prod.color, prod.size, prod.sale_price , prod.promotional_price, prod.created_at, prod.updated_at
    FROM Product pro 
    INNER JOIN ProductDetail prod ON pro.Id = prod.product_id
    ORDER BY pro.created_at DESC
    OFFSET @offset ROWS FETCH NEXT @page_size ROWS ONLY;
   
   SELECT COUNT(*) AS [total_records] FROM Product;
END;

--
CREATE OR ALTER PROCEDURE sp_get_products_active_pagination 
    @page_number INT,       
    @page_size INT
AS
BEGIN
    SET NOCOUNT ON;
  
    DECLARE @offset INT = (@page_number - 1) * @page_size;
   
    SELECT pro.Id, pro.product_desc, pro.status, pro.created_at, pro.booth_id, pro.last_updated, pro.updated_by,
    		prod.product_id, prod.Id, prod.product_name, prod.image, prod.color, prod.size, prod.sale_price , prod.promotional_price, prod.created_at, prod.updated_at
    FROM Product pro
    INNER JOIN ProductDetail prod ON pro.Id = prod.product_id
    WHERE pro.status = 1 AND pro.is_deleted = 0 AND prod.is_deleted = 0
    ORDER BY pro.created_at DESC
    OFFSET @offset ROWS FETCH NEXT @page_size ROWS ONLY;
   
   SELECT COUNT(*) AS [total_records] 
    FROM Product pro
    INNER JOIN ProductDetail prod ON pro.Id = prod.product_id
    WHERE pro.status = 1 AND pro.is_deleted = 0 AND prod.is_deleted = 0;
END;

--
CREATE OR ALTER PROCEDURE sp_get_products_inactive_pagination 
    @page_number INT,       
    @page_size INT
AS	
BEGIN
    SET NOCOUNT ON;
  
    DECLARE @offset INT = (@page_number - 1) * @page_size;
   
    SELECT pro.Id, pro.product_desc, pro.status, pro.created_at, pro.booth_id, pro.last_updated, pro.updated_by,
       		prod.product_id, prod.Id AS product_detail_id, prod.product_name, prod.image, prod.color, prod.size, prod.sale_price, prod.promotional_price, prod.created_at AS detail_created_at, prod.updated_at AS detail_updated_at
		FROM Product pro
		INNER JOIN ProductDetail prod ON pro.Id = prod.product_id
		WHERE pro.status = 0 AND pro.is_deleted = 0
		ORDER BY pro.created_at DESC
		OFFSET @offset ROWS FETCH NEXT @page_size ROWS ONLY
   

    SELECT COUNT(*) AS [total_records] 
    FROM Product pro
    WHERE pro.status = 0 AND pro.is_deleted = 0;
END;


EXECUTE sp_get_products_inactive_pagination @page_number = 1, @page_size = 10

--
CREATE OR ALTER PROCEDURE sp_get_products_deleted_pagination 
    @page_number INT,       
    @page_size INT
AS
BEGIN
    SET NOCOUNT ON;
  
    DECLARE @offset INT = (@page_number - 1) * @page_size;
   
    SELECT pro.Id, pro.product_desc, pro.status, pro.created_at, pro.booth_id, pro.last_updated, pro.updated_by,
    		prod.product_id, prod.Id, prod.product_name, prod.image, prod.color, prod.size, prod.sale_price , prod.promotional_price, prod.created_at, prod.updated_at
    FROM Product pro
    INNER JOIN ProductDetail prod ON pro.Id = prod.product_id
    WHERE pro.is_deleted = 1
    ORDER BY pro.created_at DESC
    OFFSET @offset ROWS FETCH NEXT @page_size ROWS ONLY;
   
   SELECT COUNT(*) AS [total_records] FROM Product WHERE is_deleted = 1;
END;

--
CREATE OR ALTER PROCEDURE sp_get_products_active_by_booth_id
	@booth_id NVARCHAR(50),
    @page_number INT,       
    @page_size INT
AS
BEGIN
    SET NOCOUNT ON;
  
    DECLARE @offset INT = (@page_number - 1) * @page_size;
   
    SELECT pro.Id, pro.product_desc, pro.status, pro.created_at, pro.booth_id, pro.last_updated, pro.updated_by,
    		prod.product_id, prod.Id, prod.product_name, prod.image, prod.color, 
    			prod.size, prod.sale_price , prod.promotional_price, prod.created_at, prod.updated_at, prod.is_deleted 
    FROM Product pro
    INNER JOIN ProductDetail prod ON pro.Id = prod.product_id
    WHERE pro.status = 1 AND pro.is_deleted = 0 AND pro.booth_id = @booth_id
    ORDER BY pro.created_at DESC
    OFFSET @offset ROWS FETCH NEXT @page_size ROWS ONLY;
   
   SELECT COUNT(*) AS [total_records] FROM Product WHERE status = 1 AND is_deleted = 0 AND booth_id = @booth_id;
END;

--
CREATE OR ALTER PROCEDURE sp_get_products_inactive_by_booth_id
	@booth_id NVARCHAR(50),
    @page_number INT,       
    @page_size INT
AS
BEGIN
    SET NOCOUNT ON;
  
    DECLARE @offset INT = (@page_number - 1) * @page_size;
   
    SELECT pro.Id, pro.product_desc, pro.status, pro.created_at, pro.booth_id, pro.last_updated, pro.updated_by,
    		prod.product_id, prod.Id, prod.product_name, prod.image, prod.color, 
    			prod.size, prod.sale_price , prod.promotional_price, prod.created_at, prod.updated_at, prod.is_deleted 
    FROM Product pro
    INNER JOIN ProductDetail prod ON pro.Id = prod.product_id
    WHERE pro.status = 0 AND pro.is_deleted = 0 AND pro.booth_id = @booth_id
    ORDER BY pro.created_at DESC
    OFFSET @offset ROWS FETCH NEXT @page_size ROWS ONLY;
   
   SELECT COUNT(*) AS [total_records] FROM Product WHERE status = 0 AND is_deleted = 0 AND booth_id = @booth_id;
END;

--
CREATE OR ALTER PROCEDURE sp_get_products_deleted_by_booth_id
	@booth_id NVARCHAR(50),
    @page_number INT,       
    @page_size INT
AS
BEGIN
    SET NOCOUNT ON;
  
    DECLARE @offset INT = (@page_number - 1) * @page_size;
   
    SELECT pro.Id, pro.product_desc, pro.status, pro.created_at, pro.booth_id, pro.last_updated, pro.updated_by,
    		prod.product_id, prod.Id, prod.product_name, prod.image, prod.color, prod.size,
    			prod.sale_price , prod.promotional_price, prod.created_at, prod.updated_at, prod.is_deleted 
    FROM Product pro 
    INNER JOIN ProductDetail prod ON pro.Id = prod.product_id
    WHERE pro.is_deleted = 1 AND pro.booth_id = @booth_id
    ORDER BY pro.created_at DESC
    OFFSET @offset ROWS FETCH NEXT @page_size ROWS ONLY;
   
   SELECT COUNT(*) AS [total_records] FROM Product WHERE is_deleted = 1 AND booth_id = @booth_id;
END;


--
CREATE OR ALTER PROCEDURE sp_get_products_by_desc_pagination
    @page_number INT,       
    @page_size INT,
    @product_desc NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
  
    DECLARE @offset INT = (@page_number - 1) * @page_size;
   
    SELECT  pro.Id, pro.product_desc, pro.status, pro.booth_id, pro.booth_id, pro.last_updated, pro.updated_by,
    		prod.product_id, prod.Id, prod.product_name, prod.image, prod.color, prod.size, prod.sale_price, prod.promotional_price, prod.created_at, prod.updated_at
    FROM Product pro
    INNER JOIN ProductDetail prod ON pro.Id = prod.product_id
    WHERE pro.product_desc LIKE '%' + @product_desc + '%'
    ORDER BY pro.created_at DESC
    OFFSET @offset ROWS FETCH NEXT @page_size ROWS ONLY;
   
   SELECT COUNT(*) AS [total_records] FROM Product  WHERE product_desc LIKE '%' + @product_desc + '%';
  
END;


--
CREATE OR ALTER PROCEDURE sp_get_product_by_id
    @product_id NVARCHAR(50)
AS
BEGIN
    SELECT  pro.Id, pro.product_desc, pro.status, pro.created_at, pro.booth_id, pro.last_updated, pro.updated_by,
    		prod.product_id, prod.Id, prod.product_name, prod.image, prod.color, prod.size, prod.sale_price, prod.promotional_price, prod.created_at, prod.updated_at
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
	@booth_id NVARCHAR(50),
	@last_updated DATETIME2,
	@updated_by NVARCHAR(50),
	@is_deleted BIT
AS 
BEGIN 
	BEGIN TRANSACTION;

	INSERT INTO Product
	VALUES (@product_id, @product_desc, @status, @category_detail_id, @created_at, @booth_id, @last_updated, @updated_by, @is_deleted)

    SELECT cgd.Id, cgd.category_detail_name,
            pro.Id, pro.product_desc, pro.status, pro.created_at, pro.booth_id, pro.updated_by
    FROM CategoryDetail cgd 
    INNER JOIN Product pro ON cgd.Id = pro.category_detail_id
    WHERE pro.Id = @product_id;

    COMMIT TRANSACTION;

END

--
CREATE OR ALTER PROCEDURE sp_active_product_by_id
  	@Id NVARCHAR(50)
AS 
BEGIN 
	BEGIN TRANSACTION 
	
	UPDATE Product 
	SET status = 1
	WHERE Id = @Id
	
	
	SELECT * FROM Product WHERE Id = @Id
	COMMIT
END

--
CREATE OR ALTER PROCEDURE sp_active_product_by_id
  	@Id NVARCHAR(50)
AS 
BEGIN 
	BEGIN TRANSACTION 
	
	UPDATE Product 
	SET status = 1
	WHERE Id = @Id
	
	
	SELECT * FROM Product WHERE Id = @Id
	COMMIT
END


--
CREATE OR ALTER PROCEDURE sp_delete_soft_product_by_id
	@Id NVARCHAR(50)
AS 
BEGIN 
	BEGIN TRANSACTION 
	
	UPDATE Product 
	SET is_deleted = 1
	WHERE Id = @Id
	
	
	SELECT * FROM Product WHERE Id = @Id
	COMMIT
END

--
CREATE OR ALTER PROCEDURE sp_restore_product_by_id
	@Id NVARCHAR(50)
AS 
BEGIN 
	BEGIN TRANSACTION 
	
	UPDATE Product 
	SET is_deleted = 0
	WHERE Id = @Id
	
	
	SELECT * FROM Product WHERE Id = @Id
	COMMIT
END


--
CREATE OR ALTER PROCEDURE sp_delete_product_by_id
	@Id NVARCHAR(50)
AS 
BEGIN 
	BEGIN TRANSACTION 
	
	DELETE FROM Product OUTPUT DELETED.* WHERE Id = @Id

	COMMIT
END

--

--ProductDetail

--
CREATE OR ALTER PROCEDURE sp_get_product_by_cg_detail_id_pagination
	@page_number INT,
	@page_size INT,
	@cg_detail_id NVARCHAR(50)
AS 
BEGIN 
	
	SET NOCOUNT ON;

	DECLARE @offset INT = (@page_number -1) * @page_size
	
	SELECT prod.*
	FROM CategoryDetail cgd 
	INNER JOIN Product pro ON cgd.Id = pro.category_detail_id
	INNER JOIN ProductDetail prod ON pro.Id = prod.product_id
	WHERE cgd.Id = @cg_detail_id
	ORDER BY created_at DESC
	OFFSET @offset ROWS FETCH NEXT @page_size ROWS ONLY 
	
	SELECT COUNT(prod.Id)
	FROM CategoryDetail cgd 
	INNER JOIN Product pro ON cgd.Id = pro.category_detail_id
	INNER JOIN ProductDetail prod ON pro.Id = prod.product_id
	WHERE cgd.Id = @cg_detail_id
	
END

--
CREATE OR ALTER PROCEDURE sp_get_product_detail_by_id 
	@Id NVARCHAR(50)
AS 
BEGIN 
	
	SELECT Id, product_name, image, color, size, sale_price, promotional_price, sale_quantity, stock_quantity, created_at, updated_at, product_id
    FROM ProductDetail
    WHERE Id = @Id;
	
END

	

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
    @updated_at DATETIME2,
    @is_deleted BIT
AS 
BEGIN
    BEGIN TRANSACTION;

    INSERT INTO ProductDetail 
    VALUES (@product_detail_id, @product_name, @image, @color, @size, @sale_price, @promotional_price, @sale_quantity, 
   			@stock_quantity, @created_at, @updated_at, @product_id, @is_deleted);

    SELECT Id, product_name, image, color, size, sale_price, promotional_price, sale_quantity, stock_quantity, created_at, updated_at, product_id, is_deleted 
    FROM ProductDetail
    WHERE Id = @product_detail_id;

    COMMIT TRANSACTION;
END;

--
CREATE OR ALTER PROCEDURE sp_update_product_detail_by_id
	@product_detail_id NVARCHAR(50),
    @product_name NVARCHAR(MAX),
    @image NVARCHAR(MAX),
    @color NVARCHAR(MAX),
    @size NVARCHAR(MAX),
    @sale_price FLOAT,
    @promotional_price FLOAT,
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
    	stock_quantity = @stock_quantity,
    	updated_at = updated_at
    WHERE Id = @product_detail_id;
   
   
    SELECT * FROM ProductDetail
    WHERE Id = @product_detail_id;
    
	COMMIT TRANSACTION;

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
 
 
--
CREATE OR ALTER PROCEDURE sp_delete_soft_product_detail
	@Id NVARCHAR(50)
AS 
BEGIN 
	
	BEGIN TRANSACTION
	
	UPDATE ProductDetail 
	SET is_deleted = 1
	WHERE Id = @Id
	
	SELECT * FROM ProductDetail WHERE Id = @Id
	
	COMMIT
	
END

--
CREATE OR ALTER PROCEDURE sp_restore_product_detail
	@Id NVARCHAR(50)
AS 
BEGIN 
	
	BEGIN TRANSACTION
	
	UPDATE ProductDetail 
	SET is_deleted = 0
	WHERE Id = @Id
	
	SELECT * FROM ProductDetail WHERE Id = @Id
	
	COMMIT
	
END



 
--ProductReview

--
CREATE OR ALTER PROCEDURE sp_get_reviews_by_product_id
	@Id NVARCHAR(50)
AS 
BEGIN 
	SELECT u.Id AS [user_id], u.full_name, u.avatar,
		   pr.created_by, pr.Id, pr.rating, pr.content,
			pd.created_at, pd.Id, pd.product_name, pd.color, pd.image, pd.size
	FROM Account acc 
	INNER JOIN [User] u ON u.created_by = acc.Id 
	INNER JOIN ProductReview pr ON acc.Id = pr.created_by 
	INNER JOIN ProductDetail pd ON pd.Id = pr.product_detail_id
	INNER JOIN Product p ON p.Id = pd.product_id
	WHERE p.Id = @Id 
	
END

EXECUTE sp_get_reviews_by_product_id '17eb962a-a528-4be0-b898-c961ede90d74'
--
CREATE OR ALTER PROCEDURE sp_create_review_product
	@Id NVARCHAR(50),
	@content NVARCHAR(MAX),
	@rating INT,
	@product_detail_id NVARCHAR(50),
	@created_at DATETIME2,
	@created_by NVARCHAR(50),
	@last_updated DATETIME2,
	@updated_by NVARCHAR(50),
	@is_deleted BIT
AS 
BEGIN 
	
	BEGIN TRANSACTION
	
	INSERT INTO ProductReview 
	VALUES (@Id, @content, @rating, @product_detail_id, @created_at, @created_by, @last_updated, @updated_by, @is_deleted)
	
	COMMIT
	
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
    WHERE status_voucher = 0 AND is_deleted = 0
    ORDER BY created_at DESC
    OFFSET @offset ROWS FETCH NEXT @page_size ROWS ONLY;
   
   SELECT COUNT(*) AS [total_records] FROM Voucher WHERE status_voucher = 0 AND is_deleted = 0;
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
    WHERE status_voucher = 1  AND is_deleted = 0
    ORDER BY created_at DESC
    OFFSET @offset ROWS FETCH NEXT @page_size ROWS ONLY;
   
   SELECT COUNT(*) AS [total_records] FROM Voucher WHERE status_voucher = 1 AND is_deleted = 0;
END

--
CREATE OR ALTER PROCEDURE sp_get_voucher_deleted_pagination
	@page_number INT,       
    @page_size INT
AS 
BEGIN 
	SET NOCOUNT ON;
  
    DECLARE @offset INT = (@page_number - 1) * @page_size;
   
    SELECT  * FROM Voucher
    WHERE is_deleted = 1
    ORDER BY created_at DESC
    OFFSET @offset ROWS FETCH NEXT @page_size ROWS ONLY;
   
   SELECT COUNT(*) AS [total_records] FROM Voucher WHERE is_deleted = 1;
END

use penguin

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
    @discount FLOAT,
    @type_discount NVARCHAR(50),
    @status_voucher INT,
    @created_at DATETIME2,
    @created_by NVARCHAR(50),
    @last_updated DATETIME2,
    @updated_by NVARCHAR(50),
    @is_deleted BIT
AS
BEGIN
    BEGIN TRANSACTION;
        INSERT INTO Voucher
        VALUES (@voucher_id, @voucher_type, @voucher_name, @voucher_code, 
       		@apply_for, @expiry_date, @quantity_remain, @quantity_used,
       	@discount, @type_discount,  @status_voucher, @created_at,
       	@created_by, @last_updated, @updated_by, @is_deleted );	

    COMMIT TRANSACTION;
    SELECT * FROM Voucher WHERE Id = @voucher_id;
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
CREATE OR ALTER PROCEDURE sp_update_voucher_by_id
	@voucher_id NVARCHAR(50),
    @voucher_type NVARCHAR(50),
    @voucher_name NVARCHAR(50),
    @apply_for NVARCHAR(50),
    @expiry_date DATETIME2,
    @quantity_remain INT,
    @quantity_used INT,
    @discount FLOAT,
    @type_discount NVARCHAR(50)
AS 
BEGIN 
	BEGIN TRANSACTION
	
	UPDATE Voucher
	SET voucher_type = @voucher_type,
		voucher_name = @voucher_name,
		apply_for = @apply_for,
		expiry_date = @expiry_date,
		quantity_remain = @quantity_remain,
		quantity_used = @quantity_used,
		discount = @discount,
		type_discount = @type_discount
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

--
CREATE OR ALTER PROCEDURE sp_delete_soft_voucher_by_id
	@voucher_id NVARCHAR(50)
AS 
BEGIN 
	BEGIN TRANSACTION
	
	UPDATE Voucher
	SET is_deleted = 1
	WHERE Id = @voucher_id
	
	COMMIT TRANSACTION
	
	SELECT * FROM Voucher WHERE Id = @voucher_id
END


--
CREATE OR ALTER PROCEDURE sp_restore_voucher_by_id
	@voucher_id NVARCHAR(50)
AS 
BEGIN 
	BEGIN TRANSACTION
	
	UPDATE Voucher
	SET is_deleted = 0
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
   SELECT od.Id, od.buyer_id, od.seller_id, od.product_detail_id, od.quantity, od.size, od.color, od.updated_by, 
		prod.Id AS [product_detail_id] ,prod.product_name, prod.image, prod.sale_price, prod.promotional_price
    FROM OrderItem od
    INNER JOIN ProductDetail prod ON prod.Id = od.product_detail_id
    WHERE od.buyer_id = @buyer_id
 END
 

--
CREATE OR ALTER PROCEDURE sp_create_order_item
	@order_id NVARCHAR(50),
	@seller_id NVARCHAR(50),
	@buyer_id NVARCHAR(50),
	@product_detail_id NVARCHAR(50),
	@quantity INT,
	@size NVARCHAR(10),
	@color NVARCHAR(30),
	@updated_by NVARCHAR(50),
	@created_at DATETIME2,
	@last_updated DATETIME2,
	@is_deleted BIT
AS 
BEGIN 
	BEGIN TRANSACTION;

	INSERT INTO OrderItem 
	VALUES (@order_id, @product_detail_id, @quantity, @size, @color, @seller_id, @created_at, @buyer_id, @last_updated, @updated_by, @is_deleted)
	

	COMMIT TRANSACTION;

	SELECT od.Id, od.buyer_id, od.seller_id, od.product_detail_id, od.quantity, od.size, od.color, od.updated_by, 
		prod.Id AS [product_detail_id] ,prod.product_name, prod.image, prod.sale_price, prod.promotional_price
    FROM OrderItem od
    INNER JOIN ProductDetail prod ON prod.Id = od.product_detail_id
    WHERE od.Id = @order_id
END

        
--
CREATE OR ALTER PROCEDURE sp_detele_order_item_by_id 
	@order_id NVARCHAR(50)
AS 
BEGIN 

	BEGIN TRANSACTION;

	DELETE FROM OrderItem OUTPUT DELETED.*
	WHERE Id = @order_id
	
	COMMIT TRANSACTION;
END

--SaleBill
--
CREATE OR ALTER PROCEDURE sp_get_bills_by_status_and_seller_id
	@page_number INT,
	@page_size INT,
	@seller_id NVARCHAR(50),
	@status INT
AS 
BEGIN 
	
	SET NOCOUNT ON;

	DECLARE @offset INT = (@page_number - 1) * @page_size;
	
	SELECT mb.Id, mb.booth_name,
			sb.seller_id, sb.Id, sb.status_bill, sb.total_bill, sb.created_at, 
			sbd.sale_bill_id, sbd.quantity, sbd.[size], sbd.color, sbd.product_detail_id,
			pd.Id, pd.product_name, pd.product_name, pd.[image], pd.sale_price, pd.promotional_price
	FROM MyBooth mb 
	INNER JOIN SaleBill sb ON sb.seller_id = mb.Id 
	INNER JOIN SaleBillDetail sbd ON sb.Id = sbd.sale_bill_id 
	INNER JOIN ProductDetail pd ON sbd.product_detail_id = pd.Id 
	WHERE sb.status_bill = @status AND sb.seller_id = @seller_id
	
	
	SELECT COUNT(sbd.Id)
	FROM MyBooth mb 
	INNER JOIN SaleBill sb ON sb.seller_id = mb.Id 
	INNER JOIN SaleBillDetail sbd ON sb.Id = sbd.sale_bill_id 
	INNER JOIN ProductDetail pd ON sbd.product_detail_id = pd.Id 
	WHERE sb.status_bill = @status AND sb.seller_id = @seller_id
	
END

--
CREATE OR ALTER PROCEDURE sp_get_bills_by_status_and_buyer_id
	@buyer_id NVARCHAR(50),
	@status INT,
	@page_number INT,
	@page_size INT
AS 
BEGIN 
	
	SET NOCOUNT ON;

	DECLARE @offset INT = (@page_number - 1) * @page_size;
	
	SELECT mb.Id, mb.booth_name,
			sb.seller_id, sb.Id, sb.status_bill, sb.total_bill, sb.created_at, 
			sbd.sale_bill_id, sbd.quantity, sbd.[size], sbd.color, sbd.product_detail_id,
			pd.Id, pd.product_name, pd.product_name, pd.[image], pd.sale_price, pd.promotional_price
	FROM MyBooth mb 
	INNER JOIN SaleBill sb ON sb.seller_id = mb.Id 
	INNER JOIN SaleBillDetail sbd ON sb.Id = sbd.sale_bill_id 
	INNER JOIN ProductDetail pd ON sbd.product_detail_id = pd.Id 
	WHERE sb.status_bill = @status AND sb.buyer_id  = @buyer_id
	
	
	SELECT COUNT(sbd.Id)
	FROM MyBooth mb 
	INNER JOIN SaleBill sb ON sb.seller_id = mb.Id 
	INNER JOIN SaleBillDetail sbd ON sb.Id = sbd.sale_bill_id 
	INNER JOIN ProductDetail pd ON sbd.product_detail_id = pd.Id 
	WHERE sb.status_bill = @status AND sb.buyer_id  = @buyer_id
	
END


EXECUTE sp_get_bills_by_status_and_buyer_id @buyer_id = '1b6cc96a-09bd-47ac-ac76-a7227cf3316f', @status_bill = 5, 
@page_number = 1, @page_size = 10


--
CREATE OR ALTER PROCEDURE sp_create_sale_bill
	@bill_id NVARCHAR(50),
	@status_bill INT,
	@pay_method NVARCHAR(MAX),
	@total_bill FLOAT,
	@name_receiver NVARCHAR(MAX),
	@address_receiver NVARCHAR(MAX),
	@phone_receiver NVARCHAR(MAX),
	@seller_id NVARCHAR(50),
	@created_at DATETIME2,
	@buyer_id NVARCHAR(50),
	@last_updated DATETIME2,
	@updated_by NVARCHAR(50),
	@is_deleted BIT
AS 
BEGIN 
	BEGIN TRANSACTION
	
	INSERT INTO SaleBill
	VALUES (@bill_id, @status_bill, @pay_method, @total_bill, @seller_id, @name_receiver, @address_receiver, @phone_receiver,
	@created_at, @buyer_id, @last_updated, @updated_by, @is_deleted)
	
	
	COMMIT TRANSACTION;

END

-- 
CREATE OR ALTER PROCEDURE sp_update_status_sale_bill
	@bill_id NVARCHAR(50),
	@status INT
AS 
BEGIN 
	BEGIN TRANSACTION
	UPDATE SaleBill
	SET status_bill = @status
	WHERE Id = @bill_id
	COMMIT TRANSACTION;
END


-- 
CREATE OR ALTER PROCEDURE sp_update_total_sale_bill
	@bill_id NVARCHAR(50),
	@total FLOAT
AS 
BEGIN 
	BEGIN TRANSACTION
	UPDATE SaleBill
	SET total_bill = @total
	WHERE Id = @bill_id
	COMMIT TRANSACTION;

	SELECT * FROM Bill WHERE Id = @bill_id
END


--BillSaleDetail
--
CREATE OR ALTER PROCEDURE sp_create_sale_bill_detail
	@Id NVARCHAR(50),
	@bill_id NVARCHAR(50),
	@product_detail_id NVARCHAR(50),
	@quantity INT,
	@size NVARCHAR(10),
	@color NVARCHAR(30)
AS 
BEGIN 
	BEGIN TRANSACTION;

	INSERT INTO SaleBillDetail
	VALUES (@Id, @product_detail_id, @quantity, @size, @color, @bill_id)

	COMMIT TRANSACTION;

	SELECT sbd.Id, sbd.product_detail_id, prod.product_name, prod.image, prod.sale_price, prod.promotional_price, sbd.quantity, sbd.size, sbd.color
	FROM SaleBillDetail sbd
	INNER JOIN ProductDetail prod ON sbd.product_detail_id = prod.Id
	WHERE sbd.Id = @Id
	
END



--VoucherUseSaleBill

--
CREATE OR ALTER PROCEDURE sp_create_voucher_use_bill_sale
	@Id NVARCHAR(50),
	@bill_id NVARCHAR(50),
	@voucher_id NVARCHAR(50)
AS 
BEGIN 
	
	BEGIN TRANSACTION
	INSERT INTO VoucherUseSaleBill VALUES(@Id, @bill_id, @voucher_id)
	COMMIT TRANSACTION
	
	
END

--RefreshToken
--
CREATE OR ALTER PROCEDURE sp_get_refresh_token_by_acc_id
	@acc_id NVARCHAR(50)
AS 
BEGIN 
	
	SELECT * FROM RefreshToken WHERE created_by = @acc_id
	
END

--
CREATE OR ALTER PROCEDURE sp_get_by_refresh_token
	@token NVARCHAR(MAX)
AS 
BEGIN 
	SELECT * FROM RefreshToken WHERE refresh_token = @token
END

--
CREATE OR ALTER PROCEDURE sp_create_refresh_token 
	@Id NVARCHAR(50),
	@token NVARCHAR(MAX),
	@created_at DATETIME2,
	@created_by NVARCHAR(50),
	@last_updated DATETIME2,
	@updated_by NVARCHAR(50),
	@is_deleted BIT
AS 
BEGIN 
	
	BEGIN TRANSACTION
	
	INSERT INTO RefreshToken
	VALUES(@Id, @token, @created_at, @created_by, @last_updated, @updated_by, @is_deleted)
	
	COMMIT
	
END

--
CREATE OR ALTER PROCEDURE sp_update_refresh_token
	@token NVARCHAR(MAX),
	@created_at DATETIME2,
	@created_by NVARCHAR(50),
	@last_updated DATETIME2,
	@updated_by NVARCHAR(50)
AS
BEGIN 
	
	BEGIN TRANSACTION
	
	UPDATE RefreshToken
	SET refresh_token = @token,
		created_at = @created_at,
		last_updated = @last_updated
	WHERE  created_by = @created_by
	COMMIT
	SELECT * FROM RefreshToken WHERE created_by = @created_by
END




-- Satistical

--
CREATE OR ALTER PROCEDURE sp_get_total_product_by_seller_id
	@seller_id NVARCHAR(50)
AS 
BEGIN 
	
	
END

--
CREATE OR ALTER PROCEDURE sp_get_total_by_seller_id
	@seller_id NVARCHAR(50)
AS 
BEGIN 
	SELECT COUNT(Id) AS [total_active] FROM Product p WHERE p.booth_id = @seller_id AND p.status = 1
	SELECT COUNT(Id) AS [total_inactive] FROM Product p WHERE p.booth_id = @seller_id AND p.status = 0
	
	SELECT SUM(total_bill) AS [total]
	FROM SaleBill 
	WHERE status_bill = 2 AND seller_id = @seller_id
	
	SELECT COUNT(Id) AS [bills_sold]
	FROM SaleBill 
	WHERE status_bill = 2 AND seller_id = @seller_id
END

EXECUTE sp_get_total_by_seller_id '96c93e98-0bce-47dc-91fe-39957d497f84'


--
CREATE OR ALTER PROCEDURE sp_get_statistical_by_seller_id
    @seller_id NVARCHAR(50),
    @mode NVARCHAR(10)
AS 
BEGIN
    DECLARE @start DATETIME2;
    DECLARE @end DATETIME2;

    -- Xác định khoảng thời gian
    IF @mode = 'day'
    BEGIN
        SET @start = CAST(GETDATE() AS DATE);
        SET @end = DATEADD(DAY, 1, @start);

        WITH Today AS (
            SELECT @start AS [date]
        )
        SELECT 
            T.[date], 
            ISNULL(SUM(SB.total_bill), 0) AS [total],          -- Tổng doanh thu
            ISNULL(COUNT(SB.Id), 0) AS [products_sold]         -- Tổng số hóa đơn
        FROM 
            Today T
        LEFT JOIN 
            SaleBill SB                                       -- Kết nối với bảng SaleBill
            ON CAST(SB.created_at AS DATE) = T.[date] 
            AND SB.seller_id = @seller_id
            AND SB.status_bill = 2
        GROUP BY 
            T.[date]
        ORDER BY 
            T.[date];
    END
    ELSE IF @mode = 'week'
    BEGIN
        SET @start = DATEADD(DAY, 1 - DATEPART(WEEKDAY, GETDATE()), CAST(GETDATE() AS DATE));
        SET @end = DATEADD(DAY, 7 - DATEPART(WEEKDAY, GETDATE()), CAST(GETDATE() AS DATE));

        WITH WeekDays AS (
            SELECT @start AS [date]
            UNION ALL
            SELECT DATEADD(DAY, 1, [date])
            FROM WeekDays
            WHERE DATEADD(DAY, 1, [date]) <= @end
        )
        SELECT 
            WD.[date], 
            ISNULL(SUM(SB.total_bill), 0) AS [total],
            ISNULL(COUNT(SB.Id), 0) AS [products_sold]
        FROM 
            WeekDays WD
        LEFT JOIN 
            SaleBill SB
            ON CAST(SB.created_at AS DATE) = WD.[date] 
            AND SB.seller_id = @seller_id
            AND SB.status_bill = 2
        GROUP BY 
            WD.[date]
        ORDER BY 
            WD.[date];
    END
    ELSE IF @mode = 'month'
    BEGIN
        SET @start = DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1);
        SET @end = EOMONTH(GETDATE());

        WITH MonthDays AS (
            SELECT @start AS [date]
            UNION ALL
            SELECT DATEADD(DAY, 1, [date])
            FROM MonthDays
            WHERE DATEADD(DAY, 1, [date]) <= @end
        )
        SELECT 
            MD.[date], 
            ISNULL(SUM(SB.total_bill), 0) AS [total],
            ISNULL(COUNT(SB.Id), 0) AS [products_sold]
        FROM 
            MonthDays MD
        LEFT JOIN 
            SaleBill SB
            ON CAST(SB.created_at AS DATE) = MD.[date] 
            AND SB.seller_id = @seller_id
            AND SB.status_bill = 2
        GROUP BY 
            MD.[date]
        ORDER BY 
            MD.[date];
    END
    ELSE IF @mode = 'year'
    BEGIN
        SET @start = DATEFROMPARTS(YEAR(GETDATE()), 1, 1);
        SET @end = DATEFROMPARTS(YEAR(GETDATE()), 12, 31);

        WITH YearMonths AS (
            SELECT DATEFROMPARTS(YEAR(@start), 1, 1) AS [date]
            UNION ALL
            SELECT DATEADD(MONTH, 1, [date])
            FROM YearMonths
            WHERE DATEADD(MONTH, 1, [date]) <= @end
        )
        SELECT 
            FORMAT(YM.[date], 'yyyy-MM') AS [date], 
            ISNULL(SUM(SB.total_bill), 0) AS [total],
            ISNULL(COUNT(SB.Id), 0) AS [products_sold]
        FROM 
            YearMonths YM
        LEFT JOIN 
            SaleBill SB
            ON YEAR(SB.created_at) = YEAR(YM.[date])
            AND MONTH(SB.created_at) = MONTH(YM.[date])
            AND SB.seller_id = @seller_id
            AND SB.status_bill = 2
        GROUP BY 
            FORMAT(YM.[date], 'yyyy-MM')
        ORDER BY 
            FORMAT(YM.[date], 'yyyy-MM');
    END
END;


EXEC sp_get_statistical_by_seller_id
    @seller_id = '96c93e98-0bce-47dc-91fe-39957d497f84', 
    @mode = 'year';







