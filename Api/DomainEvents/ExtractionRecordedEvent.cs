namespace PlantManager.Api.DomainEvents
{
    public class ExtractionRecordedEvent : DomainEvent
    {
        public string ExtractionId { get; set; }
    }
}