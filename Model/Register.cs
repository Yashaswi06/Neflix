using System.ComponentModel.DataAnnotations.Schema;

namespace neflix.Model
{
    public class Register
    {
        public int UserId { get; set; }
        public string? UserName { get; set; }
        public string? Password { get; set; }
        [NotMapped]
        public string? ConfirmPassword { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Role { get; set; }
    }
}
