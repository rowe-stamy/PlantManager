using System.Threading.Tasks;
using PlantManager.Api.Model;

namespace PlantManager.Api.Behaviour
{
    public class RenamePlant : ICommand
    {
        public string PlantId { get; set; }

        public string Name { get; set; }

        public async Task HandleAsync(IState state)
        {
            var plant = await state.GetByIdStrictAsync<Plant>(PlantId);
            plant.Name = Name;
        }
    }
}