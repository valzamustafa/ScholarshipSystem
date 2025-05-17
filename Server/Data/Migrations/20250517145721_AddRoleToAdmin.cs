using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddRoleToAdmin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Admin_RoleId",
                table: "User",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_User_Admin_RoleId",
                table: "User",
                column: "Admin_RoleId");

            migrationBuilder.AddForeignKey(
                name: "FK_User_Role_Admin_RoleId",
                table: "User",
                column: "Admin_RoleId",
                principalTable: "Role",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_User_Role_Admin_RoleId",
                table: "User");

            migrationBuilder.DropIndex(
                name: "IX_User_Admin_RoleId",
                table: "User");

            migrationBuilder.DropColumn(
                name: "Admin_RoleId",
                table: "User");
        }
    }
}
