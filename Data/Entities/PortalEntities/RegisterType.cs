
using System.ComponentModel.DataAnnotations;

namespace ClientPortal.Data.Entities.PortalEntities
{
    [Serializable]
    public class RegisterType
    {
        [Key]
        public int RegisterTypeId { get; set; }
        public string RegisterTypeName { get; set; }

    }
}