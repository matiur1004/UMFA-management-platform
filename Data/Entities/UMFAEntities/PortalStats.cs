using Microsoft.EntityFrameworkCore;

namespace ClientPortal.Data.Entities.UMFAEntities
{
    [Serializable]
    [Keyless]
    public class PortalStats
    {
        public int Partners { get; set; }
        public int Buildings { get; set; }
        public int Clients { get; set; }
        public int Shops { get; set; }
        public int Tenants { get; set; }
        public int Users { get; set; }
    }
}
