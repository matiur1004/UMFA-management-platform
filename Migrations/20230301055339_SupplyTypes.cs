using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class SupplyTypes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Key1",
                table: "MappedMeters");

            migrationBuilder.RenameColumn(
                name: "Key2",
                table: "MappedMeters",
                newName: "ScadaSerial");

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
            migrationBuilder.Sql("DELETE FROM RegisterTypes", true);

            migrationBuilder.InsertData("RegisterTypes",
               new[] { "RegisterTypeName" },
               new object[,]
               {
                    {"AdHoc"},
                    {"Electricity"},
                    {"Gas"},
                    {"Sewerage"},
                    {"Solar"},
                    {"Water" },
                    {"Wind"}
               });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SupplyTypes");

            migrationBuilder.RenameColumn(
                name: "ScadaSerial",
                table: "MappedMeters",
                newName: "Key2");

            migrationBuilder.AddColumn<string>(
                name: "Key1",
                table: "MappedMeters",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
