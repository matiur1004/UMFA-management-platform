namespace ClientPortal.Models.RequestModels
{
    public class UpdateArchiveFileFormatSpRequest
    {
        public int Id { get; set; }
        public int BuildingId { get; set; }
        public string Format { get; set; }
        public string Description { get; set; } = "";
    }
}
