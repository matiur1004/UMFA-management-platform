using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class touseasontoheader : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TOUHeaderId",
                table: "TOUSeasons",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_TOUSeasons_TOUHeaderId",
                table: "TOUSeasons",
                column: "TOUHeaderId");

            migrationBuilder.AddForeignKey(
                name: "FK_TOUSeasons_TOUHeaders_TOUHeaderId",
                table: "TOUSeasons",
                column: "TOUHeaderId",
                principalTable: "TOUHeaders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TOUSeasons_TOUHeaders_TOUHeaderId",
                table: "TOUSeasons");

            migrationBuilder.DropIndex(
                name: "IX_TOUSeasons_TOUHeaderId",
                table: "TOUSeasons");

            migrationBuilder.DropColumn(
                name: "TOUHeaderId",
                table: "TOUSeasons");
        }
    }
}
