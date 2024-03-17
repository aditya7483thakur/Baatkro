import React from "react";
import "./Navbar.css";
import { IoReorderThree } from "react-icons/io5";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "white" }}>
        <img src="/logo.png" alt="logo" className="logo" />
        BAAT<span style={{ color: "rgb(188,84,253)" }}>KRO</span>
      </div>
      <input type="checkbox" id="click" />
      <label htmlFor="click" className="menu-btn">
        <IoReorderThree style={{ color: "white", fontSize: "3rem" }} />
      </label>
      <ul>
        <li>
          <Link to="/">HOME</Link>
        </li>
        <li>
          <Link to="/about">ABOUT</Link>
        </li>
        <li>
          <Link to="/login">LOGIN</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
