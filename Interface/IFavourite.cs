using neflix.Model;

namespace neflix.Interface
{
    public interface IFavourite
    {
        Task AddToFavorites(int userId, string movieName);
        Task RemoveFromFavorites(int userId, int movieId);
        Task<List<Movie>> GetFavoritesByUserId(int userId);
        Task<bool> IsMovieFavorite(int userId, string movieName);
    }
}
