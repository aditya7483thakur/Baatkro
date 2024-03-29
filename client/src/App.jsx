import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React, { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";

import { Toaster } from "react-hot-toast";
import { io } from "socket.io-client";
import { ChatProviderContext } from "./context/ChatProvider";
import Navbar from "./components/Navbar/Navbar";

export const server = "https://baatkro-backend.onrender.com";

export const socket = io("https://baatkro-backend.onrender.com", {
  autoConnect: false,
});
const App = () => {
  const {
    setUser,
    setIsAuthenticated,
    setSenderImage,
    isAuthenticated,
    setUserId,
  } = useContext(ChatProviderContext);
  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`${server}/user/isAuthenticated`, {
        method: "GET",
        credentials: "include",
      });

      const json = await response.json();

      if (json.success) {
        setUser(json.user.name);
        setSenderImage(json.user.imagePath);
        setUserId(json.user._id);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    };
    fetchUser();
  }, [isAuthenticated]);
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
};

export default App;
