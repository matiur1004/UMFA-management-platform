using ClientPortal.Controllers.Authorization;
using ClientPortal.Data;
using ClientPortal.DtOs;
using Dapper;
using Microsoft.EntityFrameworkCore;
using System.Dynamic;

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
        public ActionResult<IEnumerable<dynamic>> GetAlarmConfigNightFlow([FromBody] AlarmConfigNightFlowModel model)
        {
            if (!model.MeterSerialNo.Any()) return BadRequest(new ApplicationException($"Invalid Meter Number: '{model.MeterSerialNo}'"));
            if (!DateTime.TryParse(model.ProfileStartDTM, out DateTime sDt)) return BadRequest(new ApplicationException($"Invalid StartDate: '{model.ProfileStartDTM}'"));
            if (!DateTime.TryParse(model.ProfileEndDTM, out DateTime eDt)) return BadRequest(new ApplicationException($"Invalid EndDate: '{model.ProfileEndDTM}'"));
            if (!TimeOnly.TryParse(model.NFStartTime, out TimeOnly nfsTime)) return BadRequest(new ApplicationException($"Invalid NightFlow Start: '{model.NFStartTime}'"));
            if (!TimeOnly.TryParse(model.NFEndTime, out TimeOnly nfeTime)) return BadRequest(new ApplicationException($"Invalid NightFlow End: '{model.NFEndTime}'"));

            var resultList = new List<dynamic>();

            _logger.LogInformation(1, "Get AlarmConfigNightflow Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
            try
            {
                using var command = _context.Database.GetDbConnection().CreateCommand();
                command.CommandText = "spAlarmConfigNightFlow";
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
                //Add NFStartTime
                var p4 = command.CreateParameter();
                p4.ParameterName = "@NFStartTime";
                p4.Value = model.NFStartTime;
                command.Parameters.Add(p4);
                //Add NFEndTime
                var p5 = command.CreateParameter();
                p5.ParameterName = "@NFEndTime";
                p5.Value = model.NFEndTime;
                command.Parameters.Add(p5);

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
                _logger?.LogError("Failed to get AlarmConfigNightflow Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
                return Problem($"Failed to get AlarmConfigNightflow Details for Meter: {model.MeterSerialNo}");
            }
            if (resultList.Count > 0)
            {
                _logger.LogInformation(1, message: "Returning AlarmConfigNightflow Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
            }
            else
            {
                _logger.LogError(1, "No Results Found For AlarmConfigNightflow Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
            }

            return Ok(resultList);
        }

        [HttpPost("getAlarmAnalyzeNightFlow")]
        public async Task<AlarmAnalyzeNightFlowResultModel> GetAlarmAnalyzeNightFlow([FromBody] AlarmAnalyzeNightFlowModel model)
        {
            var returnResult = new AlarmAnalyzeNightFlowResultModel();

            _logger.LogInformation(1, "Get AlarmAnalyzeNightflow Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
            try
            {
                var CommandText = $"execute spAlarmAnalyzeNightFlow '{model.MeterSerialNo}','{model.ProfileStartDTM}','{model.ProfileEndDTM}','{model.NFStartTime}','{model.NFEndTime}',{model.Threshold},{model.Duration}";
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
                _logger?.LogError("Failed to get AlarmAnalyzeNightflow Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
                Console.Write(ex.ToString());
                return returnResult;
            }
            if (returnResult.Alarms.NoOfAlarms >= 0)
            {
                _logger.LogInformation(1, message: "Returning AlarmAnalyzeNightflow Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
            }
            else
            {
                _logger.LogError(1, "No Results Found For AlarmAnalyzeNightflow Details for Meter: {MeterSerialNo}", model.MeterSerialNo);
            }

            return returnResult;
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

