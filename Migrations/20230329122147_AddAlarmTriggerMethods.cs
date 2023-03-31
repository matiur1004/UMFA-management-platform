using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class AddAlarmTriggerMethods : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AlarmTriggerMethods",
                columns: table => new
                {
                    AlarmTriggerMethodId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AlarmTriggerMethodName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AlarmTriggerMethodDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Active = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AlarmTriggerMethods", x => x.AlarmTriggerMethodId);
                });

            migrationBuilder.InsertData("AlarmTriggerMethods",
               new[] { "AlarmTriggerMethodName", "AlarmTriggerMethodDescription", "Active" },
               new object[,]
               {
                    {"Exceed Threshold" , "The set threshold is exceeded", true }
               });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AlarmTriggerMethods");
        }
    }
}
