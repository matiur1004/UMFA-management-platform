using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class changesToTriggeredAlarmNotification : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MessageAddress",
                table: "TriggeredAlarmNotifications",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RetryCount",
                table: "TriggeredAlarmNotifications",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MessageAddress",
                table: "TriggeredAlarmNotifications");

            migrationBuilder.DropColumn(
                name: "RetryCount",
                table: "TriggeredAlarmNotifications");
        }
    }
}
