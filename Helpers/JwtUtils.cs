using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using ClientPortal.Data;
using ClientPortal.Data.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace ClientPortal.Helpers
{
    public interface IJwtUtils
    {
        public string GenerateToken(User user);
        public int? ValidateToken(string token);
        public RefreshToken? GetRefreshToken(string ipAddress);
        public RefreshToken? GetRefreshToken(string ipAddress, User user);
    }

    public class JwtUtils : IJwtUtils
    {
        private readonly PortalDBContext _context;
        private readonly ILogger<JwtUtils> _logger;
        private readonly AppSettings _options;

        public JwtUtils(
            PortalDBContext context,
            IOptions<AppSettings> options,
            ILogger<JwtUtils> logger)
        {
            _context = context;
            _logger = logger;
            _options = options.Value;
        }
        public string GenerateToken(User user)
        {
            _logger.LogInformation("Generating new token for user: {UserName}", user.UserName);

            // generate token with valid time from config file

            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_options.Secret);
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new[] { new Claim("id", user.Id.ToString()) }),
                    Expires = DateTime.UtcNow.AddMinutes(_options.TimeToExpire),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };
                var token = tokenHandler.CreateToken(tokenDescriptor);
                return tokenHandler.WriteToken(token);
            }
            catch (Exception ex)
            {
                _logger.LogError("Error generating token: {Message}", ex.Message);
                throw new Exception(ex.Message);
            }
        }

        public int? ValidateToken(string token)
        {
            _logger.LogInformation("Validating token...");
            if (token == null || token.Length == 0)
            {
                _logger.LogWarning("Empty token recieved.");
                return null;
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_options.Secret);

            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero //token expires exactly at expiration time
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var userId = int.Parse(jwtToken.Claims.First(c => c.Type == "id").Value);

                _logger.LogInformation("Succesfully validate token for userid: {userId}", userId);

                return userId;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error validating token: {Message}", ex.Message);
                return null;
            }

        }

        public RefreshToken? GetRefreshToken(string ipAddress, User user)
        {
            _logger.LogInformation("Retrieving refreshToken for user {UserName} with ip {ipAddress}...", user.UserName, ipAddress);
            try
            {
                RefreshToken? refreshToken = null;
                var dbUser = _context.Users.Include(u => u.RefreshTokens).FirstOrDefault<User>(u => u.Id == user.Id);
                if (dbUser != null)
                {
                    refreshToken = dbUser.RefreshTokens.FirstOrDefault<RefreshToken>(rt => rt.IsActive && rt.Expires > DateTime.UtcNow);
                }
                if (refreshToken == null) refreshToken = GetRefreshToken(ipAddress);
                if (refreshToken == null) return null;
                return refreshToken;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error while retreiving refreshtoken for user {UserName}: {Message}", user.UserName, ex.Message);
                return null;
            }
        }

        public RefreshToken? GetRefreshToken(string ipAddress)
        {
            _logger.LogInformation("Refreshing token for ip: {ipAddress}", ipAddress);
            try
            {
                var refreshToken = new RefreshToken
                {
                    Token = getUniqueToken(),
                    Expires = DateTime.UtcNow.AddDays(_options.RefreshTokenTTL), //get life time form configuration file
                    Created = DateTime.UtcNow,
                    CreatedByIp = ipAddress
                };

                return refreshToken;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error while refreshing token for ip {ipAddress} : {Message}", ipAddress, ex.Message);
                return null;
            }

            string getUniqueToken()
            {
                _logger.LogInformation("Generating unique refresh token...");
                try
                {
                    // token is a cryptographically strong random sequence of values
                    var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
                    //chk that token is unique
                    var tokenIsUnique = !_context.Users.Any(u => u.RefreshTokens.Any(r => r.Token == token));

                    if (!tokenIsUnique) return getUniqueToken();

                    return token;
                }
                catch (Exception ex)
                {
                    _logger.LogError("Error while generating unique token: {Message}", ex.Message);
                    throw new Exception(ex.Message);
                }
            }
        }
    }
}
