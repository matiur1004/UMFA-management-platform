using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class KiloLitersAndNoUsage : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData("NotificationTypes",
               new[] { "Name" },
               new object[,]
               {
                    {"No Usage" }
               });
            migrationBuilder.InsertData("RegisterTypes",
               new[] { "RegisterTypeName" },
               new object[,]
               {
                    {"kl - Water" }
               });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
