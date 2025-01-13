import Navbar from "../../components/navbar/Navbar";
import Featured from "../../components/featured/Featured";
import "./home.css";
import List from "../../components/list/List";
import { useEffect, useState } from "react";
import AdminNav from "../../components/movie/adminnav";

const Home = () => {
  const [isAdmin, setIsAdmin] = useState(null); 

  useEffect(() => {
    const role = localStorage.getItem("role"); 
    if (role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, []); 

  if (isAdmin === null) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="home">
      {isAdmin ? <AdminNav /> : <Navbar />}
      <Featured />
      <List />
    </div>
  );
};

export default Home;
