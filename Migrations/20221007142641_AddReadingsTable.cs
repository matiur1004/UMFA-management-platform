using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class AddReadingsTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "LastDataDate",
                table: "ScadaRequestDetails",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.CreateTable(
                name: "scadaReadingData",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProcessedStatus = table.Column<int>(type: "int", nullable: false),
                    SerialNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ReadingResult = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ReadingDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    P1 = table.Column<float>(type: "real", nullable: false),
                    P2 = table.Column<float>(type: "real", nullable: false),
                    Q1 = table.Column<float>(type: "real", nullable: false),
                    Q2 = table.Column<float>(type: "real", nullable: false),
                    Q3 = table.Column<float>(type: "real", nullable: false),
                    Q4 = table.Column<float>(type: "real", nullable: false),
                    ReadingStatus = table.Column<int>(type: "int", nullable: false),
                    KvaResult = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    kvaDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    kVA = table.Column<float>(type: "real", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_scadaReadingData", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "scadaReadingData");

            migrationBuilder.AlterColumn<DateTime>(
                name: "LastDataDate",
                table: "ScadaRequestDetails",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);
        }
    }
}
