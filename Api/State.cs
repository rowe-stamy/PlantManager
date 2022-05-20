using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PlantManager.Api.Model;
using Raven.Client.Documents.Session;

namespace PlantManager.Api
{
    public class State : IState, IDisposable
    {
        private readonly IAsyncDocumentSession _session;
        private readonly ICurrentRequest _currentRequest;
        private readonly IClock _clock;

        public State(IAsyncDocumentSession session, ICurrentRequest currentRequest, IClock clock)
        {
            _session = session;
            _currentRequest = currentRequest;
            _clock = clock;
        }

        public void Dispose()
        {
            _session?.Dispose();
        }

        public IAsyncDocumentSession GetSession()
        {
            return _session;
        }

        public async Task<T> GetByIdAsync<T>(string id)
        {
            if (id == null)
            {
                return default;
            }

            return await _session.LoadAsync<T>(id);
        }

        public async Task<T> GetByIdAsync<T>(string id, ICollection<string> includes)
        {
            if (id == null)
            {
                return default;
            }

            if (includes.Count == 0)
            {
                return await GetByIdAsync<T>(id);
            }

            var sessionWithIncludes = _session.Include(includes.First());
            sessionWithIncludes = includes.Skip(1).Aggregate(sessionWithIncludes, (current, i) => current.Include(i));
            return await sessionWithIncludes.LoadAsync<T>(id);
        }

        public async Task<Dictionary<string, T>> GetByIdsAsync<T>(IEnumerable<string> ids)
        {
            if (ids == null)
            {
                return new Dictionary<string, T>();
            }
            
            if (!ids.Any())
            {
                return new Dictionary<string, T>();
            }

            return await _session.LoadAsync<T>(ids);
        }

        public async Task<Dictionary<string, T>> GetByIdsAsync<T>(IEnumerable<string> ids, ICollection<string> includes)
        {
            if (includes.Count == 0)
            {
                return await GetByIdsAsync<T>(ids);
            }

            var sessionWithIncludes = _session.Include(includes.First());
            sessionWithIncludes = includes.Skip(1).Aggregate(sessionWithIncludes, (current, i) => current.Include(i));
            return await sessionWithIncludes.LoadAsync<T>(ids);
        }

        public async Task<T> GetByIdStrictAsync<T>(string id)
        {
            if (id == null)
            {
                throw new EntityNotFound<T>(null);
            }

            var entity = await _session.LoadAsync<T>(id);
            if (entity == null)
            {
                throw new EntityNotFound<T>(id);
            }

            return entity;
        }

        public async Task<T> GetByIdStrictAsync<T>(string id, ICollection<string> includes)
        {
            if (includes.Count == 0)
            {
                return await GetByIdStrictAsync<T>(id);
            }

            var sessionWithIncludes = _session.Include(includes.First());
            sessionWithIncludes = includes.Skip(1).Aggregate(sessionWithIncludes, (current, i) => current.Include(i));
            var entity = await sessionWithIncludes.LoadAsync<T>(id);
            if (entity == null)
            {
                throw new EntityNotFound<T>(id);
            }

            return entity;
        }

        public async Task AddAsync<T>(T entity)
        {
            await _session.StoreAsync(entity);
        }


        public void Delete<T>(T entity)
        {
            if (entity == null)
            {
                return;
            }

            _session.Delete(entity);
        }

        public async Task AssertEntityDoesNotExist<T>(string id)
        {
            var entity = await _session.LoadAsync<T>(id);
            if (entity != null)
            {
                throw new EntityAlreadyExists<T>(id);
            }
        }

        public DateTimeOffset GetTime()
        {
            return _clock.GetTime();
        }

        public async Task<Dictionary<string, List<object>>> SaveChangesAsync()
        {
            var currentUser = _currentRequest.GetCurrentUser();
            return await SaveChangesAsync(currentUser?.Email);
        }

        public User GetCurrentUser()
        {
            return _currentRequest.GetCurrentUser();
        }

        public async Task<Dictionary<string, List<object>>> SaveChangesAsync(string userId)
        {
            var changes = await GetChanges(userId);
            await _session.SaveChangesAsync();
            return changes;
        }

        public async Task<Dictionary<string, List<object>>> GetChanges(string userId)
        {
            var changes = _session.Advanced.WhatChanged();
            var changedEntities = await _session.LoadAsync<object>(changes.Keys.Distinct());
            var response = new Dictionary<string, List<object>>();
            foreach (var changedEntity in changedEntities.Values.Where(v => v != null))
            {
                var metaData = _session.Advanced.GetMetadataFor(changedEntity);
                var collection = metaData["@collection"] as string;
                if (collection == null)
                {
                    continue;
                }

                var modifiedDate = DateTimeOffset.UtcNow;
                if (changedEntity is Entity entity)
                {
                    entity.ModifiedBy = userId;
                    entity.ModifiedOn = modifiedDate;
                    entity.CreatedOn ??= modifiedDate;
                    entity.CreatedBy ??= userId;
                }

                var camelCaseCollection = collection.ToCamelCase();

                if (!response.ContainsKey(camelCaseCollection))
                {
                    response[camelCaseCollection] = new List<object>();
                }

                response[camelCaseCollection].Add(changedEntity);
            }

            return response;
        }
    }
}