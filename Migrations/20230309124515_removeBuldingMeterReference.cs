using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class removeBuldingMeterReference : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AMRMeters_Buildings_BuildingId",
                table: "AMRMeters");

            migrationBuilder.DropIndex(
                name: "IX_AMRMeters_BuildingId",
                table: "AMRMeters");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_AMRMeters_BuildingId",
                table: "AMRMeters",
                column: "BuildingId");

            migrationBuilder.AddForeignKey(
                name: "FK_AMRMeters_Buildings_BuildingId",
                table: "AMRMeters",
                column: "BuildingId",
                principalTable: "Buildings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
