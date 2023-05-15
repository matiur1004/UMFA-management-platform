using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class UpdateSPGetNotificationsToSend : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("CREATE OR ALTER PROC [dbo].[spGetNotificationsToSend]\r\n\r\nAS\r\n\r\ndeclare\r\n@Day int = datepart(W, getdate()), --Sunday = 1\r\n@Time time = cast(getdate() as time)\r\n\r\nSELECT ta.AMRMeterTriggeredAlarmId, ta.AMRMeterAlarmId, ua.UserId, Users.FirstName, Users.LastName, Users.NotificationEmailAddress, Users.NotificationMobileNumber, b.Id AS BuildingId, b.UmfaId, b.Name AS BuildingName, \r\n                  m.Id AS AMRMeterId, m.MeterNo, m.MeterSerial, m.Description, t.AlarmName, t.AlarmDescription, ta.OccStartDTM, us.NotificationSendTypeId, nt.Name AS NotificationSendTypeName\r\nFROM     AMRMeterTriggeredAlarms AS ta WITH (NOLOCK) INNER JOIN\r\n                  AMRMeterAlarms AS ma WITH (NOLOCK) ON ta.AMRMeterAlarmId = ma.AMRMeterAlarmId INNER JOIN\r\n                  AlarmTypes AS t WITH (NOLOCK) ON ma.AlarmTypeId = t.AlarmTypeId INNER JOIN\r\n                  AMRMeters AS m WITH (NOLOCK) ON ma.AMRMeterId = m.Id INNER JOIN\r\n                  Buildings AS b WITH (NOLOCK) ON m.BuildingId = b.UmfaId INNER JOIN\r\n                  UserAMRMeterActiveNotifications AS ua WITH (NOLOCK) ON ta.AMRMeterAlarmId = ua.AMRMeterAlarmId AND ua.Enabled = 1 AND ua.Active = 1 AND (ua.LastRunDataDateTime IS NULL OR\r\n                  ua.LastRunDataDateTime < ta.OccStartDTM) INNER JOIN\r\n                  UserNotifications AS un WITH (NOLOCK) ON ua.UserId = un.UserId AND ma.AlarmTypeId = un.NotificationTypeId INNER JOIN\r\n                  UserNotificationSchedules AS us WITH (NOLOCK) ON ua.UserId = us.UserId AND m.BuildingId = us.BuildingId AND (@Day = 2 AND us.Monday = 1 OR\r\n                  @Day = 3 AND us.Tuesday = 1 OR\r\n                  @Day = 4 AND us.Wednesday = 1 OR\r\n                  @Day = 5 AND us.Thursday = 1 OR\r\n                  @Day = 6 AND us.Friday = 1 OR\r\n                  @Day = 7 AND us.Saturday = 1 OR\r\n                  @Day = 1 AND us.Sunday = 1) AND @Time BETWEEN us.StartTime AND us.EndTime AND (un.Email = 1 AND us.NotificationSendTypeId = 1 OR\r\n                  un.WhatsApp = 1 AND us.NotificationSendTypeId = 2 OR\r\n                  un.Telegram = 1 AND us.NotificationSendTypeId = 3) INNER JOIN\r\n                  NotificationSendTypes AS nt WITH (NOLOCK) ON us.NotificationSendTypeId = nt.Id INNER JOIN\r\n                  Users ON m.UserId = Users.Id LEFT OUTER JOIN\r\n                  TriggeredAlarmNotifications AS tn WITH (NOLOCK) ON ua.UserId = tn.UserId AND ta.AMRMeterTriggeredAlarmId = tn.AMRMeterTriggeredAlarmId AND tn.Active = 1 AND (tn.Status = 1 OR\r\n                  tn.Status > 1 AND tn.SendDateTime > DATEADD(HH, - 24, GETDATE()))\r\nWHERE  (ta.Acknowledged = 0) AND (ta.Active = 1) AND (tn.TriggeredAlarmNotificationId IS NULL)");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE [dbo].[spGetNotificationsToSend]");
        }
    }
}
