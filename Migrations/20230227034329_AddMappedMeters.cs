using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class AddMappedMeters : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MappedMeters",
                columns: table => new
                {
                    MappedMeterId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BuildingId = table.Column<int>(type: "int", nullable: false),
                    BuildingName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PartnerId = table.Column<int>(type: "int", nullable: false),
                    PartnerName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BuildingServiceId = table.Column<int>(type: "int", nullable: false),
                    MeterNo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UmfaDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ScadaSerial= table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ScadaDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RegisterType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TOUHeader = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SupplyType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Location = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MappedMeters", x => x.MappedMeterId);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MappedMeters");
        }
    }
}
