import { Notifications } from "@material-ui/icons";
import React, { useState } from "react";
import "./navbar.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";



const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

const loggedInUserId = localStorage.getItem("userId"); // Replace with actual logic

const handleImageClick = () => {
  navigate(`/profile/${loggedInUserId}`);
  console.log(loggedInUserId);
};

  window.onscroll = () => {
    setIsScrolled(window.scrollY === 0 ? false : true);
    return () => (window.onscroll = null);
  };

  const handleNavigate = (path) => {
    navigate(path); 
  };

  const handleLogout = async () => {
    const tokenprefix = localStorage.getItem('token');
    const token = tokenprefix.replace("Token: ", ""); 
    if (!token) {
        console.error("No token found, redirecting to login...");
        return;
    }

    try {
        const response = await axios.post(
          
            'https://localhost:7248/api/User/logout',
            {}, 
            {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            }
        );

        console.log("Logout successful:", response.data);
        window.location.href = '/login';
    } catch (error) {
        console.error("Logout failed:", error);
        if (error.response?.status === 401) {
            console.warn("Invalid token. Redirecting to login...");
        }
    }
};


  return (
    <div className={isScrolled ? "navbar scrolled" : "navbar"}>
      <div className="container">
        <div className="left">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png"
            alt=""
          /> 
              <span onClick={() => handleNavigate("/home")}>Home</span>
              <span onClick={() => handleNavigate("/favlist")}>Favourites</span>
              <span onClick={() => handleNavigate("/searchlist")}>Movies List</span>
            


        </div>
        <div className="right">
          <Notifications className="icon" />
          <img
            src="https://images.pexels.com/photos/6899260/pexels-photo-6899260.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
            alt=""
            onClick={handleImageClick}
          />
          <div className="icon" >
            <div >
             <span onClick={handleLogout}>Logout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
