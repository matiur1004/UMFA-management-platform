using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class RenameUserNotificationSchedule : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_UserNotificationSchedule",
                table: "UserNotificationSchedule");

            migrationBuilder.RenameTable(
                name: "UserNotificationSchedule",
                newName: "UserNotificationSchedules");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserNotificationSchedules",
                table: "UserNotificationSchedules",
                column: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_UserNotificationSchedules",
                table: "UserNotificationSchedules");

            migrationBuilder.RenameTable(
                name: "UserNotificationSchedules",
                newName: "UserNotificationSchedule");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserNotificationSchedule",
                table: "UserNotificationSchedule",
                column: "Id");
        }
    }
}
