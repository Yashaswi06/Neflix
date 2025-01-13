using neflix.Model;

namespace neflix.Interface
{
    public interface IUser
    {
        Task<Register> CreateUser(Register user);
        Task<string> UserLogin(Login loginUser);
        Task<IEnumerable<Register>> GetAllUsers();
        Task<Register?> GetUserById(int userId);
        Task<Register> UpdateUser(Register user);
        Task<bool> DeleteUser(int userId);
        Task<bool> IsTokenValid(string token);
        Task RevokeToken(string token);
 
    }
}
