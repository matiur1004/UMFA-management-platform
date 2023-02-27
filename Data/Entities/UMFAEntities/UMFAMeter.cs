using System.ComponentModel.DataAnnotations;

namespace ClientPortal.Data.Entities.UMFAEntities
{
    public class UMFAMeter
    {
        [Key]
        public int MeterId { get; set; }
        public string MeterNo { get; set; }
        public string Description { get; set; }
        public string RegisterType { get; set; }
        public string MeterType { get; set; }
        public string Location { get; set; }
        public int Sequence { get; set; }
    }
}

