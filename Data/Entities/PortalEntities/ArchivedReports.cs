using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;

namespace ClientPortal.Data.Entities.PortalEntities
{
    public class ArchivedReport
    {
        [Key]
        public int ArchivedReportId { get; set; }

        public int BuildingId { get; set; }

        public int PeriodId { get; set; }

        [MaxLength(500)]
        public string FileName { get; set; }
        
        public string Url { get; set; }
        
        public DateTime CreatedDateTime { get; set; }
        
        public bool Active { get; set; }
    }
}
