using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class NotificationTypesToDB : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "NotificationTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NotificationTypes", x => x.Id);
                });

            migrationBuilder.Sql("DELETE FROM NotificationTypes", true);

            migrationBuilder.InsertData("NotificationTypes",
               new[] { "Name" },
               new object[,]
               {
                    {"Burst Pipe"},
                    {"UMFA Operator"},
                    {"Night Flow"},
                    {"Max Usage Exceeded"},
                    {"Peak Exceeded"},
                    {"Leak Detection"},
                    {"Total Exceeded"}
               });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NotificationTypes");
        }
    }
}
