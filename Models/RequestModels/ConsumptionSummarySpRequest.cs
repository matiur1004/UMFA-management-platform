using ClientPortal.Enums;
using System.ComponentModel.DataAnnotations;

namespace ClientPortal.Models.RequestModels
{
    public class ConsumptionSummarySpRequest
    {
        [Required]
        public int? BuildingID { get; set; }

        [Required]
        public int? PeriodID { get; set; }

        [Required]
        public int? SplitIndicator { get; set; }

        [Required]
        public string Sort { get; set; }

        [Required]
        public string ShopFilter { get; set; }
    }
}
