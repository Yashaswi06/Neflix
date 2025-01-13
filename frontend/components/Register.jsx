import React, { useEffect, useState } from "react";
import userIcon from "./img/user.svg";
import emailIcon from "./img/email.svg";
import passwordIcon from "./img/password.svg";
import phone from "./img/phone.svg";
import { validate } from "./validate";
import styles from "./SignUp.module.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { notify } from "./toast";
import { Link } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const [data, setData] = useState({
    UserName: "",
    Password: "",
    Email: "",
    PhoneNumber: "",
    Role: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    setErrors(validate(data, "signUp"));
  }, [data, touched]);

  const changeHandler = (event) => {
    if (event.target.name === "IsAccepted") {
      setData({ ...data, [event.target.name]: event.target.checked });
    } else {
      setData({ ...data, [event.target.name]: event.target.value });
    }
  };

  const focusHandler = (event) => {
    setTouched({ ...touched, [event.target.name]: true });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    if (!Object.keys(errors).length) {
      try {
        const response = await toast.promise(
        
          axios.post("https://localhost:7248/api/User/register", data, {
            headers: {
              "Content-Type": "application/json",
            },
          }),
          {
            pending: "Submitting your data...",
            success: "Registration successful!",
            error: "Registration failed. Please try again.",
          }
        );

        if (response.data.ok) {
        
          notify("You signed up successfully!", "success");
          
        
        } 
      } catch (error) {
        console.error(error);
        notify("An error occurred. Please try again.", "error");
      }
    }  else {
      notify("Please Check fileds again", "error");
      setTouched({
        UserName: true,
        Password: true,
        ConfirmPassword: true,
        Email: true,
        PhoneNumber: true,
        Role: true,
        IsAccepted: false,
      });
    }
  };

  return (
    <div className={styles.container}>
      <form
        className={styles.formLogin}
        onSubmit={submitHandler}
        autoComplete="off"
      >
        <h2>Sign Up</h2>

        <div>
          <div
            className={
              errors.UserName && touched.UserName
                ? styles.unCompleted
                : !errors.UserName && touched.UserName
                ? styles.completed
                : undefined
            }
          >
            <input
              type="text"
              name="UserName"
              value={data.UserName}
              placeholder="Username"
              onChange={changeHandler}
              onFocus={focusHandler}
              autoComplete="off"
            />
            <img src={userIcon} alt="" />
          </div>
          {errors.UserName && touched.UserName && (
            <span className={styles.error}>{errors.UserName}</span>
          )}
        </div>

        <div>
          <div
            className={
              errors.Password && touched.Password
                ? styles.unCompleted
                : !errors.Password && touched.Password
                ? styles.completed
                : undefined
            }
          >
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
          {errors.Password && touched.Password && (
            <span className={styles.error}>{errors.Password}</span>
          )}
        </div>

        <div>
          <div
            className={
              errors.ConfirmPassword && touched.ConfirmPassword
                ? styles.unCompleted
                : !errors.ConfirmPassword && touched.ConfirmPassword
                ? styles.completed
                : undefined
            }
          >
            <input
              type="password"
              name="ConfirmPassword"
              value={data.ConfirmPassword}
              placeholder="Confirm Password"
              onChange={changeHandler}
              onFocus={focusHandler}
              autoComplete="off"
            />
            <img src={passwordIcon} alt="" />
          </div>
          {errors.ConfirmPassword && touched.ConfirmPassword && (
            <span className={styles.error}>{errors.ConfirmPassword}</span>
          )}
        </div>

        <div>
          <div
            className={
              errors.Email && touched.Email
                ? styles.unCompleted
                : !errors.Email && touched.Email
                ? styles.completed
                : undefined
            }
          >
            <input
              type="text"
              name="Email"
              value={data.Email}
              placeholder="Email"
              onChange={changeHandler}
              onFocus={focusHandler}
              autoComplete="off"
            />
            <img src={emailIcon} alt="" />
          </div>
          {errors.Email && touched.Email && (
            <span className={styles.error}>{errors.Email}</span>
          )}
        </div>

        <div>
          <div
            className={
              errors.PhoneNumber && touched.PhoneNumber
                ? styles.unCompleted
                : !errors.PhoneNumber && touched.PhoneNumber
                ? styles.completed
                : undefined
            }
          >
            <input
              type="text"
              name="PhoneNumber"
              value={data.PhoneNumber}
              placeholder="Phone Number"
              onChange={changeHandler}
              onFocus={focusHandler}
              autoComplete="off"
            />
            <img src={phone} alt="" />
          </div>
          {errors.PhoneNumber && touched.PhoneNumber && (
            <span className={styles.error}>{errors.PhoneNumber}</span>
          )}
        </div>
        <div>
          <div
            className={
              errors.Role && touched.Role
                ? styles.unCompleted
                : !errors.Role && touched.Role
                ? styles.completed
                : undefined
            }
          >
            <select
              name="Role"
              value={data.Role}
              onChange={changeHandler}
              onFocus={focusHandler}
              autoComplete="off"
            >
              <option>Select Role</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
            <img src={userIcon} alt="User icon" />
          </div>
          {errors.Role && touched.Role && (
            <span className={styles.error}>{errors.Role}</span>
          )}
        </div>

        <button type="submit">Create Account</button>
        <span
          style={{
            color: "#a29494",
            textAlign: "center",
            display: "inline-block",
            width: "100%",
          }}
        >
          Already have a account? <Link to="/login">Sign In</Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  );
};

export default SignUp;