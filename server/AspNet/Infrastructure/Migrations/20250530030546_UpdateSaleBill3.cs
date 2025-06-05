using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSaleBill3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_BackBill_bill_id",
                table: "BackBill");

            migrationBuilder.CreateIndex(
                name: "IX_BackBill_bill_id",
                table: "BackBill",
                column: "bill_id",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_BackBill_bill_id",
                table: "BackBill");

            migrationBuilder.CreateIndex(
                name: "IX_BackBill_bill_id",
                table: "BackBill",
                column: "bill_id");
        }
    }
}
