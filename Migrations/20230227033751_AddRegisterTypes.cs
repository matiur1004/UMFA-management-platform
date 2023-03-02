using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class AddRegisterTypes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RegisterTypes",
                columns: table => new
                {
                    RegisterTypeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RegisterTypeName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RegisterTypes", x => x.RegisterTypeId);
                });

            migrationBuilder.Sql("DELETE FROM RegisterTypes", true);

            migrationBuilder.InsertData("RegisterTypes",
               new[] { "RegisterTypeName" },
               new object[,]
               {
                    {"kWh - Total"},
                    {"kWh - Peak"},
                    {"kWh - Standard"},
                    {"kWh - Off-Peak"},
                    {"kVA"},
                    {"kVARh"}
               });

        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RegisterTypes");
        }
    }
}
