import React, { useEffect, useState } from "react";
import "../movie/moviestyle.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import AdminNav from "../movie/adminnav";

const FavoriteList = ({ userId }) => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(null); 

  useEffect(() => {
    const role = localStorage.getItem("role"); 
    if (role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, []); 


  useEffect(() => {
    getFavorites();
  }, []);

  const getFavorites = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(
        `https://localhost:7248/api/Movie/get-favorites/${userId}`,
        {
          headers: {
            "Content-type": "application/json",
          },
          method: "GET",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMovies(data);
      } else {
        console.error("Failed to fetch favorite movies.");
      }
    } catch (error) {
      console.error("An error occurred while fetching favorites:", error);
    }
  };


  const handleMovieClick = (movieId) => {
    navigate(`/moviesinfo/${movieId}`);
  };

  return (
    <>
    {isAdmin ? <AdminNav /> : <Navbar/> }
    <div className="MovieList favlist" >
      {movies.length > 0 ? (
        movies.map((movie) => (
          <div
            className="movie"
            key={movie.movieId}
            onClick={() => handleMovieClick(movie.movieId)}
          >
            <div className="image-container">
              <img
                src={`https://localhost:7248/Resources/${movie.movieImage}`}
                alt={movie.title}
              />
            </div>
            <div className="movie-details">
              <h1 className="favmovie-title">{movie.title}</h1>
            </div>
          </div>
        ))
      ) : (
        <p>No favorite movies found.</p>
      )}
    </div></>
  );
};

export default FavoriteList;
