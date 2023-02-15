using AutoMapper;
using ClientPortal.Data.Entities;

namespace ClientPortal.Data.Repositories
{
    public interface IAMRScadaUserRepository
    {
        Task<IEnumerable<AMRScadaUser>> GetAll();
        Task<AMRScadaUser> GetById(int id);
        Task<IEnumerable<AMRScadaUser>> GetAllforUser(int userId);
        Task<AMRScadaUser> Edit(AMRScadaUser user, int userId);
        Task<AMRScadaUser> Edit(AMRScadaUser user);
    }
    public class AMRScadaUserRepository : IAMRScadaUserRepository
    {
        private readonly ILogger<AMRScadaUserRepository> _logger;
        private readonly PortalDBContext _context;

        public AMRScadaUserRepository(
            ILogger<AMRScadaUserRepository> logger,
            PortalDBContext context,
            IMapper mapper)
        {
            _logger = logger;
            _context = context;
        }

        public async Task<IEnumerable<AMRScadaUser>> GetAll()
        {
            try
            {
                var ret = await _context.AMRScadaUsers.ToListAsync();
                return ret;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while retrieving AMR Scada Users: {ex.Message}");
                throw new ApplicationException($"Error while retrieving AMR Scada Users: {ex.Message}");
            }
        }

        public async Task<IEnumerable<AMRScadaUser>> GetAllforUser(int userId)
        {
            try
            {
                var ret = await _context.AMRScadaUsers.Where(su => su.User.Id == userId && su.Active).ToListAsync();
                return ret;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while retrieving AMR Scada Users for user {userId}: {ex.Message}");
                throw new ApplicationException($"Error while retrieving AMR Scada Users for user {userId}: {ex.Message}");
            }
        }

        public async Task<AMRScadaUser> GetById(int id)
        {
            try
            {
                var scadaUser = await _context.AMRScadaUsers.FindAsync(id);
                if (scadaUser == null) throw new Exception($"AMRScadaUser with id {id} not found");
                return scadaUser;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving AMRScadaUser by id for id {id}: {ex.Message}");
                throw new ApplicationException($"Error retrieving AMRScadaUser by id for id {id}: {ex.Message}");
            }
        }

        public async Task<AMRScadaUser> Edit(AMRScadaUser user, int userId)
        {
            try
            {
                AMRScadaUser retUsr = new();
                if (user == null) throw new ApplicationException("Empty user object recieved");
                var usr = await _context.Users.FindAsync(userId);
                if (usr == null || userId == 0) throw new ApplicationException($"Invalid userId supplied");
                user.User = usr;
                if (user.Id == 0) //new user
                {
                    _context.Add(user);
                    retUsr = user;
                }
                else //existing user
                {
                    var findUsr = await _context.AMRScadaUsers.FindAsync(user.Id);
                    if (findUsr != null) retUsr = findUsr;
                    if (retUsr == null || retUsr.Id == 0) throw new ApplicationException($"Amr scada user with id {user.Id} not found");
                    if (retUsr.ProfileName != user.ProfileName) retUsr.ProfileName = user.ProfileName;
                    if (retUsr.ScadaUserName != user.ScadaUserName) retUsr.ScadaUserName = user.ScadaUserName;
                    if (retUsr.ScadaPassword != user.ScadaPassword) retUsr.ScadaPassword = retUsr.ScadaPassword; // user.ScadaPassword;
                    if (retUsr.SgdUrl != user.SgdUrl) retUsr.SgdUrl = user.SgdUrl;
                    if (retUsr.Active != user.Active) retUsr.Active = user.Active;
                }
                var ret = await _context.SaveChangesAsync();
                return retUsr;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating/adding amr scada user {user?.ScadaUserName ?? "No user recieved"} with id {user?.Id ?? 0}: {ex.Message}");
                throw new ApplicationException($"Error updating/adding amr scada user {user?.ScadaUserName ?? "No user recieved"} with id {user?.Id ?? 0}: {ex.Message}");
            }
        }

        public async Task<AMRScadaUser> Edit(AMRScadaUser user)
        {
            try
            {
                AMRScadaUser? retUsr = null;
                if (user == null) throw new ApplicationException("Empty user object recieved");
                retUsr = await _context.AMRScadaUsers.FindAsync(user.Id);
                if (retUsr == null) throw new ApplicationException($"Amr scada user with id {user.Id} not found");
                if (retUsr.ScadaPassword != user.ScadaPassword) retUsr.ScadaPassword = user.ScadaPassword;
                var ret = await _context.SaveChangesAsync();
                return retUsr;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating/adding amr scada user {user?.ScadaUserName ?? "No user recieved"} with id {user?.Id ?? 0}: {ex.Message}");
                throw new ApplicationException($"Error updating/adding amr scada user {user?.ScadaUserName ?? "No user recieved"} with id {user?.Id ?? 0}: {ex.Message}");
            }
        }

    }
}
