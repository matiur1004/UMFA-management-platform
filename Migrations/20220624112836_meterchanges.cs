using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class meterchanges : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "make",
                table: "AMRMeters");

            migrationBuilder.DropColumn(
                name: "model",
                table: "AMRMeters");

            migrationBuilder.DropColumn(
                name: "utility",
                table: "AMRMeters");

            migrationBuilder.AddColumn<int>(
                name: "makeModelId",
                table: "AMRMeters",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_AMRMeters_makeModelId",
                table: "AMRMeters",
                column: "makeModelId");

            migrationBuilder.AddForeignKey(
                name: "FK_AMRMeters_MetersMakeModels_makeModelId",
                table: "AMRMeters",
                column: "makeModelId",
                principalTable: "MetersMakeModels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AMRMeters_MetersMakeModels_makeModelId",
                table: "AMRMeters");

            migrationBuilder.DropIndex(
                name: "IX_AMRMeters_makeModelId",
                table: "AMRMeters");

            migrationBuilder.DropColumn(
                name: "makeModelId",
                table: "AMRMeters");

            migrationBuilder.AddColumn<string>(
                name: "make",
                table: "AMRMeters",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "model",
                table: "AMRMeters",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "utility",
                table: "AMRMeters",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
