using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class RenameUserScheduleNotificationSendTypeId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "NotificationTypeId",
                table: "UserNotificationSchedules",
                newName: "NotificationSendTypeId");

            migrationBuilder.CreateTable(
                name: "NotificationSendTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NotificationSendTypes", x => x.Id);
                });
            
            migrationBuilder.InsertData("NotificationSendTypes",
               new[] { "Name", "Description" },
               new object[,]
               {
                    {"Email","Send Via Email"},
                    {"Whatsapp","Send Via Whatsapp"},
                    {"Telegram","Send Via Telegram"}
               });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NotificationSendTypes");

            migrationBuilder.RenameColumn(
                name: "NotificationSendTypeId",
                table: "UserNotificationSchedules",
                newName: "NotificationTypeId");
        }
    }
}
