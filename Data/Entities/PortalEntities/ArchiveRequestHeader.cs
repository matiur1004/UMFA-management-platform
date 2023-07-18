using ClientPortal.Models.RequestModels;
using System.ComponentModel.DataAnnotations;

namespace ClientPortal.Data.Entities.PortalEntities
{
    public class ArchiveRequestHeader
    {
        [Key]
        [Required]
        public int ArchiveRequestId { get; set; }

        [Required]
        public int BuildingId { get; set; }

        [Required]
        public int PeriodId { get; set; }
        
        [Required]
        public int ReportTypeId { get; set; }
        
        [Required]
        public string ArchiveFileName { get; set; }
        
        [Required]
        public DateTime CreatedDTM { get; set; }
        
        [Required]
        public DateTime LastUpdateDTM { get; set; }
        
        [Required]
        /// <summary>
        /// 1 = Requested 2 = partially completed 3 = Complete 4 = failed
        /// </summary>
        public int Status { get; set; } 

        public string? StatusMessage { get; set; }
        
        [Required]
        public bool Active { get; set; }

        public ICollection<ArchiveRequestDetail> ArchiveRequestDetails { get; set; }


        public ArchiveRequestHeader() { }

        public ArchiveRequestHeader(ArchiveReportsRequest request) 
        {
            BuildingId = (int)request.BuildingId!;
            PeriodId = (int)request.PeriodId!;
            ReportTypeId = (int)request.ReportTypeId!;
            ArchiveFileName = request.FileName;
            CreatedDTM = DateTime.Now;
            LastUpdateDTM = DateTime.Now;
            Status = 1;
            Active = true;
        }
    }
}
