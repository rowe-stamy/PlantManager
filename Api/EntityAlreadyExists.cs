namespace PlantManager.Api
{
    public class EntityAlreadyExists<T> : BusinessException
    {
        public EntityAlreadyExists(string id) : base($"entity {nameof(T)} with id {id} already exists")
        {
        }
    }
}