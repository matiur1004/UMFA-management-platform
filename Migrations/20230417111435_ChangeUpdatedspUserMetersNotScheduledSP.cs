using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientPortal.Migrations
{
    public partial class ChangeUpdatedspUserMetersNotScheduledSP : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("CREATE OR ALTER proc spUserMetersNotScheduled\r\n(\r\n@UserId int,\r\n@JobType int\r\n)\r\n\r\n \r\n\r\nAS\r\n\r\n \r\n\r\nselect\r\ndistinct \r\nm.Id as AMRMeterId,\r\nm.MeterNo as AMRMeterNo,\r\nb.Name as Building,\r\nb.Partner as Partner\r\nfrom\r\nAMRMeters m (NOLOCK)\r\njoin Buildings b (NOLOCK) on (m.BuildingId = b.UmfaId)\r\njoin BuildingUser bu (NOLOCK) on (b.Id = bu.BuildingsId and bu.UsersId = @UserId)\r\njoin MappedMeters mm (NOLOCK) on (b.UmfaId = mm.BuildingId and b.PartnerId = mm.PartnerId and m.MeterNo = mm.MeterNo)\r\nleft join ScadaRequestDetails rd (NOLOCK) on (m.Id = rd.AmrMeterId and rd.Active = 1)\r\nleft join ScadaRequestHeaders rh (NOLOCK) on (rd.HeaderId = rh.Id and rh.Active = 1 and rh.JobType = @JobType)\r\nwhere\r\nrd.Id is null");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE [dbo].[spUserMetersNotScheduled]");
        }
    }
}
