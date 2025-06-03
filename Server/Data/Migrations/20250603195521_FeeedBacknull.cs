using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class FeeedBacknull : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Feedback_Scholarship_ScholarshipId",
                table: "Feedback");

            migrationBuilder.AlterColumn<int>(
                name: "ScholarshipId",
                table: "Feedback",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AddForeignKey(
                name: "FK_Feedback_Scholarship_ScholarshipId",
                table: "Feedback",
                column: "ScholarshipId",
                principalTable: "Scholarship",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Feedback_Scholarship_ScholarshipId",
                table: "Feedback");

            migrationBuilder.AlterColumn<int>(
                name: "ScholarshipId",
                table: "Feedback",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Feedback_Scholarship_ScholarshipId",
                table: "Feedback",
                column: "ScholarshipId",
                principalTable: "Scholarship",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
