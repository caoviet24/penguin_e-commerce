using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "status_bill",
                table: "SaleBill");

            migrationBuilder.RenameColumn(
                name: "status_voucher",
                table: "Voucher",
                newName: "status");

            migrationBuilder.RenameColumn(
                name: "status_verify",
                table: "VerifyAccount",
                newName: "status");

            migrationBuilder.RenameColumn(
                name: "category_detail_name",
                table: "CategoryDetail",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "category_name",
                table: "Category",
                newName: "name");

            migrationBuilder.AddColumn<string>(
                name: "status",
                table: "SaleBill",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "status",
                table: "SaleBill");

            migrationBuilder.RenameColumn(
                name: "status",
                table: "Voucher",
                newName: "status_voucher");

            migrationBuilder.RenameColumn(
                name: "status",
                table: "VerifyAccount",
                newName: "status_verify");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "CategoryDetail",
                newName: "category_detail_name");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "Category",
                newName: "category_name");

            migrationBuilder.AddColumn<int>(
                name: "status_bill",
                table: "SaleBill",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
