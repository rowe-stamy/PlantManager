namespace PlantManager.Api.Model
{
    public class Extraction : Entity
    {
        public string PlantId { get; set; }

        public string FractionId { get; set; }

        public string ChargeId { get; set; }

        public decimal WeightInKg { get; set; }

        public string Comment { get; set; }
    }
}