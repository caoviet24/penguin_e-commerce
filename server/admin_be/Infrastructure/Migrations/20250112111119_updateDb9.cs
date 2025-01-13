using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class updateDb9 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductReview_Product_product_id",
                table: "ProductReview");

            migrationBuilder.RenameColumn(
                name: "product_id",
                table: "ProductReview",
                newName: "product_detail_id");

            migrationBuilder.RenameIndex(
                name: "IX_ProductReview_product_id",
                table: "ProductReview",
                newName: "IX_ProductReview_product_detail_id");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductReview_ProductDetail_product_detail_id",
                table: "ProductReview",
                column: "product_detail_id",
                principalTable: "ProductDetail",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductReview_ProductDetail_product_detail_id",
                table: "ProductReview");

            migrationBuilder.RenameColumn(
                name: "product_detail_id",
                table: "ProductReview",
                newName: "product_id");

            migrationBuilder.RenameIndex(
                name: "IX_ProductReview_product_detail_id",
                table: "ProductReview",
                newName: "IX_ProductReview_product_id");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductReview_Product_product_id",
                table: "ProductReview",
                column: "product_id",
                principalTable: "Product",
                principalColumn: "Id");
        }
    }
}
