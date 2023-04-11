using ClientPortal.Controllers.Authorization;
using ClientPortal.Data;
using System.Dynamic;

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
        public ActionResult<IEnumerable<dynamic>> GetAlarmConfigBurstPipe([FromBody] AlarmConfigBurstPipeModel model)
        {
            if (!model.MeterSerialNo.Any()) return BadRequest(new ApplicationException($"Invalid Meter Number: '{model.MeterSerialNo}'"));
            if (!DateTime.TryParse(model.ProfileStartDTM, out DateTime sDt)) return BadRequest(new ApplicationException($"Invalid StartDate: '{model.ProfileStartDTM}'"));
            if (!DateTime.TryParse(model.ProfileEndDTM, out DateTime eDt)) return BadRequest(new ApplicationException($"Invalid EndDate: '{model.ProfileEndDTM}'"));
            if (!int.TryParse(model.NoOfPeaks.ToString(), out int duration)) return BadRequest(new ApplicationException($"Invalid BurstPipe Threshold: '{model.NoOfPeaks}'"));

            var resultList = new List<dynamic>();

            _logger.LogInformation(1, "Get AlarmConfigBurstPipe Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
            try
            {
                using var command = _context.Database.GetDbConnection().CreateCommand();
                command.CommandText = "spAlarmConfigBurstPipe";
                command.CommandType = System.Data.CommandType.StoredProcedure;

                //Add MeterSerialNo
                var p1 = command.CreateParameter();
                p1.ParameterName = "@MeterSerialNo";
                p1.Value = model.MeterSerialNo;
                command.Parameters.Add(p1);
                //Add ProfileStartDTM
                var p2 = command.CreateParameter();
                p2.ParameterName = "@ProfileStartDTM";
                p2.Value = model.ProfileStartDTM;
                command.Parameters.Add(p2);
                //Add ProfileEndDTM
                var p3 = command.CreateParameter();
                p3.ParameterName = "@ProfileEndDTM";
                p3.Value = model.ProfileEndDTM;
                command.Parameters.Add(p3);
                //Add NoOfPeaks
                var p4 = command.CreateParameter();
                p4.ParameterName = "@Threshold";
                p4.Value = model.NoOfPeaks;
                command.Parameters.Add(p4);

                _context.Database.OpenConnection();

                //var result = new List<AlarmConfigBurstPipeResult>();

                using var reader = command.ExecuteReader();
                while (reader.Read())
                {
                    dynamic result = new ExpandoObject();
                    var dictionary = result as IDictionary<string, object>;

                    for (int i = 0; i < reader.FieldCount; i++)
                    {
                        dictionary.Add(reader.GetName(i), reader.IsDBNull(i) ? null : reader[i]);
                    }
                    resultList.Add(result);
                }
            }
            catch (Exception)
            {
                _logger?.LogError("Failed to get AlarmConfigBurstPipe Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
                return Problem($"Failed to get AlarmConfigBurstPipe Details for Meter: {model.MeterSerialNo}");
            }
            if (resultList.Count > 0)
            {
                _logger.LogInformation(1, message: "Returning AlarmConfigBurstPipe Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
            }
            else
            {
                _logger.LogError(1, "No Results Found For AlarmConfigBurstPipe Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
            }

            return Ok(resultList);
        }

        [HttpPost("getAlarmAnalyzeBurstPipe")]
        public ActionResult<IEnumerable<dynamic>> GetAlarmAnalyzeBurstPipe([FromBody] AlarmAnalyzeBurstPipeModel model)
        {
            if (!model.MeterSerialNo.Any()) return BadRequest(new ApplicationException($"Invalid Meter Number: '{model.MeterSerialNo}'"));
            if (!DateTime.TryParse(model.ProfileStartDTM, out DateTime sDt)) return BadRequest(new ApplicationException($"Invalid StartDate: '{model.ProfileStartDTM}'"));
            if (!DateTime.TryParse(model.ProfileEndDTM, out DateTime eDt)) return BadRequest(new ApplicationException($"Invalid EndDate: '{model.ProfileEndDTM}'"));
            if (!decimal.TryParse(model.Threshold.ToString(), out decimal threshold)) return BadRequest(new ApplicationException($"Invalid BurstPipe Threshold: '{model.Threshold}'"));
            if (!int.TryParse(model.Duration.ToString(), out int duration)) return BadRequest(new ApplicationException($"Invalid BurstPipe Threshold: '{model.Threshold}'"));

            var resultList = new List<dynamic>();

            _logger.LogInformation(1, "Get AlarmAnalyzeBurstPipe Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
            try
            {
                using var command = _context.Database.GetDbConnection().CreateCommand();
                command.CommandText = "spAlarmAnalyzeBurstPipe";
                command.CommandType = System.Data.CommandType.StoredProcedure;

                //Add MeterSerialNo
                var p1 = command.CreateParameter();
                p1.ParameterName = "@MeterSerialNo";
                p1.Value = model.MeterSerialNo;
                command.Parameters.Add(p1);
                //Add ProfileStartDTM
                var p2 = command.CreateParameter();
                p2.ParameterName = "@ProfileStartDTM";
                p2.Value = model.ProfileStartDTM;
                command.Parameters.Add(p2);
                //Add ProfileEndDTM
                var p3 = command.CreateParameter();
                p3.ParameterName = "@ProfileEndDTM";
                p3.Value = model.ProfileEndDTM;
                command.Parameters.Add(p3);
                //Add Threshold
                var p6 = command.CreateParameter();
                p6.ParameterName = "@Threshold";
                p6.Value = model.Threshold;
                command.Parameters.Add(p6);
                //Add Duration
                var p7 = command.CreateParameter();
                p7.ParameterName = "@Duration";
                p7.Value = model.Duration;
                command.Parameters.Add(p7);

                _context.Database.OpenConnection();

                using var reader = command.ExecuteReader();
                while (reader.Read())
                {
                    dynamic result = new ExpandoObject();
                    var dictionary = result as IDictionary<string, object>;

                    for (int i = 0; i < reader.FieldCount; i++)
                    {
                        dictionary.Add(reader.GetName(i), reader.IsDBNull(i) ? null : reader[i]);
                    }
                    resultList.Add(result);
                }
            }
            catch (Exception)
            {
                _logger?.LogError("Failed to get AlarmAnalyzeBurstPipe Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
                return Problem($"Failed to get AlarmAnalyzeBurstPipe Details for Meter: {model.MeterSerialNo}");
            }
            if (resultList.Count > 0)
            {
                _logger.LogInformation(1, message: "Returning AlarmAnalyzeBurstPipe Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
            }
            else
            {
                _logger.LogError(1, "No Results Found For AlarmAnalyzeBurstPipe Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
            }

            return Ok(resultList);
        }
    }
    public class AlarmConfigBurstPipeModel
    {
        public string MeterSerialNo { get; set; }
        public string ProfileStartDTM { get; set; }
        public string ProfileEndDTM { get; set; }
        public int NoOfPeaks { get; set; }
    }

    public class AlarmAnalyzeBurstPipeModel
    {
        public string MeterSerialNo { get; set; }
        public string ProfileStartDTM { get; set; }
        public string ProfileEndDTM { get; set; }
        public decimal Threshold { get; set; }
        public int Duration { get; set; }
    }

    public class AlarmConfigBurstPipeResult
    { 
        public AlarmConfigBurstPipeFlowResult alarmConfigBurstPipeFlowResult { get; set; }
        public AlarmConfigBurstPipePeakResult alarmConfigBurstPipePeakResult { get; set; }
        public int ReturnValue { get; set; }
    }

    public class AlarmConfigBurstPipeFlowResult
    { 
        public DateTime ReadingDate { get; set; }
        public decimal ActFlow { get; set; }
        public int Calculated { get; set; }
        public string Color { get; set; }
    }

    public class AlarmConfigBurstPipePeakResult
    {
        public int Id { get; set; }
        public DateTime ReadingDate { get; set; }
        public decimal Peak { get; set; } = 0;
    }
}

