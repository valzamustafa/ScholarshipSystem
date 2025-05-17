using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class Rolet : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "RoleId",
                table: "User",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AddColumn<int>(
                name: "Provider_RoleId",
                table: "User",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_User_Provider_RoleId",
                table: "User",
                column: "Provider_RoleId");

            migrationBuilder.AddForeignKey(
                name: "FK_User_Role_Provider_RoleId",
                table: "User",
                column: "Provider_RoleId",
                principalTable: "Role",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_User_Role_Provider_RoleId",
                table: "User");

            migrationBuilder.DropIndex(
                name: "IX_User_Provider_RoleId",
                table: "User");

            migrationBuilder.DropColumn(
                name: "Provider_RoleId",
                table: "User");

            migrationBuilder.AlterColumn<int>(
                name: "RoleId",
                table: "User",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);
        }
    }
}
