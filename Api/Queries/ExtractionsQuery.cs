using System.Collections.Generic;
using System.Threading.Tasks;
using PlantManager.Api.Model;
using Raven.Client.Documents;
using Raven.Client.Documents.Linq;

namespace PlantManager.Api.Queries
{
    public class ExtractionsQuery : IQuery
    {
        public string PlantId { get; set; }

        public async Task<IReadOnlyCollection<object>> RunAsync(IState state)
        {
            return await state.GetSession().Query<Extraction>().Where(e => e.PlantId == PlantId).OrderByDescending(e => e.CreatedOn).ToListAsync();
        }
    }
}