using ClientPortal.Controllers.Authorization;
using ClientPortal.Data;
using ClientPortal.Models.ResponseModels;
using Dapper;

namespace ClientPortal.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class AlarmTriggeredController : ControllerBase
    {
        private readonly ILogger<AlarmTriggeredController> _logger;
        private readonly PortalDBContext _context;

        public AlarmTriggeredController(ILogger<AlarmTriggeredController> logger, PortalDBContext portalDBContext)
        {
            _logger = logger;
            _context = portalDBContext;
        }

        [HttpPost("getAlarmTriggered")]
        public async Task<ActionResult<AlarmTriggeredResultModel>> GetAlarmTriggered([FromBody] AlarmTriggeredModel model)
        {
            if (!int.TryParse(model.AMRMeterTriggeredAlarmId.ToString(), out _)) return BadRequest(new ApplicationException($"Invalid AMR Meter Triggered Alarm Id: '{model.AMRMeterTriggeredAlarmId}'"));

            var returnResult = new AlarmTriggeredResultModel();

            _logger.LogInformation(1, "Get Triggered Alarm Details for AMRMeterTriggeredAlarmId: {0}", model.AMRMeterTriggeredAlarmId);

            try
            {
                var CommandText = $"execute spGetTriggeredAlarm {model.AMRMeterTriggeredAlarmId}";
                var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();
                var results = await connection.QueryMultipleAsync(CommandText);

                AlarmTriggeredResultInfoModel alarmInfo = results.Read<AlarmTriggeredResultInfoModel>().First();
                List<AlarmTriggeredResultDataModel> alarmData = results.Read<AlarmTriggeredResultDataModel>().ToList();

                returnResult.AlarmInfo = alarmInfo;
                returnResult.AlarmData = alarmData;

            }
            catch (Exception ex)
            {
                _logger?.LogError("Failed to get AlarmTriggered Details for Meter: {MeterSerialNo}", model.AMRMeterTriggeredAlarmId);
                Console.WriteLine(ex.ToString());
                return Problem($"Failed to get AlarmTriggered Details for Meter: {model.AMRMeterTriggeredAlarmId}");
            }

            if (returnResult.AlarmData.Count >= 0)
            {
                _logger.LogInformation(1, message: "Returning AlarmTriggered Details for Meter: {MeterSerialNo}", model.AMRMeterTriggeredAlarmId);
            }
            else
            {
                _logger.LogError(1, "No Results Found For AlarmTriggered Details for Meter: {MeterSerialNo}", model.AMRMeterTriggeredAlarmId);
            }
            return Ok(returnResult);
        }

        [HttpPost("updateAcknowledged")]
        public IActionResult UpdateAcknowledged([FromBody] AlarmTriggeredModel model)
        {
            try
            {
                _logger.LogInformation($"Update AlarmTriggered Acknowledged With Id: {model.AMRMeterTriggeredAlarmId}");
                var response = _context.Database.ExecuteSqlRaw($"UPDATE [dbo].[AMRMeterTriggeredAlarms] SET " +
                    $"[Acknowledged] = 1 " +
                    $"WHERE AMRMeterTriggeredAlarmId = {model.AMRMeterTriggeredAlarmId}");

                if (response != 0)
                {
                    var result = new SuccessModel();
                    result.Status = "Success";
                    _logger.LogInformation($"Successfully updated user: {model.AMRMeterTriggeredAlarmId}");
                    return Ok(result);
                }
                else throw new Exception($"Failed to Update AlarmTriggered Acknowledged With Id: {model.AMRMeterTriggeredAlarmId}");
            }
            catch (Exception ex)
            {
                _logger?.LogError($"Failed to update User Roles: {ex.Message}");
                return BadRequest(new ApplicationException($"Failed to update User Roles and Notification Settings: {ex.Message}"));
            }
        }
    }

    //Config
    public class AlarmTriggeredModel
    {
        public int AMRMeterTriggeredAlarmId { get; set; }

    }

    public class AlarmTriggeredResultInfoModel
    {
        public int AMRMeterTriggeredAlarmId { get; set; }
        public bool Acknowledged { get; set; }
        public string AlarmName { get; set; }
        public string AlarmDescription { get; set; }
        public string MeterSerial { get; set; }
        public string UMFAMeterNo { get; set; }
        public string MeterDescription { get; set; }
        public string Partner { get; set; }
        public string Building { get; set; }
        public decimal Threshold { get; set; }
        public int Duration { get; set; }
        public decimal AverageObserved { get; set; }
        public decimal MaximumObserved { get; set; }

    }

    public class AlarmTriggeredResultDataModel
    {
        public string ReadingDate { get; set; }
        public decimal ActFlow { get; set; }
        public bool Calculated { get; set; }
        public string Color { get; set; }
    }


    public class AlarmTriggeredResultModel
    {
        public AlarmTriggeredResultInfoModel AlarmInfo { get; set; }
        public List<AlarmTriggeredResultDataModel> AlarmData { get; set; }
    }

    public class SuccessModel
    {
        public string Status { get; set; }
    }
}