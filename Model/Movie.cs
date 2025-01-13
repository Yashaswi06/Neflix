using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace neflix.Model
{
    public class Movie
    {
        public int MovieId { get; set; }
        public string? Title { get; set; }
        public string? ReleaseYear { get; set; }
        public string? MovieImage { get; set; }
        public string? Cast { get; set; }
        public string? Director { get; set; }
        public int CategoryId { get; set; }
        [NotMapped]
        public IFormFile? ImageFile { get; set; }
        public string? VideoUrl { get; set; }
        [NotMapped]
        public IFormFile? VideoFile { get; set; }


    }
}
