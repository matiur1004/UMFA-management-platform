using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class RemoveTelegram : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("delete TriggeredAlarmNotifications where NotificationSendTypeId = 3");
            migrationBuilder.Sql("delete UserNotificationSchedules where NotificationSendTypeId = 3");
            migrationBuilder.Sql("delete NotificationSendTypes where Id = 3");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData("NotificationSendTypes",
               new[] { "Name", "Description" },
               new object[,]
               {
                    {"Telegram","Send Via Telegram"}
               });
        }
    }
}
