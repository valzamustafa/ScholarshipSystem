using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class Notiffications : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DeadlineDate",
                table: "Scholarship",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ExpiryDate",
                table: "Scholarship",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsRead",
                table: "Notification",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "NotificationType",
                table: "Notification",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "RelatedEntityId",
                table: "Notification",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RelatedEntityType",
                table: "Notification",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DeadlineDate",
                table: "Scholarship");

            migrationBuilder.DropColumn(
                name: "ExpiryDate",
                table: "Scholarship");

            migrationBuilder.DropColumn(
                name: "IsRead",
                table: "Notification");

            migrationBuilder.DropColumn(
                name: "NotificationType",
                table: "Notification");

            migrationBuilder.DropColumn(
                name: "RelatedEntityId",
                table: "Notification");

            migrationBuilder.DropColumn(
                name: "RelatedEntityType",
                table: "Notification");
        }
    }
}
