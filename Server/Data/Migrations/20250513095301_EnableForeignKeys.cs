using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Data.Migrations
{
   public partial class EnableForeignKeys : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
       
        migrationBuilder.Sql("PRAGMA foreign_keys = 1;");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        
        migrationBuilder.Sql("PRAGMA foreign_keys = 0;");
    }
}

}
