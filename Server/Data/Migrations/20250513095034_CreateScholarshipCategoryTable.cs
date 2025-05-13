using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class CreateScholarshipCategoryTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Scholarship_ScholarshipCategorie_ScholarshipCategoryId",
                table: "Scholarship");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ScholarshipCategorie",
                table: "ScholarshipCategorie");

            migrationBuilder.RenameTable(
                name: "ScholarshipCategorie",
                newName: "ScholarshipCategory");

            migrationBuilder.RenameColumn(
                name: "ScholarshipTypeId",
                table: "ScholarshipType",
                newName: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ScholarshipCategory",
                table: "ScholarshipCategory",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Scholarship_ScholarshipCategory_ScholarshipCategoryId",
                table: "Scholarship",
                column: "ScholarshipCategoryId",
                principalTable: "ScholarshipCategory",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Scholarship_ScholarshipCategory_ScholarshipCategoryId",
                table: "Scholarship");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ScholarshipCategory",
                table: "ScholarshipCategory");

            migrationBuilder.RenameTable(
                name: "ScholarshipCategory",
                newName: "ScholarshipCategorie");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "ScholarshipType",
                newName: "ScholarshipTypeId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ScholarshipCategorie",
                table: "ScholarshipCategorie",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Scholarship_ScholarshipCategorie_ScholarshipCategoryId",
                table: "Scholarship",
                column: "ScholarshipCategoryId",
                principalTable: "ScholarshipCategorie",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
