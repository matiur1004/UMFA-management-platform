using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class AddAlarmConfigNightFlowSP : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("CREATE OR ALTER proc spAlarmConfigNightFlow\r\n(\r\n@MeterSerialNo nvarchar(250),\r\n@ProfileStartDTM smalldatetime,\r\n@ProfileEndDTM smalldatetime,\r\n@NFStartTime time,\r\n@NFEndTime time\r\n)\r\n\r\nAS\r\n\r\n--declare\r\n--@MeterSerialNo nvarchar(250) = '57770290',\r\n--@ProfileStartDTM smalldatetime = '2023-02-01 00:00',\r\n--@ProfileEndDTM smalldatetime = '2023-02-28 23:59',\r\n--@NFStartTime time = '22:00',\r\n--@NFEndTime time = '05:00'\r\n\r\ndeclare\r\n@TimeDiff int\r\n\r\ndeclare @tProfile table (Id int identity(1,1), ProfileId int, SerialNo varchar(250), ReadingDate smalldatetime, P1 decimal(18,4))\r\n\r\ninsert into @tProfile\r\nselect\r\np.Id, p.SerialNumber, p.ReadingDate, p.P1\r\nfrom\r\nScadaProfileData p (NOLOCK)\r\nwhere\r\np.SerialNumber = @MeterSerialNo\r\nand p.IsActive = 1\r\nand p.ReadingDate between @ProfileStartDTM and @ProfileEndDTM\r\norder by p.ReadingDate\r\n\r\nSELECT @TimeDiff =  DATEDIFF(MI, CONCAT('2023-04-01 ', @NFStartTime), CONCAT(case when @NFEndTime < @NFStartTime then '2023-04-02 ' else '2023-04-01 ' end, @NFEndTime)                    )\r\n\r\nselect\r\nb.SerialNo as MeterSerial, MIN(b.ReadingStart) as PeriodStartDTM, MAX(b.ReadingEnd) as PeriodEndDTM\r\n, AVG(b.ProfileAverage) as IntervalAvg, AVG(b.NFTotal) as NFAvg, MAX(b.NFPeak) as NFPeak, MIN(b.NFMin) as NFMin\r\nfrom\r\n(select\r\na.Id,\r\np.SerialNo,\r\na.StartDTM as ReadingStart,\r\na.EndDTM as ReadingEnd,\r\nAVG(p.P1) as ProfileAverage,\r\nSUM(p.P1) as NFTotal,\r\nMAX(p.P1) as NFPeak,\r\nMIN(p.P1) as NFMin\r\nfrom\r\n@tProfile p\r\njoin\r\n(select\r\nId, ProfileId, SerialNo, ReadingDate as StartDTM, DATEADD(MI, @TimeDiff, ReadingDate) as EndDTM\r\nfrom @tProfile\r\nwhere\r\nDATEPART(HH, ReadingDate) = DATEPART(HH, @NFStartTime)\r\nand DATEPART(MI, ReadingDate) = DATEPART(MI, @NFStartTime)\r\n) a on (p.SerialNo = a.SerialNo and p.ReadingDate between a.StartDTM and a.EndDTM)\r\ngroup by\r\na.Id, a.StartDTM, a.EndDTM, p.SerialNo\r\n) b\r\ngroup by b.SerialNo");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE [dbo].[spAlarmConfigNightFlow]");
        }
    }
}
