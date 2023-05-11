using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class AddTriggeredAlarmNotificationTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("CREATE TABLE [dbo].[TriggeredAlarmNotifications](\r\n\t[TriggeredAlarmNotificationId] [int] IDENTITY(1,1) NOT NULL,\r\n\t[UserId] [int] NOT NULL,\r\n\t[AMRMeterTriggeredAlarmId] [int] NOT NULL,\r\n\t[NotiicationSendTypeId] [int] NOT NULL,\r\n\t[Status] [smallint] NOT NULL,\r\n\t[CreatedDateTime] [smalldatetime] NOT NULL,\r\n\t[LastUdateDateTime] [smalldatetime] NOT NULL,\r\n\t[SendDateTime] [smalldatetime] NULL,\r\n\t[Active] [bit] NOT NULL,\r\n\t[SendStatusMessage] nvarchar NULL,\r\n CONSTRAINT [PK_TriggeredAlarmNotifications] PRIMARY KEY CLUSTERED\r\n(\r\n\t[TriggeredAlarmNotificationId] ASC\r\n)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]\r\n) ON [PRIMARY]");
            //migrationBuilder.CreateTable(
            //    name: "TriggeredAlarmNotifications",
            //    columns: table => new
            //    {
            //        TriggeredAlarmNotificationId = table.Column<int>(type: "int", nullable: false)
            //            .Annotation("SqlServer:Identity", "1, 1"),
            //        UserId = table.Column<int>(type: "int", nullable: false),
            //        AMRMeterTriggeredAlarmId = table.Column<int>(type: "int", nullable: false),
            //        NotiicationSendTypeId = table.Column<int>(type: "int", nullable: false),
            //        Status = table.Column<int>(type: "int", nullable: false),
            //        CreatedDateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
            //        LastUdateDateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
            //        SendDateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
            //        Active = table.Column<bool>(type: "bit", nullable: false),
            //        SendStatusMessage = table.Column<string>(type: "nvarchar(max)", nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_TriggeredAlarmNotifications", x => x.TriggeredAlarmNotificationId);
            //    });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TriggeredAlarmNotifications");
        }
    }
}
