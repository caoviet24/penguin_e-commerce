using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitDB2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MyBooth_Account_booth_id",
                table: "MyBooth");

            migrationBuilder.DropForeignKey(
                name: "FK_Product_MyBooth_created_by",
                table: "Product");

            migrationBuilder.RenameColumn(
                name: "created_by",
                table: "Product",
                newName: "booth_id");

            migrationBuilder.RenameIndex(
                name: "IX_Product_created_by",
                table: "Product",
                newName: "IX_Product_booth_id");

            migrationBuilder.RenameColumn(
                name: "booth_id",
                table: "MyBooth",
                newName: "created_by");

            migrationBuilder.RenameIndex(
                name: "IX_MyBooth_booth_id",
                table: "MyBooth",
                newName: "IX_MyBooth_created_by");

            migrationBuilder.AddForeignKey(
                name: "FK_MyBooth_Account_created_by",
                table: "MyBooth",
                column: "created_by",
                principalTable: "Account",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Product_MyBooth_booth_id",
                table: "Product",
                column: "booth_id",
                principalTable: "MyBooth",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MyBooth_Account_created_by",
                table: "MyBooth");

            migrationBuilder.DropForeignKey(
                name: "FK_Product_MyBooth_booth_id",
                table: "Product");

            migrationBuilder.RenameColumn(
                name: "booth_id",
                table: "Product",
                newName: "created_by");

            migrationBuilder.RenameIndex(
                name: "IX_Product_booth_id",
                table: "Product",
                newName: "IX_Product_created_by");

            migrationBuilder.RenameColumn(
                name: "created_by",
                table: "MyBooth",
                newName: "booth_id");

            migrationBuilder.RenameIndex(
                name: "IX_MyBooth_created_by",
                table: "MyBooth",
                newName: "IX_MyBooth_booth_id");

            migrationBuilder.AddForeignKey(
                name: "FK_MyBooth_Account_booth_id",
                table: "MyBooth",
                column: "booth_id",
                principalTable: "Account",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Product_MyBooth_created_by",
                table: "Product",
                column: "created_by",
                principalTable: "MyBooth",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
