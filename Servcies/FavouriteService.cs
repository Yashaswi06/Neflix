using Microsoft.EntityFrameworkCore;
using neflix.Interface;
using neflix.Model;

namespace neflix.Servcies
{
    public class FavouriteService : IFavourite
    {
        private readonly UserDBContext _context;

        public FavouriteService(UserDBContext context)
        {
            _context = context;
        }

        public async Task AddToFavorites(int userId, string movieName)
        {
            var movie = await _context.Movies
                .FirstOrDefaultAsync(m => m.Title == movieName);

            if (movie == null)
            {
                throw new Exception("Movie not found");
            }

            var existingFavorite = await _context.Favorites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.MovieId == movie.MovieId);

            if (existingFavorite != null)
            {
                throw new Exception("Movie is already in favorites");
            }

            var favorite = new Favourite
            {
                UserId = userId,
                MovieId = movie.MovieId
            };

            _context.Favorites.Add(favorite);
            await _context.SaveChangesAsync();
        }


        public async Task RemoveFromFavorites(int userId, int movieId)
        {
            var favorite = await _context.Favorites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.MovieId == movieId);

            if (favorite == null)
            {
                throw new Exception("Favorite movie not found");
            }

            _context.Favorites.Remove(favorite);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Movie>> GetFavoritesByUserId(int userId)
        {
            var favorites = await (from favorite in _context.Favorites
                                   join movie in _context.Movies
                                   on favorite.MovieId equals movie.MovieId
                                   where favorite.UserId == userId
                                   select movie)
                                  .ToListAsync();

            return favorites;
        }

        public async Task<bool> IsMovieFavorite(int userId, string movieName)
        {
            return await _context.Favorites
                .Join(
                    _context.Movies,
                    favorite => favorite.MovieId,
                    movie => movie.MovieId,
                    (favorite, movie) => new { favorite, movie }
                )
                .AnyAsync(fm => fm.favorite.UserId == userId && fm.movie.Title == movieName);
        }
    }

}
