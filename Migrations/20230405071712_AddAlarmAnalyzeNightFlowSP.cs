using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class AddAlarmAnalyzeNightFlowSP : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("CREATE OR ALTER proc spAlarmAnalyzeNightFlow\r\n(\r\n@MeterSerialNo nvarchar(250),\r\n@ProfileStartDTM smalldatetime,\r\n@ProfileEndDTM smalldatetime,\r\n@NFStartTime time,\r\n@NFEndTime time,\r\n@Threshold decimal(18,4),\r\n@Duration int\r\n)\r\n\r\nAS\r\n\r\n--declare\r\n--@MeterSerialNo nvarchar(250) = '57770290',\r\n--@ProfileStartDTM smalldatetime = '2023-02-01 00:00',\r\n--@ProfileEndDTM smalldatetime = '2023-02-28 23:59',\r\n--@NFStartTime time = '22:00',\r\n--@NFEndTime time = '05:00',\r\n--@Threshold decimal(18,4) = 0.02,\r\n--@Duration int = 60\r\n\r\ndeclare\r\n@TimeDiff int,\r\n@iCnt int = 1,\r\n@iRows int,\r\n@NoAlarms int = 0\r\n\r\ndeclare @tProfile table (Id int identity(1,1), ProfileId int, SerialNo varchar(250), ReadingDate smalldatetime, P1 decimal(18,4))\r\n\r\ninsert into @tProfile\r\nselect\r\np.Id, p.SerialNumber, p.ReadingDate, p.P1\r\nfrom\r\nScadaProfileData p (NOLOCK)\r\nwhere\r\np.SerialNumber = @MeterSerialNo\r\nand p.IsActive = 1\r\nand p.ReadingDate between @ProfileStartDTM and @ProfileEndDTM\r\norder by p.ReadingDate\r\n\r\nSELECT @TimeDiff =  DATEDIFF(MI, CONCAT('2023-04-01 ', @NFStartTime), CONCAT(case when @NFEndTime < @NFStartTime then '2023-04-02 ' else '2023-04-01 ' end, @NFEndTime))\r\n\r\n--first identify all occurences where threshold was exceeded\r\ndeclare @tResults table (Id int identity(1,1), SerialNo varchar(250), StartDTM smalldatetime, EndDTM smalldatetime, OccDTM smalldatetime, maxUsage decimal(18,4)\r\n\t\t\t\t\t\t, Duration int)\r\n\r\ninsert into @tResults\r\nselect\r\nb.SerialNo, b.StartDTM, b.EndDTM\r\n, (select min(ReadingDate) from @tProfile where SerialNo = b.SerialNo and ReadingDate between b.StartDTM and b.EndDTM and P1 >= @Threshold) as OccDTM\r\n, b.maxUsage, 0 as Duration\r\nfrom\r\n(select\r\np.SerialNo, a.StartDTM, a.EndDTM, MAX(p.P1) as maxUsage\r\nfrom\r\n@tProfile p\r\nJOIN\r\n(SELECT\r\nId, ProfileId, SerialNo, ReadingDate as StartDTM, DATEADD(MI, @TimeDiff, ReadingDate) as EndDTM\r\nfrom @tProfile\r\nwhere\r\nDATEPART(HH, ReadingDate) = DATEPART(HH, @NFStartTime)\r\nand DATEPART(MI, ReadingDate) = DATEPART(MI, @NFStartTime)\r\n) a on (p.SerialNo = a.SerialNo and p.ReadingDate between a.StartDTM and a.EndDTM)\r\ngroup by\r\np.SerialNo, a.StartDTM, a.EndDTM\r\nhaving MAX(p.P1) > @Threshold\r\n) b\r\n\r\nset @iRows = @@ROWCOUNT\r\nset @iCnt = 1\r\n\r\ndeclare @SerNo varchar(250), @SDTM smalldatetime, @EDTM smalldatetime, @OccDTM smalldatetime, @maxUsage decimal(18,4), @Dur int\r\n\r\nwhile @iCnt <= @iRows\r\nbegin \r\nSELECT @SerNo = SerialNo, @SDTM = StartDTM, @EDTM = EndDTM, @OccDTM = OccDTM, @maxUsage = maxUsage from @tResults where Id = @iCnt \r\nSELECT \r\n\t@Dur = ISNULL(SUM(DATEDIFF(MINUTE, t1.ReadingDate, t2.ReadingDate)), 0) \r\nFROM \r\n\t@tProfile t1\r\n\tJOIN @tProfile t2 ON t2.Id = t1.Id + 1\r\nWHERE \r\n\tt1.ReadingDate between @OccDTM and @EDTM \r\n\tand t1.P1 >= @Threshold AND t2.P1 >= @Threshold \r\n\r\n\tupdate @tResults set Duration = @Dur where Id = @iCnt \r\n\r\nset @iCnt += 1 \r\nend \r\n\r\nselect @NoAlarms = count(1) from @tResults where Duration >= @Duration \r\n\r\nselect @NoAlarms as NoOfAlarms");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE [dbo].[spAlarmAnalyzeNightFlow]");
        }
    }
}
