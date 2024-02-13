import React, { useContext, useEffect, useState } from "react";
import Contact from "../Contact/Contact";
import ChatSection from "../ChatSection/ChatSection";
import { FaSearch } from "react-icons/fa";
import { ChatProviderContext } from "../../context/ChatProvider";
import { Navigate } from "react-router-dom";
import { socket } from "../../App";
import "./ChatPage.css";
import toast from "react-hot-toast";
import { Button, Modal } from "react-bootstrap";
import ContactSection from "../ContactSection/ContactSection";

const ChatPage = () => {
  const { isAuthenticated } = useContext(ChatProviderContext);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 860);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 860);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        } else {
          toast.error("Failed to fetch users");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllUsers();

    socket.on("users-changed", fetchAllUsers);

    return () => {
      socket.off("users-changed", fetchAllUsers);
    };
  }, []);

  const filteredUsers = users.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleModalToggle = () => {
    setShowModal(!showModal);
  };

  if (!isAuthenticated) return <Navigate to={"/"} />;

  return (
    <div>
      <h2 className="main-heading bg-dark text-white text-center py-2">
        Baat Kro
        {isSmallScreen && (
          <button
            className="btn btn-primary ms-3 mb-2"
            onClick={handleModalToggle}
          >
            Show Users
          </button>
        )}
      </h2>

      <div className="min-vh-100 overflow-hidden">
        <div className="row">
          <div className={`col-4 ps-4 ${isSmallScreen ? "d-none" : ""}`}>
            <ContactSection
              users={filteredUsers}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>
          <div
            className={`col ${
              isSmallScreen ? "col-12" : "col-8"
            } right-side pe-4`}
          >
            <div className="mt-4 rounded chats px-4 pt-3">
              <ChatSection />
            </div>
          </div>
        </div>
      </div>

      <Modal
        show={showModal}
        onHide={handleModalToggle}
        centered
        dialogClassName="custom-modal"
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <ContactSection
            users={filteredUsers}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ChatPage;
