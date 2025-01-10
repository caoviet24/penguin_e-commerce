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
            migrationBuilder.DropIndex(
                name: "IX_MyBooth_created_by",
                table: "MyBooth");

            migrationBuilder.CreateIndex(
                name: "IX_MyBooth_created_by",
                table: "MyBooth",
                column: "created_by",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_MyBooth_created_by",
                table: "MyBooth");

            migrationBuilder.CreateIndex(
                name: "IX_MyBooth_created_by",
                table: "MyBooth",
                column: "created_by");
        }
    }
}
