using Dapper;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Linq.Expressions;

namespace ClientPortal.Data.Repositories
{
    public interface IRepository<TTable>
    {
        public Task<List<TTable>> GetAllAsync();
        public Task<List<TTable>> GetAllAsync(params Expression<Func<TTable, object>>[] includes);
        public Task<List<TTable>> GetAllAsync(Expression<Func<TTable, bool>> conditions, params Expression<Func<TTable, object>>[] includes);
        public Task<TTable> GetAsync(int id);
        public Task<TTable> GetAsync(int id, string keyPropertyName, params Expression<Func<TTable, object>>[] includes);
        public Task<TTable> GetAsync(Expression<Func<TTable, bool>> conditions, params Expression<Func<TTable, object>>[] includes);
        public Task<TTable> AddAsync(TTable entity);
        public Task<TTable> UpdateAsync(TTable entity);
        public Task<TTable> RemoveAsync(int id);
        public Task<T> RunStoredProcedureAsync<T, TArgumentClass>(string procedure, TArgumentClass? args = default) where T : new();
        public Task RunStoredProcedureAsync<TArgumentClass>(string procedure, TArgumentClass? args = default);
        public int? Count(Expression<Func<TTable, bool>> conditions, params Expression<Func<TTable, object>>[] includes);
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
        public async Task<T> RunStoredProcedureAsync<T, TArgumentClass>(string procedure, TArgumentClass? args = default) where T : new()
        {
            var connection = _dbContext.Database.GetDbConnection();
            if (connection.State == System.Data.ConnectionState.Closed)
                await connection.OpenAsync();

            string commandText = $"exec {procedure}";

            // add arguments
            if (args is not null)
            {
                var argumentProperties = typeof(TArgumentClass).GetProperties();

                var arguments = string.Join(", ", argumentProperties.Select(property =>
                {
                    var value = property.GetValue(args);
                    if (value is int || value is bool)
                    {
                        int intValue = (value is bool bit) ? (bit ? 1 : 0) : Convert.ToInt32(value);
                        return $"@{property.Name} = {intValue}";
                    }
                    else
                    {
                        return $"@{property.Name} = '{value}'";
                    }
                }));

                commandText += $" {arguments}";
            }

            using (var results = await connection.QueryMultipleAsync(commandText))
            {
                if (results == null)
                {
                    _logger.LogError($"Not time to run yet...");
                    return default(T);
                }

                var combinedResult = new T();

                foreach (var property in typeof(T).GetProperties())
                {
                    if (property.PropertyType.IsGenericType && property.PropertyType.GetGenericTypeDefinition() == typeof(List<>))
                    {
                        var resultType = property.PropertyType.GetGenericArguments()[0];
                        var result = await results.ReadAsync(resultType);
                        var resultList = JsonConvert.DeserializeObject(JsonConvert.SerializeObject(result), property.PropertyType);
                        property.SetValue(combinedResult, resultList);
                    }
                }

                return combinedResult;
            }
        }

        public async Task RunStoredProcedureAsync<TArgumentClass>(string procedure, TArgumentClass? args = default)
        {
            var connection = _dbContext.Database.GetDbConnection();
            if (connection.State == System.Data.ConnectionState.Closed)
                await connection.OpenAsync();

            string commandText = $"exec {procedure}";

            // add arguments
            if (args is not null)
            {
                var argumentProperties = typeof(TArgumentClass).GetProperties();

                var arguments = string.Join(", ", argumentProperties.Select(property =>
                {
                    var value = property.GetValue(args);
                    if (value is int || value is bool)
                    {
                        int intValue = (value is bool bit) ? (bit ? 1 : 0) : Convert.ToInt32(value);
                        return $"@{property.Name} = {intValue}";
                    }
                    else
                    {
                        return $"@{property.Name} = '{value}'";
                    }
                }));

                commandText += $" {arguments}";
            }

            using (var results = await connection.QueryMultipleAsync(commandText))
            {
                if (results == null)
                {
                    _logger.LogError($"Not time to run yet...");
                    return;
                }

                return;
            }
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

            // Apply includes to the query if any are specified
            if (includes != null && includes.Length > 0)
            {
                foreach (var include in includes)
                {
                    query = query.Include(include);
                }
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

        public async Task<TTable> GetAsync(Expression<Func<TTable, bool>> conditions, params Expression<Func<TTable, object>>[] includes)
        {
            var tableExists = _dbContext.Model.FindEntityType(typeof(TTable)) != null;

            if (!tableExists)
            {
                _logger.LogError($"{typeof(TTable).Name} Table is Not Found");
                return null;
            }

            var query = _dbContext.Set<TTable>().AsQueryable();

            // Apply includes to the query if any are specified
            if (includes != null && includes.Length > 0)
            {
                foreach (var include in includes)
                {
                    query = query.Include(include);
                }
            }

            var entity = await query.Where(conditions).FirstOrDefaultAsync();

            _logger.LogInformation($"Returning entity matching conditions from {typeof(TTable).Name} entities matched the conditions.");
            return entity;
        }

        public int? Count(Expression<Func<TTable, bool>> conditions, params Expression<Func<TTable, object>>[] includes)
        {
            var tableExists = _dbContext.Model.FindEntityType(typeof(TTable)) != null;

            if (!tableExists)
            {
                _logger.LogError($"{typeof(TTable).Name} Table is Not Found");
                return null;
            }

            var query = _dbContext.Set<TTable>().AsQueryable();

            // Apply includes to the query if any are specified
            if (includes != null && includes.Length > 0)
            {
                foreach (var include in includes)
                {
                    query = query.Include(include);
                }
            }

            var count = query.Where(conditions).Count();

            _logger.LogInformation($"Returning count matching conditions from {typeof(TTable).Name}. {count} entities matched the conditions.");
            return count;
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

            // Apply includes to the query if any are specified
            if (includes != null && includes.Length > 0)
            {
                foreach (var include in includes)
                {
                    query = query.Include(include);
                }
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

        public async Task<List<TTable>> GetAllAsync(Expression<Func<TTable, bool>> conditions, params Expression<Func<TTable, object>>[] includes)
        {
            var tableExists = _dbContext.Model.FindEntityType(typeof(TTable)) != null;

            if (!tableExists)
            {
                _logger.LogError($"{typeof(TTable).Name} Table is Not Found");
                return null;
            }

            var query = _dbContext.Set<TTable>().AsQueryable();

            // Apply includes to the query if any are specified
            if (includes != null && includes.Length > 0)
            {
                foreach (var include in includes)
                {
                    query = query.Include(include);
                }
            }

            var entities = await query.Where(conditions).ToListAsync();

            _logger.LogInformation($"{entities.Count} {typeof(TTable).Name} entities matched the conditions.");
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
