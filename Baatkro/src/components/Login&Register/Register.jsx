import React, { useContext, useRef } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { server } from "../../App";
import { ChatProviderContext } from "../../context/ChatProvider";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();

  const { setUser, isAuthenticated, setIsAuthenticated } =
    useContext(ChatProviderContext);

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const imageRef = useRef();

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", nameRef.current.value);
    formData.append("email", emailRef.current.value);
    formData.append("password", passwordRef.current.value);
    formData.append("image", imageRef.current.files[0]);

    try {
      toast.loading("Signing Up...");
      const response = await fetch(`${server}/user/register`, {
        method: "POST",
        credentials: "include",

        body: formData,
      });

      const json = await response.json();

      toast.dismiss();
      if (json.success) {
        toast.success(json.message);
        setIsAuthenticated(true);
        navigate("/chat");
      } else {
        toast.error(json.message);
      }
    } catch (error) {
      toast.error("Some error Occured !");
    }
  };

  if (isAuthenticated) return <Navigate to={"/chat"} />;
  return (
    <div className="main-div">
      <div className="form-box p-2 px-3">
        <div className="header-text">Registeration Form</div>
        <form encType="multipart/form-data" onSubmit={handleRegister}>
          <input placeholder="Enter your UserName" type="text" ref={nameRef} />
          <input placeholder="Your Email Address" type="email" ref={emailRef} />
          <input
            placeholder="Your Password"
            type="password"
            ref={passwordRef}
          />
          <input
            type="file"
            id="imageUpload"
            name="image"
            accept="image/*"
            className="bg-light text-dark"
            ref={imageRef}
          />
          <button className="p-2 my-2" type="submit">
            Register
          </button>
        </form>
        <center className="pt-2 text-dark">
          <h5>
            Already Registered ? <Link to="/">Login</Link>
          </h5>
        </center>
      </div>
    </div>
  );
};

export default Register;
