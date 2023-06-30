using ClientPortal.DtOs;
using System.Xml.Serialization;

namespace ClientPortal.Services
{
    public interface IScadaCalls
    {
        Task<ScadaMeterProfile> GetAmrProfileFromScada(AmrJobToRun job);
        Task<ScadaMeterReading> GetAmrReadingsFromScada(AmrJobToRun job);
    }
    public class ScadaCalls : IScadaCalls
    {
        private readonly ILogger<ScadaCalls> _logger;

        public ScadaCalls(ILogger<ScadaCalls> logger)
        {
            _logger = logger;
        }
        public async Task<ScadaMeterProfile> GetAmrProfileFromScada(AmrJobToRun job)
        {
            _logger.LogInformation("Retrieving amr data from scada external call");
            try
            {
                string url = $"{job.SqdUrl}readMeterProfile?LOGIN={job.ProfileName}.{job.ScadaUserName}&PWD={job.ScadaPassword}";
                //url += $"&eid={job.CommsId}&startdate={job.FromDate.ToString("yyyy-MM-dd HH:mm")}&enddate={job.ToDate.ToString("yyyy-MM-dd HH:mm")}";
                url += $"&key1={job.Key1}&startdate={job.FromDate.ToString("yyyy-MM-dd HH:mm")}&enddate={job.ToDate.ToString("yyyy-MM-dd HH:mm")}";
                using var httpClient = new HttpClient();
                using var resp = await httpClient.GetAsync(url);
                var result = await resp.Content.ReadAsStreamAsync();
                var serializer = new XmlSerializer(typeof(ScadaMeterProfile));

                ScadaMeterProfile profile = new();
                if (result != null)
                    profile = (ScadaMeterProfile)serializer.Deserialize(result);

                return profile;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error while retrieving amr data from scada: {Message}", ex.Message);
                //throw new ApplicationException($"Error in process GetAmrProfileFromScada: {ex.Message}");
                return null;
            }
        }

        public async Task<ScadaMeterReading> GetAmrReadingsFromScada(AmrJobToRun job)
        {
            _logger.LogInformation("Retrieving amr reading data from scada external call");
            try
            {
                string url = $"{job.SqdUrl}readMeterTotals?LOGIN={job.ProfileName}.{job.ScadaUserName}&PWD={job.ScadaPassword}";
                //url += $"&eid={job.CommsId}&startdate={job.FromDate.ToString("yyyy-MM-dd HH:mm")}&enddate={job.ToDate.ToString("yyyy-MM-dd HH:mm")}";
                url += $"&key1={job.Key1}&startdate={job.FromDate.ToString("yyyy-MM-dd HH:mm")}&enddate={job.ToDate.ToString("yyyy-MM-dd HH:mm")}";
                using var httpClient = new HttpClient();
                httpClient.Timeout = TimeSpan.FromSeconds(240);
                using var resp = await httpClient.GetAsync(url);
                var result = await resp.Content.ReadAsStreamAsync();
                var serializer = new XmlSerializer(typeof(ScadaMeterReading));

                ScadaMeterReading readings = new();
                if (result != null)
                    readings = (ScadaMeterReading)serializer.Deserialize(result);

                return readings;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error while retrieving amr data from scada: {Message}", ex.Message);
                //throw new ApplicationException($"Error in process GetAmrProfileFromScada: {ex.Message}");
                return null;
            }
        }
    }
}
