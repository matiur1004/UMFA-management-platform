using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class addAmrUserV2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SacadaPassword",
                table: "AMRScadaUser",
                newName: "ScadaPassword");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ScadaPassword",
                table: "AMRScadaUser",
                newName: "SacadaPassword");
        }
    }
}
