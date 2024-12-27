using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class updateDB2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OrderItemDetail");

            migrationBuilder.DropColumn(
                name: "total_order",
                table: "OrderItem");

            migrationBuilder.RenameColumn(
                name: "status_order",
                table: "OrderItem",
                newName: "quantity");

            migrationBuilder.RenameColumn(
                name: "pay_method",
                table: "OrderItem",
                newName: "size");

            migrationBuilder.AddColumn<string>(
                name: "color",
                table: "OrderItem",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "product_detail_id",
                table: "OrderItem",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItem_product_detail_id",
                table: "OrderItem",
                column: "product_detail_id");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItem_ProductDetail_product_detail_id",
                table: "OrderItem",
                column: "product_detail_id",
                principalTable: "ProductDetail",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderItem_ProductDetail_product_detail_id",
                table: "OrderItem");

            migrationBuilder.DropIndex(
                name: "IX_OrderItem_product_detail_id",
                table: "OrderItem");

            migrationBuilder.DropColumn(
                name: "color",
                table: "OrderItem");

            migrationBuilder.DropColumn(
                name: "product_detail_id",
                table: "OrderItem");

            migrationBuilder.RenameColumn(
                name: "size",
                table: "OrderItem",
                newName: "pay_method");

            migrationBuilder.RenameColumn(
                name: "quantity",
                table: "OrderItem",
                newName: "status_order");

            migrationBuilder.AddColumn<double>(
                name: "total_order",
                table: "OrderItem",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.CreateTable(
                name: "OrderItemDetail",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    order_id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    product_detail_id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    color = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    quantity = table.Column<int>(type: "int", nullable: false),
                    size = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderItemDetail", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderItemDetail_OrderItem_order_id",
                        column: x => x.order_id,
                        principalTable: "OrderItem",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderItemDetail_ProductDetail_product_detail_id",
                        column: x => x.product_detail_id,
                        principalTable: "ProductDetail",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_OrderItemDetail_order_id",
                table: "OrderItemDetail",
                column: "order_id");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItemDetail_product_detail_id",
                table: "OrderItemDetail",
                column: "product_detail_id");
        }
    }
}
