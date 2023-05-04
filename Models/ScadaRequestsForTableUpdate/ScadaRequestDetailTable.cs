using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace ClientPortal.Models.ScadaRequestsForTableUpdate
{
    public class ScadaRequestDetailTable
    {
        public int Id { get; set; }
        public int HeaderId { get; set; }
        public int AmrMeterId { get; set; }
        public int AmrScadaUserId { get; set; } = 1;
        public int Status { get; set; } = 1;
        public int Active { get; set; } = 1;
        public DateTime LastRunDTM { get; set; } = DateTime.Now;
        public DateTime CurrentRunDTM { get; set; }= DateTime.Now;
        public int UpdateFrequency { get; set; } = 720;
        public DateTime LastDataDate { get; set; } = DateTime.Now;
    }
}
