using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class Amrscadausers : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AMRScadaUser_Users_UserId",
                table: "AMRScadaUser");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AMRScadaUser",
                table: "AMRScadaUser");

            migrationBuilder.RenameTable(
                name: "AMRScadaUser",
                newName: "AMRScadaUsers");

            migrationBuilder.RenameIndex(
                name: "IX_AMRScadaUser_UserId",
                table: "AMRScadaUsers",
                newName: "IX_AMRScadaUsers_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AMRScadaUsers",
                table: "AMRScadaUsers",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_AMRScadaUsers_Users_UserId",
                table: "AMRScadaUsers",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AMRScadaUsers_Users_UserId",
                table: "AMRScadaUsers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AMRScadaUsers",
                table: "AMRScadaUsers");

            migrationBuilder.RenameTable(
                name: "AMRScadaUsers",
                newName: "AMRScadaUser");

            migrationBuilder.RenameIndex(
                name: "IX_AMRScadaUsers_UserId",
                table: "AMRScadaUser",
                newName: "IX_AMRScadaUser_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AMRScadaUser",
                table: "AMRScadaUser",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_AMRScadaUser_Users_UserId",
                table: "AMRScadaUser",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
