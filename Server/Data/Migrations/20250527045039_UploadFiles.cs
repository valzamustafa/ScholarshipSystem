using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class UploadFiles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CvLink",
                table: "Application");

            migrationBuilder.DropColumn(
                name: "MotivationLetter",
                table: "Application");

            migrationBuilder.DropColumn(
                name: "Portfolio",
                table: "Application");

            migrationBuilder.AddColumn<string>(
                name: "DocumentType",
                table: "ApplicationDocument",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DocumentType",
                table: "ApplicationDocument");

            migrationBuilder.AddColumn<string>(
                name: "CvLink",
                table: "Application",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MotivationLetter",
                table: "Application",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Portfolio",
                table: "Application",
                type: "TEXT",
                nullable: true);
        }
    }
}
