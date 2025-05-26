using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class FieldsApplication : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CvLink",
                table: "Application",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Gpa",
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

            migrationBuilder.AddColumn<string>(
                name: "StudyField",
                table: "Application",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StudyYear",
                table: "Application",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CvLink",
                table: "Application");

            migrationBuilder.DropColumn(
                name: "Gpa",
                table: "Application");

            migrationBuilder.DropColumn(
                name: "MotivationLetter",
                table: "Application");

            migrationBuilder.DropColumn(
                name: "Portfolio",
                table: "Application");

            migrationBuilder.DropColumn(
                name: "StudyField",
                table: "Application");

            migrationBuilder.DropColumn(
                name: "StudyYear",
                table: "Application");
        }
    }
}
