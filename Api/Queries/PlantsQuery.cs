using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PlantManager.Api.Model;
using Raven.Client.Documents;
using Raven.Client.Documents.Session;

namespace PlantManager.Api.Queries
{
    public class PlantsQuery : IQuery
    {
        public ICollection<string> Ids { get; set; }

        public async Task<IReadOnlyCollection<object>> RunAsync(IState state)
        {
            if (Ids == null)
            {
                return await state.GetSession().Query<Plant>().ToListAsync();
            }

            return (await state.GetByIdsAsync<Plant>(Ids)).Values.Where(v => v != null).ToList();
        }
    }
}