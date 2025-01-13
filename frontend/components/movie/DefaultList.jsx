import React, { useEffect, useState } from "react";
import"../movie/moviestyle.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import AdminNav from "../movie/adminnav";

const DefaultList = (movie) => {
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
    getMovies();
  }, []);

  const handleItemclick = (movieId)=>{
    navigate(`/moviesinfo/${movieId}`);
  };

  async function getMovies() {
    try {
      const response = await fetch("https://localhost:7248/api/Movie", {
        headers: {
          "Content-type": "application/json",
        },
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data); 
        setMovies(data); 
      } else {
        console.error("Failed to fetch movies.");
        setMovies([]); 
      }
    } catch (error) {
      console.error("An error occurred while fetching movies:", error);
      setMovies([]);
    }
  }


  return (
    <>
    {isAdmin ? <AdminNav /> : <Navbar/> }
    <div className="MovieList">
      {movies.length > 0 ? (
        movies.map((movie) => (
          <div className="movie" key={movie.movieId}
          onClick={() => handleItemclick(movie.movieId)}
          >
            <div className="image-container">
              <img
                  src={`https://localhost:7248/Resources/${movie.movieImage}`}
                alt={movie.title}
              />
            </div>

            <div className="movie-details">
              <h1 className="title">{movie.title}</h1>
            </div>
          </div>
        ))
      ) : (
        <p>No movies found.</p>
      )}
    </div></>
  );
};

export default DefaultList;

