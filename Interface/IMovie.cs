using Microsoft.AspNetCore.Mvc;
using neflix.Model;

namespace neflix.Interface
{
    public interface IMovie
    {
        Task<IEnumerable<Movie>> GetAllMovies();
        Task<Movie> GetMovieById(int id);
        Task AddMovie(MovieDTO movieDto);
        Task UpdateMovie(int id, MovieDTO movieDto);
        Task DeleteMovie(int id);
        Task<List<Movie>> SearchMoviesByTitle(string title);
        Task<List<Movie>> SearchMoviesByCategory(string categoryName);
    }
}
