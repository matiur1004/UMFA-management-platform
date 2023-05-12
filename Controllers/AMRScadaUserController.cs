using ClientPortal.Controllers.Authorization;
using ClientPortal.Models.RequestModels;
using ClientPortal.Models.ResponseModels;
using ClientPortal.Services;
using System.Web;

namespace ClientPortal.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class AMRScadaUserController : ControllerBase
    {
        private readonly ILogger<AMRScadaUserController> _logger;
        private readonly IAMRScadaUserService _asuService;
        private readonly IUserService _opuService;

        public AMRScadaUserController(ILogger<AMRScadaUserController> logger, IAMRScadaUserService asuService, IUserService opuService)
        {
            _logger = logger;
            _asuService = asuService;
            _opuService = opuService;
        }
        // GET: AMRScadaUserController
        [HttpGet("getAll")]
        public IActionResult GetAllScadaUsers()
        {
            _logger.LogInformation($"Retrieving All AMR Scada Users");
            try
            {
                var response = _asuService.GetAll().Result;
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while retrieving amr scada users: {ex.Message}");
                return BadRequest($"Error while retrieving amr scada users: {ex.Message}");
            }
        }

        // GET: AMRScadaUserController/Details/5
        [HttpGet("{id}")]
        public IActionResult Details(int id)
        {
            _logger.LogInformation($"Retrieving AMR Scada User with id {id}");
            try
            {
                var response = _asuService.GetById(id).Result;
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while retrieving AMR Scada user with id {id}: {ex.Message}");
                return BadRequest($"Error while retrieving AMR Scada user with id {id}: {ex.Message}");
            }
        }

        [HttpGet("user/{id}")]
        public IActionResult GetAllforUser(int id)
        {
            _logger.LogInformation($"Retrieving AMR Scada Users for user {id}");
            try
            {
                var response = _asuService.GetAllforUser(id).Result;
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while retriving amr scada users for user {id}: {ex.Message}");
                return BadRequest($"Error while retriving amr scada users for user {id}: {ex.Message}");
            }
        }

        [HttpPost("edit")]
        public IActionResult EditForUser(AMRScadaUserUpdateRequest request)
        {
            _logger.LogInformation($"Saving amr scada users for userid {request?.UserId.ToString() ?? "Empty object recieved"}");
            try
            {
                if (request == null) throw new ArgumentNullException(nameof(request));
                if (request.ScadaUsers == null || request.ScadaUsers.Count == 0) throw new ApplicationException("Scada Users not found");

                AMRScadaUserUpdateResponse response = new()
                {
                    UserId = request.UserId,
                    ScadaUsers = new List<AMRScadaUserResponse>()
                };
                foreach (var scadaUser in request.ScadaUsers)
                {
                    var ret = _asuService.Update(scadaUser, request.UserId).Result;
                    response.ScadaUsers.Add(ret);
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while saving amr scada users for userid {request?.UserId.ToString() ?? "Empty object"}: {ex.Message}");
                return BadRequest($"Error while saving amr scada users for userid {request?.UserId.ToString() ?? "Empty object"}: {ex.Message}");
            }
        }

        [HttpPost("edit/{id}")]
        public IActionResult Edit([FromRoute] int id, [FromBody] AMRScadaUserRequest request)
        {
            _logger.LogInformation($"Saving amr scada user {request?.ScadaUserName ?? "Empty object recieved"}");
            try
            {
                if (request == null) throw new ArgumentNullException(nameof(request));
                if (request.Id == 0) //new user
                {
                    _logger.LogInformation($"New amr scada user {request?.ScadaUserName ?? "Empty object recieved"}");
                    List<AMRScadaUserRequest> asuL = new();
                    if (request != null) asuL.Add(request);
                    AMRScadaUserUpdateRequest ur = new() { UserId = id, ScadaUsers = asuL };
                    var response = _opuService.UpdateScadaUsers(ur).AmrScadaUsers.FirstOrDefault(asu => asu.ScadaUserName == request?.ScadaUserName);
                    return Ok(response);
                }
                else //edit
                {
                    _logger.LogInformation($"Edit amr scada user {request?.ScadaUserName ?? "Empty object recieved"}");
                    if (request != null)
                    {
                        var response = _asuService.Update(request, id).Result;
                        return Ok(response);
                    }
                    else throw new ArgumentNullException(nameof(request));
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while saving amr scada user {request?.ScadaUserName ?? "Empty object"}: {ex.Message}");
                return BadRequest($"Error while saving amr scada user {request?.ScadaUserName ?? "Empty object"}: {ex.Message}");
            }
        }

        [HttpPut("edit/changePwd")]
        public IActionResult ChangePwd([FromBody] AMRScadaUserRequest request)
        {
            _logger.LogInformation($"Saving amr scada user {request?.ScadaUserName ?? "Empty object recieved"} to change pwd");
            try
            {
                if (request == null) throw new ArgumentNullException(nameof(request));
                var response = _asuService.Update(request).Result;
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while saving amr scada user {request?.ScadaUserName ?? "Empty object"}: {ex.Message}");
                return BadRequest($"Error while saving amr scada user {request?.ScadaUserName ?? "Empty object"}: {ex.Message}");
            }
        }

        [HttpPost("delete/{id}")]
        public IActionResult Remove([FromRoute] int id, [FromBody] AMRScadaUserRequest request)
        {
            _logger.LogInformation($"Saving amr scada user {request?.ScadaUserName ?? "Empty object recieved"}");
            try
            {
                if (request == null) throw new ArgumentNullException(nameof(request));
                request.Active = false;
                var response = _asuService.Update(request, id).Result;
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while saving amr scada user {request?.ScadaUserName ?? "Empty object"}: {ex.Message}");
                return BadRequest($"Error while saving amr scada user {request?.ScadaUserName ?? "Empty object"}: {ex.Message}");
            }
        }

        [HttpGet("decrypt/{value}")]
        public IActionResult Decrypt([FromRoute] string value)
        {
            var str = HttpUtility.UrlDecode(value);
            var response = _asuService.Decrypt(value);
            return Ok(response);
        }

        [HttpGet("encrypt/{value}")]
        public IActionResult Encrypt([FromRoute] string value)
        {
            var str = HttpUtility.UrlDecode(value);
            var response = _asuService.Encrypt(str);
            return Ok(response);
        }
    }
}
