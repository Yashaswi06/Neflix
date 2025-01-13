import React, {useEffect, useState } from "react";
import userIcon from "./img/user.svg";
import passwordIcon from "./img/password.svg";
import styles from "./SignUp.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { validate } from "./validate";

const Login = () => {
  const [data, setData] = useState({
    Username: "",
    Password: "",
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  
  const changeHandler = (event) => {
    if (event.target.name === "IsAccepted") {
      setData({ ...data, [event.target.name]: event.target.checked });
    } else {
      setData({ ...data, [event.target.name]: event.target.value });
    }
  };

  useEffect(() => {
    setErrors(validate(data, "signUp"));
  }, [data, touched]);



  const focusHandler = (event) => {
    setTouched({ ...touched, [event.target.name]: true });
  };


  const submitHandler = async (event) => {
    event.preventDefault();

    const urlApi = `https://localhost:7248/api/User/login`;

    try {
      // Sending email and password to backend
      const response = await axios.post(urlApi, data, {
        headers: { "Content-Type": "application/json" },
      });
      
      if (response.status === 200) {
        const token = response.data;
       
        if (token) {
          localStorage.setItem("token", token); 
          toast.success("You have logged in successfully!");
  
          try {
            const payload = jwtDecode(token); 
            console.log(payload);
            const userId = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']; 
            console.log(userId);
            localStorage.setItem("userId", userId);
            const userRole = payload.role; 
           

          if (userRole === "user") {
            localStorage.setItem("role", userRole);
              window.location.href = "/home";

        } else if (userRole === "admin") {
          localStorage.setItem("role", userRole);
          window.location.href = "/admin";
        }
          } catch (error) {
            console.error("Error decoding token:", error);
            toast.error("Token decoding failed.");
          }
        }
      } 
       else {
        toast.error("Invalid email or password!");
      }
    } catch (error) {
      // Handle errors
      if (error.response) {
        toast.error("Login failed!");
      } else {
        toast.error("Network error. Please try again later.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.formLogin} onSubmit={submitHandler} autoComplete="off">
        <h2>Sign In</h2>
        {/* <div>
          <div>
            <input
              type="text"
              name="username"
              value={data.username}
              placeholder="UserName"
              onChange={changeHandler}
              onFocus={focusHandler}
              autoComplete="off"
            />
            <img src={userIcon} alt="" />
          </div>
        </div>
        <div>
          <div>
            <input
              type="password"
              name="password"
              value={data.password}
              placeholder="Password"
              onChange={changeHandler}
              onFocus={focusHandler}
              autoComplete="off"
            />
            <img src={passwordIcon} alt="" />
          </div>
        </div> */}
  {/* Username Field */}
  <div>
        <div className={
          errors.UserName && touched.UserName 
          ? styles.unCompleted 
          : !errors.UserName && touched.UserName 
          ? styles.completed 
          : undefined
        }>
          <input 
            type="text" 
            name="UserName" 
            value={data.userName} 
            placeholder="Username" 
            onChange={changeHandler} 
            onFocus={focusHandler} 
            autoComplete="off" 
          />
          <img src={userIcon} alt="" />
        </div>
        {errors.UserName && touched.UserName && <span className={styles.error}>{errors.UserName}</span>}
      </div>

      {/* Password Field */}
      <div>
        <div className={
          errors.Password && touched.Password 
          ? styles.unCompleted 
          : !errors.Password && touched.Password 
          ? styles.completed 
          : undefined
        }>
          <input 
            type="password" 
            name="Password" 
            value={data.Password} 
            placeholder="Password" 
            onChange={changeHandler} 
            onFocus={focusHandler} 
            autoComplete="off" 
          />
          <img src={passwordIcon} alt="" />
        </div>
        {errors.Password && touched.Password && <span className={styles.error}>{errors.Password}</span>}
      </div>
        <div>
          <button type="submit">Login</button>
          <span
            style={{
              color: "#a29494",
              textAlign: "center",
              display: "inline-block",
              width: "100%",
            }}
          >
            Don't have an account? <Link to="/signup">Create account</Link>
          </span>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;
