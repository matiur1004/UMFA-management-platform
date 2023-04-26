using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class ChangespGetAMRMeterAlarms : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("CREATE OR ALTER PROCEDURE [dbo].[spGetAMRMeterAlarms]\r\n(\r\n@BuildingId INT\r\n)\r\n\r\nAS\r\n\r\n--DECLARE @BuildingId INT = 2983;\r\n\r\nDECLARE @AlarmNames NVARCHAR(MAX), @SelectNames nvarchar(max), @PivotQuery NVARCHAR(MAX);\r\n\r\nSELECT @AlarmNames = COALESCE(@AlarmNames + ', ', '') + QUOTENAME(t.AlarmName)\r\nFROM AlarmTypes t (NOLOCK)\r\n\r\nselect @SelectNames = COALESCE(@SelectNames + ', ', '') + 'ISNULL(' + QUOTENAME(AlarmName) + ', 0)' + ' as ' + QUOTENAME(AlarmName)\r\nfrom AlarmTypes t (NOLOCK)\r\n\r\nIF OBJECT_ID('tempdb..#tmpAlarms') IS NOT NULL\r\n    DROP TABLE #tmpAlarms;\r\n\r\nSET @PivotQuery = '\r\nselect * into #tmpAlarms from (\r\nSELECT AMRMeterId,\r\n       MeterNo,\r\n\t   Description,\r\n\t\tMake,\r\n\t\tModel,\r\n       MeterSerial AS ScadaMeterNo,\r\n       ' + @SelectNames + '\r\nFROM (\r\n    SELECT m.Id AS AMRMeterId,\r\n           m.MeterNo,\r\n           m.MeterSerial,\r\n\t\t   m.Description,\r\n\t\t   mm.Make,\r\n\t\t   mm.Model,\r\n           t.AlarmName,\r\n           ma.AMRMeterAlarmId AS Configured\r\n    FROM AMRMeters m (NOLOCK)\r\n\tjoin MetersMakeModels mm (NOLOCK) on (m.MakeModelId = mm.id  )\r\n    LEFT JOIN AMRMeterAlarms ma (NOLOCK) ON (m.Id = ma.AMRMeterId AND ma.Active = 1)\r\n    LEFT JOIN AlarmTypes t (NOLOCK) ON (ma.AlarmTypeId = t.AlarmTypeId and t.Active = 1)\r\n    WHERE m.BuildingId = ' + CAST(@BuildingId AS NVARCHAR) + '\r\n) p\r\nPIVOT (\r\n    max(Configured)\r\n    FOR AlarmName IN (' + @AlarmNames + ')\r\n) AS PivotTable\r\n) a;\r\n\r\nselect * from #tmpAlarms';\r\n\r\nEXECUTE sp_executesql @PivotQuery;\r\n\r\nIF OBJECT_ID('tempdb..#tmpAlarms') IS NOT NULL\r\n    DROP TABLE #tmpAlarms;");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE [dbo].[spGetAMRMeterAlarms]");
        }
    }
}
