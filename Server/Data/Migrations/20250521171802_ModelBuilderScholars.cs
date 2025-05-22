using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class ModelBuilderScholars : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "ScholarshipCategory",
                columns: new[] { "Id", "Description", "Name" },
                values: new object[,]
                {
                    { 1, "For students already enrolled in university", "University Students" },
                    { 2, "For students graduating high school and entering university", "High School Graduates" },
                    { 3, "For vocational and professional training programs", "Training Programs" }
                });

            migrationBuilder.InsertData(
                table: "ScholarshipType",
                columns: new[] { "Id", "Description", "Name" },
                values: new object[,]
                {
                    { 1, "100% coverage", "Full" },
                    { 2, "75% coverage", "Partial 75%" },
                    { 3, "50% coverage", "Partial 50%" },
                    { 4, "25% coverage", "Partial 25%" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ScholarshipCategory",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "ScholarshipCategory",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "ScholarshipCategory",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "ScholarshipType",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "ScholarshipType",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "ScholarshipType",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "ScholarshipType",
                keyColumn: "Id",
                keyValue: 4);
        }
    }
}
