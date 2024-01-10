using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class changesTospGetSmartServicesTenant : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("CREATE OR ALTER proc [dbo].[spGetSmartServicesTenant]\r\n(\r\n@BuildingServiceIds varchar(max)\r\n)\r\nAS\r\n\r\n--declare\r\n--@BuildingServiceIds varchar(max) = '166183, 154175, 214967, 130859, 117292, 130870, 130867, 130868'\r\n\r\nSELECT\r\ncount(1) as TotalSmart\r\n, sum(case when s.SupplyTypeName = 'Electricity' then 1 else 0 end) as Electricity\r\n, sum(case when s.SupplyTypeName = 'Water' then 1 else 0 end) as Water\r\nFROM\r\nMappedMeters m\r\njoin SupplyTypes s on (m.SupplyTypeId = s.SupplyTypeId)\r\njoin (select value as BuildingServiceId from string_split(@BuildingServiceIds, ',')) a on (m.BuildingServiceId = a.BuildingServiceId)\r\n");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("CREATE OR ALTER proc [dbo].[spGetSmartServicesTenant]\r\n(\r\n@BuildingServiceIds varchar(max)\r\n)\r\nAS\r\n\r\n--declare\r\n--@BuildingServiceIds varchar(max) = '166183, 154175, 214967, 130859, 117292, 130870, 130867, 130868'\r\n\r\nSELECT\r\ncount(1) as TotalSmart\r\n, sum(case when m.SupplyType = 'Electricity' then 1 else 0 end) as Electricity\r\n, sum(case when m.SupplyType = 'Water' then 1 else 0 end) as Water\r\nFROM\r\nMappedMeters m\r\njoin (select value as BuildingServiceId from string_split(@BuildingServiceIds, ',')) a on (m.BuildingServiceId = a.BuildingServiceId)\r\n");
        }
    }
}
