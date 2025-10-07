using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class NewRows : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AcademicYear",
                table: "Scholarship",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EligibilityCriteria",
                table: "Scholarship",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "University",
                table: "Scholarship",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AcademicYear",
                table: "Scholarship");

            migrationBuilder.DropColumn(
                name: "EligibilityCriteria",
                table: "Scholarship");

            migrationBuilder.DropColumn(
                name: "University",
                table: "Scholarship");
        }
    }
}
