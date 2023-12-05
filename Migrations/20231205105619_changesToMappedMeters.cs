using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class changesToMappedMeters : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LocationType",
                table: "MappedMeters");

            migrationBuilder.DropColumn(
                name: "SupplyTo",
                table: "MappedMeters");

            migrationBuilder.DropColumn(
                name: "SupplyType",
                table: "MappedMeters");

            migrationBuilder.AddColumn<int>(
                name: "SupplyTypeId",
                table: "MappedMeters",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SupplyToId",
                table: "MappedMeters",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "LocationTypeId",
                table: "MappedMeters",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LocationTypeId",
                table: "MappedMeters");

            migrationBuilder.DropColumn(
                name: "SupplyToId",
                table: "MappedMeters");

            migrationBuilder.DropColumn(
                name: "SupplyTypeId",
                table: "MappedMeters");

            migrationBuilder.AddColumn<string>(
                name: "SupplyType",
                table: "MappedMeters",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SupplyTo",
                table: "MappedMeters",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LocationType",
                table: "MappedMeters",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
