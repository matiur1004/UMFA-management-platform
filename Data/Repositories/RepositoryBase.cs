namespace ClientPortal.Data.Repositories
{
    public interface IRepository<TTable>
    {
        public Task<List<TTable>> GetAll();
        public Task<TTable> Get(int id);
        public Task<TTable> Add(TTable entity);
        public Task<TTable> Update(TTable entity);
        public Task<TTable> Remove(int id);
    }

    public abstract class RepositoryBase<T, TContext> : IRepository<T> where TContext : DbContext where T : class // TODO a model base class would be better
    {
        private readonly ILogger<RepositoryBase<T, TContext>> _logger;
        private readonly TContext _dbContext;

        protected RepositoryBase(ILogger<RepositoryBase<T, TContext>> logger, TContext dbContext)
        {
            _logger = logger;
            _dbContext = dbContext;
        }
        public async Task<T> Add(T entity)
        {
            _logger.LogInformation($"Adding new {typeof(T).Name}");

            var tableExists = _dbContext.Model.FindEntityType(typeof(T).Name) != null;

            if (!tableExists)
            {
                _logger.LogError($"{typeof(T).Name} Table is Not Found");
                return default;
            }

            var createdModel = _dbContext.Add(entity);

            await _dbContext.SaveChangesAsync();

            _logger.LogInformation($"{typeof(T).Name} Saved Successfully!");

            return createdModel.Entity;
        }

        public async Task<T> Get(int id)
        {
            _logger.LogInformation($"Retrieving {typeof(T).Name} with Id: {id}");

            var tableExists = _dbContext.Model.FindEntityType(typeof(T).Name) != null;

            if (!tableExists)
            {
                _logger.LogError($"{typeof(T).Name} Table is Not Found");
                return null;
            }

            var entity = await _dbContext.Set<T>().FindAsync(id);

            if (entity == null)
            {
                _logger.LogError($"{typeof(T).Name} with Id: {id} Not Found!");
                return null;
            }

            _logger.LogInformation($"{typeof(T).Name} with Id: {id} Found and Returned!");
            return entity;
        }

        public async Task<List<T>> GetAll()
        {
            _logger.LogInformation($"Retrieving all {typeof(T).Name}s");

            var tableExists = _dbContext.Model.FindEntityType(typeof(T).Name) != null;

            if (!tableExists)
            {
                _logger.LogError($"{typeof(T).Name}s Table is Not Found");
                return null;
            }

            _logger.LogInformation($"All {typeof(T).Name}s returned.");
            return await _dbContext.Set<T>().ToListAsync();
        }

        public async Task<T> Remove(int id)
        {
            _logger.LogInformation($"Removing {typeof(T).Name} with Id: {id}");

            var tableExists = _dbContext.Model.FindEntityType(typeof(T).Name) != null;

            if (!tableExists)
            {
                _logger.LogError($"{typeof(T).Name} Table is Not Found");
                return null;
            }

            var entity = await _dbContext.Set<T>().FindAsync(id);

            if (entity == null)
            {
                _logger.LogError($"{typeof(T).Name} with Id: {id} Not Found!");
                return null;
            }

            _dbContext.Set<T>().Remove(entity);
            await _dbContext.SaveChangesAsync();

            _logger.LogInformation($"{typeof(T).Name} with Id: {id} removed successfully");
            return entity;
        }

        public async Task<T> Update(T entity)
        {
            _logger.LogInformation($"Updating {typeof(T).Name}");

            var tableExists = _dbContext.Model.FindEntityType(typeof(T).Name) != null;

            if (!tableExists)
            {
                _logger.LogError($"{typeof(T).Name} Table is Not Found");
                return null;
            }

            _dbContext.Update(entity);

            try
            {
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                _logger.LogError($"{typeof(T).Name} could not be updated!");
                return null;
            }

            _logger.LogInformation($"{typeof(T).Name} updated successfully");
            return entity;
        }
    }
}
