import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React, { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Login from "./components/Login&Register/Login";
import Register from "./components/Login&Register/Register";
import ChatPage from "./components/ChatPage/ChatPage";
import { isAuthenticated } from "../../Baatkro-backend/utils/auth";
import { ChatProviderContext } from "./context/ChatProvider";

export const server = "http://localhost:4000";

const App = () => {
  const { setUser, setIsAuthenticated } = useContext(ChatProviderContext);
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const response = await fetch(`${server}/user/isAuthenticated`, {
  //       method: "GET",
  //       credentials: "include",
  //     });

  //     const json = await response.json();
  //     console.log(json);

  //     if (json.success) {
  //       // setUser(json.user);
  //       setIsAuthenticated(true);
  //     }
  //   };
  //   fetchUser();
  // }, [isAuthenticated]);
  return (
    <>
      {/* <Outlet /> */}
      <div>HII</div>
    </>
  );
};

export default App;
