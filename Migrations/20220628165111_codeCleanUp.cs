using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class CodeCleanUp : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AMRMeters_Buildings_buildingId",
                table: "AMRMeters");

            migrationBuilder.DropForeignKey(
                name: "FK_AMRMeters_MetersMakeModels_makeModelId",
                table: "AMRMeters");

            migrationBuilder.DropForeignKey(
                name: "FK_AMRMeters_Users_userId",
                table: "AMRMeters");

            migrationBuilder.RenameColumn(
                name: "umfaId",
                table: "Buildings",
                newName: "UmfaId");

            migrationBuilder.RenameColumn(
                name: "partner",
                table: "Buildings",
                newName: "Partner");

            migrationBuilder.RenameColumn(
                name: "parterId",
                table: "Buildings",
                newName: "ParterId");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "Buildings",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "userId",
                table: "AMRMeters",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "progFact",
                table: "AMRMeters",
                newName: "ProgFact");

            migrationBuilder.RenameColumn(
                name: "phase",
                table: "AMRMeters",
                newName: "Phase");

            migrationBuilder.RenameColumn(
                name: "meterSerial",
                table: "AMRMeters",
                newName: "MeterSerial");

            migrationBuilder.RenameColumn(
                name: "meterNo",
                table: "AMRMeters",
                newName: "MeterNo");

            migrationBuilder.RenameColumn(
                name: "makeModelId",
                table: "AMRMeters",
                newName: "MakeModelId");

            migrationBuilder.RenameColumn(
                name: "digits",
                table: "AMRMeters",
                newName: "Digits");

            migrationBuilder.RenameColumn(
                name: "description",
                table: "AMRMeters",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "ctSizeSec",
                table: "AMRMeters",
                newName: "CtSizeSec");

            migrationBuilder.RenameColumn(
                name: "ctSizePrim",
                table: "AMRMeters",
                newName: "CtSizePrim");

            migrationBuilder.RenameColumn(
                name: "commsId",
                table: "AMRMeters",
                newName: "CommsId");

            migrationBuilder.RenameColumn(
                name: "cbSize",
                table: "AMRMeters",
                newName: "CbSize");

            migrationBuilder.RenameColumn(
                name: "buildingId",
                table: "AMRMeters",
                newName: "BuildingId");

            migrationBuilder.RenameColumn(
                name: "active",
                table: "AMRMeters",
                newName: "Active");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "AMRMeters",
                newName: "Id");

            migrationBuilder.RenameIndex(
                name: "IX_AMRMeters_userId",
                table: "AMRMeters",
                newName: "IX_AMRMeters_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_AMRMeters_meterNo",
                table: "AMRMeters",
                newName: "IX_AMRMeters_MeterNo");

            migrationBuilder.RenameIndex(
                name: "IX_AMRMeters_makeModelId",
                table: "AMRMeters",
                newName: "IX_AMRMeters_MakeModelId");

            migrationBuilder.RenameIndex(
                name: "IX_AMRMeters_buildingId",
                table: "AMRMeters",
                newName: "IX_AMRMeters_BuildingId");

            migrationBuilder.AlterColumn<string>(
                name: "MeterSerial",
                table: "AMRMeters",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CommsId",
                table: "AMRMeters",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_AMRMeters_Buildings_BuildingId",
                table: "AMRMeters",
                column: "BuildingId",
                principalTable: "Buildings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_AMRMeters_MetersMakeModels_MakeModelId",
                table: "AMRMeters",
                column: "MakeModelId",
                principalTable: "MetersMakeModels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_AMRMeters_Users_UserId",
                table: "AMRMeters",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AMRMeters_Buildings_BuildingId",
                table: "AMRMeters");

            migrationBuilder.DropForeignKey(
                name: "FK_AMRMeters_MetersMakeModels_MakeModelId",
                table: "AMRMeters");

            migrationBuilder.DropForeignKey(
                name: "FK_AMRMeters_Users_UserId",
                table: "AMRMeters");

            migrationBuilder.RenameColumn(
                name: "UmfaId",
                table: "Buildings",
                newName: "umfaId");

            migrationBuilder.RenameColumn(
                name: "Partner",
                table: "Buildings",
                newName: "partner");

            migrationBuilder.RenameColumn(
                name: "ParterId",
                table: "Buildings",
                newName: "parterId");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Buildings",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "AMRMeters",
                newName: "userId");

            migrationBuilder.RenameColumn(
                name: "ProgFact",
                table: "AMRMeters",
                newName: "progFact");

            migrationBuilder.RenameColumn(
                name: "Phase",
                table: "AMRMeters",
                newName: "phase");

            migrationBuilder.RenameColumn(
                name: "MeterSerial",
                table: "AMRMeters",
                newName: "meterSerial");

            migrationBuilder.RenameColumn(
                name: "MeterNo",
                table: "AMRMeters",
                newName: "meterNo");

            migrationBuilder.RenameColumn(
                name: "MakeModelId",
                table: "AMRMeters",
                newName: "makeModelId");

            migrationBuilder.RenameColumn(
                name: "Digits",
                table: "AMRMeters",
                newName: "digits");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "AMRMeters",
                newName: "description");

            migrationBuilder.RenameColumn(
                name: "CtSizeSec",
                table: "AMRMeters",
                newName: "ctSizeSec");

            migrationBuilder.RenameColumn(
                name: "CtSizePrim",
                table: "AMRMeters",
                newName: "ctSizePrim");

            migrationBuilder.RenameColumn(
                name: "CommsId",
                table: "AMRMeters",
                newName: "commsId");

            migrationBuilder.RenameColumn(
                name: "CbSize",
                table: "AMRMeters",
                newName: "cbSize");

            migrationBuilder.RenameColumn(
                name: "BuildingId",
                table: "AMRMeters",
                newName: "buildingId");

            migrationBuilder.RenameColumn(
                name: "Active",
                table: "AMRMeters",
                newName: "active");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "AMRMeters",
                newName: "id");

            migrationBuilder.RenameIndex(
                name: "IX_AMRMeters_UserId",
                table: "AMRMeters",
                newName: "IX_AMRMeters_userId");

            migrationBuilder.RenameIndex(
                name: "IX_AMRMeters_MeterNo",
                table: "AMRMeters",
                newName: "IX_AMRMeters_meterNo");

            migrationBuilder.RenameIndex(
                name: "IX_AMRMeters_MakeModelId",
                table: "AMRMeters",
                newName: "IX_AMRMeters_makeModelId");

            migrationBuilder.RenameIndex(
                name: "IX_AMRMeters_BuildingId",
                table: "AMRMeters",
                newName: "IX_AMRMeters_buildingId");

            migrationBuilder.AlterColumn<string>(
                name: "meterSerial",
                table: "AMRMeters",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "commsId",
                table: "AMRMeters",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddForeignKey(
                name: "FK_AMRMeters_Buildings_buildingId",
                table: "AMRMeters",
                column: "buildingId",
                principalTable: "Buildings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_AMRMeters_MetersMakeModels_makeModelId",
                table: "AMRMeters",
                column: "makeModelId",
                principalTable: "MetersMakeModels",
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
    }
}
