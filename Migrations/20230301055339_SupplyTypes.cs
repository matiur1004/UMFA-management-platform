using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class SupplyTypes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SupplyTypes",
                columns: table => new
                {
                    SupplyTypeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SupplyTypeName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SupplyTypes", x => x.SupplyTypeId);
                });

            migrationBuilder.Sql("DELETE FROM SupplyTypes", true);

            migrationBuilder.InsertData("SupplyTypes",
               new[] { "SupplyTypeName" },
               new object[,]
               {
                    {"Electricity"},
                    {"Gas"},
                    {"Sewerage"},
                    {"Water" }
               });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SupplyTypes");

        }
    }
}
