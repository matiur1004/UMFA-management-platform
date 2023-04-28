using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.Helpers;

namespace ClientPortal.Models.ResponseModels
{
    public class AMRScadaUserUpdateResponse
    {
        public int UserId { get; set; }
        public List<AMRScadaUserResponse> ScadaUsers { get; set; }
    }

    public class AMRScadaUserResponse
    {
        public int Id { get; set; }
        public string ProfileName { get; set; }
        public string ScadaUserName { get; set; }
        public string ScadaPassword { get; set; }
        public string SgdUrl { get; set; }
        public bool Active { get; set; }
        public int UserId { get; set; }

        public AMRScadaUserResponse()
        {
        }

        public AMRScadaUserResponse(
            int id, 
            string profileName, 
            string scadaUserName, 
            string scadaPassword, 
            string sgdUrl, 
            bool active, 
            int userId)
        {
            this.Id = id;
            this.ProfileName = profileName;
            this.ScadaUserName = scadaUserName;
            this.ScadaPassword = CryptoUtils.EncryptString(scadaPassword);
            this.SgdUrl = sgdUrl;
            this.Active = active;
            this.UserId = userId;
        }
        public AMRScadaUserResponse(AMRScadaUser scadaUser)
        {
            this.Id = scadaUser.Id;
            this.ProfileName = scadaUser.ProfileName;
            this.ScadaUserName = scadaUser.ScadaUserName;
            this.ScadaPassword = scadaUser.ScadaPassword;
            this.SgdUrl = scadaUser.SgdUrl;
            this.Active = scadaUser.Active;
            this.UserId = scadaUser.User.Id;
        }

    }
}
