using PlantManager.Api.Model;

namespace PlantManager.Api
{
    public class PermissionsContext
    {
        public User CurrentUser { get; set; }

        public User OriginalUser { get; set; }
    }
}