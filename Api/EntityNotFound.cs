namespace PlantManager.Api
{
    public class EntityNotFound<T> : BusinessException
    {
        public EntityNotFound(string id) : base($"entity {typeof(T).Name} with id {id ?? "null"} not found")
        {
        }
    }
}