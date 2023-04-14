using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class UpdateGetWaterProfileNew : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("CREATE OR ALTER proc [dbo].[spGetWaterProfile]\r\n(\r\n@MeterId int,\r\n@SDate smalldatetime,\r\n@EDate smalldatetime,\r\n@NightFlowStart time = '22:00',\r\n@NightFlowEnd time = '05:00',\r\n@ApplyNightFlow bit = 1\r\n)\r\n\r\n \r\n\r\nAS\r\n\r\n \r\n\r\n--declare\r\n--@MeterId int = 70,\r\n--@SDate smalldatetime = '2022-10-02 00:30',\r\n--@EDate smalldatetime = '2022-10-09 00:00',\r\n--@NightFlowStart time = '22:00',\r\n--@NightFlowEnd time = '05:00',\r\n--@ApplyNightFlow bit = 0\r\n\r\n \r\n\r\ndeclare\r\n@RowCnt int\r\n\r\n \r\n\r\ndeclare @tMeter table (Id int, Serial nvarchar(50))\r\ndeclare @tData table (Id int identity(1,1), ReadingDate smalldatetime, ActFlow decimal(18,4), Calculated bit)\r\n\r\n \r\n\r\ninsert into @tMeter\r\nselect Id, MeterSerial from AMRMeters where Id = @MeterId\r\n\r\n \r\n\r\ninsert into @tData\r\nselect\r\nconvert(varchar(16), d.ReadingDate, 120) as ReadingDate,\r\nActFlow = d.P1,\r\nCalculated = case when d.Status = 0 then 0 else 1 end\r\nfrom\r\n@tMeter m\r\njoin ScadaProfileData d (NOLOCK) on (m.Serial = d.SerialNumber and d.IsActive = 1)\r\nwhere\r\nm.Id = @MeterId\r\nand d.ReadingDate >= @SDate and d.ReadingDate <= @EDate\r\nand d.isActive = 1\r\norder by\r\nd.ReadingDate\r\n\r\n \r\n\r\nselect @RowCnt = count(1) from @tData\r\n\r\n \r\n\r\nselect\r\nm.Id as MeterId,\r\nm.MeterNo as MeterNo,\r\nm.Description,\r\n@SDate as StartDate,\r\n@EDate as EndDate,\r\n(select MAX(ActFlow) from @tData ) as MaxFlow,\r\n(select top 1 ReadingDate from @tData order by ActFlow desc) as MaxFlowDate,\r\n(select sum(ActFlow) from @tData where \r\n    ( cast(ReadingDate as time(0)) >= @NightFlowStart and cast(ReadingDate as time(0)) < cast('1900-01-01 00:00' as time(0)) ) or \r\n    ( cast(ReadingDate as time(0)) >= cast('1900-01-01 00:00' as time(0)) and cast(ReadingDate as time(0)) < @NightFlowEnd )\r\n    ) as NightFlow,\r\nPeriodUsage = (select sum(ActFlow) from @tData),\r\n(@RowCnt/(DATEDIFF(HH, @SDate, @EDate)*2.00)) as DataPercentage\r\nfrom\r\nAMRMeters m\r\nwhere\r\nm.Id = @MeterId\r\n--for JSON auto\r\n\r\n \r\n\r\nselect ReadingDate, ActFlow as ActFlow, Calculated\r\n,case when @ApplyNightFlow = 1 and (\r\n    ( cast(ReadingDate as time(0)) >= @NightFlowStart and cast(ReadingDate as time(0)) < cast('1900-01-01 23:59' as time(0)) ) or \r\n    ( cast(ReadingDate as time(0)) >= cast('1900-01-01 00:00' as time(0)) and cast(ReadingDate as time(0)) < @NightFlowEnd )) then '#4949d0'\r\nelse '#00cc00' end as Color\r\nfrom @tData\r\n--select convert(varchar(16),ReadingDate, 121) as ReadingDate, ShortName, (PeakDemand + StandardDemand + OffPeakDemand) as DemandValue from @tData\r\n--select ReadingDate, ShortName, convert(varchar,(PeakDemand + StandardDemand + OffPeakDemand)) as DemandValue from @tData\r\n--for JSON auto");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE [dbo].[spGetWaterProfile]");
        }
    }
}
