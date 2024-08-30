using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

public interface IJwtService
{
    string GetUserIdFromToken(string token);
}

public class TokenService : IJwtService
{
    public string GetUserIdFromToken(string token)
    {
        var handler = new JwtSecurityTokenHandler();
        var jwtToken = (handler.ReadToken(token) as JwtSecurityToken)!;

        // Extract userId from the claims
        var userIdClaim = jwtToken.Claims.FirstOrDefault(claim => claim.Type == "UserId")!;
        return userIdClaim.Value; // Return userId if exists
    }
}