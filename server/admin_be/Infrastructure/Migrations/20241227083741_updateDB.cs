using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class updateDB : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VoucherUseOrderItem_OrderItem_order_item_id",
                table: "VoucherUseOrderItem");

            migrationBuilder.RenameColumn(
                name: "order_item_id",
                table: "VoucherUseOrderItem",
                newName: "bill_id");

            migrationBuilder.RenameIndex(
                name: "IX_VoucherUseOrderItem_order_item_id",
                table: "VoucherUseOrderItem",
                newName: "IX_VoucherUseOrderItem_bill_id");

            migrationBuilder.AddForeignKey(
                name: "FK_VoucherUseOrderItem_SaleBill_bill_id",
                table: "VoucherUseOrderItem",
                column: "bill_id",
                principalTable: "SaleBill",
                principalColumn: "sale_bill_id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VoucherUseOrderItem_SaleBill_bill_id",
                table: "VoucherUseOrderItem");

            migrationBuilder.RenameColumn(
                name: "bill_id",
                table: "VoucherUseOrderItem",
                newName: "order_item_id");

            migrationBuilder.RenameIndex(
                name: "IX_VoucherUseOrderItem_bill_id",
                table: "VoucherUseOrderItem",
                newName: "IX_VoucherUseOrderItem_order_item_id");

            migrationBuilder.AddForeignKey(
                name: "FK_VoucherUseOrderItem_OrderItem_order_item_id",
                table: "VoucherUseOrderItem",
                column: "order_item_id",
                principalTable: "OrderItem",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
