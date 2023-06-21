using Microsoft.Extensions.Options;
using ClientPortal.Data;
using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.DtOs;
using ClientPortal.Helpers;
using ClientPortal.Models.RequestModels;
using ClientPortal.Models.ResponseModels;
using ClientPortal.Data.Entities;
using ClientPortal.Models;

namespace ClientPortal.Services
{
    public interface IUserService
    {
        User UpdatePortalUsers(User user);
        AuthResponse Authenticate(AuthRequest model, string ipAddress);
        AuthResponse RefreshToken(string token, string ipAddress);
        void RevokeToken(string token, string ipAddress);
        User GetUserById(int id);
        User UpdateScadaUsers(AMRScadaUserUpdateRequest user);
    }
    public class UserService : IUserService
    {
        private readonly PortalDBContext _dbContext;
        private readonly IJwtUtils _jwtUtils;
        private readonly IOptions<AppSettings> _options;
        private readonly ILogger<UserService> _logger;
        private readonly IExternalCalls _extCalls;

        public UserService(
            PortalDBContext dbContext,
            IJwtUtils jwtUtils,
            IOptions<AppSettings> options,
            ILogger<UserService> logger,
            IExternalCalls extCalls)
        {
            _dbContext = dbContext;
            _jwtUtils = jwtUtils;
            _options = options;
            _logger = logger;
            _extCalls = extCalls;
        }

        #region Authentication methods
        public AuthResponse Authenticate(AuthRequest model, string ipAddress)
        {
            _logger.LogInformation("Authenticating user: {UserName}", model.UserName);

            bool newUser = true;

            //first chk if user exist in local db
            try
            {
                if (!_dbContext.Database.CanConnect()) throw new Exception("Database not available");
                else _logger.LogInformation($"Using connection string: {_dbContext.Database.GetConnectionString()}");
                var user = _dbContext.Users.SingleOrDefault(u => u.UserName == model.UserName);

                //if user exist validate, else fetch from UMFAWeb
                if (user == null)
                {
                    _logger.LogInformation("User not found locally, fetching from UMFAWeb...");
                    string msg = ""; //used for returning messages
                    AspUserModel? aspUser = GetAspUser(model, ref msg);
                    //If null return throw exception with return result
                    if (aspUser == null) throw new AppException($"User validation for user: {model.UserName} failed: {msg.Trim()}");
                    //else set user to fetched user
                    user = new User()
                    {
                        Id = 0,
                        UmfaId = aspUser.UserId,
                        FirstName = aspUser.Name,
                        LastName = aspUser.Surname,
                        UserName = model.UserName,
                        IsAdmin = (bool)aspUser.IsSiteAdmin,
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password),
                        RoleId = 2
                    };
                }
                else //validate the user within local db
                {
                    newUser = false;
                    if (!BCrypt.Net.BCrypt.Verify(model.Password, user.PasswordHash)) //password validation failed in local db
                    {
                        //local db might be out-dated, validate remotely
                        string msg = ""; //used for returning messages
                        AspUserModel? aspUser = GetAspUser(model, ref msg);
                        //If null return throw exception with return result
                        if (aspUser == null) throw new AppException($"User validation for user: {model.UserName} failed: {msg.Trim()}");
                        //else set user to fetched user
                        _logger.LogInformation("Local db data for user {UserName} is stale, replace with new.", model.UserName);
                        newUser = true;
                        user = new User()
                        {
                            Id = 0,
                            UmfaId = aspUser.UserId,
                            FirstName = aspUser.Name,
                            LastName = aspUser.Surname,
                            UserName = model.UserName,
                            PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password),
                            RoleId = 2
                        };
                    }
                }

                //generate token for validated user
                var jwtToken = _jwtUtils.GenerateToken(user);

                if (newUser)
                {
                    var refreshToken = _jwtUtils.GetRefreshToken(ipAddress);
                    if (refreshToken != null) user.RefreshTokens = new List<RefreshToken> { refreshToken };
                }
                else
                {
                    var refreshToken = _jwtUtils.GetRefreshToken(ipAddress, user);
                    if (refreshToken != null)
                    {
                        List<RefreshToken> oldTokens = user.RefreshTokens.Where(rt => rt.Token != refreshToken.Token).ToList();
                        foreach (RefreshToken token in oldTokens)
                            if (token.IsActive)
                            {
                                token.RevokedDtm = DateTime.UtcNow;
                                token.ReplacedByToken = refreshToken.Token;
                                var isExpired = token.Expires <= DateTime.UtcNow ? ": Token Expired" : ".";
                                token.ReasonRevoked = $"New token generated{isExpired}";
                            }
                        if (!user.RefreshTokens.Any(rt => rt.Token == refreshToken.Token && rt.IsActive)) user.RefreshTokens.Add(refreshToken);
                    }
                }

                //remove old refresh tokens
                if (!newUser)
                    RemoveOldRefreshTokens(user);

                //save changes
                _dbContext.Update(user);
                _dbContext.SaveChanges();

                AuthResponse ret = new(user, jwtToken, user.RefreshTokens.FirstOrDefault<RefreshToken>(rt => rt.IsActive)?.Token);
                return ret;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error while authenticating user {user}: {message}", model.UserName, ex.Message);
                throw new ApplicationException($"Error while authenticating user {model.UserName}: {ex.Message}");
            }

        }

        public AuthResponse RefreshToken(string token, string ipAddress)
        {
            try
            {
                _logger.LogInformation("Refreshing token: {token}...", token);
                var user = GetUserByRefreshToken(token);
                if (user == null) throw new AppException("User not found");
                var refreshToken = user.RefreshTokens.Single(rt => rt.Token == token);
                if (refreshToken == null) throw new AppException("Token not found for user");

                if (refreshToken.IsRevoked)
                {
                    _logger.LogWarning($"Possible reuse attempt of revoked token");
                    //lets revoke all descendant tokens if applicable
                    RevokeDescendantTokens(refreshToken, user, ipAddress, $"Attempted reuse of revoked ancestor token: {token}");
                    _dbContext.Update(user);
                    _dbContext.SaveChanges();
                }

                if (!refreshToken.IsActive)
                {
                    _logger.LogWarning("Invalid token used:- token {token}, isExpired: {IsExpired}, revoked: {RevokedDtm}", token, refreshToken.IsExpired, refreshToken.RevokedDtm);
                    throw new AppException("Invalid token");
                }

                //rotate token
                var newReshToken = RotateRefreshToken(refreshToken, ipAddress);
                user.RefreshTokens.Add(newReshToken);

                //remove old tokens
                RemoveOldRefreshTokens(user);

                //save changes
                _dbContext.Update(user);
                _dbContext.SaveChanges();

                //generate new jwt token
                var jwtToken = _jwtUtils.GenerateToken(user);

                return new AuthResponse(user, jwtToken, newReshToken.Token);

            }
            catch (Exception ex)
            {
                _logger.LogError("Error while refreshing token {token}: {Message}", token, ex.Message);
                throw new AppException(ex.Message);
            }
        }

        public void RevokeToken(string token, string ipAddress)
        {
            _logger.LogInformation("Revoking token {token}...", token);
            try
            {
                var user = GetUserByRefreshToken(token);
                if (user == null) throw new AppException("No User associated with token {token}.", token);

                var refreshToken = user.RefreshTokens.Single(rt => rt.Token == token);
                if (refreshToken == null) throw new AppException($"Error retrieving token from user {user.UserName}");
                if (!refreshToken.IsActive) throw new AppException("Supplied token not active");

                RevokeRefreshToken(refreshToken, ipAddress, "Revoked without replacement");

                _dbContext.Update(user);
                _dbContext.SaveChanges();
            }
            catch (Exception ex)
            {
                _logger.LogError("Error revoking token token {token}: {Message}", token, ex.Message);
                throw new AppException($"Error revoking token token {token}: {ex.Message}");
            }
        }

        private RefreshToken RotateRefreshToken(RefreshToken refreshToken, string ipAddress)
        {
            var newRefreshToken = _jwtUtils.GetRefreshToken(ipAddress);
            if (newRefreshToken == null) throw new AppException("Error while rotating tokens.");
            RevokeRefreshToken(refreshToken, ipAddress, "Replaced by new token", newRefreshToken.Token);
            return newRefreshToken;
        }

        private User GetUserByRefreshToken(string token)
        {
            _logger.LogInformation("Finding user based on token initiated...");
            try
            {
                var user = _dbContext.Users.Include(u => u.RefreshTokens).SingleOrDefault(u => u.RefreshTokens.Any(rt => rt.Token == token));
                if (user != null)
                {
                    _logger.LogInformation("Found user {Username}.", user.UserName);
                    return user;
                }
                else throw new AppException("Invalid token supplied.");
            }
            catch (Exception ex)
            {
                _logger.LogError("No user find for token: {token} with error: {Message}", token, ex.Message);
                throw new AppException("Invalid token supplied.");
            }
        }

        private static void RevokeDescendantTokens(RefreshToken refreshToken, User user, string ipAddress, string reason)
        {
            if (!string.IsNullOrEmpty(refreshToken.ReplacedByToken))
            {
                var childTokens = user.RefreshTokens.Where(rt => rt.Token == refreshToken.ReplacedByToken).ToList();
                foreach (var childToken in childTokens)
                {
                    if (childToken.IsActive)
                        RevokeRefreshToken(childToken, ipAddress, reason);
                }
            }
        }

        private static void RevokeRefreshToken(RefreshToken token, string ipAddress, string? reason = null, string? replacedByToken = null)
        {
            token.RevokedDtm = DateTime.UtcNow;
            token.RevokedByIp = ipAddress;
            token.ReasonRevoked = reason;
            token.ReplacedByToken = replacedByToken;
        }

        private void RemoveOldRefreshTokens(User user)
        {
            if (user.RefreshTokens == null)
            {
                return;
            }
            try
            {
                var tokens = _dbContext.RefreshTokens.Where(
                    rt => (rt.IsExpired || (rt.RevokedDtm != null))
                    && rt.Created.AddDays(_options.Value.RefreshTokenTTL) <= DateTime.UtcNow).ToList<RefreshToken>();
                if (tokens.Count > 0)
                {
                    foreach (var token in tokens)
                    {
                        _dbContext.RefreshTokens.Remove(token);
                        _dbContext.Update(token);
                    }
                    //_dbContext.SaveChanges();
                }
                user.RefreshTokens.RemoveAll(rt => !rt.IsActive && rt.Created.AddDays(_options.Value.RefreshTokenTTL) <= DateTime.UtcNow);
            }
            catch (Exception ex)
            {
                _logger.LogError("Error removing stale tokens: {Message}", ex.Message);
                throw new Exception($"Error removing stale tokens: {ex.Message}");
            }
        }

        private AspUserModel? GetAspUser(AuthRequest model, ref string msg)
        {
            try
            {
                AspUserModel aspUser = new() { UserId = 0 };
                aspUser = Task.Run<AspUserModel>(
                    async () => await _extCalls.GetUmfaUser(new LoginUser { Username = model.UserName, Password = model.Password, DeviceId = Constants.DefaultDeviceId }))
                .Result;

                if (aspUser.UserId <= 0)
                {
                    switch (aspUser.UserId)
                    {
                        case 0: //no result from remote
                            _logger.LogInformation("Remote system did not return any results.");
                            msg += $"Remote system did not return any results.\n";
                            break;
                        case -1: //remote user not found
                            _logger.LogInformation("User {UserName} not found on UMFA Database.", model.UserName);
                            msg += $"User {model.UserName} not found on UMFA Database.\n";
                            break;
                        case -2: //remote validation failed
                            _logger.LogInformation("Remote validation failed for user {UserName}.", model.UserName);
                            msg += $"Remote validation failed for user {model.UserName}.\n";
                            break;
                        case -3: //remote error while validating, msg in name
                            _logger.LogInformation("Remote error while validating user {UserName}: {Name}.", model.UserName, aspUser.Name);
                            msg += $"Remote error while validating user {model.UserName}: {aspUser.Name}\n.";
                            break;
                        case -4: //remote user is locked
                            _logger.LogInformation("Remote user {UserName} is locked.", model.UserName);
                            msg += $"Remote user {model.UserName} is locked.\n";
                            break;
                        default:
                            _logger.LogInformation("Unexpected result while fetching user {UserName}.", model.UserName);
                            msg += $"Unexpected result while fetching user {model.UserName}.\n";
                            break;
                    }

                    return null;

                }
                else
                {
                    _logger.LogInformation("User {UserName} found and validated remotely.", model.UserName);
                    return aspUser;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("Error whie fetching user {UserName}: {Message}", model.UserName, ex.Message);
                msg += $"Error while fetching user {model.UserName}: {ex.Message}\n";
                return null;
            }
        }

        #endregion

        public User GetUserById(int id)
        {
            try
            {
                var user = _dbContext.Users.Include(u => u.AmrScadaUsers.Where(su => su.Active == true)).Where(u => u.Id == id).FirstOrDefault();
                if (user == null) throw new KeyNotFoundException($"User with Id {id} not found.");
                return user;
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }
        
        public User UpdateScadaUsers(AMRScadaUserUpdateRequest user)
        {
            _logger.LogInformation("Updating user {UserId}", user.UserId);
            try
            {
                var usr = _dbContext.Users.FirstOrDefault<User>(u => u.Id == user.UserId);
                if (usr == null) throw new ApplicationException($"User with id {user.UserId} not found");
                foreach (AMRScadaUserRequest ur in user.ScadaUsers)
                {
                    if (!usr.AmrScadaUsers.Any(u => u.Id == ur.Id))
                    {
                        var newU = new AMRScadaUser()
                        {
                            ProfileName = ur.ProfileName,
                            ScadaUserName = ur.ScadaUserName,
                            ScadaPassword = CryptoUtils.DecryptString(ur.ScadaPassword),
                            SgdUrl = ur.SGDUrl,
                            Active = ur.Active,
                            User = usr
                        };
                        usr.AmrScadaUsers.Add(newU);
                    }
                }
                _dbContext.Users.Update(usr);
                int res = _dbContext.SaveChanges();
                //if (res != 2) throw new ApplicationException($"Unexpected number of rows updated: {res}");
                return usr;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error while updating user {UserId}", user.UserId);
                throw new ApplicationException($"Error while updating user {user.UserId}: {ex.Message}");
            }
        }

        public User UpdatePortalUsers(User user)
        {
            _logger.LogInformation("Updating user {UserId}", user.Id);
            try
            {
                var usr = _dbContext.Users.FirstOrDefault<User>(u => u.Id == user.Id);
                if (usr == null) throw new ApplicationException($"User with id {user.Id} not found");
                
                _dbContext.Users.Update(usr);
                int res = _dbContext.SaveChanges();
                //if (res != 2) throw new ApplicationException($"Unexpected number of rows updated: {res}");
                return usr;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error while updating user {UserId}", user.Id);
                throw new ApplicationException($"Error while updating user {user.Id}: {ex.Message}");
            }
        }
    }
}
