using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class AddspGetSmartServices : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("CREATE OR ALTER PROC [dbo].[spGetSmartServices]\r\n(\r\n@BuildingId int = 0\r\n)\r\nAS\r\n--declare\r\n--@BuildingId int = 0\r\n\r\nSELECT\r\nBuildingId\r\n, count(1) as TotalSmart\r\n, sum(case when SupplyType = 'Electricity' then 1 else 0 end) as Electricity\r\n, sum(case when SupplyType = 'Water' then 1 else 0 end) as Water\r\n, sum(case when SupplyType = 'Solar' then 1 else 0 end) as Solar\r\n, sum(case when SupplyTo in ('Building', 'Check Meter') and LocationType like 'Council%' then 1 else 0 end) as Council_Check\r\n, sum(case when SupplyTo in ('Building', 'Check Meter') and LocationType in ('Distribution Board', 'Busbar') then 1 else 0 end) as [Bulk]\r\n, sum(case when SupplyType = 'Electricity' and SupplyTo = 'Emergency Supply' then 1 else 0 end) as Generator\r\nFROM\r\nMappedMeters\r\nwhere\r\nBuildingId = @BuildingId or @BuildingId = 0\r\ngroup by\r\nBuildingId\r\n");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE [dbo].[spGetSmartServices]");
        }
    }
}
