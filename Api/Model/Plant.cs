using System.Collections.Generic;
using System.Linq;

namespace PlantManager.Api.Model
{
    public class Plant : Entity
    {
        public string Name { get; set; }

        public ICollection<Fraction> Fractions { get; set; }

        public string GetChargeIdForFraction(string fractionId)
        {
            return Fractions.FirstOrDefault(f => f.Id == fractionId)?.ChargeId;
        }
    }
}