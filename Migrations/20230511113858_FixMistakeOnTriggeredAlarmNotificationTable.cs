using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class FixMistakeOnTriggeredAlarmNotificationTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[TriggeredAlarmNotifications]') AND type in (N'U'))\r\nDROP TABLE [dbo].[TriggeredAlarmNotifications]\r\nGO\r\n\r\nSET ANSI_NULLS ON\r\nGO\r\n\r\nSET QUOTED_IDENTIFIER ON\r\nGO\r\n\r\nCREATE TABLE [dbo].[TriggeredAlarmNotifications](\r\n\t[TriggeredAlarmNotificationId] [int] IDENTITY(1,1) NOT NULL,\r\n\t[UserId] [int] NOT NULL,\r\n\t[AMRMeterTriggeredAlarmId] [int] NOT NULL,\r\n\t[NotificationSendTypeId] [int] NOT NULL,\r\n\t[Status] [smallint] NOT NULL,\r\n\t[CreatedDateTime] [smalldatetime] NOT NULL,\r\n\t[LastUdateDateTime] [smalldatetime] NOT NULL,\r\n\t[SendDateTime] [smalldatetime] NULL,\r\n\t[Active] [bit] NOT NULL,\r\n\t[SendStatusMessage] [nvarchar](MAX) NULL,\r\n CONSTRAINT [PK_TriggeredAlarmNotifications] PRIMARY KEY CLUSTERED \r\n(\r\n\t[TriggeredAlarmNotificationId] ASC\r\n)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]\r\n) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]\r\nGO");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TriggeredAlarmNotifications");
        }
    }
}
