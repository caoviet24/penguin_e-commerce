using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class initDB3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BackBill_MyBooth_booth_id",
                table: "BackBill");

            migrationBuilder.DropForeignKey(
                name: "FK_MyBooth_Account_created_by",
                table: "MyBooth");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderItem_MyBooth_seller_id",
                table: "OrderItem");

            migrationBuilder.DropForeignKey(
                name: "FK_Product_MyBooth_booth_id",
                table: "Product");

            migrationBuilder.DropForeignKey(
                name: "FK_SaleBill_MyBooth_seller_id",
                table: "SaleBill");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MyBooth",
                table: "MyBooth");

            migrationBuilder.RenameTable(
                name: "MyBooth",
                newName: "Booth");

            migrationBuilder.RenameColumn(
                name: "booth_name",
                table: "Booth",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "booth_description",
                table: "Booth",
                newName: "description");

            migrationBuilder.RenameColumn(
                name: "booth_avatar",
                table: "Booth",
                newName: "avatar");

            migrationBuilder.RenameIndex(
                name: "IX_MyBooth_created_by",
                table: "Booth",
                newName: "IX_Booth_created_by");

            migrationBuilder.AlterColumn<string>(
                name: "created_by",
                table: "Booth",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Booth",
                table: "Booth",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_BackBill_Booth_booth_id",
                table: "BackBill",
                column: "booth_id",
                principalTable: "Booth",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Booth_Account_created_by",
                table: "Booth",
                column: "created_by",
                principalTable: "Account",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItem_Booth_seller_id",
                table: "OrderItem",
                column: "seller_id",
                principalTable: "Booth",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Product_Booth_booth_id",
                table: "Product",
                column: "booth_id",
                principalTable: "Booth",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SaleBill_Booth_seller_id",
                table: "SaleBill",
                column: "seller_id",
                principalTable: "Booth",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BackBill_Booth_booth_id",
                table: "BackBill");

            migrationBuilder.DropForeignKey(
                name: "FK_Booth_Account_created_by",
                table: "Booth");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderItem_Booth_seller_id",
                table: "OrderItem");

            migrationBuilder.DropForeignKey(
                name: "FK_Product_Booth_booth_id",
                table: "Product");

            migrationBuilder.DropForeignKey(
                name: "FK_SaleBill_Booth_seller_id",
                table: "SaleBill");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Booth",
                table: "Booth");

            migrationBuilder.RenameTable(
                name: "Booth",
                newName: "MyBooth");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "MyBooth",
                newName: "booth_name");

            migrationBuilder.RenameColumn(
                name: "description",
                table: "MyBooth",
                newName: "booth_description");

            migrationBuilder.RenameColumn(
                name: "avatar",
                table: "MyBooth",
                newName: "booth_avatar");

            migrationBuilder.RenameIndex(
                name: "IX_Booth_created_by",
                table: "MyBooth",
                newName: "IX_MyBooth_created_by");

            migrationBuilder.AlterColumn<string>(
                name: "created_by",
                table: "MyBooth",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_MyBooth",
                table: "MyBooth",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_BackBill_MyBooth_booth_id",
                table: "BackBill",
                column: "booth_id",
                principalTable: "MyBooth",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MyBooth_Account_created_by",
                table: "MyBooth",
                column: "created_by",
                principalTable: "Account",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItem_MyBooth_seller_id",
                table: "OrderItem",
                column: "seller_id",
                principalTable: "MyBooth",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Product_MyBooth_booth_id",
                table: "Product",
                column: "booth_id",
                principalTable: "MyBooth",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SaleBill_MyBooth_seller_id",
                table: "SaleBill",
                column: "seller_id",
                principalTable: "MyBooth",
                principalColumn: "Id");
        }
    }
}
