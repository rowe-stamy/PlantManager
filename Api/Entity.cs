using System;

namespace PlantManager.Api
{
    public class Entity
    {
        public string Id { get; set; }

        public DateTimeOffset? CreatedOn { get; set; }

        public string CreatedBy { get; set; }

        public DateTimeOffset ModifiedOn { get; set; }

        public string ModifiedBy { get; set; }
    }
}