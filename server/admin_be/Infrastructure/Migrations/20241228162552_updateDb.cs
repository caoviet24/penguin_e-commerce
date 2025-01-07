using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class updateDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VoucherUseOrderItem");

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
                name: "VoucherUseSaleBill");

            migrationBuilder.CreateTable(
                name: "VoucherUseOrderItem",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    bill_id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    voucher_id = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VoucherUseOrderItem", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VoucherUseOrderItem_SaleBill_bill_id",
                        column: x => x.bill_id,
                        principalTable: "SaleBill",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_VoucherUseOrderItem_Voucher_voucher_id",
                        column: x => x.voucher_id,
                        principalTable: "Voucher",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_VoucherUseOrderItem_bill_id",
                table: "VoucherUseOrderItem",
                column: "bill_id");

            migrationBuilder.CreateIndex(
                name: "IX_VoucherUseOrderItem_voucher_id",
                table: "VoucherUseOrderItem",
                column: "voucher_id");
        }
    }
}
