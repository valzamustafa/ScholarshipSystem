using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class ApplicationStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "ApplicationStatus",
                columns: new[] { "Id", "StatusName" },
                values: new object[,]
                {
                    { 1, "Pending" },
                    { 2, "Declined" },
                    { 3, "Approved" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ApplicationStatus",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "ApplicationStatus",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "ApplicationStatus",
                keyColumn: "Id",
                keyValue: 3);
        }
    }
}
