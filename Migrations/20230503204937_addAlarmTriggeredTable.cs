using System;
using ClientPortal.Data.Entities.PortalEntities;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class addAlarmTriggeredTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AMRMeterTriggeredAlarms",
                columns: table => new
                {
                    AMRMeterTriggeredAlarmId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AMRMeterAlarmId = table.Column<int>(type: "int", nullable: false),
                    OccStartDTM = table.Column<DateTime>(type: "datetime2", nullable: false),
                    OccEndDTM = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Threshold = table.Column<decimal>(type: "decimal(18,6)", nullable: false),
                    Duration = table.Column<int>(type: "int", nullable: false),
                    AverageObserved = table.Column<decimal>(type: "decimal(18,6)", nullable: false),
                    MaximumObserved = table.Column<decimal>(type: "decimal(18,6)", nullable: false),
                    CreatedDTM = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedDTM = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Acknowledged = table.Column<bool>(type: "bit", nullable: false),
                    Active = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AMRMeterTriggeredAlarms", x => x.AMRMeterTriggeredAlarmId);
                    table.ForeignKey(
                        name: "FK_AMRMeterTriggeredAlarms_AMRMeterAlarms_AMRMeterAlarmId",
                        column: x => x.AMRMeterAlarmId,
                        principalTable: "AMRMeterAlarms",
                        principalColumn: "AMRMeterAlarmId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_AMRMeterTriggeredAlarms_AMRMeterAlarmId",
                table: "AMRMeterTriggeredAlarms",
                column: "AMRMeterAlarmId");

            migrationBuilder.Sql("DELETE FROM AMRMeterTriggeredAlarms", true);

            migrationBuilder.InsertData("AMRMeterTriggeredAlarms",
               new[] { "AMRMeterAlarmId", "OccStartDTM", "OccEndDTM", "Threshold", "Duration", "AverageObserved", "MaximumObserved", "CreatedDTM", "UpdatedDTM", "Acknowledged", "Active" },
            new object[,]
            {
                    { 1, "2023-02-11 20:00:00.0000000", "2023-02-11 22:00:00.0000000", 0.010000, 60, 0.200000, 0.038000, "2023-05-03 21:51:00.0000000", "2023-05-03 21:51:00.0000000", false, true },
                    { 1, "2023-02-18 20:00:00.0000000", "2023-02-18 21:30:00.0000000", 0.010000, 60, 0.011000, 0.014000, "2023-05-03 21:54:00.0000000", "2023-05-03 21:54:00.0000000", false, true },
                    { 4, "2023-02-12 09:30:00.0000000", "2023-02-12 10:30:00.0000000", 0.040000, 2, 0.044000, 0.046000, "2023-05-03 21:58:00.0000000", "2023-05-03 21:58:00.0000000", false, true }
               });

        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AMRMeterTriggeredAlarms");
        }
    }
}
