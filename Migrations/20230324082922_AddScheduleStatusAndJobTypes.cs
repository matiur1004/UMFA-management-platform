using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class AddScheduleStatusAndJobTypes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "JobStatus",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobStatus", x => x.Id);
                });

            //1 for profile, 2 for readings
            migrationBuilder.InsertData("JobStatus",
               new[] { "Name", "Description" },
               new object[,]
               {
                    { "For Profile", "Job For Profiles" },
                    { "For Readings", "Job For Readings" }
               });


            migrationBuilder.CreateTable(
                name: "ScheduleStatus",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ScheduleStatus", x => x.Id);
                });

            //1: not busy, 2: scheduled to run, 3: running, 4: successfully retrieved,
            //5: Inserted in DB , 6: Processed profile data, 7: error
            migrationBuilder.InsertData("ScheduleStatus",
               new[] { "Name", "Description" },
               new object[,]
               {
                    { "Not Busy", "Schedule is Not Busy" },
                    { "Scheduled To Run", "Job is Scheduled To Run" },
                    { "Running", "Job is Running" },
                    { "Successfully Retrieved", "Successfully Retrieved" },
                    { "Inserted in DB", "Inserted in Database" },
                    { "Processed Profile Data", "Processed Profile Data" },
                    { "Error", "An Error Occurred While Running the Job" }
               });

            //Update the JobStatus On Headers Table
            migrationBuilder.Sql("UPDATE [dbo].[ScadaRequestHeaders] " +
                "SET [Status] = 1 " +
                "WHERE [Status] = 0");

            //Update the JobStatus On Details Table
            migrationBuilder.Sql("UPDATE [dbo].[ScadaRequestDetails] " +
                "SET [Status] = 1 " +
                "WHERE [Status] = 0");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "JobStatus");

            migrationBuilder.DropTable(
                name: "ScheduleStatus");
        }
    }
}
