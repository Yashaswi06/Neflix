import React from "react";
import "../movie/moviestyle.css";

const Movie = ({ movies = [] }) => {
  if (!movies.length) {
    return <p>No movies found.</p>;
  }

  return (
    <div className="MovieList">
      {movies.map((movie) => (
        <div className="movie" key={movie.movieId}>
          <div className="image-container">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.movieImage}`}
              alt={movie.title}
            />
          </div>
          <div className="movie-details">
            <h1 className="movie-title">{movie.title}</h1>
            <p className="movie-release-date">Release Year: {movie.releaseYear}</p>
            <p className="movie-cast">Cast: {movie.cast}</p>
            <p className="movie-director">Director: {movie.director}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Movie;
