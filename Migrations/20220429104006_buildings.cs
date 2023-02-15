using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class buildings : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Buildings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    umfaId = table.Column<int>(type: "int", nullable: false),
                    name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    parterId = table.Column<int>(type: "int", nullable: false),
                    partner = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Buildings", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AMRMeters_buildingId",
                table: "AMRMeters",
                column: "buildingId");

            migrationBuilder.CreateIndex(
                name: "IX_AMRMeters_userId",
                table: "AMRMeters",
                column: "userId");

            migrationBuilder.AddForeignKey(
                name: "FK_AMRMeters_Buildings_buildingId",
                table: "AMRMeters",
                column: "buildingId",
                principalTable: "Buildings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_AMRMeters_Users_userId",
                table: "AMRMeters",
                column: "userId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AMRMeters_Buildings_buildingId",
                table: "AMRMeters");

            migrationBuilder.DropForeignKey(
                name: "FK_AMRMeters_Users_userId",
                table: "AMRMeters");

            migrationBuilder.DropTable(
                name: "Buildings");

            migrationBuilder.DropIndex(
                name: "IX_AMRMeters_buildingId",
                table: "AMRMeters");

            migrationBuilder.DropIndex(
                name: "IX_AMRMeters_userId",
                table: "AMRMeters");
        }
    }
}
