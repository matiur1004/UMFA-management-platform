using System.ComponentModel.DataAnnotations;

namespace ClientPortal.Models.RequestModels
{
    public class ArchiveReportsRequest
    {
        [Required]
        public int? BuildingId { get; set; }

        [Required]
        public int? PeriodId { get; set; }

        [Required]
        public int? ReportTypeId { get; set; }

        [Required]
        public string FileName { get; set; }

        public string FileFormat { get; set; }

        [Required]
        public int? TenantId { get; set; }

        [Required]
        public int? ShopId { get; set; }
    }
}
