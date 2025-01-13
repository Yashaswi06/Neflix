using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using neflix.Interface;
using neflix.Model;
using neflix.Servcies;
using Netfliee.Service;

namespace neflix.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovieController : ControllerBase
    {
        private readonly IMovie _movieService;
        private readonly IFileService _fileService;
        private readonly IFavourite _favoriteService;

        public MovieController(IMovie movieService, IFileService fileService, IFavourite favourite)
        {
            _movieService = movieService;
            _fileService = fileService;
            _favoriteService = favourite;
        }

        [HttpPost("add-movie")]
        public async Task<IActionResult> AddMovieAsync([FromForm] MovieDTO movie)
        {
            try
            {
                if (movie.ImageFile != null)
                {
                    var fileResult = _fileService.SaveImage(movie.ImageFile);
                    if (fileResult.Item1 == 1)
                    {
                        movie.MovieImage = fileResult.Item2;
                    }
                }
                if (movie.VideoFile != null)
                {
                    var videoResult = _fileService.SaveVideo(movie.VideoFile); 
                    if (videoResult.Item1 == 1)
                    {
                        movie.VideoUrl = videoResult.Item2;
                    }
                }

                await _movieService.AddMovie(movie);

                return Ok(new { message = "Movie added successfully", movie });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllMovies()
        {
            var movies = await _movieService.GetAllMovies();
            return Ok(movies);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetMovieById(int id)
        {
            var movie = await _movieService.GetMovieById(id);
            if (movie == null)
                return NotFound();

            return Ok(movie);
        }
        
        [HttpPut("update-movie/{id}")]
        public async Task<IActionResult> UpdateMovieAsync(int id, [FromForm] MovieDTO movieDto)
        {
            try
            {
                await _movieService.UpdateMovie(id, movieDto);
                return Ok(new { message = "Movie updated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMovie(int id)
        {
            try
            {
                await _movieService.DeleteMovie(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchMovies([FromQuery] string title)
        {
            try
            {
                var movies = await _movieService.SearchMoviesByTitle(title);
                return Ok(movies);
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred: {ex.Message}");
            }
        }

        [HttpGet("searchByCategory")]
        public async Task<IActionResult> SearchMoviesByCategory([FromQuery] string categoryName)
        {
            try
            {
                var movies = await _movieService.SearchMoviesByCategory(categoryName);
                return Ok(movies);
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred: {ex.Message}");
            }
        }

        [HttpPost("add-to-favorites/{userId}")]
        public async Task<IActionResult> AddToFavorites(int userId, string movieName)
        {
            try
            {
                await _favoriteService.AddToFavorites(userId, movieName);
                return Ok(new { message = "Movie added to favorites" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [HttpDelete("remove-from-favorites/{userId}/{movieId}")]
        public async Task<IActionResult> RemoveFromFavorites(int userId, int movieId)
        {
            try
            {
                await _favoriteService.RemoveFromFavorites(userId, movieId);
                return Ok(new { message = "Movie removed from favorites" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("get-favorites/{userId}")]
        public async Task<IActionResult> GetFavorites(int userId)
        {
            try
            {
                var favoriteMovies = await _favoriteService.GetFavoritesByUserId(userId);
                return Ok(favoriteMovies);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("check-favorite/{userId}")]
        public async Task<IActionResult> CheckFavorite(int userId, [FromQuery] string movieName)
        {
            if (string.IsNullOrEmpty(movieName))
            {
                return BadRequest("Movie name is required.");
            }

            try
            {
                bool isFavorite = await _favoriteService.IsMovieFavorite(userId, movieName);
                return Ok(new { isFavorite });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}

