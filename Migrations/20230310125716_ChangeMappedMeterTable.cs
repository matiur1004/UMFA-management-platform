using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class ChangeMappedMeterTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Location",
                table: "MappedMeters",
                newName: "SupplyTo");

            migrationBuilder.AddColumn<string>(
                name: "LocationType",
                table: "MappedMeters",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LocationType",
                table: "MappedMeters");

            migrationBuilder.RenameColumn(
                name: "SupplyTo",
                table: "MappedMeters",
                newName: "Location");
        }
    }
}
