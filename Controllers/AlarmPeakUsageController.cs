using ClientPortal.Controllers.Authorization;
using ClientPortal.Data;
using Dapper;
using System.Globalization;

namespace ClientPortal.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class AlarmPeakUsageController : ControllerBase
    {
        private readonly ILogger<AlarmPeakUsageController> _logger;
        private readonly PortalDBContext _context;

        public AlarmPeakUsageController(ILogger<AlarmPeakUsageController> logger, PortalDBContext portalDBContext)
        {
            _logger = logger;
            _context = portalDBContext;
        }

        [HttpPost("getAlarmConfigPeakUsage")]
        public async Task<ActionResult<AlarmConfigPeakUsageResultModel>> GetAlarmConfigPeakUsage([FromBody] AlarmConfigPeakUsageModel model)
        {
            if (!model.MeterSerialNo.Any()) return BadRequest(new ApplicationException($"Invalid Meter Number: '{model.MeterSerialNo}'"));
            if (!DateTime.TryParse(model.ProfileStartDTM, out DateTime sDt)) return BadRequest(new ApplicationException($"Invalid StartDate: '{model.ProfileStartDTM}'"));
            if (!DateTime.TryParse(model.ProfileEndDTM, out DateTime eDt)) return BadRequest(new ApplicationException($"Invalid EndDate: '{model.ProfileEndDTM}'"));
            if (!TimeOnly.TryParse(model.PeakStartTime, out TimeOnly nfsTime)) return BadRequest(new ApplicationException($"Invalid PeakUsage Start: '{model.PeakStartTime}'"));
            if (!TimeOnly.TryParse(model.PeakEndTime, out TimeOnly nfeTime)) return BadRequest(new ApplicationException($"Invalid PeakUsage End: '{model.PeakEndTime}'"));
            if (!int.TryParse(model.NoOfPeaks.ToString(), out int noPeaks)) return BadRequest(new ApplicationException($"Invalid PeakUsage End: '{model.NoOfPeaks}'"));

            var returnResult = new AlarmConfigPeakUsageResultModel();

            _logger.LogInformation(1, "Get AlarmConfigPeakUsage Details for Meter: {MeterSerialNo}", model.MeterSerialNo);

            try
            {
                var CommandText = $"execute spAlarmConfigPeakUsage '{model.MeterSerialNo}','{model.ProfileStartDTM}','{model.ProfileEndDTM}','{model.PeakStartTime}','{model.PeakEndTime}','{model.NoOfPeaks}'";
                var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();
                var results = await connection.QueryMultipleAsync(CommandText);

                List<AlarmConfigPeakUsageResultDataModel> resultData = results.Read<AlarmConfigPeakUsageResultDataModel>().ToList();
                List<AlarmConfigPeakUsageResultPeaksModel> peaksData = results.Read<AlarmConfigPeakUsageResultPeaksModel>().ToList();

                returnResult.MeterData = resultData;
                returnResult.MeterPeaks = peaksData;
            }
            catch (Exception ex)
            {
                _logger?.LogError("Failed to get AlarmConfigPeakUsage Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
                Console.WriteLine(ex.ToString());
                return Problem($"Failed to get AlarmConfigPeakUsage Details for Meter: {model.MeterSerialNo}");
            }

            if (returnResult.MeterData.Count >= 0)
            {
                _logger.LogInformation(1, message: "Returning AlarmConfigPeakUsage Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
            }
            else
            {
                _logger.LogError(1, "No Results Found For AlarmConfigPeakUsage Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
            }

            return Ok(returnResult);

        }

        [HttpPost("getAlarmAnalyzePeakUsage")]
        public async Task<ActionResult<AlarmAnalyzePeakUsageResultModel>> GetAlarmAnalyzePeakUsage([FromBody] AlarmAnalyzePeakUsageModel model)
        {
            if (!model.MeterSerialNo.Any()) return BadRequest(new ApplicationException($"Invalid Meter Number: '{model.MeterSerialNo}'"));
            if (!DateTime.TryParse(model.ProfileStartDTM, out DateTime sDt)) return BadRequest(new ApplicationException($"Invalid StartDate: '{model.ProfileStartDTM}'"));
            if (!DateTime.TryParse(model.ProfileEndDTM, out DateTime eDt)) return BadRequest(new ApplicationException($"Invalid EndDate: '{model.ProfileEndDTM}'"));
            if (!TimeOnly.TryParse(model.PeakStartTime, out TimeOnly psTime)) return BadRequest(new ApplicationException($"Invalid PeakUsage Start: '{model.PeakStartTime}'"));
            if (!TimeOnly.TryParse(model.PeakEndTime, out TimeOnly peTime)) return BadRequest(new ApplicationException($"Invalid PeakUsage End: '{model.PeakEndTime}'"));
            if (!decimal.TryParse(model.Threshold.ToString(), out decimal threshold)) return BadRequest(new ApplicationException($"Invalid PeakUsage Threshold: '{model.Threshold}'"));
            if (!int.TryParse(model.Duration.ToString(), out int duration)) return BadRequest(new ApplicationException($"Invalid PeakUsage End: '{model.Duration}'"));

            var returnResult = new AlarmAnalyzePeakUsageResultModel();

            _logger.LogInformation(1, "Get AlarmAnalyzePeakUsage Details for Meter: {MeterSerialNo}", model.MeterSerialNo);

            try
            {
                var CommandText = $"execute spAlarmAnalyzePeakUsage '{model.MeterSerialNo}','{model.ProfileStartDTM}','{model.ProfileEndDTM}','{model.PeakStartTime}','{model.PeakEndTime}',{model.Threshold.ToString(CultureInfo.InvariantCulture)},{model.Duration}";
                var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();
                var results = await connection.QueryMultipleAsync(CommandText);

                List<AlarmAnalyzePeakUsageResultDataModel> resultData = results.Read<AlarmAnalyzePeakUsageResultDataModel>().ToList();
                AlarmAnalyzePeakUsageResultCountModel countData = results.Read<AlarmAnalyzePeakUsageResultCountModel>().First();

                returnResult.MeterData = resultData;
                returnResult.Alarms = countData;
            }
            catch (Exception ex)
            {
                _logger?.LogError("Failed to get AlarmAnalyzePeakUsage Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
                Console.Write(ex.ToString());
                return Problem($"Failed to get AlarmAnalyzePeakUsage Details for Meter: {model.MeterSerialNo}");
            }

            if (returnResult.MeterData.Count > 0)
            {
                _logger.LogInformation(1, message: "Returning AlarmAnalyzePeakUsage Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
            }
            else
            {
                _logger.LogError(1, "No Results Found For AlarmAnalyzePeakUsage Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
                return Problem($"Failed to get AlarmAnalyzePeakUsage Details for Meter: {model.MeterSerialNo}");
            }

            return Ok(returnResult);
        }
    }

    //Config
    public class AlarmConfigPeakUsageModel
    {
        public string MeterSerialNo { get; set; }
        public string ProfileStartDTM { get; set; }
        public string ProfileEndDTM { get; set; }
        public string PeakStartTime { get; set; } = "00:00";
        public string PeakEndTime { get; set; } = "23:59";
        public int NoOfPeaks { get; set; }
    }

    public class AlarmConfigPeakUsageResultDataModel
    {
        public string ReadingDate { get; set; }
        public decimal ActFlow { get; set; }
        public bool Calculated { get; set; }
        public string Color { get; set; }
    }

    public class AlarmConfigPeakUsageResultPeaksModel
    {
        public string MeterSerial { get; set; }
        public string OccDTM { get; set; }
        public decimal Peak { get; set; }
    }

    public class AlarmConfigPeakUsageResultModel
    {
        public List<AlarmConfigPeakUsageResultDataModel> MeterData { get; set; }
        public List<AlarmConfigPeakUsageResultPeaksModel> MeterPeaks { get; set; }
    }

    //Analyze
    public class AlarmAnalyzePeakUsageModel
    {
        public string MeterSerialNo { get; set; }
        public string ProfileStartDTM { get; set; }
        public string ProfileEndDTM { get; set; }
        public string PeakStartTime { get; set; } = "05:00";
        public string PeakEndTime { get; set; } = "22:00";
        public decimal Threshold { get; set; }
        public int Duration { get; set; }
    }

    public class AlarmAnalyzePeakUsageResultDataModel
    {
        public string ReadingDate { get; set; }
        public decimal ActFlow { get; set; }
        public bool Calculated { get; set; }
        public string Color { get; set; }
    }

    public class AlarmAnalyzePeakUsageResultCountModel
    {
        public int NoOfAlarms { get; set; }
    }

    public class AlarmAnalyzePeakUsageResultModel
    {
        public List<AlarmAnalyzePeakUsageResultDataModel> MeterData { get; set; }
        public AlarmAnalyzePeakUsageResultCountModel Alarms { get; set; }
    }
}
