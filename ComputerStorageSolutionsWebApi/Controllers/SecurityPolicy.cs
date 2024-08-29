using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ComputerStorageSolutions.Controllers
{
    public class SecurityPolicy
    {

        public const string Admin = "2F838181-4FFD-4CD1-8AF8-9953896B0E88";
        public const string User = "D8CF7302-366A-4CEF-BF70-AC974CFE48DC";


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
