using neflix.Interface;
using System.Text.Json.Serialization;

namespace neflix.Model
{
    public class Favourite
    {
        public int FavoriteId { get; set; }
        public int MovieId { get; set; }
        public int UserId { get; set; }
    }
}
