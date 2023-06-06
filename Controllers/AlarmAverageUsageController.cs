using ClientPortal.Controllers.Authorization;
using ClientPortal.Data;
using Dapper;
using System.Globalization;

namespace ClientPortal.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class AlarmAverageUsageController : ControllerBase
    {
        private readonly ILogger<AlarmAverageUsageController> _logger;
        private readonly PortalDBContext _context;

        public AlarmAverageUsageController(ILogger<AlarmAverageUsageController> logger, PortalDBContext portalDBContext)
        {
            _logger = logger;
            _context = portalDBContext;
        }

        [HttpPost("getAlarmConfigAvgUsage")]
        public async Task<ActionResult<AlarmConfigAvgUsageResultModel>> GetAlarmConfigAvgUsage([FromBody] AlarmConfigAvgUsageModel model)
        {
            if (!model.MeterSerialNo.Any()) return BadRequest(new ApplicationException($"Invalid Meter Number: '{model.MeterSerialNo}'"));
            if (!DateTime.TryParse(model.ProfileStartDTM, out DateTime sDt)) return BadRequest(new ApplicationException($"Invalid StartDate: '{model.ProfileStartDTM}'"));
            if (!DateTime.TryParse(model.ProfileEndDTM, out DateTime eDt)) return BadRequest(new ApplicationException($"Invalid EndDate: '{model.ProfileEndDTM}'"));
            if (!TimeOnly.TryParse(model.AveStartTime, out TimeOnly aveSTime)) return BadRequest(new ApplicationException($"Invalid AvgUsage Start: '{model.AveStartTime}'"));
            if (!TimeOnly.TryParse(model.AveEndTime, out TimeOnly aveETime)) return BadRequest(new ApplicationException($"Invalid AvgUsage End: '{model.AveEndTime}'"));
           

            var returnResult = new AlarmConfigAvgUsageResultModel();

            _logger.LogInformation(1, "Get AlarmConfigAvgUsage Details for Meter: {MeterSerialNo}", model.MeterSerialNo);

            try
            {
                var CommandText = $"execute spAlarmConfigAvgUsage '{model.MeterSerialNo}','{model.ProfileStartDTM}','{model.ProfileEndDTM}','{model.AveStartTime}','{model.AveEndTime}'";
                var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();
                var results = await connection.QueryMultipleAsync(CommandText);

                List<AlarmConfigAvgUsageResultDataModel> resultData = results.Read<AlarmConfigAvgUsageResultDataModel>().ToList();
                AlarmConfigAvgUsageResultInfoModel peaksData = results.Read<AlarmConfigAvgUsageResultInfoModel>().First();

                returnResult.MeterData = resultData;
                returnResult.MeterInfo = peaksData;
            }
            catch (Exception ex)
            {
                _logger?.LogError("Failed to get AlarmConfigAvgUsage Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
                Console.WriteLine(ex.ToString());
                return Problem($"Failed to get AlarmConfigAvgUsage Details for Meter: {model.MeterSerialNo}");
            }

            if (returnResult.MeterData.Count >= 0)
            {
                _logger.LogInformation(1, message: "Returning AlarmConfigAvgUsage Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
            }
            else
            {
                _logger.LogError(1, "No Results Found For AlarmConfigAvgUsage Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
            }

            return Ok(returnResult);

        }

        [HttpPost("getAlarmAnalyzeAvgUsage")]
        public async Task<ActionResult<AlarmAnalyzeAvgUsageResultModel>> GetAlarmAnalyzeAvgUsage([FromBody] AlarmAnalyzeAvgUsageModel model)
        {
            if (!model.MeterSerialNo.Any()) return BadRequest(new ApplicationException($"Invalid Meter Number: '{model.MeterSerialNo}'"));
            if (!DateTime.TryParse(model.ProfileStartDTM, out DateTime sDt)) return BadRequest(new ApplicationException($"Invalid StartDate: '{model.ProfileStartDTM}'"));
            if (!DateTime.TryParse(model.ProfileEndDTM, out DateTime eDt)) return BadRequest(new ApplicationException($"Invalid EndDate: '{model.ProfileEndDTM}'"));
            if (!TimeOnly.TryParse(model.AvgStartTime, out TimeOnly psTime)) return BadRequest(new ApplicationException($"Invalid AvgUsage Start: '{model.AvgStartTime}'"));
            if (!TimeOnly.TryParse(model.AvgEndTime, out TimeOnly peTime)) return BadRequest(new ApplicationException($"Invalid AvgUsage End: '{model.AvgEndTime}'"));
            if (!decimal.TryParse(model.Threshold.ToString(), out decimal threshold)) return BadRequest(new ApplicationException($"Invalid AvgUsage Threshold: '{model.Threshold}'"));
            if (!bool.TryParse(model.UseInterval.ToString(), out bool useIntrvl)) return BadRequest(new ApplicationException($"Invalid AvgUsage End: '{model.UseInterval}'"));

            var returnResult = new AlarmAnalyzeAvgUsageResultModel();

            _logger.LogInformation(1, "Get AlarmAnalyzeAvgUsage Details for Meter: {MeterSerialNo}", model.MeterSerialNo);

            try
            {
                var CommandText = $"execute spAlarmAnalyzeAvgUsage '{model.MeterSerialNo}','{model.ProfileStartDTM}','{model.ProfileEndDTM}','{model.AvgStartTime}','{model.AvgEndTime}',{model.Threshold.ToString(CultureInfo.InvariantCulture)},{model.UseInterval}";
                var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();
                var results = await connection.QueryMultipleAsync(CommandText);

                List<AlarmAnalyzeAvgUsageResultDataModel> resultData = results.Read<AlarmAnalyzeAvgUsageResultDataModel>().ToList();
                AlarmAnalyzeAvgUsageResultCountModel countData = results.Read<AlarmAnalyzeAvgUsageResultCountModel>().First();

                returnResult.MeterData = resultData;
                returnResult.Alarms = countData;
            }
            catch (Exception ex)
            {
                _logger?.LogError("Failed to get AlarmAnalyzeAvgUsage Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
                Console.Write(ex.ToString());
                return Problem($"Failed to get AlarmAnalyzeAvgUsage Details for Meter: {model.MeterSerialNo}");
            }

            if (returnResult.MeterData.Count > 0)
            {
                _logger.LogInformation(1, message: "Returning AlarmAnalyzeAvgUsage Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
            }
            else
            {
                _logger.LogError(1, "No Results Found For AlarmAnalyzeAvgUsage Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
                return Problem($"Failed to get AlarmAnalyzeAvgUsage Details for Meter: {model.MeterSerialNo}");
            }

            return Ok(returnResult);
        }
    }

    //Config
    public class AlarmConfigAvgUsageModel
    {
        public string MeterSerialNo { get; set; }
        public string ProfileStartDTM { get; set; }
        public string ProfileEndDTM { get; set; }
        public string AveStartTime { get; set; } = "22:00";
        public string AveEndTime { get; set; } = "05:00";
    }

    public class AlarmConfigAvgUsageResultDataModel
    {
        public string ReadingDate { get; set; }
        public decimal ActFlow { get; set; }
        public bool Calculated { get; set; }
        public string Color { get; set; }
    }

    public class AlarmConfigAvgUsageResultInfoModel
    {
        public string MeterSerial { get; set; }
        public string PeriodStartDTM { get; set; }
        public string PeriodEndDTM { get; set; }
        public decimal IntervalAvg { get; set; }
        public decimal PeriodAvg { get; set; }
        public decimal AvgPeak { get; set; }
        public decimal AvgMin { get; set; }
    }

    public class AlarmConfigAvgUsageResultModel
    {
        public List<AlarmConfigAvgUsageResultDataModel> MeterData { get; set; }
        public AlarmConfigAvgUsageResultInfoModel MeterInfo { get; set; }
    }

    //Analyze
    public class AlarmAnalyzeAvgUsageModel
    {
        public string MeterSerialNo { get; set; }
        public string ProfileStartDTM { get; set; }
        public string ProfileEndDTM { get; set; }
        public string AvgStartTime { get; set; } = "22:00";
        public string AvgEndTime { get; set; } = "05:00";
        public decimal Threshold { get; set; }
        public bool UseInterval { get; set; } = false;
    }

    public class AlarmAnalyzeAvgUsageResultDataModel
    {
        public string ReadingDate { get; set; }
        public decimal ActFlow { get; set; }
        public bool Calculated { get; set; }
        public string Color { get; set; }
    }

    public class AlarmAnalyzeAvgUsageResultCountModel
    {
        public int NoOfAlarms { get; set; }
    }

    public class AlarmAnalyzeAvgUsageResultModel
    {
        public List<AlarmAnalyzeAvgUsageResultDataModel> MeterData { get; set; }
        public AlarmAnalyzeAvgUsageResultCountModel Alarms { get; set; }
    }
}
