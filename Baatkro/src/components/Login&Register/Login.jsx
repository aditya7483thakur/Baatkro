import React, { useContext } from "react";
import "./Login.css";
import { useRef } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { server } from "../../App";
import { ChatProviderContext } from "../../context/ChatProvider";
import toast from "react-hot-toast";

const Login = () => {
  const { user, setUser, isAuthenticated, setIsAuthenticated } =
    useContext(ChatProviderContext);
  const navigate = useNavigate();
  const email = useRef();
  const password = useRef();

  const handlelogin = async () => {
    try {
      toast.loading("Logging In...");
      const response = await fetch(`${server}/user/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.current.value,
          password: password.current.value,
        }),
      });

      const json = await response.json();

      toast.dismiss();
      if (json.success) {
        setIsAuthenticated(true);
        toast.success(json.message);
        navigate("/chat");
      } else {
        toast.error(json.message);
      }
    } catch (error) {
      toast.error("Some error Occurred !");
    }
  };

  if (isAuthenticated) return <Navigate to={"/chat"} />;

  return (
    <div className="main-div">
      <div className="form-box px-3">
        <div className="header-text my-4">Login Form</div>
        <input
          className="my-4"
          placeholder="Your Email Address"
          type="email"
          ref={email}
        />
        <input
          className="my-4"
          placeholder="Your Password"
          type="password"
          ref={password}
        />{" "}
        <Link onClick={handlelogin}>
          <button className="p-2 my-2">login</button>
        </Link>
        <center className="pt-3 text-dark">
          <h5>
            Create Account ? <Link to="/register">Register</Link>
          </h5>
        </center>
      </div>
    </div>
  );
};

export default Login;
