using ClientPortal.Controllers.Authorization;
using ClientPortal.Data;
using Dapper;
using System.Globalization;

namespace ClientPortal.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class AlarmBurstPipeController : ControllerBase
    {
        private readonly ILogger<AlarmBurstPipeController> _logger;
        private readonly PortalDBContext _context;

        public AlarmBurstPipeController(ILogger<AlarmBurstPipeController> logger, PortalDBContext portalDBContext)
        {
            _logger = logger;
            _context = portalDBContext;
        }

        [HttpPost("getAlarmConfigBurstPipe")]
        public async Task<ActionResult<AlarmConfigBurstPipeResultModel>> GetAlarmConfigBurstPipe([FromBody] AlarmConfigBurstPipeModel model)
        {
            if (!model.MeterSerialNo.Any()) return BadRequest(new ApplicationException($"Invalid Meter Number: '{model.MeterSerialNo}'"));
            if (!DateTime.TryParse(model.ProfileStartDTM, out DateTime sDt)) return BadRequest(new ApplicationException($"Invalid StartDate: '{model.ProfileStartDTM}'"));
            if (!DateTime.TryParse(model.ProfileEndDTM, out DateTime eDt)) return BadRequest(new ApplicationException($"Invalid EndDate: '{model.ProfileEndDTM}'"));
            if (!int.TryParse(model.NoOfPeaks.ToString(), out int noOfPeaks)) return BadRequest(new ApplicationException($"Invalid BurstPipe No Of Peaks: '{model.NoOfPeaks}'"));

            var returnResult = new AlarmConfigBurstPipeResultModel();

            _logger.LogInformation(1, "Get AlarmConfigBurstPipe Details for Meter: {MeterSerialNo}", model.MeterSerialNo);

            try
            {
                var CommandText = $"execute spAlarmConfigBurstPipe '{model.MeterSerialNo}','{model.ProfileStartDTM}','{model.ProfileEndDTM}',{model.NoOfPeaks}";
                var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();
                var results = await connection.QueryMultipleAsync(CommandText);

                List<AlarmConfigBurstPipeResultDataModel> resultData = results.Read<AlarmConfigBurstPipeResultDataModel>().ToList();
                List<AlarmConfigBurstPipeResultPeaksModel> peaksData = results.Read<AlarmConfigBurstPipeResultPeaksModel>().ToList();

                returnResult.MeterData = resultData;
                returnResult.PeaksData = peaksData;
            }
            catch (Exception ex)
            {
                _logger?.LogError("Failed to get AlarmConfigBurstPipe Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
                Console.WriteLine(ex.ToString());
                return Problem($"Failed to get AlarmConfigBurstPipe Details for Meter: {model.MeterSerialNo}");
            }
            if (returnResult.MeterData.Count >= 0)
            {
                _logger.LogInformation(1, message: "Returning AlarmConfigBurstPipe Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
            }
            else
            {
                _logger.LogError(1, "No Results Found For AlarmConfigBurstPipe Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
            }

            return Ok(returnResult);

        }

        [HttpPost("getAlarmAnalyzeBurstPipe")]
        public async Task<ActionResult<AlarmAnalyzeBurstPipeResultModel>> GetAlarmAnalyzeBurstPipe([FromBody] AlarmAnalyzeBurstPipeModel model)
        {
            if (!model.MeterSerialNo.Any()) return BadRequest(new ApplicationException($"Invalid Meter Number: '{model.MeterSerialNo}'"));
            if (!DateTime.TryParse(model.ProfileStartDTM, out DateTime sDt)) return BadRequest(new ApplicationException($"Invalid StartDate: '{model.ProfileStartDTM}'"));
            if (!DateTime.TryParse(model.ProfileEndDTM, out DateTime eDt)) return BadRequest(new ApplicationException($"Invalid EndDate: '{model.ProfileEndDTM}'"));
            if (!decimal.TryParse(model.Threshold.ToString(), out decimal threshold)) return BadRequest(new ApplicationException($"Invalid BurstPipe Threshold: '{model.Threshold}'"));
            if (!int.TryParse(model.Duration.ToString(), out int duration)) return BadRequest(new ApplicationException($"Invalid BurstPipe Duration: '{model.Duration}'"));

            var returnResult = new AlarmAnalyzeBurstPipeResultModel();

            _logger.LogInformation(1, "Get AlarmAnalyzeBurstPipe Details for Meter: {MeterSerialNo}", model.MeterSerialNo);

            try
            {
                var CommandText = $"execute spAlarmAnalyzeBurstPipe '{model.MeterSerialNo}','{model.ProfileStartDTM}','{model.ProfileEndDTM}',{model.Threshold.ToString(CultureInfo.InvariantCulture)},{model.Duration}";
                var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();
                var results = await connection.QueryMultipleAsync(CommandText);

                List<AlarmAnalyzeBurstPipeResultDataModel> resultData = results.Read<AlarmAnalyzeBurstPipeResultDataModel>().ToList();
                AlarmAnalyzeBurstPipeResultCountModel countData = results.Read<AlarmAnalyzeBurstPipeResultCountModel>().First();

                returnResult.MeterData = resultData;
                returnResult.Alarms = countData;
            }
            catch (Exception ex)
            {
                _logger?.LogError("Failed to get AlarmAnalyzeBurstPipe Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
                Console.Write(ex.ToString());
                return Problem($"Failed to get AlarmAnalyzeBurstPipe Details for Meter: {model.MeterSerialNo}");
            }

            if (returnResult.MeterData.Count > 0)
            {
                _logger.LogInformation(1, message: "Returning AlarmAnalyzeBurstPipe Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
            }
            else
            {
                _logger.LogError(1, "No Results Found For AlarmAnalyzeBurstPipe Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
                return Problem($"Failed to get AlarmAnalyzeBurstPipe Details for Meter: {model.MeterSerialNo}");
            }
            return Ok(returnResult);
        }
    }
    public class AlarmConfigBurstPipeModel
    {
        public string MeterSerialNo { get; set; }
        public string ProfileStartDTM { get; set; }
        public string ProfileEndDTM { get; set; }
        public int NoOfPeaks { get; set; }
    }

    public class AlarmConfigBurstPipeResultDataModel
    {
        public string ReadingDate { get; set; }
        public decimal ActFlow { get; set; }
        public bool Calculated { get; set; }
        public string Color { get; set; }
    }

    public class AlarmConfigBurstPipeResultPeaksModel
    {
        public int Id { get; set; }
        public string ReadingDate { get; set; }
        public decimal Peak { get; set; }
    }

    public class AlarmConfigBurstPipeResultModel
    {
        public List<AlarmConfigBurstPipeResultDataModel> MeterData { get; set; }
        public List<AlarmConfigBurstPipeResultPeaksModel> PeaksData { get; set; }
    }

    public class AlarmAnalyzeBurstPipeModel
    {
        public string MeterSerialNo { get; set; }
        public string ProfileStartDTM { get; set; }
        public string ProfileEndDTM { get; set; }
        public decimal Threshold { get; set; }
        public int Duration { get; set; }
    }

    public class AlarmAnalyzeBurstPipeResultDataModel
    {
        public string ReadingDate { get; set; }
        public decimal ActFlow { get; set; }
        public bool Calculated { get; set; }
        public string Color { get; set; }
    }

    public class AlarmAnalyzeBurstPipeResultCountModel
    {
        public int NoOfAlarms { get; set; }
    }

    public class AlarmAnalyzeBurstPipeResultModel
    {
        public List<AlarmAnalyzeBurstPipeResultDataModel> MeterData { get; set; }
        public AlarmAnalyzeBurstPipeResultCountModel Alarms { get; set; }
    }

}

