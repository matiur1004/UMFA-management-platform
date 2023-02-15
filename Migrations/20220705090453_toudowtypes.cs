using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class toudowtypes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TOUDayOfWeekDayTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TOUHeaderId = table.Column<int>(type: "int", nullable: false),
                    TOUDaysOfWeekId = table.Column<int>(type: "int", nullable: false),
                    TOUDayTypeId = table.Column<int>(type: "int", nullable: false),
                    Active = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TOUDayOfWeekDayTypes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TOUDayOfWeekDayTypes_TOUDaysOfWeeks_TOUDaysOfWeekId",
                        column: x => x.TOUDaysOfWeekId,
                        principalTable: "TOUDaysOfWeeks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TOUDayOfWeekDayTypes_TOUDayTypes_TOUDayTypeId",
                        column: x => x.TOUDayTypeId,
                        principalTable: "TOUDayTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TOUDayOfWeekDayTypes_TOUHeaders_TOUHeaderId",
                        column: x => x.TOUHeaderId,
                        principalTable: "TOUHeaders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TOUDayOfWeekDayTypes_TOUDaysOfWeekId",
                table: "TOUDayOfWeekDayTypes",
                column: "TOUDaysOfWeekId");

            migrationBuilder.CreateIndex(
                name: "IX_TOUDayOfWeekDayTypes_TOUDayTypeId",
                table: "TOUDayOfWeekDayTypes",
                column: "TOUDayTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_TOUDayOfWeekDayTypes_TOUHeaderId",
                table: "TOUDayOfWeekDayTypes",
                column: "TOUHeaderId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TOUDayOfWeekDayTypes");
        }
    }
}
