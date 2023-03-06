namespace ClientPortal.Models.ResponseModels
{
    public class MakeModelResponse
    {
        public int Id { get; set; }
        public string Make { get; set; }
        public string Model { get; set; }
        public string Description { get; set; }
        public bool Active { get; set; }

        public MakeModelResponse() { }

    }

    public class UtilityResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool Active { get; set; }
        public List<MakeModelResponse> MakeModels { get; set; }

        public UtilityResponse() { }

    }
}
