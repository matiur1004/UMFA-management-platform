using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClientPortal.Data.Entities.UMFAEntities
{
    public class UMFAMeter
    {
        [Key]
        public int MeterId { get; set; }
        public string MeterNo { get; set; }
        [Column("Name")]
        public string Description { get; set; }
        public string RegisterType { get; set; }
        public string MeterType { get; set; }
        public string Location { get; set; }
        public int Sequence { get; set; }
    }
}

