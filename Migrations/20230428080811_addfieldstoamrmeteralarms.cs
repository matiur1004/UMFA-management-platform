using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class addfieldstoamrmeteralarms : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LastDataDTM",
                table: "AMRMeterAlarms",
                type: "smalldatetime",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastRunDTM",
                table: "AMRMeterAlarms",
                type: "smalldatetime",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastDataDTM",
                table: "AMRMeterAlarms");

            migrationBuilder.DropColumn(
                name: "LastRunDTM",
                table: "AMRMeterAlarms");
        }
    }
}
