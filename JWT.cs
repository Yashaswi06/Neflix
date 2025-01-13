using Microsoft.IdentityModel.Tokens;
using neflix.Model;
using neflix.Servcies;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace neflix
{
    public static class JWT
    {
        public static string HashPassword(this UserService userRepository, string password)
        {
            var hashpassword = BCrypt.Net.BCrypt.HashPassword(password);
            Console.WriteLine(hashpassword);
            return hashpassword;
        }

        public static bool VerifyPassword(this UserService userRepository, string inputPassword, string storedPasswordHash)
        {
            bool isvalidPass = BCrypt.Net.BCrypt.Verify(inputPassword, storedPasswordHash);
            Console.WriteLine(isvalidPass);
            return isvalidPass;
        }

        public static string GenerateJSONWebToken(this UserService userRepository, Register user, IConfiguration configuration)
        {
            var claims = new[]
               {
                    new Claim("role", user.Role), 
                    new Claim("name", user.UserName),
                    new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),  
                    new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(JwtRegisteredClaimNames.Iss, configuration["Jwt:Issuer"]),
                    new Claim(JwtRegisteredClaimNames.Aud, configuration["Jwt:Audience"]),
                };


            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);


            var token = new JwtSecurityToken(
                issuer: configuration["Jwt:Issuer"],
                audience: configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: credentials
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
