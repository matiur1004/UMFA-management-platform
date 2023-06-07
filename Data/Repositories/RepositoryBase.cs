using System.Linq.Expressions;

namespace ClientPortal.Data.Repositories
{
    public interface IRepository<TTable>
    {
        public Task<List<TTable>> GetAllAsync();
        public Task<List<TTable>> GetAllAsync(params Expression<Func<TTable, object>>[] includes);
        public Task<TTable> GetAsync(int id);
        public Task<TTable> GetAsync(int id, string keyPropertyName, params Expression<Func<TTable, object>>[] includes);
        public Task<TTable> AddAsync(TTable entity);
        public Task<TTable> UpdateAsync(TTable entity);
        public Task<TTable> RemoveAsync(int id);
        
    }

    public abstract class RepositoryBase<TTable, TContext> : IRepository<TTable> where TContext : DbContext where TTable : class // TODO a model base class would be better
    {
        private readonly ILogger<RepositoryBase<TTable, TContext>> _logger;
        private readonly TContext _dbContext;

        protected RepositoryBase(ILogger<RepositoryBase<TTable, TContext>> logger, TContext dbContext)
        {
            _logger = logger;
            _dbContext = dbContext;
        }
        public async Task<TTable> AddAsync(TTable entity)
        {
            _logger.LogInformation($"Adding new {typeof(TTable).Name}");

            var tableExists = _dbContext.Model.FindEntityType(typeof(TTable)) != null;

            if (!tableExists)
            {
                _logger.LogError($"{typeof(TTable).Name} Table is Not Found");
                return default;
            }

            var createdModel = _dbContext.Add(entity);

            await _dbContext.SaveChangesAsync();

            _logger.LogInformation($"{typeof(TTable).Name} Saved Successfully!");

            return createdModel.Entity;
        }

        public async Task<TTable> GetAsync(int id)
        {
            _logger.LogInformation($"Retrieving {typeof(TTable).Name} with Id: {id}");

            var tableExists = _dbContext.Model.FindEntityType(typeof(TTable)) != null;

            if (!tableExists)
            {
                _logger.LogError($"{typeof(TTable).Name} Table is Not Found");
                return null;
            }

            var entity = await _dbContext.Set<TTable>().FindAsync(id);

            if (entity == null)
            {
                _logger.LogError($"{typeof(TTable).Name} with Id: {id} Not Found!");
                return null;
            }

            _logger.LogInformation($"{typeof(TTable).Name} with Id: {id} Found and Returned!");
            return entity;
        }
        public async Task<TTable> GetAsync(int id, string keyPropertyName, params Expression<Func<TTable, object>>[] includes)
        {
            _logger.LogInformation($"Retrieving {typeof(TTable).Name} with Id: {id}");

            var tableExists = _dbContext.Model.FindEntityType(typeof(TTable)) != null;

            if (!tableExists)
            {
                _logger.LogError($"{typeof(TTable).Name} Table is Not Found");
                return null;
            }

            var query = _dbContext.Set<TTable>().AsQueryable();

            // Apply includes to the query
            foreach (var include in includes)
            {
                query = query.Include(include);
            }

            // Get the key property using reflection
            var keyProperty = typeof(TTable).GetProperty(keyPropertyName);
            if (keyProperty == null)
            {
                _logger.LogError($"{typeof(TTable).Name} does not have a property with the name {keyPropertyName}");
                return null;
            }

            // Create the expression to compare the key property
            var parameter = Expression.Parameter(typeof(TTable), "e");
            var propertyAccess = Expression.MakeMemberAccess(parameter, keyProperty);
            var equality = Expression.Equal(propertyAccess, Expression.Constant(id));
            var lambda = Expression.Lambda<Func<TTable, bool>>(equality, parameter);

            var entity = await query.FirstOrDefaultAsync(lambda);

            if (entity == null)
            {
                _logger.LogError($"{typeof(TTable).Name} with Id: {id} Not Found!");
                return null;
            }

            _logger.LogInformation($"{typeof(TTable).Name} with Id: {id} Found and Returned!");
            return entity;
        }


        public async Task<List<TTable>> GetAllAsync()
        {
            _logger.LogInformation($"Retrieving all {typeof(TTable).Name}s");

            var tableExists = _dbContext.Model.FindEntityType(typeof(TTable)) != null;

            if (!tableExists)
            {
                _logger.LogError($"{typeof(TTable).Name}s Table is Not Found");
                return null;
            }

            _logger.LogInformation($"All {typeof(TTable).Name}s returned.");
            return await _dbContext.Set<TTable>().ToListAsync();
        }

        public async Task<List<TTable>> GetAllAsync(params Expression<Func<TTable, object>>[] includes)
        {
            _logger.LogInformation($"Retrieving all {typeof(TTable).Name}s");

            var tableExists = _dbContext.Model.FindEntityType(typeof(TTable)) != null;

            if (!tableExists)
            {
                _logger.LogError($"{typeof(TTable).Name} Table is Not Found");
                return null;
            }

            var query = _dbContext.Set<TTable>().AsQueryable();

            // Apply includes to the query
            foreach (var include in includes)
            {
                query = query.Include(include);
            }

            var entities = await query.ToListAsync();

            if (entities == null)
            {
                _logger.LogError($"Could not retrieve from {typeof(TTable).Name}");
                return null;
            }

            _logger.LogInformation($"All {typeof(TTable).Name}s returned.");
            return entities;
        }

        public async Task<TTable> RemoveAsync(int id)
        {
            try
            {
                _logger.LogInformation($"Removing {typeof(TTable).Name} with Id: {id}");

                var tableExists = _dbContext.Model.FindEntityType(typeof(TTable)) != null;

                if (!tableExists)
                {
                    _logger.LogError($"{typeof(TTable).Name} Table is Not Found");
                    return null;
                }

                var entity = await _dbContext.Set<TTable>().FindAsync(id);

                if (entity == null)
                {
                    _logger.LogError($"{typeof(TTable).Name} with Id: {id} Not Found!");
                    return null;
                }

                _dbContext.Set<TTable>().Remove(entity);
                await _dbContext.SaveChangesAsync();

                _logger.LogInformation($"{typeof(TTable).Name} with Id: {id} removed successfully");
                return entity;
            }
            catch (DbUpdateException e)
            {
                _logger.LogError($"Could not delete from {typeof(TTable).Name} Id: {id} Error: {e.Message}");
                return null;
            }
        }

        public async Task<TTable> UpdateAsync(TTable entity)
        {
            _logger.LogInformation($"Updating {typeof(TTable).Name}");

            var tableExists = _dbContext.Model.FindEntityType(typeof(TTable)) != null;

            if (!tableExists)
            {
                _logger.LogError($"{typeof(TTable).Name} Table is Not Found");
                return null;
            }

            _dbContext.Update(entity);

            try
            {
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                _logger.LogError($"{typeof(TTable).Name} could not be updated!");
                return null;
            }

            _logger.LogInformation($"{typeof(TTable).Name} updated successfully");
            return entity;
        }

    }
}
