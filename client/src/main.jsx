import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Register from "./components/Login&Register/Register.jsx";
import Login from "./components/Login&Register/Login.jsx";
import ChatPage from "./components/ChatPage/ChatPage.jsx";
import ChatProvider from "./context/ChatProvider.jsx";
import Home from "./components/Home/Home.jsx";
import About from "./components/About/About.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/chat",
        element: <ChatPage />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <ChatProvider>
    <RouterProvider router={router} />
  </ChatProvider>
  // </React.StrictMode>
);
