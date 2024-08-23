using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ComputerStorageSolutions.Controllers
{
    public class SecurityPolicy
    {

        public const string Admin = "2F838181-4FFD-4CD1-8AF8-9953896B0E88";
        public const string User = "BC39DC2C-AC04-4D9F-8361-7E4744DE7B5D";


        public static AuthorizationPolicy AdminPolicy()
        {
            var builder = new AuthorizationPolicyBuilder();
            AuthorizationPolicy policy = builder.RequireAuthenticatedUser().RequireRole(Admin.ToLower()).Build();
            return policy;
        }

        public static AuthorizationPolicy UserPolicy()
        {
            var builder = new AuthorizationPolicyBuilder();
            AuthorizationPolicy policy = builder.RequireAuthenticatedUser().RequireRole(User.ToLower()).Build();
            return policy;
        }
    }
}
