using System.ComponentModel.DataAnnotations.Schema;

namespace neflix.Model
{
    public class MovieDTO
    {
        public string? Title { get; set; }
        public string? ReleaseYear { get; set; }
        public string? MovieImage { get; set; }
        public string? Cast { get; set; }
        public string? Director { get; set; }
        public string? CategoryName { get; set; }
        [NotMapped]
        public IFormFile? ImageFile { get; set; }
        public string? VideoUrl { get; set; }
        [NotMapped]
        public IFormFile? VideoFile { get; set; }
    }
}
