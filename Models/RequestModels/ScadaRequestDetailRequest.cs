using ClientPortal.Data.Entities.PortalEntities;

namespace ClientPortal.Models.RequestModels
{
    public class ScadaRequestDetailRequest
    {
        public int HeaderId { get; set; }
        public int AmrMeterId { get; set; }
        public int AmrScadaUserId { get; set; }

        /// <summary>
        /// 0: not busy
        /// 1: scheduled to run
        /// 2: running
        /// 3: successfully retrieved data
        /// 4: Inserted in DB
        /// 6: Error
        /// </summary>
        public int Status { get; set; } //0: not busy, 1: scheduled to run, 2: running, 3: successfully retrieved, 4: Inserted in DB
        public bool Active { get; set; }
        public DateTime? LastRunDTM { get; set; }
        public DateTime? CurrentRunDTM { get; set; }
        /// <summary>
        /// The time to wait after last successful execution of task per meter.
        /// In minutes
        /// </summary>
        public int UpdateFrequency { get; set; } //frequency of updates in minutes
        public DateTime? LastDataDate { get; set; }
    }
}
