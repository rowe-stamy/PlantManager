using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PlantManager.Api.Model;

namespace PlantManager.Api.Behaviour
{
    public class UpdatePlantFractions : ICommand
    {
        public string PlantId { get; set; }

        public ICollection<Fraction> Fractions { get; set; }

        public async Task HandleAsync(IState state)
        {
            if (Fractions.Select(f => f.Id).Distinct().Count() != Fractions.Count)
            {
                throw new BusinessException(BusinessException.FractionIdMustBeUniqueOnPlant);
            }
            var plant = await state.GetByIdStrictAsync<Plant>(PlantId);
            plant.Fractions = Fractions;
        }
    }
}