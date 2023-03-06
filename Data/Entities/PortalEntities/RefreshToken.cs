namespace ClientPortal.Data.Entities.PortalEntities
{
    using Microsoft.EntityFrameworkCore;
    using System.Text.Json.Serialization;

    public class RefreshToken
    {
        [JsonIgnore]
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public string Token { get; set; }
        public DateTime Expires { get; set; }
        public DateTime Created { get; set; }
        public string CreatedByIp { get; set; }
        public DateTime? RevokedDtm { get; set; }
        public string? RevokedByIp { get; set; }
        public string? ReplacedByToken { get; set; }
        public string? ReasonRevoked { get; set; }
        public bool IsExpired { get; set; }
        public bool IsRevoked => RevokedDtm != null;
        public bool IsActive => !IsRevoked && !IsExpired;
    }
}
