using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using neflix.Interface;
using neflix.Model;
using Netfliee.Service;

namespace neflix.Servcies
{
    public class MovieService:IMovie
    {
        private readonly UserDBContext _context;
        private readonly IWebHostEnvironment _env;
        private readonly IFileService _fileService;

        public MovieService(UserDBContext context, IWebHostEnvironment webHostEnvironment, IFileService fileService)
        {
            _env = webHostEnvironment;
            _context = context;
            _fileService = fileService;
        }

        public async Task<IEnumerable<Movie>> GetAllMovies()
        {
            var movies = await (from movie in _context.Movies
                                join category in _context.Categories
                                on movie.CategoryId equals category.CategoryId
                                select new Movie
                                {
                                    MovieId = movie.MovieId,
                                    Title = movie.Title,
                                    ReleaseYear = movie.ReleaseYear,
                                    MovieImage = movie.MovieImage,
                                    Cast = movie.Cast,
                                    Director = movie.Director,
                                    CategoryId = movie.CategoryId,
                                    VideoUrl = movie.VideoUrl
                                }).ToListAsync();

            return movies;
        }

        public async Task<Movie> GetMovieById(int id)
        {
            var movie = await (from m in _context.Movies
                               join c in _context.Categories
                               on m.CategoryId equals c.CategoryId
                               where m.MovieId == id
                               select new Movie
                               {
                                   MovieId = m.MovieId,
                                   Title = m.Title,
                                   ReleaseYear = m.ReleaseYear,
                                   MovieImage = m.MovieImage,
                                   Cast = m.Cast,
                                   Director = m.Director,
                                   CategoryId = m.CategoryId,
                                   VideoUrl = m.VideoUrl,
                               }).FirstOrDefaultAsync();

            return movie;
        }

        public async Task AddMovie(MovieDTO movieDto)
        {
            if (string.IsNullOrEmpty(movieDto.Title))
            {
                throw new Exception("Movie title is required");
            }

            var category = await _context.Categories
                .FirstOrDefaultAsync(c => c.CategoryName == movieDto.CategoryName);

            if (category == null)
            {
                throw new Exception("Category not found");
            }
            if (string.IsNullOrEmpty(movieDto.VideoUrl))
            {
                throw new Exception("Video URL is required");
            }

            var movie = new Movie
            {
                Title = movieDto.Title,
                ReleaseYear = movieDto.ReleaseYear,
                MovieImage = movieDto.MovieImage,
                Cast = movieDto.Cast,
                Director = movieDto.Director,
                VideoUrl = movieDto.VideoUrl, 
                CategoryId = category.CategoryId, 
            };

            _context.Movies.Add(movie);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateMovie(int id, MovieDTO movieDto)
        {
            var existingMovie = await _context.Movies.FindAsync(id);

            if (existingMovie == null)
            {
                throw new Exception("Movie not found");
            }

            existingMovie.Title = movieDto.Title ?? existingMovie.Title;
            existingMovie.ReleaseYear = movieDto.ReleaseYear ?? existingMovie.ReleaseYear;
            existingMovie.Cast = movieDto.Cast ?? existingMovie.Cast;
            existingMovie.Director = movieDto.Director ?? existingMovie.Director;
            existingMovie.MovieImage = movieDto.MovieImage ?? existingMovie.MovieImage;
            existingMovie.VideoUrl = movieDto.VideoUrl ?? existingMovie.VideoUrl;

            if (movieDto.ImageFile != null)
            {
                if (!string.IsNullOrEmpty(existingMovie.MovieImage))
                {
                    var oldImagePath = Path.Combine(_env.ContentRootPath, "Uploads", existingMovie.MovieImage);
                    if (System.IO.File.Exists(oldImagePath))
                    {
                        System.IO.File.Delete(oldImagePath);
                    }
                }

                var fileResult = _fileService.SaveImage(movieDto.ImageFile);
                if (fileResult.Item1 == 1)
                {
                    existingMovie.MovieImage = fileResult.Item2;
                }

                var VideoResult = _fileService.SaveVideo(movieDto.VideoFile);
                if (VideoResult.Item1 == 1)
                {
                    existingMovie.VideoUrl = VideoResult.Item2;
                }
            }

            _context.Movies.Update(existingMovie);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteMovie(int id)
        {
            var movie = await _context.Movies.FindAsync(id);
            if (movie == null)
            {
                throw new Exception("Movie not found.");
            }

            if (!string.IsNullOrEmpty(movie.MovieImage))
            {
                await _fileService.DeleteImage(movie.MovieImage);
            }

            if (!string.IsNullOrEmpty(movie.VideoUrl))
            {
                var videoFileName = Path.GetFileName(movie.VideoUrl);
                await _fileService.DeleteVideo(videoFileName);
            }
            _context.Movies.Remove(movie);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Movie>> SearchMoviesByTitle(string title)
        {
            if (string.IsNullOrWhiteSpace(title))
                return new List<Movie>();

            var moviesQuery = _context.Movies.AsQueryable();

            moviesQuery = moviesQuery.Where(m => EF.Functions.Like(m.Title, $"%{title}%"));

            var movies = await moviesQuery
                .Take(10)  
                .ToListAsync();

            return movies;
        }
        public async Task<List<Movie>> SearchMoviesByCategory(string categoryName)
        {
            if (string.IsNullOrWhiteSpace(categoryName))
                return new List<Movie>();

            var movies = await _context.Movies
                .Where(m => m.CategoryId ==
                    _context.Categories
                        .Where(c => c.CategoryName.Contains(categoryName))
                        .Select(c => c.CategoryId)
                        .FirstOrDefault())
                .Take(10) 
                .ToListAsync();

            return movies;
        }

    }
}
