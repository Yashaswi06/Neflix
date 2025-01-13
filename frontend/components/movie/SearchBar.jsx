import React, { useEffect,useState } from "react";
import Movie from "./Movie";
import DefaultList from "./DefaultList";
import "../movie/moviestyle.css";
import Navbar from "../navbar/Navbar";
import AdminNav from "../movie/adminnav";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(null); 

  useEffect(() => {
    const role = localStorage.getItem("role"); 
    if (role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, []); 
  
  async function searchMovie(query) {
    try {
      const response = await fetch(
        `https://localhost:7248/api/Movie/search?title=${query}`
      );

      if (response.ok) {
        const data = await response.json();
        setMovies(data);
        setError("");
      } else {
        setError("An error occurred while fetching movies.");
        setMovies([]);
      }
    } catch (error) {
      setError("An error occurred while fetching movies.");
      setMovies([]);
    }
  }

  function handleSearch(e) {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() !== "") {
      searchMovie(query);
    } else {
      setMovies([]);
      setError("");
    }
  }

  return (
    
    <>
    {isAdmin ? <AdminNav /> : <Navbar/> }
    <div className="adminnav"> 
      <form action="" className="form">
        <h1>Movies</h1>

        <input
          type="text"
          placeholder="Search"
          onChange={handleSearch}
          value={searchQuery}
          className="search-input"
        />
      </form>
      {error && <p>{error}</p>}

      {searchQuery ? <Movie movies={movies} /> : <DefaultList />}
    </div></>
  );
};

export default SearchBar;

