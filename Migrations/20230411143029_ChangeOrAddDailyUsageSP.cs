using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class ChangeOrAddDailyUsageSP : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //Config
            migrationBuilder.Sql("CREATE OR ALTER proc [dbo].[spAlarmConfigDailyUsage]\r\n(\r\n@MeterSerialNo nvarchar(250),\r\n@ProfileStartDTM smalldatetime,\r\n@ProfileEndDTM smalldatetime\r\n)\r\n\r\nAS\r\n\r\n--declare\r\n--@MeterSerialNo nvarchar(250) = '57770290',\r\n--@ProfileStartDTM smalldatetime = '2023-02-01 00:00',\r\n--@ProfileEndDTM smalldatetime = '2023-02-28 23:59'\r\n\r\ndeclare @tProfile table (Id int identity(1,1), ProfileId int, SerialNo varchar(250), ReadingDate smalldatetime, P1 decimal(18,4))\r\n\r\ninsert into @tProfile\r\nselect\r\np.Id, p.SerialNumber, p.ReadingDate, p.P1\r\nfrom\r\nScadaProfileData p (NOLOCK)\r\nwhere\r\np.SerialNumber = @MeterSerialNo\r\nand p.IsActive = 1\r\nand p.ReadingDate between @ProfileStartDTM and @ProfileEndDTM\r\norder by p.ReadingDate\r\n\r\ndeclare @tDaily table (Id int identity(1,1), ReadingDate smalldatetime, Usage decimal(18,4))\r\n\r\ninsert into @tDaily\r\nselect\r\nCast(Convert(varchar(10), ReadingDate, 120) as smalldatetime) as ReadingDate, sum(P1/2) as Usage\r\nfrom\r\n@tProfile\r\ngroup by\r\nCast(Convert(varchar(10), ReadingDate, 120) as smalldatetime)\r\norder by\r\n1\r\n\r\ndeclare @tData table (Id int identity(1,1), ReadingDate smalldatetime, ActFlow decimal(18,4), Calculated bit)\r\n\r\ndeclare @avgUsage decimal(18,6)\r\n\r\nselect @avgUsage = AVG(Usage) from @tDaily\r\n\r\nselect\r\nReadingDate, Usage as ActFlow, 0 as Calculated\r\n,case when (Usage <= @avgUsage) then '#00cc00' else '#F5A333' end as Color\r\nfrom\r\n@tDaily\r\n\r\nselect\r\n@avgUsage as AvgDaily, Max(Usage) as MaxDaily, Min(Usage) as MinDaily\r\nfrom\r\n@tDaily");
            migrationBuilder.Sql("CREATE OR ALTER proc [dbo].[spAlarmAnalyzeDailyUsage]\r\n(\r\n@MeterSerialNo nvarchar(250),\r\n@ProfileStartDTM smalldatetime,\r\n@ProfileEndDTM smalldatetime,\r\n@Threshold decimal(18,6)\r\n)\r\n\r\nAS\r\n\r\n--declare\r\n--@MeterSerialNo nvarchar(250) = '57770290',\r\n--@ProfileStartDTM smalldatetime = '2023-02-01 00:00',\r\n--@ProfileEndDTM smalldatetime = '2023-02-28 23:59',\r\n--@Threshold decimal(18,6) = 1.11\r\n\r\ndeclare @tProfile table (Id int identity(1,1), ProfileId int, SerialNo varchar(250), ReadingDate smalldatetime, P1 decimal(18,4))\r\n\r\ninsert into @tProfile\r\nselect\r\np.Id, p.SerialNumber, p.ReadingDate, p.P1\r\nfrom\r\nScadaProfileData p (NOLOCK)\r\nwhere\r\np.SerialNumber = @MeterSerialNo\r\nand p.IsActive = 1\r\nand p.ReadingDate between @ProfileStartDTM and @ProfileEndDTM\r\norder by p.ReadingDate\r\n\r\ndeclare @tDaily table (Id int identity(1,1), ReadingDate smalldatetime, Usage decimal(18,4))\r\n\r\ninsert into @tDaily\r\nselect\r\nCast(Convert(varchar(10), ReadingDate, 120) as smalldatetime) as ReadingDate, sum(P1/2) as Usage\r\nfrom\r\n@tProfile\r\ngroup by\r\nCast(Convert(varchar(10), ReadingDate, 120) as smalldatetime)\r\norder by\r\n1\r\n\r\ndeclare @tData table (Id int identity(1,1), ReadingDate smalldatetime, ActFlow decimal(18,4), Calculated bit)\r\n\r\ndeclare @avgUsage decimal(18,6)\r\n\r\nselect @avgUsage = AVG(Usage) from @tDaily\r\n\r\nselect\r\nReadingDate, Usage as ActFlow, 0 as Calculated\r\n,case when (Usage < @Threshold) then '#00cc00' else 'red' end as Color\r\nfrom\r\n@tDaily\r\n\r\nselect\r\ncount(1) as NoOfAlarms\r\nfrom\r\n@tDaily\r\nwhere\r\nUsage >= @Threshold");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE [dbo].[spAlarmConfigDailyUsage]");
            migrationBuilder.Sql("DROP PROCEDURE [dbo].[spAlarmAnalyzeDailyUsage]");
        }
    }
}
