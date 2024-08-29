using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ComputerStorageSolutions.Controllers
{
    public class SecurityPolicy
    {

        public const string Admin = "9DFB14D0-0311-417C-A93F-ABD781AABDE2";
        public const string User = "572EBC78-233F-4EFC-80F5-39C07264BD85";


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
