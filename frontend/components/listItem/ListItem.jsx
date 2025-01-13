import { useNavigate } from "react-router-dom";
import "./listitem.css";

const ListItem = ({ movie}) => {
  const navigate = useNavigate();
  const handleMovieClick = () => {
    navigate(`/moviesinfo/${movie.movieId}`); 
  };

  return (
    <div
      className="listItem"
      onClick={handleMovieClick} 
    >
      <img
        src={`https://localhost:7248/Resources/${movie.movieImage}`}
        alt={movie.title}
      />
       <div className="itemInfo">
        <h1 className="movie-title">{movie.title}</h1>
       </div>
    </div>
  );
};

export default ListItem;
