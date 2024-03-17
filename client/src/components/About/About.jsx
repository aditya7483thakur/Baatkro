import React from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

const About = () => {
  return (
    <>
      <Navbar />
      <div className="landing-page vh-100 center text-center">
        <div className=" about">
          <h1 className="text-white features">About Us</h1>
          <h3 className="text-white">
            Welcome to my dynamic{" "}
            <span className="text-warning">chatting app</span>! Crafted with
            modern tech like
            <span className="text-warning">
              Socket.io, React.js, and Bootstrap
            </span>{" "}
            , it offers a contemporary user experience. Built on
            <span className="text-warning"> Express.js </span>and
            <span className="text-warning"> Node.js</span> with{" "}
            <span className="text-warning">MongoDB</span>, it ensures robustness
            and scalability. Whether it's{" "}
            <span className="text-warning">private chats</span> with encryption
            or vibrant community discussions,{" "}
            <span className="text-warning">user</span> privacy and convenience
            are prioritized. Explore instant communication in a visually
            appealing, user-friendly environment tailored to enhance your
            <span className="text-warning"> chatting experience </span>.
          </h3>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;
