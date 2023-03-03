using ClientPortal.Services;
using ClientPortal.Controllers.Authorization;
using ClientPortal.Models;
using Microsoft.Extensions.Options;
using ClientPortal.Helpers;
using System.Text.Json;
using Microsoft.AspNetCore.Cors;
using ClientPortal.Data.Entities;
using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.Data;
using Microsoft.Extensions.Logging;

namespace ClientPortal.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly PortalDBContext _context;
        private readonly IUserService _userService;
        private readonly AppSettings _options;
        private readonly ILogger<UserController> _logger;

        public UserController(ILogger<UserController> logger, IUserService userService, IOptions<AppSettings> options, PortalDBContext context)
        {
            _logger = logger;   
            _userService = userService;
            _options = options.Value;
            _context = context;
        }

        #region Authentication methods
        [AllowAnonymous]
        [HttpPost("authenticate")]
        public IActionResult Authenticate(AuthRequest model)
        {
            try
            {
                var response = _userService.Authenticate(model, IpAddress());
                if (response != null)
                {
                    SetTokenCookie(response.RefreshToken);
                    return Ok(response);
                }
                else
                    return BadRequest("Server Error");
            }
            catch (Exception ex)
            {
                return BadRequest(new Exception($"Error authenticating user: {ex.Message}", ex.InnerException));
                //throw new Exception($"Error authenticating user: {ex.Message}");
            }
        }

        [AllowAnonymous, HttpPost("refresh-token")]
        public IActionResult RefreshToken()
        {
            // accept refresh token in request body or by cookie
            var refreshToken = Request.Cookies["refreshToken"];

            if (string.IsNullOrEmpty(refreshToken))
                return BadRequest(new { message = "Token is required" });

            try
            {
                var response = _userService.RefreshToken(refreshToken, IpAddress());
                if (response == null) return BadRequest(new { message = "Error while refreshing token" });
                SetTokenCookie(response.RefreshToken);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("revoke-token")]
        public IActionResult RevokeToken()
        {
            try
            {
                //if token is supplied in body, get it
                var reader = new StreamReader(Request.Body, Encoding.UTF8);
                var body = Task.Run(async () => await reader.ReadToEndAsync()).Result;
                var model = new RevokeTokenRequest();
                if (body.Contains("Token"))
                    model = JsonSerializer.Deserialize<RevokeTokenRequest>(body);
                //accept token in body or in cookie
                var token = model?.Token ?? Request.Cookies["refreshToken"];
                if (string.IsNullOrEmpty(token)) throw new AppException("Token is required");
                _userService.RevokeToken(token, IpAddress());
                return Ok(new { message = "Token revoked" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error revoking token: {ex.Message}" });
            }
        }
        private void SetTokenCookie(string token)
        {
            //append the cookie with the refreshtoken to the http reponse
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(_options.RefreshTokenTTL)
            };
            Response.Cookies.Append("refreshToken", token, cookieOptions);
        }

        #endregion

        [HttpGet("{id}")]
        public IActionResult GetUserById(int id)
        {
            try
            {
                var user = _userService.GetUserById(id);
                return Ok(user);
            }
            catch (Exception ex)
            {
                if (ex.GetType() == typeof(KeyNotFoundException))
                {
                    return BadRequest(ex.Message);
                }
                else return BadRequest("Server Error");
            }
        }

        [HttpGet("GetAllUsers")]
        public async Task<ActionResult<IEnumerable<User>>> GetAllUsers()
        {
            return await _context.Users.ToListAsync();
        }

        [HttpPost("UpdateUser")]
        public IActionResult UpdateUserAMRUsers(AMRScadaUserUpdateRequest user)
        {
            try
            {
                var retUser = _userService.UpdateScadaUsers(user);
                return Ok(retUser);
            }
            catch (Exception ex)
            {
                return BadRequest($"Server error while updating user: {ex.Message}");
            }
        }

        //[HttpPost("UpdatePortalUserRole")]
        //public async Task<ActionResult<User>> UpdatePortalUserRole(User user)
        //{
        //    try
        //    {
        //        var retUser = _context.Users.Update(user);
        //        await _context.SaveChangesAsync();

        //        return Ok(retUser);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest($"Server error while updating user: {ex.Message}");
        //    }
        //}

        [HttpPost("UpdatePortalUserRole")]
        public IActionResult UpdatePortalUserRole(int userId, int roleId)
        {
            try
            {
                _logger.LogInformation($"update User with Id: {userId}");
                var response = _context.Users.FromSqlRaw($"UPDATE [dbo].[Users] SET [RoleId] = {roleId} WHERE Id = {userId}");
                if (response != null)
                {
                    _logger.LogInformation($"Successfully updated user: {userId}");
                    return Ok(response);
                }
                else throw new Exception($"Failed to User With Id: {userId}");
            }
            catch (Exception ex)
            {
                _logger?.LogError($"Failed to update meter: {ex.Message}");
                return BadRequest(new ApplicationException($"Failed to update meter: {ex.Message}"));
            }
        }


        #region Private methods
        private string IpAddress()
        {
            //get the source ip for the current request
            if (Request.Headers.ContainsKey("X-Forwarded-For"))
                return Request.Headers["X-Forwarded-For"];
            else
            {
                var ip = HttpContext.Connection.RemoteIpAddress;
                if (ip != null) return ip.MapToIPv4().ToString();
                else return Request.Headers["X-Forwarded-For"];
            }
        }

        #endregion
    }
}
