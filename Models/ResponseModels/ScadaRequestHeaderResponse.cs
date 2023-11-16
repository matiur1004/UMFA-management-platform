using ClientPortal.Data.Entities.PortalEntities;

namespace ClientPortal.Models.ResponseModels
{
    public class ScadaRequestHeaderResponse
    {
        public int Id { get; set; }
        /// <summary>
        /// 0: not busy
        /// 1: scheduled to run
        /// 2: running
        /// 3: successfully retrieved Data from Scada
        /// 4: Inserted in DB
        /// 5: Processed profile data
        /// 6: error
        /// </summary>
        public int Status { get; set; } //0: not busy, 1: scheduled to run, 2: running, 3: successfully retrieved, 4: Inserted in DB , 5: Processed profile data, 6: error
        public bool Active { get; set; }
        public DateTime CreatedDTM { get; set; }
        public DateTime StartRunDTM { get; set; }
        public DateTime? LastRunDTM { get; set; }
        public DateTime? CurrentRunDTM { get; set; }
        /// <summary>
        /// 1: Retreive Profile Data
        /// 2: Retreive Reading Data
        /// </summary>
        public int JobType { get; set; } //1 for profile, 2 for readings
        public string Description { get; set; }
        /// <summary>
        /// The task to check for new jobs to run executes every 10 minutes.
        /// If larger offset is required, use this setting to set the time to wait after last execution.
        /// In minutes
        /// </summary>
        public int Interval { get; set; } //time to execute after previous run in minutes

        public ScadaRequestHeaderResponse(ScadaRequestHeader source)
        {
            Id = source.Id;
            Status = source.Status;
            Active = source.Active;
            CreatedDTM = source.CreatedDTM;
            StartRunDTM = source.StartRunDTM;
            LastRunDTM = source.LastRunDTM;
            CurrentRunDTM = source.CurrentRunDTM;
            JobType = source.JobType;
            Description = source.Description;
            Interval = source.Interval;
        }
    }
}
