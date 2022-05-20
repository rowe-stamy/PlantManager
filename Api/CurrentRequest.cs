using System.Security.Claims;
using PlantManager.Api.Model;
using Microsoft.AspNetCore.Http;

namespace PlantManager.Api
{
    public class CurrentRequest : ICurrentRequest
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentRequest(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public User GetCurrentUser()
        {
            var httpContextUser = _httpContextAccessor?.HttpContext?.User;

            if (httpContextUser == null)
            {
                return null;
            }


            return httpContextUser.Identity != null && !httpContextUser.Identity.IsAuthenticated
                ? null
                : new User
                {
                    Name =  httpContextUser.FindFirstValue("name"),
                    Email = httpContextUser.FindFirstValue(ClaimTypes.Email)
                };
        }
    }
}