import React, { useContext, useEffect, useState } from "react";
import Contact from "../Contact/Contact";
import ChatSection from "../ChatSection/ChatSection";
import { FaSearch } from "react-icons/fa";
import { ChatProviderContext } from "../../context/ChatProvider";
import { Navigate } from "react-router-dom";

const ChatPage = () => {
  const { user } = useContext(ChatProviderContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/user/get-all-users",
          {
            method: "GET",
            credentials: "include",
          }
        );

        const json = await response.json();
        if (json.success) {
          setUsers(json.users);
          console.log(json.users);
        } else {
          console.log("Failed to fetch users");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllUsers();
  }, []);

  // if (!user) return <Navigate to={"/login"} />;

  return (
    <div>
      <div className="min-vh-100 overflow-hidden">
        <h2 className="main-heading bg-dark text-white text-center py-2">
          Baat Kro
        </h2>
        <div className="row ">
          <div className="col-4 ps-4 left-side ">
            <div className="mt-4  rounded contacts">
              <div>
                <div
                  className=" d-flex px-3 align-items-center"
                  style={{
                    minHeight: "6rem",
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <input
                    type="text"
                    className="p-2 w-100 rounded border-0 me-2"
                  />
                  <button className="btn btn-success cursor-pointer">
                    <FaSearch
                      style={{
                        fontSize: "1.2rem",
                      }}
                    />
                  </button>
                </div>
                {/* single contact */}
                <div
                  className=" overflow-auto px-3"
                  style={{
                    borderTop: "1px solid rgba(255,255,255,0.5)",
                    maxHeight: "30rem",
                  }}
                >
                  {users.map((item) => {
                    return <Contact key={item._id} item={item} />;
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="col-8 right-side pe-4">
            <div className="mt-4 rounded chats px-4 pt-3">
              {/* different components */}
              <div className="chat-user">
                <ChatSection />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
