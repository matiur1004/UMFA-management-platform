using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class AddAlarmTypeItems : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData("AlarmTypes",
               new[] { "SupplyTypeId", "AlarmName", "AlarmDescription", "Active" },
               new object[,]
               {
                    {6 , "Night Flow", "Un-Expected flow observed during in-active hours", true },
                    {6 , "Burst Pipe", "Un-Expected high usage observed for extended time", true },
                    {6 , "Leak", "Possible leak due to usage not falling below threshold", true },
                    {6 , "Daily Usage", "The average daily usage was exceeded", true },
                    {6 , "Peak", "Previously observed maximum usages exceeded", true },
                    {6 , "Average", "Previously observed average usage for time period exceeded", true }
               });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
