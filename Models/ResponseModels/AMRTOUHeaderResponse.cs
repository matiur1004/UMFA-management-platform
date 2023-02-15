
namespace ClientPortal.Models
{
    [Serializable]
    public class AMRTOUHeaderResponse
    {
        public int Id { get; set; }
        public int UtilitySupplierId { get; set; }
        public string Name { get; set; }
        public bool IsDefault { get; set; }
        public bool Active { get; set; }
    }
}
