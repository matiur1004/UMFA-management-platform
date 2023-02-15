
using System.Text.Json.Serialization;

namespace ClientPortal.Data.Entities
{
    [Serializable]

    public class AMRScadaUser
    {
        public int Id { get; set; }
        public string ProfileName { get; set; }
        public string ScadaUserName { get; set; }
        public string ScadaPassword { get; set; }
        public string SgdUrl { get; set; }
        public bool Active { get; set; }
        public User User { get; set; }
        public List<ScadaRequestDetail> ScadaRequestDetails { get; set; }
        public AMRScadaUser() { }

    }
}
