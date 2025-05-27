using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class addReviewMedia : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "content",
                table: "ProductReview",
                newName: "comment");

            migrationBuilder.CreateTable(
                name: "ReviewMedia",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    review_id = table.Column<string>(type: "text", nullable: false),
                    media_url = table.Column<string>(type: "text", nullable: false),
                    media_type = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReviewMedia", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ReviewMedia_ProductReview_review_id",
                        column: x => x.review_id,
                        principalTable: "ProductReview",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ReviewMedia_review_id",
                table: "ReviewMedia",
                column: "review_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ReviewMedia");

            migrationBuilder.RenameColumn(
                name: "comment",
                table: "ProductReview",
                newName: "content");
        }
    }
}
