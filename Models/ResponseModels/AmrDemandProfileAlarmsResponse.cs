namespace ClientPortal.Models.ResponseModels
{
    public class AmrDemandProfileAlarmsResponse
    {
        public AmrDemandProfileAlarmHeader? Header { get; set; }
        public List<AmrDemandProfileAlarmReading> Readings { get; set; } 

        public AmrDemandProfileAlarmsResponse(AmrDemandProfileAlarmsSpResponse source) 
        {
            Header = source.Headers?[0];
            Readings= source.Readings;
        }
    }
}
