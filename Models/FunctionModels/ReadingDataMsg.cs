using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.DtOs;

namespace ClientPortal.Models.FunctionModels
{
    public class ReadingDataMsg
    {
        public List<ReadingDataDetail> Data { get; set; }
        public int DequeueCount { get; set; }
    }

    public class ReadingDataDetail
    {
        public int JobHeaderId { get; set; }
        public int JobDetailId { get; set; }
        public ScadaMeterReading ReadingData { get; set; }
    }
}
