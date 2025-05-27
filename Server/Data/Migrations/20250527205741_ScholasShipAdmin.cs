using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class ScholasShipAdmin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AdminId",
                table: "Scholarship",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Scholarship_AdminId",
                table: "Scholarship",
                column: "AdminId");

            migrationBuilder.AddForeignKey(
                name: "FK_Scholarship_User_AdminId",
                table: "Scholarship",
                column: "AdminId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Scholarship_User_AdminId",
                table: "Scholarship");

            migrationBuilder.DropIndex(
                name: "IX_Scholarship_AdminId",
                table: "Scholarship");

            migrationBuilder.DropColumn(
                name: "AdminId",
                table: "Scholarship");
        }
    }
}
