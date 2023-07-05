using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class ArchivesTables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ArchiveRequestHeaders",
                columns: table => new
                {
                    ArchiveRequestId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BuildingId = table.Column<int>(type: "int", nullable: false),
                    PeriodId = table.Column<int>(type: "int", nullable: false),
                    ReportTypeId = table.Column<int>(type: "int", nullable: false),
                    ArchiveFileName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedDTM = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastUpdateDTM = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    StatusMessage = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Active = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ArchiveRequestHeaders", x => x.ArchiveRequestId);
                });

            migrationBuilder.CreateTable(
                name: "ArchiveRequestDetails",
                columns: table => new
                {
                    ArchiveRequestDetailId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ArchiveRequestId = table.Column<int>(type: "int", nullable: false),
                    TenantId = table.Column<int>(type: "int", nullable: false),
                    ShopId = table.Column<int>(type: "int", nullable: false),
                    FileFormat = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedDTM = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastUpdateDTM = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    StatusMessage = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Active = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ArchiveRequestDetails", x => x.ArchiveRequestDetailId);
                    table.ForeignKey(
                        name: "FK_ArchiveRequestDetails_ArchiveRequestHeaders_ArchiveRequestId",
                        column: x => x.ArchiveRequestId,
                        principalTable: "ArchiveRequestHeaders",
                        principalColumn: "ArchiveRequestId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ArchiveRequestDetails_ArchiveRequestId",
                table: "ArchiveRequestDetails",
                column: "ArchiveRequestId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ArchiveRequestDetails");

            migrationBuilder.DropTable(
                name: "ArchiveRequestHeaders");
        }
    }
}
