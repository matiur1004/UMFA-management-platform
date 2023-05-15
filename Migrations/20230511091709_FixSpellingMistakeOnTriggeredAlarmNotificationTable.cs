using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class FixSpellingMistakeOnTriggeredAlarmNotificationTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "NotiicationSendTypeId",
                table: "TriggeredAlarmNotifications",
                newName: "NotificationSendTypeId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "NotificationSendTypeId",
                table: "TriggeredAlarmNotifications",
                newName: "NotiicationSendTypeId");
        }
    }
}
