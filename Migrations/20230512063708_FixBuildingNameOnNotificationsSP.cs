using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class FixBuildingNameOnNotificationsSP : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("CREATE OR ALTER PROC [dbo].[spGetNotificationsToSend]\r\n\r\nAS\r\n\r\ndeclare\r\n@Day int = datepart(W, getdate()), --Sunday = 1\r\n@Time time = cast(getdate() as time)\r\n\r\nselect\r\nta.AMRMeterTriggeredAlarmId, ta.AMRMeterAlarmId\r\n, ua.UserId\r\n, b.id  as BuildingId, b.UmfaId, b.Name as BuildingName\r\n, m.Id as AMRMeterId, m.MeterNo, m.MeterSerial, m.Description\r\n, t.AlarmName, t.AlarmDescription\r\n, ta.OccStartDTM\r\n, us.NotificationSendTypeId, nt.Name\r\n--, *\r\nfrom\r\nAMRMeterTriggeredAlarms ta (NOLOCK)\r\njoin AMRMeterAlarms ma (NOLOCK) on (ta.AMRMeterAlarmId = ma.AMRMeterAlarmId)\r\njoin AlarmTypes t (NOLOCK) on (ma.AlarmTypeId = t.AlarmTypeId)\r\njoin AMRMeters m (NOLOCK) on (ma.AMRMeterId = m.Id)\r\njoin Buildings b (NOLOCK) on (m.BuildingId = b.UmfaId)\r\njoin UserAMRMeterActiveNotifications ua (NOLOCK) on (ta.AMRMeterAlarmId = ua.AMRMeterAlarmId and ua.Enabled = 1 and ua.Active = 1\r\n\t\tand (ua.LastRunDataDateTime is null or ua.LastRunDataDateTime < ta.OccStartDTM))\r\njoin UserNotifications un (NOLOCK) on (ua.UserId = un.UserId and ma.AlarmTypeId = un.NotificationTypeId)\r\njoin UserNotificationSchedules us (NOLOCK) on (ua.UserId = us.UserId and m.BuildingId = us.BuildingId\r\n\t\tand (\r\n\t\t\t\t(@Day = 2 and us.Monday = 1) or\r\n\t\t\t\t(@Day = 3 and us.Tuesday = 1) or\r\n\t\t\t\t(@Day = 4 and us.Wednesday = 1) or\r\n\t\t\t\t(@Day = 5 and us.Thursday = 1) or\r\n\t\t\t\t(@Day = 6 and us.Friday = 1) or\r\n\t\t\t\t(@Day = 7 and us.Saturday = 1) or\r\n\t\t\t\t(@Day = 1 and us.Sunday = 1)\r\n\t\t\t) and @Time between us.StartTime and us.EndTime\r\n\t\tand (\r\n\t\t\t\t(un.Email = 1 and us.NotificationSendTypeId = 1) or\r\n\t\t\t\t(un.WhatsApp = 1 and us.NotificationSendTypeId = 2) or\r\n\t\t\t\t(un.Telegram = 1 and us.NotificationSendTypeId = 3)\r\n\t\t\t))\r\njoin NotificationSendTypes nt (NOLOCK) on (us.NotificationSendTypeId = nt.id )\r\nleft join TriggeredAlarmNotifications tn (NOLOCK) on (ua.UserId = tn.UserId and ta.AMRMeterTriggeredAlarmId = tn.AMRMeterTriggeredAlarmId\r\n\t\tand tn.Active = 1 and ((tn.Status = 1) or (tn.Status > 1  and tn.SendDateTime > dateadd(HH, -24, getdate()))))\r\nwhere\r\nta.Acknowledged = 0\r\nand ta.Active = 1\r\nand tn.TriggeredAlarmNotificationId is null");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE [dbo].[spGetNotificationsToSend]");
        }
    }
}
