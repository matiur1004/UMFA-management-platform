using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class amrmeteradded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AMRMeters",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    meterNo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    buildingId = table.Column<int>(type: "int", nullable: false),
                    make = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    model = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    phase = table.Column<int>(type: "int", nullable: false),
                    cbSize = table.Column<int>(type: "int", nullable: false),
                    ctSizePrim = table.Column<int>(type: "int", nullable: false),
                    ctSizeSec = table.Column<int>(type: "int", nullable: false),
                    progFact = table.Column<float>(type: "real", nullable: false),
                    digits = table.Column<int>(type: "int", nullable: false),
                    utility = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    active = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AMRMeters", x => x.id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AMRMeters");
        }
    }
}
