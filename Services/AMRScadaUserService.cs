using AutoMapper;
using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.Data.Repositories;
using ClientPortal.Helpers;
using ClientPortal.Models.RequestModels;
using ClientPortal.Models.ResponseModels;

namespace ClientPortal.Services
{
    public interface IAMRScadaUserService
    {
        Task<IEnumerable<AMRScadaUserResponse>> GetAll();
        Task<AMRScadaUserResponse> GetById(int id);
        Task<IEnumerable<AMRScadaUserResponse>> GetAllforUser(int userId);
        Task<AMRScadaUserResponse> Update(AMRScadaUserRequest user, int userId);
        Task<AMRScadaUserResponse> Update(AMRScadaUserRequest user);
        string Decrypt(string value);
        string Encrypt(string value);
    }

    public class AMRScadaUserService : IAMRScadaUserService
    {
        private readonly ILogger<AMRScadaUserService> _logger;
        private readonly IAMRScadaUserRepository _asuRepo;
        private readonly IMapper _mapper;

        public AMRScadaUserService(ILogger<AMRScadaUserService> logger, IAMRScadaUserRepository repo, IMapper mapper)
        {
            _logger = logger;
            _asuRepo = repo;
            _mapper = mapper;
        }

        public async Task<IEnumerable<AMRScadaUserResponse>> GetAll()
        {
            try
            {
                _logger.LogInformation($"Fetching amr scada users");
                var result = await _asuRepo.GetAll();
                var ret = _mapper.Map<List<AMRScadaUserResponse>>(result);
                return ret;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while getting amr scda users: {ex.Message}");
                throw new ApplicationException($"Error while getting amr scda users: {ex.Message}");
            }
        }

        public async Task<AMRScadaUserResponse> GetById(int id)
        {
            try
            {
                _logger.LogInformation($"Fetching AMRScadaUser with id {id}");
                var ret = await _asuRepo.GetById(id);
                AMRScadaUserResponse resp = _mapper.Map<AMRScadaUserResponse>(ret);
                return resp;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while fetching AMRScadaUser with id {id}: {ex.Message}");
                throw new ApplicationException($"Error while fetching AMRScadaUser with id {id}: {ex.Message}");
            }
        }

        public async Task<IEnumerable<AMRScadaUserResponse>> GetAllforUser(int userId)
        {
            try
            {
                _logger.LogInformation($"Fetching amr scada users for user {userId}");
                var result = await _asuRepo.GetAllforUser(userId);
                var ret = _mapper.Map<List<AMRScadaUserResponse>>(result);
                return ret;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while getting amr scda user for user {userId}: {ex.Message}");
                throw new ApplicationException($"Error while getting amr scda user for user {userId}: {ex.Message}");
            }
        }

        public async Task<AMRScadaUserResponse> Update(AMRScadaUserRequest user, int userId)
        {
            try
            {
                if (user == null) throw new ApplicationException("Empty object recieved");
                var scadaUser = _mapper.Map<AMRScadaUser>(user);
                scadaUser = await _asuRepo.Edit(scadaUser, userId);
                var retUsr = _mapper.Map<AMRScadaUserResponse>(scadaUser);
                return retUsr;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error saving amr scada user {user?.ScadaUserName ?? "Empty object"}: {ex.Message}");
                throw new ApplicationException($"Error saving amr scada user {user?.ScadaUserName ?? "Empty object"}: {ex.Message}");
            }
        }

        public async Task<AMRScadaUserResponse> Update(AMRScadaUserRequest user)
        {
            try
            {
                if (user == null) throw new ApplicationException("Empty object recieved");
                user.ScadaPassword = CryptoUtils.EncryptString(user.ScadaPassword);
                var scadaUser = _mapper.Map<AMRScadaUser>(user);
                scadaUser = await _asuRepo.Edit(scadaUser);
                var retUsr = _mapper.Map<AMRScadaUserResponse>(scadaUser);
                return retUsr;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error saving amr scada user {user?.ScadaUserName ?? "Empty object"}: {ex.Message}");
                throw new ApplicationException($"Error saving amr scada user {user?.ScadaUserName ?? "Empty object"}: {ex.Message}");
            }
        }

        public string Decrypt(string value)
        {
            return CryptoUtils.DecryptString(value);
        }

        public string Encrypt(string value)
        {
            return CryptoUtils.EncryptString(value);
        }
    }
}
