import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React, { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { ChatProviderContext } from "./context/ChatProvider";

export const server = "http://localhost:4000";

const App = () => {
  const { setUser, setIsAuthenticated, setSenderImage, isAuthenticated } =
    useContext(ChatProviderContext);
  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`${server}/user/isAuthenticated`, {
        method: "GET",
        credentials: "include",
      });

      const json = await response.json();
      console.log(json);

      if (json.success) {
        setUser(json.user.name);
        setSenderImage(json.user.imagePath);
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
    </>
  );
};

export default App;
