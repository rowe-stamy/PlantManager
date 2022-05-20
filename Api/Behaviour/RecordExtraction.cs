using System;
using System.Threading.Tasks;
using PlantManager.Api.DomainEvents;
using PlantManager.Api.Model;

namespace PlantManager.Api.Behaviour
{
    public class RecordExtraction : ICommand
    {
        public string ExtractionId { get; set; }

        public string PlantId { get; set; }

        public string FractionId { get; set; }

        public decimal WeightInKg { get; set; }

        public string Comment { get; set; }

        public async Task HandleAsync(IState state)
        {
            var plant = await state.GetByIdAsync<Plant>(PlantId);
            var chargeId = plant.GetChargeIdForFraction(FractionId);
            if (chargeId == null)
            {
                throw new BusinessException(BusinessException.ChargeNotFound);
            }
            var extraction = new Extraction
            {
                Id = ExtractionId,
                PlantId = PlantId,
                FractionId = FractionId,
                ChargeId = chargeId,
                WeightInKg = WeightInKg,
                Comment = Comment
            };

            await state.AddAsync(extraction);
            await state.AddAsync(new ExtractionRecordedEvent
            {
                Id = DomainEvent.GenerateId(),
                ExtractionId = extraction.Id
            });
        }
    }
}