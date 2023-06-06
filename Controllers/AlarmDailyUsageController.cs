using ClientPortal.Controllers.Authorization;
using ClientPortal.Data;
using Dapper;
using System.Globalization;

namespace ClientPortal.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class AlarmDailyUsageController : ControllerBase
    {
        private readonly ILogger<AlarmDailyUsageController> _logger;
        private readonly PortalDBContext _context;

        public AlarmDailyUsageController(ILogger<AlarmDailyUsageController> logger, PortalDBContext portalDBContext)
        {
            _logger = logger;
            _context = portalDBContext;
        }

        [HttpPost("getAlarmConfigDailyUsage")]
        public async Task<ActionResult<AlarmConfigDailyUsageResultModel>> GetAlarmConfigDailyUsage([FromBody] AlarmConfigDailyUsageModel model)
        {
            if (!model.MeterSerialNo.Any()) return BadRequest(new ApplicationException($"Invalid Meter Number: '{model.MeterSerialNo}'"));
            if (!DateTime.TryParse(model.ProfileStartDTM, out DateTime sDt)) return BadRequest(new ApplicationException($"Invalid StartDate: '{model.ProfileStartDTM}'"));
            if (!DateTime.TryParse(model.ProfileEndDTM, out DateTime eDt)) return BadRequest(new ApplicationException($"Invalid EndDate: '{model.ProfileEndDTM}'"));

            var returnResult = new AlarmConfigDailyUsageResultModel();

            _logger.LogInformation(1, "Get AlarmConfigDailyUsage Details for Meter: {MeterSerialNo}", model.MeterSerialNo);

            try
            {
                var CommandText = $"execute spAlarmConfigDailyUsage '{model.MeterSerialNo}','{model.ProfileStartDTM}','{model.ProfileEndDTM}'";
                var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();
                var results = await connection.QueryMultipleAsync(CommandText);

                List<AlarmConfigDailyUsageResultDataModel> resultData = results.Read<AlarmConfigDailyUsageResultDataModel>().ToList();
                AlarmConfigDailyUsageResultSummaryModel configData = results.Read<AlarmConfigDailyUsageResultSummaryModel>().First();

                returnResult.MeterData = resultData;
                returnResult.MeterSummary = configData;
            }
            catch (Exception ex)
            {
                _logger?.LogError("Failed to get AlarmConfigDailyUsage Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
                Console.WriteLine(ex.ToString());
                return Problem($"Failed to get AlarmConfigDailyUsage Details for Meter: {model.MeterSerialNo}");
            }

            if (returnResult.MeterData.Count >= 0)
            {
                _logger.LogInformation(1, message: "Returning AlarmConfigDailyUsage Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
            }
            else
            {
                _logger.LogError(1, "No Results Found For AlarmConfigDailyUsage Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
            }

            return Ok(returnResult);

        }

        [HttpPost("getAlarmAnalyzeDailyUsage")]
        public async Task<ActionResult<AlarmAnalyzeDailyUsageResultModel>> GetAlarmAnalyzeDailyUsage([FromBody] AlarmAnalyzeDailyUsageModel model)
        {
            if (!model.MeterSerialNo.Any()) return BadRequest(new ApplicationException($"Invalid Meter Number: '{model.MeterSerialNo}'"));
            if (!DateTime.TryParse(model.ProfileStartDTM, out DateTime sDt)) return BadRequest(new ApplicationException($"Invalid StartDate: '{model.ProfileStartDTM}'"));
            if (!DateTime.TryParse(model.ProfileEndDTM, out DateTime eDt)) return BadRequest(new ApplicationException($"Invalid EndDate: '{model.ProfileEndDTM}'"));
            if (!decimal.TryParse(model.Threshold.ToString(), out decimal threshold)) return BadRequest(new ApplicationException($"Invalid DailyUsage Threshold: '{model.Threshold}'"));

            var returnResult = new AlarmAnalyzeDailyUsageResultModel();

            _logger.LogInformation(1, "Get AlarmAnalyzeDailyUsage Details for Meter: {MeterSerialNo}", model.MeterSerialNo);

            try
            {
                var CommandText = $"execute spAlarmAnalyzeDailyUsage '{model.MeterSerialNo}','{model.ProfileStartDTM}','{model.ProfileEndDTM}',{model.Threshold.ToString(CultureInfo.InvariantCulture)}";
                var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();
                var results = await connection.QueryMultipleAsync(CommandText);

                List<AlarmAnalyzeDailyUsageResultDataModel> resultData = results.Read<AlarmAnalyzeDailyUsageResultDataModel>().ToList();
                AlarmAnalyzeDailyUsageResultCountModel countData = results.Read<AlarmAnalyzeDailyUsageResultCountModel>().First();

                returnResult.MeterData = resultData;
                returnResult.Alarms = countData;
            }
            catch (Exception ex)
            {
                _logger?.LogError("Failed to get AlarmAnalyzeDailyUsage Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
                Console.Write(ex.ToString());
                return Problem($"Failed to get AlarmAnalyzeDailyUsage Details for Meter: {model.MeterSerialNo}");
            }

            if (returnResult.MeterData.Count > 0)
            {
                _logger.LogInformation(1, message: "Returning AlarmAnalyzeDailyUsage Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
            }
            else
            {
                _logger.LogError(1, "No Results Found For AlarmAnalyzeDailyUsage Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
                return Problem($"Failed to get AlarmAnalyzeDailyUsage Details for Meter: {model.MeterSerialNo}");
            }

            return Ok(returnResult);
        }
    }

    //Config
    public class AlarmConfigDailyUsageModel
    {
        public string MeterSerialNo { get; set; }
        public string ProfileStartDTM { get; set; }
        public string ProfileEndDTM { get; set; }
    }

    public class AlarmConfigDailyUsageResultDataModel
    {
        public string ReadingDate { get; set; }
        public decimal ActFlow { get; set; }
        public bool Calculated { get; set; }
        public string Color { get; set; }
    }

    public class AlarmConfigDailyUsageResultSummaryModel
    {
        public decimal AvgDaily { get; set; }
        public decimal MaxDaily { get; set; }
        public decimal MinDaily { get; set; }
    }

    public class AlarmConfigDailyUsageResultModel
    {
        public List<AlarmConfigDailyUsageResultDataModel> MeterData { get; set; }
        public AlarmConfigDailyUsageResultSummaryModel MeterSummary { get; set; }
    }

    //Analyze
    public class AlarmAnalyzeDailyUsageModel
    {
        public string MeterSerialNo { get; set; }
        public string ProfileStartDTM { get; set; }
        public string ProfileEndDTM { get; set; }
        public decimal Threshold { get; set; }
    }

    public class AlarmAnalyzeDailyUsageResultDataModel
    {
        public string ReadingDate { get; set; }
        public decimal ActFlow { get; set; }
        public bool Calculated { get; set; }
        public string Color { get; set; }
    }

    public class AlarmAnalyzeDailyUsageResultCountModel
    {
        public int NoOfAlarms { get; set; }
    }

    public class AlarmAnalyzeDailyUsageResultModel
    {
        public List<AlarmAnalyzeDailyUsageResultDataModel> MeterData { get; set; }
        public AlarmAnalyzeDailyUsageResultCountModel Alarms { get; set; }
    }
}
