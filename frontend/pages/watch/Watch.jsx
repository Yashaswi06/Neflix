import { ArrowBackOutlined } from "@material-ui/icons";
import "./watch.css";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Watch() {
  const [videoUrl, setVideoUrl] = useState(""); 
  const { movieId } = useParams(); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7248/api/Movie/${movieId}` 
        );
        setVideoUrl(response.data.videoUrl); 
      } catch (error) {
        console.error("Error fetching video URL:", error);
      }
    };
    fetchVideoUrl();
  }, [movieId]);

  return (
    <div className="watch">
      <div className="back" onClick={() => navigate("/")}>
        <ArrowBackOutlined />
        Home
      </div>
      {videoUrl && (
        <video
          className="video"
          autoPlay
          controls
          src={`https://localhost:7248/Resources/${videoUrl}`}
          type="video/mp4"
        />
      )}
    </div>
  );
}