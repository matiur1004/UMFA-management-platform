using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class profiledata : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProfileData",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AmrMeterId = table.Column<int>(type: "int", nullable: false),
                    ReadingDTM = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Year = table.Column<int>(type: "int", nullable: false),
                    Month = table.Column<int>(type: "int", nullable: false),
                    DayOfMonth = table.Column<int>(type: "int", nullable: false),
                    TouDaysOfWeekId = table.Column<int>(type: "int", nullable: false),
                    TouHalfHourId = table.Column<int>(type: "int", nullable: false),
                    ActiveEnergyReading = table.Column<decimal>(type: "decimal(18,4)", nullable: false),
                    ReActiveEnergyReading = table.Column<decimal>(type: "decimal(18,4)", nullable: false),
                    DemandReading = table.Column<decimal>(type: "decimal(18,4)", nullable: false),
                    ActiveEnergyUsage = table.Column<decimal>(type: "decimal(18,4)", nullable: false),
                    ReActiveEnergyUsage = table.Column<decimal>(type: "decimal(18,4)", nullable: false),
                    Calculated = table.Column<bool>(type: "bit", nullable: false),
                    Active = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProfileData", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProfileData_AMRMeters_AmrMeterId",
                        column: x => x.AmrMeterId,
                        principalTable: "AMRMeters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProfileData_TOUDaysOfWeeks_TouDaysOfWeekId",
                        column: x => x.TouDaysOfWeekId,
                        principalTable: "TOUDaysOfWeeks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProfileData_TOUHalfHours_TouHalfHourId",
                        column: x => x.TouHalfHourId,
                        principalTable: "TOUHalfHours",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProfileData_AmrMeterId",
                table: "ProfileData",
                column: "AmrMeterId");

            migrationBuilder.CreateIndex(
                name: "IX_ProfileData_TouDaysOfWeekId",
                table: "ProfileData",
                column: "TouDaysOfWeekId");

            migrationBuilder.CreateIndex(
                name: "IX_ProfileData_TouHalfHourId",
                table: "ProfileData",
                column: "TouHalfHourId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProfileData");
        }
    }
}
