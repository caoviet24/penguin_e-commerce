using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class updateDB4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Voucher_MyBooth_boot_id",
                table: "Voucher");

            migrationBuilder.DropIndex(
                name: "IX_Voucher_boot_id",
                table: "Voucher");

            migrationBuilder.DropColumn(
                name: "boot_id",
                table: "Voucher");

            migrationBuilder.AddColumn<string>(
                name: "MyBoothEntityId",
                table: "Voucher",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Voucher_MyBoothEntityId",
                table: "Voucher",
                column: "MyBoothEntityId");

            migrationBuilder.AddForeignKey(
                name: "FK_Voucher_MyBooth_MyBoothEntityId",
                table: "Voucher",
                column: "MyBoothEntityId",
                principalTable: "MyBooth",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Voucher_MyBooth_MyBoothEntityId",
                table: "Voucher");

            migrationBuilder.DropIndex(
                name: "IX_Voucher_MyBoothEntityId",
                table: "Voucher");

            migrationBuilder.DropColumn(
                name: "MyBoothEntityId",
                table: "Voucher");

            migrationBuilder.AddColumn<string>(
                name: "boot_id",
                table: "Voucher",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Voucher_boot_id",
                table: "Voucher",
                column: "boot_id");

            migrationBuilder.AddForeignKey(
                name: "FK_Voucher_MyBooth_boot_id",
                table: "Voucher",
                column: "boot_id",
                principalTable: "MyBooth",
                principalColumn: "Id");
        }
    }
}
