using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class spMaintainUserAlarmNotification : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("CREATE OR ALTER proc [dbo].[spMaintainUserAlarmNotification]\r\n(\r\n@UserId int,\r\n@AMRMeterId int,\r\n@AlarmTypeId int,\r\n@Enabled bit\r\n)\r\n\r\nas\r\n\r\n--declare\r\n--@UserId int = 2,\r\n--@AMRMeterId int = 245,\r\n--@AlarmTypeId int = 2,\r\n--@Enabled bit = 1\r\n\r\ndeclare @uaId int;\r\n\r\nif not exists (select 1 from UserNotifications (NOLOCK) where UserId = @UserId and NotificationTypeId = @AlarmTypeId)\r\nreturn\r\n\r\nif not exists (select 1 from AMRMeterAlarms (NOLOCK) where AMRMeterId = @AMRMeterId and AlarmTypeId = @AlarmTypeId)\r\nreturn\r\n\r\nselect\r\n@uaId = ua.id \r\nfrom\r\nUserAMRMeterActiveNotifications ua (NOLOCK)\r\njoin AMRMeterAlarms ma (NOLOCK) on (ua.AMRMeterAlarmId = ma.AMRMeterAlarmId and ma.AlarmTypeId = @AlarmTypeId)\r\njoin UserNotifications un (NOLOCK) on (ua.UserNotificationId = un.Id and ma.AlarmTypeId = un.NotificationTypeId)\r\njoin AMRMeters m (NOLOCK) on (ma.AMRMeterId = m.Id and m.Id = @AMRMeterId)\r\nwhere\r\nua.UserId = @UserId\r\n\r\nif @uaId is null\r\nbegin\r\n\tinsert into UserAMRMeterActiveNotifications\r\n\tselect\r\n\t@UserId, ma.AMRMeterAlarmId, un.Id, @Enabled, 1, null, null\r\n\tfrom\r\n\tAMRMeters m (NOLOCK)\r\n\tjoin AMRMeterAlarms ma (NOLOCK) on (m.Id = ma.AMRMeterId and ma.AlarmTypeId = @AlarmTypeId)\r\n\tjoin UserNotifications un (NOLOCK) on (un.UserId = @UserId and un.NotificationTypeId = @AlarmTypeId)\r\n\twhere\r\n\tm.Id = @AMRMeterId\r\nend\r\nelse\r\nbegin\r\n\tupdate UserAMRMeterActiveNotifications set Enabled = @Enabled where Id = @uaId\r\nend");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE [dbo].[spMaintainUserAlarmNotification]");
        }
    }
}
