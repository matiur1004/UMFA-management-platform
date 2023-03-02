namespace ClientPortal.Models
{
    using System.Text.Json.Serialization;
    using ClientPortal.Data.Entities;

    public class AuthResponse
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public int RoleId { get; set; }
        public string JwtToken { get; set; }
        [JsonIgnore]
        public string RefreshToken { get; set; }

        public AuthResponse(User user, string jwtToken, string refreshToken)
        {
            Id = user.Id;
            FirstName = user.FirstName;
            LastName = user.LastName;
            UserName = user.UserName;
            RoleId = user.RoleId;
            JwtToken = jwtToken;
            RefreshToken = refreshToken;
        }
    }
}
