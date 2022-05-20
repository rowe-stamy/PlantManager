using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using PlantManager.Api.Model;
using Raven.Client.Documents.Session;

namespace PlantManager.Api
{
    public interface IState
    {
        IAsyncDocumentSession GetSession();
        Task<T> GetByIdAsync<T>(string id);

        Task<T> GetByIdAsync<T>(string id, ICollection<string> includes);

        Task<Dictionary<string, T>> GetByIdsAsync<T>(IEnumerable<string> ids);

        Task<Dictionary<string, T>> GetByIdsAsync<T>(IEnumerable<string> ids, ICollection<string> includes);

        Task<T> GetByIdStrictAsync<T>(string id);

        Task<T> GetByIdStrictAsync<T>(string id, ICollection<string> includes);


        Task AddAsync<T>(T entity);

        void Delete<T>(T entity);

        Task AssertEntityDoesNotExist<T>(string id);

        DateTimeOffset GetTime();

        Task<Dictionary<string, List<object>>> SaveChangesAsync();

        User GetCurrentUser();
    }
}