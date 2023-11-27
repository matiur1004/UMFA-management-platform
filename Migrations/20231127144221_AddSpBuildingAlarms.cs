using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class AddSpBuildingAlarms : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("CREATE OR ALTER PROC [dbo].[spGetAlarmsPerBuilding]\r\n\r\nAS\r\n\r\nselect\r\nb.PartnerId, b.Partner, b.UmfaId as BuildingId, b.Name as BuildingName\r\n, count(distinct ta.AMRMeterTriggeredAlarmId) as NoOfAlarms\r\nfrom\r\nBuildings b \r\njoin AMRMeters m on (b.UmfaId = m.BuildingId)\r\njoin AMRMeterAlarms ma on (m.Id = ma.AMRMeterId and ma.Active = 1)\r\njoin AMRMeterTriggeredAlarms ta on (ma.AMRMeterAlarmId = ta.AMRMeterAlarmId and ta.Acknowledged = 0 and ta.Active = 1)\r\ngroup by\r\nb.PartnerId, b.Partner, b.UmfaId, b.Name\r\n");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE [dbo].[spGetAlarmsPerBuilding]");
        }
    }
}
