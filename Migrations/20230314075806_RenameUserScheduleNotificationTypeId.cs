using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class RenameUserScheduleNotificationTypeId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NotificationType",
                table: "UserNotificationSchedules");

            migrationBuilder.AddColumn<int>(
                name: "NotificationTypeId",
                table: "UserNotificationSchedules",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NotificationTypeId",
                table: "UserNotificationSchedules");

            migrationBuilder.AddColumn<string>(
                name: "NotificationType",
                table: "UserNotificationSchedules",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
