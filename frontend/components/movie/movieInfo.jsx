import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";
import "../movie/movieinfostyle.css";
import heart from "../img/heart.svg";
import singleheart from "../img/singleheart.svg";
import Navbar from "../navbar/Navbar";
import AdminNav from "../movie/adminnav";
import { useNavigate } from "react-router-dom";

const MovieInfoComponent = () => {
  const { movieId } = useParams();
  const [movieInfo, setMovieInfo] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [message, setMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(null);
  
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, []);

  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    Axios.get(`https://localhost:7248/api/Movie/${movieId}`)
      .then((response) => {
        setMovieInfo(response.data);
        console.log(response);
      })
      .catch((error) => console.error("Error fetching movie details:", error));
  }, [movieId]);

  useEffect(() => {
    if (movieInfo) {
      fetch(
        `https://localhost:7248/api/Movie/check-favorite/${userId}?movieName=${movieInfo.title}`
      )
        .then((response) => response.json())

        .then((data) => setIsFavorite(data.isFavorite))
        .catch((error) =>
          console.error("Error checking favorite status:", error)
        );
    }
  }, [movieInfo, userId]);

  const onClickWatch = () => {
    navigate(`/watch/${movieId}`);
  };
  const toggleFavoriteStatus = async () => {
    try {
      let response;

      if (isFavorite) {
        response = await fetch(
          `https://localhost:7248/api/Movie/remove-from-favorites/${userId}/${movieId}`,
          {
            method: "DELETE", 
            headers: {
              "Content-type": "application/json",
            },
          }
        );
        if (response.ok) {
          setIsFavorite(false);
        } else {
          setMessage("Failed to remove from favorites.");
        }
      } else {
        response = await fetch(
          `https://localhost:7248/api/Movie/add-to-favorites/${userId}?movieName=${movieInfo.title}`,
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
          }
        );
        if (response.ok) {
          setIsFavorite(true);
        } else {
          setMessage("Failed to add to favorites.");
        }
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
      setMessage("An error occurred while updating favorite status.");
    }
  };

  return (
    <>
      {isAdmin ? <AdminNav /> : <Navbar />}
      <div className="movieinfocontain">
        <div className="infocontainer">
          {movieInfo ? (
            <>
              <img
                className="cover-image"
                src={`https://localhost:7248/Resources/${movieInfo.movieImage}`}
                alt={movieInfo.title}
              />
              <div className="info-column">
                <div className="movie-name">
                  Title: <span>{movieInfo.title}</span>
                </div>
                <div className="movie-info">
                  Release Year: <span>{movieInfo.releaseYear}</span>
                </div>
                <div className="movie-info">
                  Cast: <span>{movieInfo.cast}</span>
                </div>
                <div className="movie-info">
                  Director: <span>{movieInfo.director}</span>
                </div>
                <div className="watchfavbtndiv">
                  <button className="watchbtn" onClick={() => onClickWatch()}>
                    Play{" "}
                  </button>
                  <button className="favbtn">
                    <img
                      src={isFavorite ? heart : singleheart}
                      alt="Favorite"
                      onClick={toggleFavoriteStatus}
                      style={{
                        cursor: "pointer",
                        width: "30px",
                        height: "30px",
                      }}
                    />
                  </button>
                </div>

                {isAdmin && (
                  <div className="updelbtndiv">
                    <button className="movieupdatebtn">Update</button>
                    <button className="moviedelbtn">Delete</button>
                  </div>
                )}
              </div>
              {message && <p className="feedback-message">{message}</p>}
            </>
          ) : (
            "Loading..."
          )}
        </div>
      </div>
    </>
  );
};

export default MovieInfoComponent;
