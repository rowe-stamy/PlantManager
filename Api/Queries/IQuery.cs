using System.Collections.Generic;
using System.Threading.Tasks;
using PlantManager.Api.Model;

namespace PlantManager.Api.Queries
{
    public interface IQuery
    {
        Task<IReadOnlyCollection<object>> RunAsync(IState state);
    }
}