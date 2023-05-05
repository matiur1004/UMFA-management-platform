using ClientPortal.Data.Entities.PortalEntities;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class RecreateUserAMRMeterActiveNotifications : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserAMRMeterActiveNotifications");

            migrationBuilder.CreateTable(
                name: "UserAMRMeterActiveNotifications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    AMRMeterAlarmId = table.Column<int>(type: "int", nullable: false),
                    UserNotificationId = table.Column<int>(type: "int", nullable: false),
                    Enabled = table.Column<bool>(type: "bit", nullable: false),
                    Active = table.Column<bool>(type: "bit", nullable: false),
                    LastRunDateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastRunDataDateTime = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserAMRMeterActiveNotifications", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserAMRMeterActiveNotifications");
        }
    }
}
