using Microsoft.Extensions.Options;
using ClientPortal.DtOs;
using ClientPortal.Helpers;
using System.Text.Json;

namespace ClientPortal.Services
{
    public interface IExternalCalls
    {
        public Task<AspUserModel> GetUmfaUser(LoginUser user);
    }

    public class ExternalCalls : IExternalCalls
    {
        private readonly ILogger<ExternalCalls> _logger;
        private readonly AppSettings _options;

        public ExternalCalls(ILogger<ExternalCalls> logger, IOptions<AppSettings> options)
        {
            _logger = logger;
            _options = options.Value;
        }

        public async Task<AspUserModel> GetUmfaUser(LoginUser user)
        {
            _logger.LogInformation("Validating login user against umfa database");
            try
            {
                using var httpClient = new HttpClient();
                using var response = await httpClient.PostAsJsonAsync<LoginUser>($"{_options.UmfaWebAPIURL}\\{Constants.UmfaUserUrl}", user, CancellationToken.None);
                string apiResponse = await response.Content.ReadAsStringAsync();
                AspUserModel? umfaUser = JsonSerializer.Deserialize<AspUserModel>(apiResponse);
                if (umfaUser == null) throw new ApplicationException($"Error while mapping user");
                else return umfaUser;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error while validating umfa user: {Message}", ex.Message);
                throw new ApplicationException($"Error in process GetUmfaUser: {ex.Message}");
            }
        }
    }
}
