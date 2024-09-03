using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ComputerStorageSolutions.Controllers
{
    public class SecurityPolicy
    {

        public const string Admin = "9C06200D-5AF1-4B14-BB74-9364B10977FE";
        public const string User = "0075B723-F0B5-4B6A-96A6-C46BC4EB4A98";


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
