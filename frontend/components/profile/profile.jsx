import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../profile/profilestyle.css";
import Navbar from "../navbar/Navbar";
import AdminNav from "../movie/adminnav";

const ProfilePage = () => {
  const { userId } = useParams(); 
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const[isAdmin, setisAdmin] = useState(false);

  const role = localStorage.getItem("userRole");
  if(role === "user"){
    setisAdmin(true);
  }

  useEffect(() => {
    const fetchUserById = async () => {
      try {
        const response = await axios.get(`https://localhost:7248/api/User/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        alert("Failed to fetch user data");
      }
    };
    fetchUserById();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`https://localhost:7248/api/User/${userId}`, user, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert(response.data.message || "Profile updated successfully");
      setEditMode(false);
    } catch (error) {
      alert(error.response?.data?.error || "Failed to update profile");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your profile?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`https://localhost:7248/api/User/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert(response.data.message || "Profile deleted successfully");
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (error) {
      alert(error.response?.data?.error || "Failed to delete profile");
    }
  };

  if (!user) {
    return <p>Loading user data...</p>;
  }

  return (
    <>
    {isAdmin ? <Navbar /> : <AdminNav/> }
    <div className="profile-container">
      <h2>User Profile</h2>
      <div className="profile-form">
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={user.userName}
          onChange={handleChange}
          disabled={!editMode}
        />
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          disabled={!editMode}
        />
        <label>Phone:</label>
        <input
          type="text"
          name="phone"
          value={user.phone}
          onChange={handleChange}
          disabled={!editMode}
        />
        <div className="buttons">
          {editMode ? (
            <>
              <button onClick={handleUpdate}>Save</button>
              <button onClick={() => setEditMode(false)}>Cancel</button>
            </>
          ) : (
            <button onClick={() => setEditMode(true)}>Edit</button>
          )}
          <button onClick={handleDelete} className="delete-btn">
            Delete Profile
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default ProfilePage;
