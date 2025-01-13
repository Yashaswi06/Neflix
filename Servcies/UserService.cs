using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using neflix.Interface;
using neflix.Model;
using System.Net.Mail;
using System.Net;

namespace neflix.Servcies
{
    public class UserService:IUser
    {
        private readonly UserDBContext _dbContext;
        private readonly IConfiguration _configuration;
        private readonly IMemoryCache _cache;

        public UserService(UserDBContext dbContext, IConfiguration configuration, IMemoryCache cache)
        {
            _dbContext = dbContext;
            _configuration = configuration;
            _cache = cache;
        }

        public async Task<Register> CreateUser(Register registerUser)
        {
            try
            {
               
                if (await _dbContext.NetflyUsers.AnyAsync(u => u.UserName == registerUser.UserName))
                {
                    throw new Exception("Username is not unique");
                }

                if (string.IsNullOrEmpty(registerUser.Password))
                {
                    throw new ArgumentException("Password cannot be null or empty.");
                }

                registerUser.Password = this.HashPassword(registerUser.Password);
                Console.WriteLine($"Hashed Password: {registerUser.Password}");
                Console.WriteLine($"Hashed Password: {registerUser.Password}");

                await _dbContext.NetflyUsers.AddAsync(registerUser);
                await _dbContext.SaveChangesAsync(); 
                Console.WriteLine("User successfully saved to the database.");

                return registerUser;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while creating the user.", ex);
            }
        }


        public async Task<string> UserLogin(Login loginUser)
        {
            try
            {
                var user = await _dbContext.NetflyUsers
                    .FirstOrDefaultAsync(u => u.UserName == loginUser.UserName);

                if (user == null)
                {
                    Console.WriteLine("User not found.");
                    throw new Exception("Invalid username or password.");
                }
                if (string.IsNullOrEmpty(loginUser.Password) || (string.IsNullOrEmpty(user.Password)))
                {
                    throw new ArgumentException("Password cannot be null or empty.");
                }
                if (!this.VerifyPassword(loginUser.Password, user.Password))
                {
                    Console.WriteLine("Password verification failed.");
                    throw new Exception("Invalid username or password.");
                }

                var token = this.GenerateJSONWebToken(user, _configuration);
                Console.WriteLine("JWT token generated successfully.");

                return $"Token: {token}"; 
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error during login: {ex.Message}");
                throw new Exception("An error occurred during login.", ex);
            }
        }

      

        public async Task<IEnumerable<Register>> GetAllUsers()
        {
            return await _dbContext.NetflyUsers.ToListAsync();
        }

        public async Task<Register?> GetUserById(int userId)
        {
            return await _dbContext.NetflyUsers.FindAsync(userId);
        }

        public async Task<Register> UpdateUser(Register user)
        {
            var existingUser = await _dbContext.NetflyUsers.FindAsync(user.UserId);
            if (existingUser == null)
                throw new Exception("User not found.");

            existingUser.UserName = user.UserName;
            existingUser.Email = user.Email;
            existingUser.PhoneNumber = user.PhoneNumber;
            existingUser.Role = user.Role;

            _dbContext.NetflyUsers.Update(existingUser);
            await _dbContext.SaveChangesAsync();
            return existingUser;
        }

        public async Task<bool> DeleteUser(int userId)
        {
            var user = await _dbContext.NetflyUsers.FindAsync(userId);
            if (user == null)
                throw new Exception("User not found.");

            _dbContext.NetflyUsers.Remove(user);
            await _dbContext.SaveChangesAsync();
            return true;
        }


        public async Task<bool> IsTokenValid(string token)
        {
            bool exists = await Task.Run(() => _cache.TryGetValue(token, out _));
            return !exists;
        }

        public async Task RevokeToken(string token)
        {

            await Task.Run(() => _cache.Set(token, true, new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1)
            }));
        }


    }
}
