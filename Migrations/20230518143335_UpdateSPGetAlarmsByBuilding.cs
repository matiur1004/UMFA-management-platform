using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class UpdateSPGetAlarmsByBuilding : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("ALTER proc [dbo].[spGetAlarmsByBuilding]\r\n(\r\n@BuildingId int\r\n)\r\n\r\nAS\r\n\r\n--declare @BuildingId int = 2983\r\n\r\nselect\r\nb.id  as BuildingId, b.UmfaId as UmfaBuildingId, b.Name as Building,\r\nm.Id AS AMRMeterId,\r\nm.MeterNo,\r\nm.Description,\r\nmm.Make,\r\nmm.Model,\r\nm.MeterSerial as ScadaMeterNo,\r\n(\r\n\tselect\r\n\tSTRING_AGG(AlarmTypeId, ', ')\r\n\tfrom\r\n\t(\r\n\t\tselect distinct AlarmTypeId\r\n\t\tfrom\r\n\t\tAMRMeterAlarms (NOLOCK) where AMRMeterId = m.Id\r\n\t) a\r\n) as Configured,\r\n(\r\n\tselect\r\n\tSTRING_AGG(AlarmTypeId, ', ')\r\n\tfrom\r\n\t(\r\n\t\tselect distinct ma.AlarmTypeId\r\n\t\tfrom\r\n\t\tAMRMeterTriggeredAlarms t (NOLOCK)\r\n\t\tjoin AMRMeterAlarms ma (NOLOCK) on (t.AMRMeterAlarmId = ma.AMRMeterAlarmId)\r\n\t\twhere ma.AMRMeterId = m.Id and t.Acknowledged = 0\r\n\r\n) b\r\n) as Triggered\r\nfrom\r\nAMRMeters m (NOLOCK)\r\njoin Buildings b (NOLOCK) on (m.BuildingId = b.UmfaId)\r\njoin MetersMakeModels mm (NOLOCK) on (m.MakeModelId = mm.id    )\r\nWHERE m.BuildingId = @BuildingId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
