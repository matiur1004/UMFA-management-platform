using ClientPortal.Controllers.Authorization;
using ClientPortal.Data;
using Dapper;

namespace ClientPortal.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class AlarmLeakDetectionController : ControllerBase
    {
        private readonly ILogger<AlarmLeakDetectionController> _logger;
        private readonly PortalDBContext _context;

        public AlarmLeakDetectionController(ILogger<AlarmLeakDetectionController> logger, PortalDBContext portalDBContext)
        {
            _logger = logger;
            _context = portalDBContext;
        }

        [HttpPost("getAlarmConfigLeakDetection")]
        public async Task<ActionResult<AlarmConfigLeakDetectionResultModel>> GetAlarmConfigLeakDetection([FromBody] AlarmConfigLeakDetectionModel model)
        {
            if (!model.MeterSerialNo.Any()) return BadRequest(new ApplicationException($"Invalid Meter Number: '{model.MeterSerialNo}'"));
            if (!DateTime.TryParse(model.ProfileStartDTM, out DateTime sDt)) return BadRequest(new ApplicationException($"Invalid StartDate: '{model.ProfileStartDTM}'"));
            if (!DateTime.TryParse(model.ProfileEndDTM, out DateTime eDt)) return BadRequest(new ApplicationException($"Invalid EndDate: '{model.ProfileEndDTM}'"));
            if (!int.TryParse(model.NoOfPeaks.ToString(), out int noOfPeaks)) return BadRequest(new ApplicationException($"Invalid LeakDetection No Of Peaks: '{model.NoOfPeaks}'"));

            var returnResult = new AlarmConfigLeakDetectionResultModel();

            _logger.LogInformation(1, "Get AlarmConfigLeakDetection Details for Meter: {MeterSerialNo}", model.MeterSerialNo);

            try
            {
                var CommandText = $"execute spAlarmConfigLeakDetection '{model.MeterSerialNo}','{sDt}','{eDt}',{noOfPeaks}";
                var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();
                var results = await connection.QueryMultipleAsync(CommandText);

                List<AlarmConfigLeakDetectionResultDataModel> resultData = results.Read<AlarmConfigLeakDetectionResultDataModel>().ToList();
                List<AlarmConfigLeakDetectionResultPeaksModel> peaksData = results.Read<AlarmConfigLeakDetectionResultPeaksModel>().ToList();

                returnResult.MeterData = resultData;
                returnResult.PeaksData = peaksData;
            }
            catch (Exception ex)
            {
                _logger?.LogError("Failed to get AlarmConfigLeakDetection Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
                Console.WriteLine(ex.ToString());
                return Problem($"Failed to get AlarmConfigLeakDetection Details for Meter: {model.MeterSerialNo}");
            }
            if (returnResult.MeterData.Count >= 0)
            {
                _logger.LogInformation(1, message: "Returning AlarmConfigLeakDetection Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
            }
            else
            {
                _logger.LogError(1, "No Results Found For AlarmConfigLeakDetection Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
            }

            return Ok(returnResult);

        }

        [HttpPost("getAlarmAnalyzeLeakDetection")]
        public async Task<ActionResult<AlarmAnalyzeLeakDetectionResultModel>> GetAlarmAnalyzeLeakDetection([FromBody] AlarmAnalyzeLeakDetectionModel model)
        {
            if (!model.MeterSerialNo.Any()) return BadRequest(new ApplicationException($"Invalid Meter Number: '{model.MeterSerialNo}'"));
            if (!DateTime.TryParse(model.ProfileStartDTM, out DateTime sDt)) return BadRequest(new ApplicationException($"Invalid StartDate: '{model.ProfileStartDTM}'"));
            if (!DateTime.TryParse(model.ProfileEndDTM, out DateTime eDt)) return BadRequest(new ApplicationException($"Invalid EndDate: '{model.ProfileEndDTM}'"));
            if (!decimal.TryParse(model.Threshold.ToString(), out decimal threshold)) return BadRequest(new ApplicationException($"Invalid LeakDetection Threshold: '{model.Threshold}'"));
            if (!int.TryParse(model.Duration.ToString(), out int duration)) return BadRequest(new ApplicationException($"Invalid LeakDetection Duration: '{model.Duration}'"));

            var returnResult = new AlarmAnalyzeLeakDetectionResultModel();

            _logger.LogInformation(1, "Get AlarmAnalyzeLeakDetection Details for Meter: {MeterSerialNo}", model.MeterSerialNo);

            try
            {
                var CommandText = $"execute spAlarmAnalyzeLeakDetection '{model.MeterSerialNo}','{model.ProfileStartDTM}','{model.ProfileEndDTM}',{model.Threshold},{model.Duration}";
                var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();
                var results = await connection.QueryMultipleAsync(CommandText);

                List<AlarmAnalyzeLeakDetectionResultDataModel> resultData = results.Read<AlarmAnalyzeLeakDetectionResultDataModel>().ToList();
                AlarmAnalyzeLeakDetectionResultCountModel countData = results.Read<AlarmAnalyzeLeakDetectionResultCountModel>().First();

                returnResult.MeterData = resultData;
                returnResult.Alarms = countData;
            }
            catch (Exception ex)
            {
                _logger?.LogError("Failed to get AlarmAnalyzeLeakDetection Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
                Console.Write(ex.ToString());
                return Problem($"Failed to get AlarmAnalyzeLeakDetection Details for Meter: {model.MeterSerialNo}");
            }

            if (returnResult.MeterData.Count > 0)
            {
                _logger.LogInformation(1, message: "Returning AlarmAnalyzeLeakDetection Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
            }
            else
            {
                _logger.LogError(1, "No Results Found For AlarmAnalyzeLeakDetection Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
                return Problem($"Failed to get AlarmAnalyzeLeakDetection Details for Meter: {model.MeterSerialNo}");
            }

            return Ok(returnResult);
        }
    }
    public class AlarmConfigLeakDetectionModel
    {
        public string MeterSerialNo { get; set; }
        public string ProfileStartDTM { get; set; }
        public string ProfileEndDTM { get; set; }
        public int NoOfPeaks { get; set; }
    }

    public class AlarmConfigLeakDetectionResultDataModel
    {
        public string ReadingDate { get; set; }
        public decimal ActFlow { get; set; }
        public bool Calculated { get; set; }
        public string Color { get; set; }
    }

    public class AlarmConfigLeakDetectionResultPeaksModel
    {
        public int Id { get; set; }
        public string ReadingDate { get; set; }
        public decimal Peak { get; set; }
    }

    public class AlarmConfigLeakDetectionResultModel
    {
        public List<AlarmConfigLeakDetectionResultDataModel> MeterData { get; set; }
        public List<AlarmConfigLeakDetectionResultPeaksModel> PeaksData { get; set; }
    }

    public class AlarmAnalyzeLeakDetectionModel
    {
        public string MeterSerialNo { get; set; }
        public string ProfileStartDTM { get; set; }
        public string ProfileEndDTM { get; set; }
        public decimal Threshold { get; set; }
        public int Duration { get; set; }
    }

    public class AlarmAnalyzeLeakDetectionResultDataModel
    {
        public string ReadingDate { get; set; }
        public decimal ActFlow { get; set; }
        public bool Calculated { get; set; }
        public string Color { get; set; }
    }

    public class AlarmAnalyzeLeakDetectionResultCountModel
    {
        public int NoOfAlarms { get; set; }
    }

    public class AlarmAnalyzeLeakDetectionResultModel
    {
        public List<AlarmAnalyzeLeakDetectionResultDataModel> MeterData { get; set; }
        public AlarmAnalyzeLeakDetectionResultCountModel Alarms { get; set; }
    }

}