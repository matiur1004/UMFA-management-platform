namespace ClientPortal.Models.RequestModels
{
    public class AMRScadaUserRequest
    {
        public int Id { get; set; }
        public string ProfileName { get; set; }
        public string ScadaUserName { get; set; }
        public string ScadaPassword { get; set; }
        public string SGDUrl { get; set; }
        public bool Active { get; set; }
    }

    public class AMRScadaUserUpdateRequest
    {
        public int UserId { get; set; }

        public List<AMRScadaUserRequest> ScadaUsers { get; set; }
    }
}
