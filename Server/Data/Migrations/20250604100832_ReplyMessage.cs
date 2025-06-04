using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class ReplyMessage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsDeletedForRecipient",
                table: "Message",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeletedForSender",
                table: "Message",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentMessageId",
                table: "Message",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Message_ParentMessageId",
                table: "Message",
                column: "ParentMessageId");

            migrationBuilder.AddForeignKey(
                name: "FK_Message_Message_ParentMessageId",
                table: "Message",
                column: "ParentMessageId",
                principalTable: "Message",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Message_Message_ParentMessageId",
                table: "Message");

            migrationBuilder.DropIndex(
                name: "IX_Message_ParentMessageId",
                table: "Message");

            migrationBuilder.DropColumn(
                name: "IsDeletedForRecipient",
                table: "Message");

            migrationBuilder.DropColumn(
                name: "IsDeletedForSender",
                table: "Message");

            migrationBuilder.DropColumn(
                name: "ParentMessageId",
                table: "Message");
        }
    }
}
