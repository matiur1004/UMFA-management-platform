using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class changeProcspAlarmConfigPeakUsage : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("CREATE OR ALTER proc [dbo].[spAlarmConfigPeakUsage]\r\n(\r\n@MeterSerialNo nvarchar(250),\r\n@ProfileStartDTM smalldatetime,\r\n@ProfileEndDTM smalldatetime,\r\n@PeakStartTime time,\r\n@PeakEndTime time,\r\n@NoOfPeaks int = 5\r\n)\r\n\r\nAS\r\n\r\n--declare\r\n--@MeterSerialNo nvarchar(250) = '57770290',\r\n--@ProfileStartDTM smalldatetime = '2023-02-01 00:00',\r\n--@ProfileEndDTM smalldatetime = '2023-02-28 23:59',\r\n--@PeakStartTime time = '08:00',\r\n--@PeakEndTime time = '20:00',\r\n--@NoOfPeaks int = 5\r\n\r\ndeclare\r\n@TimeDiff int\r\n\r\ndeclare @tProfile table (Id int identity(1,1), ProfileId int, SerialNo varchar(250), ReadingDate smalldatetime, P1 decimal(18,4))\r\n\r\ninsert into @tProfile\r\nselect\r\np.Id, p.SerialNumber, p.ReadingDate, p.P1\r\nfrom\r\nScadaProfileData p (NOLOCK)\r\nwhere\r\np.SerialNumber = @MeterSerialNo\r\nand p.IsActive = 1\r\nand p.ReadingDate between @ProfileStartDTM and @ProfileEndDTM\r\norder by p.ReadingDate\r\n\r\nSELECT @TimeDiff =  DATEDIFF(MI, CONCAT('2023-04-01 ', @PeakStartTime), CONCAT(case when @PeakEndTime < @PeakStartTime then '2023-04-02 ' else '2023-04-01 ' end, @PeakEndTime)                    )\r\n\r\ndeclare @tData table (Id int identity(1,1), ReadingDate smalldatetime, ActFlow decimal(18,4), Calculated bit)\r\n\r\ninsert into @tData\r\nselect\r\nconvert(varchar(16), d.ReadingDate, 120) as ReadingDate,\r\nActFlow = d.P1,\r\nCalculated = case when d.Status = 0 then 0 else 1 end\r\nfrom\r\nScadaProfileData d (NOLOCK)\r\nwhere\r\nd.SerialNumber = @MeterSerialNo\r\nand d.ReadingDate >= @ProfileStartDTM and d.ReadingDate <= @ProfileEndDTM\r\nand d.isActive = 1\r\norder by\r\nd.ReadingDate\r\n\r\ndeclare @tPeaks table (Id int identity(1,1), MeterSerial nvarchar(50), OccDTM smalldatetime, Peak decimal(18,4))\r\ninsert into @tPeaks\r\nselect top (@NoOfPeaks)\r\nb.SerialNo as MeterSerial\r\n, (select min(ReadingDate) from @tProfile where ReadingDate between b.ReadingStart and b.ReadingEnd and P1 = Peak) as OccDTM\r\n, b.Peak as Peak\r\nfrom\r\n(\r\nselect\r\na.Id,\r\np.SerialNo,\r\na.StartDTM as ReadingStart,\r\na.EndDTM as ReadingEnd,\r\nMAX(p.P1) as Peak\r\nfrom\r\n@tProfile p\r\njoin\r\n(select\r\nId, ProfileId, SerialNo, ReadingDate as StartDTM, DATEADD(MI, @TimeDiff, ReadingDate) as EndDTM\r\nfrom @tProfile\r\nwhere\r\nDATEPART(HH, ReadingDate) = DATEPART(HH, @PeakStartTime)\r\nand DATEPART(MI, ReadingDate) = DATEPART(MI, @PeakStartTime)\r\n) a on (p.SerialNo = a.SerialNo and p.ReadingDate between a.StartDTM and a.EndDTM)\r\ngroup by\r\na.Id, a.StartDTM, a.EndDTM, p.SerialNo\r\n) b\r\n order by b.Peak desc\r\n select d.ReadingDate, d.ActFlow as ActFlow, d.Calculated\r\n,case when (dd.OccDTM is null) then '#00cc00' else '#6800A2' end as Color\r\nfrom @tData d\r\nleft join @tPeaks dd on (d.ReadingDate = dd.OccDTM)\r\n\r\nselect MeterSerial, OccDTM, Peak from @tPeaks");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE [dbo].[spAlarmConfigPeakUsage]");
        }
    }
}
