using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class AddAlarmConfigBurstPipeSP : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("CREATE OR ALTER proc [dbo].[spAlarmConfigBurstPipe]\r\n(\r\n@MeterSerialNo nvarchar(250),\r\n@ProfileStartDTM smalldatetime,\r\n@ProfileEndDTM smalldatetime,\r\n@NoOfPeaks int = 5\r\n)\r\n\r\nAS\r\n\r\n--declare\r\n--@MeterSerialNo nvarchar(250) = '57770290',\r\n--@ProfileStartDTM smalldatetime = '2023-02-01 00:00',\r\n--@ProfileEndDTM smalldatetime = '2023-02-28 23:59',\r\n--@NoOfPeaks int = 5\r\n\r\ndeclare @tProfile table (Id int identity(1,1), ProfileId int, SerialNo varchar(250), ReadingDate smalldatetime, P1 decimal(18,4))\r\n\r\ninsert into @tProfile\r\nselect\r\np.Id, p.SerialNumber, p.ReadingDate, p.P1\r\nfrom\r\nScadaProfileData p (NOLOCK)\r\nwhere\r\np.SerialNumber = @MeterSerialNo\r\nand p.IsActive = 1\r\nand p.ReadingDate between @ProfileStartDTM and @ProfileEndDTM\r\norder by p.ReadingDate\r\n\r\ndeclare @tPeaks table (Id int identity(1,1), ReadingDate smalldatetime, Peak decimal(18,4))\r\n\r\ninsert into @tPeaks\r\nselect top (@NoOfPeaks)\r\nReadingDate, P1 as Peak\r\nfrom\r\n@tProfile\r\norder by P1 desc\r\n\r\ndeclare @AMRMeterId int\r\nselect @AMRMeterId = Id from AMRMeters where MeterSerial = @MeterSerialNo\r\n\r\ndeclare @tData table (Id int identity(1,1), ReadingDate smalldatetime, ActFlow decimal(18,4), Calculated bit)\r\n\r\ninsert into @tData\r\nselect\r\nconvert(varchar(16), d.ReadingDate, 120) as ReadingDate,\r\nActFlow = d.P1,\r\nCalculated = case when d.Status = 0 then 0 else 1 end\r\nfrom\r\nScadaProfileData d (NOLOCK)\r\nwhere\r\nd.SerialNumber = @MeterSerialNo\r\nand d.ReadingDate >= @ProfileStartDTM and d.ReadingDate <= @ProfileEndDTM\r\nand d.isActive = 1\r\norder by\r\nd.ReadingDate\r\n\r\nselect d.ReadingDate, d.ActFlow as ActFlow, d.Calculated\r\n,case when (dd.ReadingDate is null) then '#00cc00' else '#8000ff' end as Color\r\nfrom @tData d\r\nleft join @tPeaks dd on (d.ReadingDate = dd.ReadingDate)\r\n\r\nselect * from @tPeaks order by Peak desc");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE [dbo].[spAlarmConfigBurstPipe]");
        }
    }
}
