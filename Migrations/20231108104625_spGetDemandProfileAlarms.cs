using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class spGetDemandProfileAlarms : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("create proc [dbo].[spGetDemandProfileAlarms]\r\n(\r\n@MeterId int,\r\n@SDate smalldatetime,\r\n@EDate smalldatetime,\r\n@NightFlowStart time = '22:00',\r\n@NightFlowEnd time = '05:00',\r\n@ApplyNightFlow bit = 1\r\n)\r\nAS\r\n\r\n--declare\r\n--@MeterId int = 687,\r\n--@SDate smalldatetime = '2023-10-01 00:30',\r\n--@EDate smalldatetime = '2023-10-08 00:00',\r\n--@NightFlowStart time = '22:00',\r\n--@NightFlowEnd time = '05:00',\r\n--@ApplyNightFlow bit = 0\r\n\r\ndeclare\r\n@RowCnt int\r\n\r\ndeclare @tMeter table (Id int, Serial nvarchar(50))\r\ndeclare @tData table (Id int identity(1,1), ReadingDate smalldatetime, Energy decimal(18,4), Demand decimal(18,4), Calculated bit)\r\n\r\ninsert into @tMeter\r\nselect Id, MeterSerial from AMRMeters where Id = @MeterId\r\n\r\ninsert into @tData\r\nselect\r\nconvert(varchar(16), d.ReadingDate, 120) as ReadingDate,\r\nEnergy = d.P1/2,\r\nDemand = d.kVA,\r\nCalculated = case when d.Status = 0 then 0 else 1 end\r\n--, *\r\nfrom\r\n@tMeter m\r\njoin ScadaProfileData d (NOLOCK) on (m.Serial = d.SerialNumber and d.IsActive = 1)\r\nwhere\r\nm.Id = @MeterId\r\nand d.ReadingDate >= @SDate and d.ReadingDate <= @EDate\r\nand d.isActive = 1\r\norder by\r\nd.ReadingDate\r\n\r\nselect @RowCnt = count(1) from @tData\r\n\r\nselect\r\nm.Id as MeterId,\r\nm.MeterNo as MeterNo,\r\nm.Description,\r\n@SDate as StartDate,\r\n@EDate as EndDate,\r\n(select MAX(Demand) from @tData ) as MaxDemand,\r\n(select top 1 ReadingDate from @tData order by Energy desc) as MaxDemandDate,\r\n(select sum(Energy) from @tData where \r\n    ( cast(ReadingDate as time(0)) >= @NightFlowStart and cast(ReadingDate as time(0)) < cast('1900-01-01 00:00' as time(0)) ) or \r\n    ( cast(ReadingDate as time(0)) >= cast('1900-01-01 00:00' as time(0)) and cast(ReadingDate as time(0)) < @NightFlowEnd )\r\n    ) as NightFlow,\r\nPeriodUsage = (select sum(Energy)/2 from @tData),\r\n(@RowCnt/(DATEDIFF(HH, @SDate, @EDate)*2.00)) as DataPercentage\r\nfrom\r\nAMRMeters m\r\nwhere\r\nm.Id = @MeterId\r\n--for JSON auto\r\n\r\nselect ReadingDate, Energy as Energy, Calculated\r\n,case when @ApplyNightFlow = 1 and (\r\n    ( cast(ReadingDate as time(0)) >= @NightFlowStart and cast(ReadingDate as time(0)) < cast('1900-01-01 23:59' as time(0)) ) or \r\n    ( cast(ReadingDate as time(0)) >= cast('1900-01-01 00:00' as time(0)) and cast(ReadingDate as time(0)) < @NightFlowEnd )) then '#4949d0'\r\nelse '#00cc00' end as Color\r\nfrom @tData");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE [dbo].[spGetDemandProfileAlarms]");
        }
    }
}
