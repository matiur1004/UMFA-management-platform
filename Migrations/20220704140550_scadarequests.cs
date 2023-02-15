using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class scadarequests : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RefreshTokens_Users_UserId",
                table: "RefreshTokens");

            migrationBuilder.CreateTable(
                name: "ScadaRequestHeaders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Active = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDTM = table.Column<DateTime>(type: "datetime2", nullable: false),
                    StartRunDTM = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastRunDTM = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CurrentRunDTM = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ScadaRequestHeaders", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ScadaRequestDetails",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HeaderId = table.Column<int>(type: "int", nullable: false),
                    AmrMeterId = table.Column<int>(type: "int", nullable: false),
                    AmrScadaUserId = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Active = table.Column<bool>(type: "bit", nullable: false),
                    LastRunDTM = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CurrentRunDTM = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ScadaRequestDetails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ScadaRequestDetails_AMRMeters_AmrMeterId",
                        column: x => x.AmrMeterId,
                        principalTable: "AMRMeters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ScadaRequestDetails_AMRScadaUsers_AmrScadaUserId",
                        column: x => x.AmrScadaUserId,
                        principalTable: "AMRScadaUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ScadaRequestDetails_ScadaRequestHeaders_HeaderId",
                        column: x => x.HeaderId,
                        principalTable: "ScadaRequestHeaders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ScadaRequestDetails_AmrMeterId",
                table: "ScadaRequestDetails",
                column: "AmrMeterId");

            migrationBuilder.CreateIndex(
                name: "IX_ScadaRequestDetails_AmrScadaUserId",
                table: "ScadaRequestDetails",
                column: "AmrScadaUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ScadaRequestDetails_HeaderId",
                table: "ScadaRequestDetails",
                column: "HeaderId");

            migrationBuilder.AddForeignKey(
                name: "FK_RefreshTokens_Users_UserId",
                table: "RefreshTokens",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RefreshTokens_Users_UserId",
                table: "RefreshTokens");

            migrationBuilder.DropTable(
                name: "ScadaRequestDetails");

            migrationBuilder.DropTable(
                name: "ScadaRequestHeaders");

            migrationBuilder.AddForeignKey(
                name: "FK_RefreshTokens_Users_UserId",
                table: "RefreshTokens",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
