using System.Collections.Generic;
using System.Threading.Tasks;
using PlantManager.Api.Model;

namespace PlantManager.Api.Behaviour
{
    public class CreatePlant : ICommand
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public async Task HandleAsync(IState state)
        {
            var plant = new Plant
            {
                Id = Id,
                Name = Name,
                Fractions = new List<Fraction>()
            };

            await state.AddAsync(plant);
        }
    }
}