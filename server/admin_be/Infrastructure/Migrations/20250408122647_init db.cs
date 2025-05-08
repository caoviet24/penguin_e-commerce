using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class initdb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Account",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    username = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    password = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    role = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    is_banned = table.Column<bool>(type: "bit", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    is_deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Account", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Category",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    category_name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    image = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    created_by = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    last_updated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    is_deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Category", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Category_Account_created_by",
                        column: x => x.created_by,
                        principalTable: "Account",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MyBooth",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    booth_name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    booth_description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    booth_avatar = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    is_active = table.Column<bool>(type: "bit", nullable: false),
                    is_banned = table.Column<bool>(type: "bit", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    created_by = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    last_updated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    is_deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MyBooth", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MyBooth_Account_created_by",
                        column: x => x.created_by,
                        principalTable: "Account",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Notify",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    receiver_id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    is_read = table.Column<bool>(type: "bit", nullable: false),
                    is_delete = table.Column<bool>(type: "bit", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    created_by = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    last_updated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    is_deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notify", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Notify_Account_receiver_id",
                        column: x => x.receiver_id,
                        principalTable: "Account",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RefreshToken",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    refresh_token = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    created_by = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    last_updated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    is_deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RefreshToken", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RefreshToken_Account_created_by",
                        column: x => x.created_by,
                        principalTable: "Account",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    full_name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    nick_name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    gender = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    birth = table.Column<DateTime>(type: "datetime2", nullable: false),
                    avatar = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    phone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    created_by = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    last_updated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    is_deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.Id);
                    table.ForeignKey(
                        name: "FK_User_Account_created_by",
                        column: x => x.created_by,
                        principalTable: "Account",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VerifyAccount",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    type_account = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    type_identity = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    identity = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    status_verify = table.Column<int>(type: "int", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    created_by = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    last_updated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    is_deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VerifyAccount", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VerifyAccount_Account_created_by",
                        column: x => x.created_by,
                        principalTable: "Account",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Voucher",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    voucher_type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    voucher_name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    voucher_code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    apply_for = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    expiry_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    quantity_remain = table.Column<int>(type: "int", nullable: false),
                    quantity_used = table.Column<int>(type: "int", nullable: false),
                    discount = table.Column<double>(type: "float", nullable: false),
                    type_discount = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    status_voucher = table.Column<int>(type: "int", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    created_by = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    last_updated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    is_deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Voucher", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Voucher_Account_created_by",
                        column: x => x.created_by,
                        principalTable: "Account",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CategoryDetail",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    category_detail_name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    category_id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    is_deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CategoryDetail", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CategoryDetail_Category_category_id",
                        column: x => x.category_id,
                        principalTable: "Category",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SaleBill",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    status_bill = table.Column<int>(type: "int", nullable: false),
                    pay_method = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    total_bill = table.Column<double>(type: "float", nullable: false),
                    seller_id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    name_receiver = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    address_delivery = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    phone_delivery = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    buyer_id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    last_updated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    is_deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SaleBill", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SaleBill_Account_buyer_id",
                        column: x => x.buyer_id,
                        principalTable: "Account",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SaleBill_MyBooth_seller_id",
                        column: x => x.seller_id,
                        principalTable: "MyBooth",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Product",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    product_desc = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    status = table.Column<int>(type: "int", nullable: false),
                    category_detail_id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    booth_id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    last_updated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    is_deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Product", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Product_CategoryDetail_category_detail_id",
                        column: x => x.category_detail_id,
                        principalTable: "CategoryDetail",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Product_MyBooth_booth_id",
                        column: x => x.booth_id,
                        principalTable: "MyBooth",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VoucherUseSaleBill",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    bill_id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    voucher_id = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VoucherUseSaleBill", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VoucherUseSaleBill_SaleBill_bill_id",
                        column: x => x.bill_id,
                        principalTable: "SaleBill",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_VoucherUseSaleBill_Voucher_voucher_id",
                        column: x => x.voucher_id,
                        principalTable: "Voucher",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ProductDetail",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    product_name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    image = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    color = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    size = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    sale_price = table.Column<double>(type: "float", nullable: false),
                    promotional_price = table.Column<double>(type: "float", nullable: false),
                    sale_quantity = table.Column<int>(type: "int", nullable: false),
                    stock_quantity = table.Column<int>(type: "int", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    product_id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    is_deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductDetail", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductDetail_Product_product_id",
                        column: x => x.product_id,
                        principalTable: "Product",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OrderItem",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    product_detail_id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    quantity = table.Column<int>(type: "int", nullable: false),
                    size = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    color = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    seller_id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    buyer_id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    last_updated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    is_deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderItem", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderItem_Account_buyer_id",
                        column: x => x.buyer_id,
                        principalTable: "Account",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderItem_MyBooth_seller_id",
                        column: x => x.seller_id,
                        principalTable: "MyBooth",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_OrderItem_ProductDetail_product_detail_id",
                        column: x => x.product_detail_id,
                        principalTable: "ProductDetail",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ProductReview",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    rating = table.Column<int>(type: "int", nullable: false),
                    product_detail_id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    created_by = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    last_updated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    is_deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductReview", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductReview_Account_created_by",
                        column: x => x.created_by,
                        principalTable: "Account",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProductReview_ProductDetail_product_detail_id",
                        column: x => x.product_detail_id,
                        principalTable: "ProductDetail",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "SaleBillDetail",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    product_detail_id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    quantity = table.Column<int>(type: "int", nullable: false),
                    size = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    color = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    sale_bill_id = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SaleBillDetail", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SaleBillDetail_ProductDetail_product_detail_id",
                        column: x => x.product_detail_id,
                        principalTable: "ProductDetail",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SaleBillDetail_SaleBill_sale_bill_id",
                        column: x => x.sale_bill_id,
                        principalTable: "SaleBill",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Category_created_by",
                table: "Category",
                column: "created_by");

            migrationBuilder.CreateIndex(
                name: "IX_CategoryDetail_category_id",
                table: "CategoryDetail",
                column: "category_id");

            migrationBuilder.CreateIndex(
                name: "IX_MyBooth_created_by",
                table: "MyBooth",
                column: "created_by",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Notify_receiver_id",
                table: "Notify",
                column: "receiver_id");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItem_buyer_id",
                table: "OrderItem",
                column: "buyer_id");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItem_product_detail_id",
                table: "OrderItem",
                column: "product_detail_id");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItem_seller_id",
                table: "OrderItem",
                column: "seller_id");

            migrationBuilder.CreateIndex(
                name: "IX_Product_booth_id",
                table: "Product",
                column: "booth_id");

            migrationBuilder.CreateIndex(
                name: "IX_Product_category_detail_id",
                table: "Product",
                column: "category_detail_id");

            migrationBuilder.CreateIndex(
                name: "IX_ProductDetail_product_id",
                table: "ProductDetail",
                column: "product_id");

            migrationBuilder.CreateIndex(
                name: "IX_ProductReview_created_by",
                table: "ProductReview",
                column: "created_by");

            migrationBuilder.CreateIndex(
                name: "IX_ProductReview_product_detail_id",
                table: "ProductReview",
                column: "product_detail_id");

            migrationBuilder.CreateIndex(
                name: "IX_RefreshToken_created_by",
                table: "RefreshToken",
                column: "created_by",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SaleBill_buyer_id",
                table: "SaleBill",
                column: "buyer_id");

            migrationBuilder.CreateIndex(
                name: "IX_SaleBill_seller_id",
                table: "SaleBill",
                column: "seller_id");

            migrationBuilder.CreateIndex(
                name: "IX_SaleBillDetail_product_detail_id",
                table: "SaleBillDetail",
                column: "product_detail_id");

            migrationBuilder.CreateIndex(
                name: "IX_SaleBillDetail_sale_bill_id",
                table: "SaleBillDetail",
                column: "sale_bill_id");

            migrationBuilder.CreateIndex(
                name: "IX_User_created_by",
                table: "User",
                column: "created_by",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_VerifyAccount_created_by",
                table: "VerifyAccount",
                column: "created_by",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Voucher_created_by",
                table: "Voucher",
                column: "created_by");

            migrationBuilder.CreateIndex(
                name: "IX_VoucherUseSaleBill_bill_id",
                table: "VoucherUseSaleBill",
                column: "bill_id");

            migrationBuilder.CreateIndex(
                name: "IX_VoucherUseSaleBill_voucher_id",
                table: "VoucherUseSaleBill",
                column: "voucher_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Notify");

            migrationBuilder.DropTable(
                name: "OrderItem");

            migrationBuilder.DropTable(
                name: "ProductReview");

            migrationBuilder.DropTable(
                name: "RefreshToken");

            migrationBuilder.DropTable(
                name: "SaleBillDetail");

            migrationBuilder.DropTable(
                name: "User");

            migrationBuilder.DropTable(
                name: "VerifyAccount");

            migrationBuilder.DropTable(
                name: "VoucherUseSaleBill");

            migrationBuilder.DropTable(
                name: "ProductDetail");

            migrationBuilder.DropTable(
                name: "SaleBill");

            migrationBuilder.DropTable(
                name: "Voucher");

            migrationBuilder.DropTable(
                name: "Product");

            migrationBuilder.DropTable(
                name: "CategoryDetail");

            migrationBuilder.DropTable(
                name: "MyBooth");

            migrationBuilder.DropTable(
                name: "Category");

            migrationBuilder.DropTable(
                name: "Account");
        }
    }
}
