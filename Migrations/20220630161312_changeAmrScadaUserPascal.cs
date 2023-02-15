using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class changeAmrScadaUserPascal : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SGDUrl",
                table: "AMRScadaUsers",
                newName: "SgdUrl");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SgdUrl",
                table: "AMRScadaUsers",
                newName: "SGDUrl");
        }
    }
}
