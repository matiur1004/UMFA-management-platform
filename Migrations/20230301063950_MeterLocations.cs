using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class MeterLocations : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MeterLocations",
                columns: table => new
                {
                    MeterLocationId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MeterLocationName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MeterLocationDescription = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MeterLocations", x => x.MeterLocationId);
                });

            migrationBuilder.Sql("DELETE FROM MeterLocations", true);

            migrationBuilder.InsertData("MeterLocations",
               new[] { "MeterLocationName", "MeterLocationDescription" },
               new object[,]
               {
                    {"Air Handling Unit","Air Handling Unit"},
                    {"Basement","Basement"},
                    {"Borehole","Borehole"},
                    {"Busbar","Busbar"},
                    {"Chiller", "Chiller"},
                    {"Council","Council" },
                    {"Council Check Meter", "Council Check Meter"},
                    {"Distribution Board","Distribution Board"},
                    {"Escalator","Escalator"},
                    {"Fire Hose Reel","Fire Hose Reel"},
                    {"Fire Hydrant","Fire Hydrant"},
                    {"General", "General"},
                    {"Generator","Generator" },
                    {"Guard House", "Guard House"},
                    {"Irrigation","Irrigation"},
                    {"Lift","Lift"},
                    {"Lights","Lights"},
                    {"Location #1","Location #1"},
                    {"Location for Ad Hoc", "Location for Ad Hoc"},
                    {"Losses","Losses" },
                    {"Management Office", "Management Office"},
                    {"Meter","Meter"},
                    {"Multiple","Multiple"},
                    {"Multiple shops","Multiple shops"},
                    {"Parking", "Parking"},
                    {"Public Toilet","Public Toilet" },
                    {"Pylon", "Pylon"},
                    {"Refuse Area","Refuse Area"},
                    {"Shop","Shop"},
                    {"Signage","Signage"},
                    {"Single","Single"},
                    {"Tap", "Tap"}
               });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MeterLocations");
        }
    }
}
