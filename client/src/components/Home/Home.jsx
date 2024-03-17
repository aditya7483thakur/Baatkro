import React from "react";
import Navbar from "../Navbar/Navbar";
import "./Home.css";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleTryNow = () => {
    navigate("/login");
  };

  return (
    <>
      <Navbar />
      <div className="landing-page">
        <div className=" land-first ">
          <div className="w-50 center first-image-sec">
            <img className="w-50 " src="/come.png" alt="" />
          </div>
          <div className=" w-50 center flex-column">
            <h1 className="landing-page-text">
              Connect With Your Circle In a Fun Way
            </h1>
            <button onClick={handleTryNow} class="btn-donate">
              Try now !
            </button>
          </div>
        </div>
        <div
          className="text-white second-sec"
          style={{ paddingBottom: "30vh" }}
        >
          <div className="w-50 center flex-column pl-5 div-rando">
            <h1 className="features">Features</h1>
            <div>
              <h3 className="my-3">
                🔒Robust user authentication and authorization
              </h3>
              <h3 className="my-3">📲Encrypted privacy for messages</h3>
              <h3 className="my-3">
                💫Seamless one-to-one messaging experience
              </h3>
              <h3 className="my-3">
                ❄️Engaging community chat rooms available
              </h3>
              <h3 className="my-3">
                📷Convenient profile picture upload functionality
              </h3>
            </div>
          </div>
          <div className="w-50 d-flex first-image-sec justify-content-center align-items-center">
            <img className="w-50" src="/aij.png" alt="" />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
