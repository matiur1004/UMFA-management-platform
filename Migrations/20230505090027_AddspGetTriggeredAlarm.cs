using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class AddspGetTriggeredAlarm : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("CREATE OR ALTER proc spGetTriggeredAlarm\r\n(\r\n@AlarmTriggerId int\r\n)\r\n\r\nAS\r\n\r\n--Declare\r\n--@AlarmTriggerId int = 3\r\n\r\ndeclare\r\n@OccStart smalldatetime,\r\n@OccEnd smalldatetime,\r\n@MeterSerial varchar(50)\r\n\r\nselect\r\nt.AMRMeterTriggeredAlarmId, t.Acknowledged\r\n, ta.AlarmName, ta.AlarmDescription\r\n, m.MeterSerial, m.MeterNo as UMFAMeterNo, m.Description as MeterDescription\r\n, b.Partner, b.Name as Building\r\n, t.Threshold, t.Duration, t.AverageObserved, t.MaximumObserved\r\nfrom\r\nAMRMeterTriggeredAlarms t (NOLOCK)\r\njoin AMRMeterAlarms ma (NOLOCK) on (t.AMRMeterAlarmId = ma.AMRMeterAlarmId)\r\njoin AMRMeters m (NOLOCK) on (ma.AMRMeterId = m.Id)\r\njoin AlarmTypes ta (NOLOCK) on (ma.AlarmTypeId = ta.AlarmTypeId)\r\njoin Buildings b (NOLOCK) on (m.BuildingId = b.UmfaId)\r\nwhere\r\nt.AMRMeterTriggeredAlarmId = @AlarmTriggerId\r\n\r\nselect\r\n@OccStart = OccStartDTM, @OccEnd = OccEndDTM , @MeterSerial = m.MeterSerial\r\nfrom\r\nAMRMeterTriggeredAlarms t (NOLOCK)\r\njoin AMRMeterAlarms ma (NOLOCK) on (t.AMRMeterAlarmId = ma.AMRMeterAlarmId)\r\njoin AMRMeters m (NOLOCK) on (ma.AMRMeterId = m.Id)\r\nwhere\r\nt.AMRMeterTriggeredAlarmId = @AlarmTriggerId\r\n\r\nselect\r\nconvert(varchar(16), p.ReadingDate, 120) as ReadingDate\r\n, p.P1 as ActFlow, Calculated = case when p.Status = 0 then 0 else 1 end\r\n, case when p.ReadingDate >= @OccStart and p.ReadingDate < @OccEnd then 'red' else '#00cc00' end as Color\r\nfrom\r\nScadaProfileData p (NOLOCK)\r\nwhere\r\np.SerialNumber = @MeterSerial\r\nand p.ReadingDate between DATEADD(HH, -12, @OccStart) and DATEADD(HH, 12, @OccEnd)\r\norder by\r\np.ReadingDate");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE [dbo].[spGetTriggeredAlarm]");
        }
    }
}
