import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Register from "./components/Login&Register/Register.jsx";
import Login from "./components/Login&Register/Login.jsx";
import ChatPage from "./components/ChatPage/ChatPage.jsx";
import ChatProvider from "./context/ChatProvider.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    // children: [
    //   {
    //     path: "/",
    //     element: <ChatPage />,
    //   },
    //   {
    //     path: "/register",
    //     element: <Register />,
    //   },
    //   {
    //     path: "/login",
    //     element: <Login />,
    //   },
    // ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <ChatProvider>
    <RouterProvider router={router} />
  </ChatProvider>
  // </React.StrictMode>
);
