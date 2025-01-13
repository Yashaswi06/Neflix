import { ArrowBackIosOutlined, ArrowForwardIosOutlined } from "@material-ui/icons";
import { useRef, useState, useEffect } from "react";
import "./list.css";
import ListItem from "../listItem/ListItem";

const categories = ["Action", "Comedy", "Drama", "Horror"]; 

const List = () => {
  const [isMoved, setIsMoved] = useState({}); 
  const [slideNumbers, setSlideNumbers] = useState({}); 
  const [moviesByCategory, setMoviesByCategory] = useState({}); 

  const listRefs = useRef({}); 

  useEffect(() => {
    categories.forEach(category => {
      getMoviesByCategory(category);
      setSlideNumbers(prev => ({ ...prev, [category]: 0 }));
      setIsMoved(prev => ({ ...prev, [category]: false })); 
    });
  }, []);

  async function getMoviesByCategory(category) {
    try {
      const response = await fetch(`https://localhost:7248/api/Movie/searchByCategory?categoryName=${category}`, {
        headers: { "Content-type": "application/json" },
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        setMoviesByCategory(prev => ({ ...prev, [category]: data }));
      } else {
        console.error(`Failed to fetch ${category} movies.`);
      }
    } catch (error) {
      console.error(`Error fetching ${category} movies:`, error);
    }
  }

  const handleClick = (direction, category) => {
    setIsMoved(prev => ({ ...prev, [category]: true })); 
    let distance = listRefs.current[category].getBoundingClientRect().x - 50;
    let newSlideNumber = slideNumbers[category];

    if (direction === "left" && newSlideNumber > 0) {
      newSlideNumber -= 1;
      listRefs.current[category].style.transform = `translateX(${230 + distance}px)`;
    }
    if (direction === "right" && newSlideNumber < 5) {
      newSlideNumber += 1;
      listRefs.current[category].style.transform = `translateX(${-230 + distance}px)`;
    }

    setSlideNumbers(prev => ({ ...prev, [category]: newSlideNumber })); 
  };

  return (
    <div className="list">
      {categories.map((category, index) => (
        <div key={index} >
          <span className="listTitle">{category}</span>
          <div className="wrapper">
            <ArrowBackIosOutlined
              className="sliderArrow left"
              onClick={() => handleClick("left", category)}
              style={{ display: isMoved[category] ? "block" : "none" }}
            />
            <div className="container" ref={(el) => (listRefs.current[category] = el)}>
              {moviesByCategory[category]?.map((movie, idx) => (
                <ListItem key={movie.movieId} index={idx} movie={movie} />
              ))}
            </div>
            <ArrowForwardIosOutlined
              className="sliderArrow right"
              onClick={() => handleClick("right", category)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default List;
