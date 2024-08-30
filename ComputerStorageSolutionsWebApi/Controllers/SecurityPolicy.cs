using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ComputerStorageSolutions.Controllers
{
    public class SecurityPolicy
    {

        public const string Admin = "Admin";
        public const string User = "Customer";


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
