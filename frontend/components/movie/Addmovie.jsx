
import React, {useEffect, useState } from "react";
import axios from "axios";
import "../movie/addmoviestyle.css";
import Navbar from "../navbar/Navbar";
import AdminNav from "../movie/adminnav";

function AddMovie() {
  const [formData, setFormData] = useState({
    title: "",
    releaseYear: "",
    cast: "",
    director: "",
    categoryName: "",
    imageFile: null,
    videoFile: null, // Added state for video file
  });

  const [isAdmin, setIsAdmin] = useState(null); 

  useEffect(() => {
    const role = localStorage.getItem("role"); 
    if (role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, []); 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] }); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("categoryName", formData.categoryName);
    form.append("title", formData.title);
    form.append("releaseYear", formData.releaseYear);
    form.append("cast", formData.cast);
    form.append("director", formData.director);
    if (formData.imageFile) {
      form.append("imageFile", formData.imageFile);
    }
    if (formData.videoFile) {
      form.append("videoFile", formData.videoFile); 
    }

    try {
      const response = await axios.post("https://localhost:7248/api/Movie/add-movie", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.error || "Error adding movie");
    }
  };

  return (
    <>
    {isAdmin ? <AdminNav /> : <Navbar/> }
      <h2>Add Movie</h2>
      <div class="addmoviebackground">
        <div class=" shape"></div>
        <div class=" shape"></div>
      </div>
      <form className="addmovieform" onSubmit={handleSubmit}>
      <label className="addmovielabel">Movie Title</label>
        <input className="addmovieinput"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <label>Release Year</label>
        <select
        className="addmovieselect"
  name="releaseYear"
  value={formData.releaseYear}
  onChange={handleChange}
>
  <option value="" disabled>
  </option>
  {Array.from(
    { length: new Date().getFullYear() - 1899 },
    (_, index) => 1900 + index
  ).map((year) => (
    <option key={year} value={year}>
      {year}
    </option>
  ))}
</select>
<label>Cast</label>
        <input
          type="text"
          name="cast"
          value={formData.cast}
          onChange={handleChange}
          required
        />
        <label>Director</label>
        <input
          type="text"
          name="director"
          value={formData.director}
          onChange={handleChange}
        />
        <label>Category Name</label>
                <select
                type="text"
                name="categoryName"
                value={formData.categoryName}
                onChange={handleChange}
              >
              <option value="">
              
              </option>
              <option>Action</option>
              <option>Comedy</option>
              <option>Drama</option>
              <option>Horror</option>
            </select>
            <label>Upload ImageFile</label>
        <input type="file" name="imageFile"   value={formData.imageFile} onChange={handleFileChange} />
        <label>Upload VideoFile</label>
        <input type="file" name="videoFile"  value={formData.videoFile} onChange={handleFileChange} />
        <button className="addmoviebutton" type="submit">Add Movie</button>
      </form>
    </>
  );
}

export default AddMovie;
