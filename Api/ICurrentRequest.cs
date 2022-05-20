using PlantManager.Api.Model;

namespace PlantManager.Api
{
    public interface ICurrentRequest
    {
        User GetCurrentUser();
    }
}