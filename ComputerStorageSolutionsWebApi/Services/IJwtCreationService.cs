using System.Security.Claims;

namespace ComputerStorageSolutions.Services
{
    public interface IJwtCreationService
    {
        string CreateToken(string userId, string userName, string email, Guid role);
    }
}
