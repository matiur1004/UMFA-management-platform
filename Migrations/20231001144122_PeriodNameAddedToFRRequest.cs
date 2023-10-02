using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class PeriodNameAddedToFRRequest : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BuildingName",
                table: "FeedbackReportRequests",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PeriodName",
                table: "FeedbackReportRequests",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BuildingName",
                table: "FeedbackReportRequests");

            migrationBuilder.DropColumn(
                name: "PeriodName",
                table: "FeedbackReportRequests");
        }
    }
}
