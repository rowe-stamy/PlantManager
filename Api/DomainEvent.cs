using System;

namespace PlantManager.Api
{
    public class DomainEvent : Entity
    {
        public bool IsHandled { get; set; }

        public string TenantId { get; set; }

        public DateTimeOffset? ScheduleTime { get; set; }

        public bool IsCancelled { get; set; }

        public static string GenerateId()
        {
            return $"{IdPrefix}-{Guid.NewGuid()}";
        }

        public static string IdPrefix => "domain-event";
    }
}