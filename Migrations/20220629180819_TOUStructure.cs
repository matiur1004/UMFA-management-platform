using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class TOUStructure : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ParterId",
                table: "Buildings",
                newName: "PartnerId");

            migrationBuilder.CreateTable(
                name: "TOUDaysOfWeeks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DayNr = table.Column<int>(type: "int", nullable: false),
                    DayName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Active = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TOUDaysOfWeeks", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TOUDayTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Active = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TOUDayTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TOUHalfHours",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Start = table.Column<TimeSpan>(type: "time", nullable: false),
                    End = table.Column<TimeSpan>(type: "time", nullable: false),
                    HalfHourNr = table.Column<int>(type: "int", nullable: false),
                    Active = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TOUHalfHours", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TOURegisters",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    intName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Active = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TOURegisters", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TOUSeasons",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Active = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TOUSeasons", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UtilitySuppliers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SupplierName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SupplierDesc = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Active = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UtilitySuppliers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BuildingSupplierUtilities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BuildingId = table.Column<int>(type: "int", nullable: false),
                    UtilitySupplierId = table.Column<int>(type: "int", nullable: false),
                    UtilityId = table.Column<int>(type: "int", nullable: false),
                    Active = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BuildingSupplierUtilities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BuildingSupplierUtilities_Buildings_BuildingId",
                        column: x => x.BuildingId,
                        principalTable: "Buildings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BuildingSupplierUtilities_Utilities_UtilityId",
                        column: x => x.UtilityId,
                        principalTable: "Utilities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BuildingSupplierUtilities_UtilitySuppliers_UtilitySupplierId",
                        column: x => x.UtilitySupplierId,
                        principalTable: "UtilitySuppliers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TOUHeaders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UtilitySupplierId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDefault = table.Column<bool>(type: "bit", nullable: false),
                    Active = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TOUHeaders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TOUHeaders_UtilitySuppliers_UtilitySupplierId",
                        column: x => x.UtilitySupplierId,
                        principalTable: "UtilitySuppliers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TariffHeaders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UtilitySupplierId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TransmissionZone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VoltageStart = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VoltageEnd = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DemandStart = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DemandEnd = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AmpStart = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AmpEnd = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TariffCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TariffDesc = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TOUHeaderId = table.Column<int>(type: "int", nullable: false),
                    Active = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TariffHeaders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TariffHeaders_TOUHeaders_TOUHeaderId",
                        column: x => x.TOUHeaderId,
                        principalTable: "TOUHeaders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TariffHeaders_UtilitySuppliers_UtilitySupplierId",
                        column: x => x.UtilitySupplierId,
                        principalTable: "UtilitySuppliers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TOUProfileAssignments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TOUHeaderId = table.Column<int>(type: "int", nullable: false),
                    TOUSeasonId = table.Column<int>(type: "int", nullable: false),
                    TOUDayTypeId = table.Column<int>(type: "int", nullable: false),
                    TOUHalfHourId = table.Column<int>(type: "int", nullable: false),
                    TOURegisterId = table.Column<int>(type: "int", nullable: false),
                    Active = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TOUProfileAssignments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TOUProfileAssignments_TOUDayTypes_TOUDayTypeId",
                        column: x => x.TOUDayTypeId,
                        principalTable: "TOUDayTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TOUProfileAssignments_TOUHalfHours_TOUHalfHourId",
                        column: x => x.TOUHalfHourId,
                        principalTable: "TOUHalfHours",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TOUProfileAssignments_TOUHeaders_TOUHeaderId",
                        column: x => x.TOUHeaderId,
                        principalTable: "TOUHeaders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TOUProfileAssignments_TOURegisters_TOURegisterId",
                        column: x => x.TOURegisterId,
                        principalTable: "TOURegisters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TOUProfileAssignments_TOUSeasons_TOUSeasonId",
                        column: x => x.TOUSeasonId,
                        principalTable: "TOUSeasons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TOUAllocations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TariffHeaderId = table.Column<int>(type: "int", nullable: false),
                    TOUDaysOfWeekId = table.Column<int>(type: "int", nullable: false),
                    TOUHalfHourId = table.Column<int>(type: "int", nullable: false),
                    TOURegisterId = table.Column<int>(type: "int", nullable: false),
                    Active = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TOUAllocations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TOUAllocations_TariffHeaders_TariffHeaderId",
                        column: x => x.TariffHeaderId,
                        principalTable: "TariffHeaders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TOUAllocations_TOUDaysOfWeeks_TOUDaysOfWeekId",
                        column: x => x.TOUDaysOfWeekId,
                        principalTable: "TOUDaysOfWeeks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TOUAllocations_TOUHalfHours_TOUHalfHourId",
                        column: x => x.TOUHalfHourId,
                        principalTable: "TOUHalfHours",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TOUAllocations_TOURegisters_TOURegisterId",
                        column: x => x.TOURegisterId,
                        principalTable: "TOURegisters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BuildingSupplierUtilities_BuildingId",
                table: "BuildingSupplierUtilities",
                column: "BuildingId");

            migrationBuilder.CreateIndex(
                name: "IX_BuildingSupplierUtilities_UtilityId",
                table: "BuildingSupplierUtilities",
                column: "UtilityId");

            migrationBuilder.CreateIndex(
                name: "IX_BuildingSupplierUtilities_UtilitySupplierId",
                table: "BuildingSupplierUtilities",
                column: "UtilitySupplierId");

            migrationBuilder.CreateIndex(
                name: "IX_TariffHeaders_TOUHeaderId",
                table: "TariffHeaders",
                column: "TOUHeaderId");

            migrationBuilder.CreateIndex(
                name: "IX_TariffHeaders_UtilitySupplierId",
                table: "TariffHeaders",
                column: "UtilitySupplierId");

            migrationBuilder.CreateIndex(
                name: "IX_TOUAllocations_TariffHeaderId",
                table: "TOUAllocations",
                column: "TariffHeaderId");

            migrationBuilder.CreateIndex(
                name: "IX_TOUAllocations_TOUDaysOfWeekId",
                table: "TOUAllocations",
                column: "TOUDaysOfWeekId");

            migrationBuilder.CreateIndex(
                name: "IX_TOUAllocations_TOUHalfHourId",
                table: "TOUAllocations",
                column: "TOUHalfHourId");

            migrationBuilder.CreateIndex(
                name: "IX_TOUAllocations_TOURegisterId",
                table: "TOUAllocations",
                column: "TOURegisterId");

            migrationBuilder.CreateIndex(
                name: "IX_TOUHeaders_UtilitySupplierId",
                table: "TOUHeaders",
                column: "UtilitySupplierId");

            migrationBuilder.CreateIndex(
                name: "IX_TOUProfileAssignments_TOUDayTypeId",
                table: "TOUProfileAssignments",
                column: "TOUDayTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_TOUProfileAssignments_TOUHalfHourId",
                table: "TOUProfileAssignments",
                column: "TOUHalfHourId");

            migrationBuilder.CreateIndex(
                name: "IX_TOUProfileAssignments_TOUHeaderId",
                table: "TOUProfileAssignments",
                column: "TOUHeaderId");

            migrationBuilder.CreateIndex(
                name: "IX_TOUProfileAssignments_TOURegisterId",
                table: "TOUProfileAssignments",
                column: "TOURegisterId");

            migrationBuilder.CreateIndex(
                name: "IX_TOUProfileAssignments_TOUSeasonId",
                table: "TOUProfileAssignments",
                column: "TOUSeasonId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BuildingSupplierUtilities");

            migrationBuilder.DropTable(
                name: "TOUAllocations");

            migrationBuilder.DropTable(
                name: "TOUProfileAssignments");

            migrationBuilder.DropTable(
                name: "TariffHeaders");

            migrationBuilder.DropTable(
                name: "TOUDaysOfWeeks");

            migrationBuilder.DropTable(
                name: "TOUDayTypes");

            migrationBuilder.DropTable(
                name: "TOUHalfHours");

            migrationBuilder.DropTable(
                name: "TOURegisters");

            migrationBuilder.DropTable(
                name: "TOUSeasons");

            migrationBuilder.DropTable(
                name: "TOUHeaders");

            migrationBuilder.DropTable(
                name: "UtilitySuppliers");

            migrationBuilder.RenameColumn(
                name: "PartnerId",
                table: "Buildings",
                newName: "ParterId");
        }
    }
}
