using ClientPortal.DtOs;

namespace ClientPortal.Models.FunctionModels
{
    public class ProfileDataMsg
    {
        public List<ProfileDataDetail> Data { get; set; }
        public int DequeueCount { get; set; }
    }

    public class ProfileDataDetail
    {
        public int JobHeaderId { get; set; }
        public int JobDetailId { get; set; }
        public ScadaMeterReading ReadingData { get; set; }
    }
}
