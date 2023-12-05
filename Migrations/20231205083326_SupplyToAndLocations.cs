using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class SupplyToAndLocations : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Active",
                table: "SupplyTypes",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.CreateTable(
                name: "SupplyTos",
                columns: table => new
                {
                    SupplyToId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SupplyTypeId = table.Column<int>(type: "int", nullable: false),
                    SupplyToName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Active = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SupplyTos", x => x.SupplyToId);
                    table.ForeignKey(
                        name: "FK_SupplyTos_SupplyTypes_SupplyTypeId",
                        column: x => x.SupplyTypeId,
                        principalTable: "SupplyTypes",
                        principalColumn: "SupplyTypeId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SupplyToLocationTypes",
                columns: table => new
                {
                    SupplyToLocationTypeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SupplyToId = table.Column<int>(type: "int", nullable: false),
                    SupplyToLocationName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Active = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SupplyToLocationTypes", x => x.SupplyToLocationTypeId);
                    table.ForeignKey(
                        name: "FK_SupplyToLocationTypes_SupplyTos_SupplyToId",
                        column: x => x.SupplyToId,
                        principalTable: "SupplyTos",
                        principalColumn: "SupplyToId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SupplyToLocationTypes_SupplyToId",
                table: "SupplyToLocationTypes",
                column: "SupplyToId");

            migrationBuilder.CreateIndex(
                name: "IX_SupplyTos_SupplyTypeId",
                table: "SupplyTos",
                column: "SupplyTypeId");

            //Add Seed Data
            migrationBuilder.Sql("DELETE FROM SupplyTos", true);
            migrationBuilder.Sql("DBCC CHECKIDENT('SupplyTos', RESEED, 1)", true);

            migrationBuilder.InsertData("SupplyTos",
               new[] { "SupplyTypeId", "SupplyToName", "Active" },
               new object[,]
               {
                    { 1, "Building", true},
                    { 1, "Shop", true},
                    { 1, "Common Area", true},
                    { 1, "Air-Conditioning", true},
                    { 1, "Check", true},
                    { 1, "AdHoc", true},
                    { 2, "Building", true},
                    { 2, "Shop", true},
                    { 4, "Building", true},
                    { 4, "Shop", true},
                    { 4, "Common Area", true},
                    { 4, "Air-Conditioning", true},
                    { 4, "Check", true},
                    { 4, "AdHoc", true},
               });

            migrationBuilder.Sql("DELETE FROM SupplyToLocationTypes", true);
            migrationBuilder.Sql("DBCC CHECKIDENT('SupplyToLocationTypes', RESEED, 1)", true);

            migrationBuilder.InsertData("SupplyToLocationTypes",
               new[] { "SupplyToId", "SupplyToLocationName", "Active" },
               new object[,]
               {
                    { 1, "Council Supply", true},
                    { 1, "Generator Supply", true},
                    { 1, "Solar Supply", true},
                    { 1, "Wind Gen Supply", true},
                    { 1, "Bulk Supply", true},
                    { 1, "Losses", true},
                    { 2, "Multiple", true},
                    { 2, "Single", true},
                    { 2, "Emergency Supply", true},
                    { 3, "Basement", true},
                    { 3, "Escalator", true},
                    { 3, "General", true},
                    { 3, "Guard House", true},
                    { 3, "Lift", true},
                    { 3, "Lights", true},
                    { 3, "Management Office", true},
                    { 3, "Parking", true},
                    { 3, "Pylon", true},
                    { 3, "Signage", true},
                    { 3, "Borehole", true},
                    { 4, "Air Handling Unit", true},
                    { 4, "Chiller", true},
                    { 5, "Council", true},
                    { 5, "Bulk", true},
                    { 5, "DB", true},
                    { 5, "Shop", true},
                    { 5, "Meter", true},
                    { 6, "AdHoc", true},
                    { 7, "Bulk Supply", true},
                    { 8, "Multiple", true},
                    { 8, "Single", true},
                    { 9, "Council Supply", true},
                    { 9, "Borehole", true},
                    { 9, "Bulk Supply", true},
                    { 9, "Losses", true},
                    { 10, "Multiple", true},
                    { 10, "Single", true},
                    { 11, "Basement", true},
                    { 11, "General", true},
                    { 11, "Guard House", true},
                    { 11, "Management Office", true},
                    { 11, "Tap", true},
                    { 11, "Firehydrant / hose", true},
                    { 11, "Irrigation", true},
                    { 11, "Public Toilets", true},
                    { 11, "Refuse Area", true},
                    { 11, "Borehole", true},
                    { 12, "Chiller", true},
                    { 13, "Council", true},
                    { 13, "Bulk", true},
                    { 13, "Shop", true},
                    { 13, "Meter", true},
                    { 14, "AdHoc", true},
               });

        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SupplyToLocationTypes");

            migrationBuilder.DropTable(
                name: "SupplyTos");

            migrationBuilder.DropColumn(
                name: "Active",
                table: "SupplyTypes");
        }
    }
}
