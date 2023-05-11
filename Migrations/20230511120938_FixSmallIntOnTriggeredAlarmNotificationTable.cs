using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class FixSmallIntOnTriggeredAlarmNotificationTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<short>(
                name: "Status",
                table: "TriggeredAlarmNotifications",
                type: "smallint",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "TriggeredAlarmNotifications",
                type: "int",
                nullable: false,
                oldClrType: typeof(short),
                oldType: "smallint");
        }
    }
}
