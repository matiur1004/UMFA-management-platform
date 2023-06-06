using ClientPortal.Controllers.Authorization;
using ClientPortal.Data;
using Dapper;
using System.Globalization;

namespace ClientPortal.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class AlarmNightFlowController : ControllerBase
    {
        private readonly ILogger<AlarmNightFlowController> _logger;
        private readonly PortalDBContext _context;

        public AlarmNightFlowController(ILogger<AlarmNightFlowController> logger, PortalDBContext portalDBContext)
        {
            _logger = logger;
            _context = portalDBContext;
        }

        [HttpPost("getAlarmConfigNightFlow")]
        public async Task<ActionResult<AlarmConfigNightFlowResultModel>> GetAlarmConfigNightFlow([FromBody] AlarmConfigNightFlowModel model)
        {
            if (!model.MeterSerialNo.Any()) return BadRequest(new ApplicationException($"Invalid Meter Number: '{model.MeterSerialNo}'"));
            if (!DateTime.TryParse(model.ProfileStartDTM, out DateTime sDt)) return BadRequest(new ApplicationException($"Invalid StartDate: '{model.ProfileStartDTM}'"));
            if (!DateTime.TryParse(model.ProfileEndDTM, out DateTime eDt)) return BadRequest(new ApplicationException($"Invalid EndDate: '{model.ProfileEndDTM}'"));
            if (!TimeOnly.TryParse(model.NFStartTime, out TimeOnly nfsTime)) return BadRequest(new ApplicationException($"Invalid NightFlow Start: '{model.NFStartTime}'"));
            if (!TimeOnly.TryParse(model.NFEndTime, out TimeOnly nfeTime)) return BadRequest(new ApplicationException($"Invalid NightFlow End: '{model.NFEndTime}'"));

            var returnResult = new AlarmConfigNightFlowResultModel();

            _logger.LogInformation(1, "Get AlarmConfigNightFlow Details for Meter: {MeterSerialNo}", model.MeterSerialNo);

            try
            {
                var CommandText = $"execute spAlarmConfigNightFlow '{model.MeterSerialNo}','{model.ProfileStartDTM}','{model.ProfileEndDTM}','{model.NFStartTime}','{model.NFEndTime}'";
                var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();
                var results = await connection.QueryMultipleAsync(CommandText);

                List<AlarmConfigNightFlowResultDataModel> resultData = results.Read<AlarmConfigNightFlowResultDataModel>().ToList();
                AlarmConfigNightFlowResultConfigModel configData = results.Read<AlarmConfigNightFlowResultConfigModel>().First();

                returnResult.MeterData = resultData;
                returnResult.MeterConfig = configData;
            }
            catch (Exception ex)
            {
                _logger?.LogError("Failed to get AlarmConfigNightFlow Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
                Console.WriteLine(ex.ToString());
                return Problem($"Failed to get AlarmConfigNightFlow Details for Meter: {model.MeterSerialNo}");
            }
            if (returnResult.MeterData.Count >= 0)
            {
                _logger.LogInformation(1, message: "Returning AlarmConfigNightFlow Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
            }
            else
            {
                _logger.LogError(1, "No Results Found For AlarmConfigNightFlow Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
            }
            return Ok(returnResult);
        }

        [HttpPost("getAlarmAnalyzeNightFlow")]
        public async Task<ActionResult<AlarmAnalyzeNightFlowResultModel>> GetAlarmAnalyzeNightFlow([FromBody] AlarmAnalyzeNightFlowModel model)
        {
            if (!model.MeterSerialNo.Any()) return BadRequest(new ApplicationException($"Invalid Meter Number: '{model.MeterSerialNo}'"));
            if (!DateTime.TryParse(model.ProfileStartDTM, out DateTime sDt)) return BadRequest(new ApplicationException($"Invalid StartDate: '{model.ProfileStartDTM}'"));
            if (!DateTime.TryParse(model.ProfileEndDTM, out DateTime eDt)) return BadRequest(new ApplicationException($"Invalid EndDate: '{model.ProfileEndDTM}'"));
            if (!decimal.TryParse(model.Threshold.ToString(), out decimal threshold)) return BadRequest(new ApplicationException($"Invalid BurstPipe Threshold: '{model.Threshold}'"));
            if (!int.TryParse(model.Duration.ToString(), out int duration)) return BadRequest(new ApplicationException($"Invalid BurstPipe Duration: '{model.Duration}'"));

            var returnResult = new AlarmAnalyzeNightFlowResultModel();

            _logger.LogInformation(1, "Get AlarmAnalyzeNightFlow Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
            try
            {
                var CommandText = $"execute spAlarmAnalyzeNightFlow '{model.MeterSerialNo}','{model.ProfileStartDTM}','{model.ProfileEndDTM}','{model.NFStartTime}','{model.NFEndTime}',{model.Threshold.ToString(CultureInfo.InvariantCulture)},{model.Duration}";
                var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();
                var results = await connection.QueryMultipleAsync(CommandText);

                List<AlarmAnalyzeNightFlowResultDataModel> resultData = results.Read<AlarmAnalyzeNightFlowResultDataModel>().ToList();
                AlarmAnalyzeNightFlowResultCountModel countData = results.Read<AlarmAnalyzeNightFlowResultCountModel>().First();

                returnResult.MeterData = resultData;
                returnResult.Alarms = countData;
            }
            catch (Exception ex)
            {
                _logger?.LogError("Failed to get AlarmAnalyzeNightFlow Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
                Console.Write(ex.ToString());
                return Problem($"Failed to get AlarmConfigNightFlow Details for Meter: {model.MeterSerialNo}");
            }
            if (returnResult.MeterData.Count > 0)
            {
                _logger.LogInformation(1, message: "Returning AlarmAnalyzeNightFlow Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
            }
            else
            {
                _logger.LogError(1, "No Results Found For AlarmAnalyzeNightFlow Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
            }
            return Ok(returnResult);
        }
    }

    public class AlarmConfigNightFlowModel
    {
        public string MeterSerialNo { get; set; }
        public string ProfileStartDTM { get; set; }
        public string ProfileEndDTM { get; set; }
        public string NFStartTime { get; set; } = "10:00";
        public string NFEndTime { get; set; } = "05:00";
    }

    public class AlarmConfigNightFlowResultDataModel
    {
        public string ReadingDate { get; set; }
        public decimal ActFlow { get; set; }
        public bool Calculated { get; set; }
        public string Color { get; set; }
    }

    public class AlarmConfigNightFlowResultConfigModel
    {
        public string MeterSerial { get; set; }
        public string PeriodStartDTM { get; set; }
        public string PeriodEndDTM { get; set; }
        public decimal IntervalAvg { get; set; }
        public decimal NFAvg { get; set; }
        public decimal NFPeak { get; set; }
        public decimal NFMin { get; set; }
        public decimal TotalNightFlow { get; set; }
    }

    public class AlarmConfigNightFlowResultModel
    {
        public List<AlarmConfigNightFlowResultDataModel> MeterData { get; set; }
        public AlarmConfigNightFlowResultConfigModel MeterConfig { get; set; }
    }

    public class AlarmAnalyzeNightFlowModel
    {
        public string MeterSerialNo { get; set; }
        public string ProfileStartDTM { get; set; }
        public string ProfileEndDTM { get; set; }
        public string NFStartTime { get; set; } = "10:00";
        public string NFEndTime { get; set; } = "05:00";
        public decimal Threshold { get; set; }
        public int Duration { get; set; }
    }

    public class AlarmAnalyzeNightFlowResultDataModel
    { 
        public string ReadingDate { get; set; }
        public decimal ActFlow { get; set; }
        public bool Calculated { get; set; }
        public string Color { get; set; }
    }

    public class AlarmAnalyzeNightFlowResultCountModel
    { 
        public int NoOfAlarms { get; set; }
    }

    public class AlarmAnalyzeNightFlowResultModel
    {
        public List<AlarmAnalyzeNightFlowResultDataModel> MeterData { get; set; }
        public AlarmAnalyzeNightFlowResultCountModel Alarms { get; set; }
    }
}

