import React, { useContext, useEffect, useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";
import { RiLogoutBoxRLine } from "react-icons/ri";
import "./ChatSection.css";
import { IoVideocam } from "react-icons/io5";
import Message from "../Message/Message";
import { Button, Modal } from "react-bootstrap";
import { CgProfile } from "react-icons/cg";
import ReactScrollToBottom from "react-scroll-to-bottom";
import { ChatProviderContext } from "../../context/ChatProvider";
import { server, socket } from "../../App";

const ChatSection = () => {
  const {
    user,
    chatwith,
    messages,
    senderImage,
    setMessages,
    setUser,
    setIsAuthenticated,
    userId,
  } = useContext(ChatProviderContext);
  const [show, setShow] = useState(false);
  const message = useRef();

  const handleLogout = async () => {
    try {
      const response = await fetch(`${server}/user/logout`, {
        method: "GET",
        credentials: "include",
      });

      const json = await response.json();

      if (json.success) {
        // toast.success(json.message);
        setIsAuthenticated(false);
        setUser(null);
      } else {
        // toast.success("Some Error Occured !");

        setIsAuthenticated(true);
      }
    } catch (error) {
      // toast.success("Some Error Occured !");
    }
  };

  const send = () => {
    socket.emit("message", {
      data: message.current.value,
      user,
      chatwith,
      senderImage,
    });
    message.current.value = "";
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    // Initialize socket connection
    const connectSocket = () => {
      socket.connect();
      console.log(`${user} connected : `, socket.id);
      socket.emit("login", { user, userId });
      console.log(user, userId);
    };

    // Disconnect socket when component unmounts
    const disconnectSocket = () => {
      socket.disconnect();
    };

    // Connect socket when component mounts
    connectSocket();

    // Clean up on component unmount
    return () => {
      disconnectSocket();
    };
  }, [user, userId]);

  useEffect(() => {
    // Set up event listener for receiving messages
    if (socket) {
      socket.off("recieve-message"); // Clear existing event listeners
      socket.on("recieve-message", ({ data, chatwith, user, senderImage }) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            data,
            receiver: chatwith.name,
            sender: user,
            senderImage,
            createdAt: Date.now(),
          },
        ]);
      });
      console.log("run");
    }
  }, [socket, setMessages]);

  if (!chatwith.name) {
    return <div></div>;
  }

  return (
    <>
      <div className="user-heading p-3 rounded">
        <div className="d-flex justify-content-between">
          <div className="d-flex">
            <div style={{ height: "4rem", width: "4rem" }}>
              <img
                src={`${server}/image/${chatwith.image}`}
                alt=""
                className="img-fluid h-100 rounded-circle  w-100 object-fit-cover"
              />
            </div>
            <h4 className=" ms-3 mt-2 text-light">{chatwith.name}</h4>

            <IoVideocam
              className="zoom-hover"
              style={{
                color: "white",
                height: "3rem",
                width: "3rem",
                paddingLeft: "1rem",
              }}
            />
          </div>
          <div>
            <CgProfile
              className="zoom-hover"
              onClick={handleShow}
              style={{
                color: "white",
                height: "3rem",
                width: "3rem",
                paddingLeft: "1rem",
              }}
            />
            <RiLogoutBoxRLine
              className="zoom-hover"
              style={{
                color: "white",
                height: "3rem",
                width: "3rem",
                paddingLeft: "1rem",
              }}
              onClick={handleLogout}
            />
          </div>

          <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton></Modal.Header>
            <center>
              <h1 className="py-1" style={{ color: "rgba(0,0,0,0.78" }}>
                {chatwith.name}
              </h1>{" "}
              <div style={{ height: "6rem", width: "6rem" }} className="mx-2">
                <img
                  src={`${server}/image/${chatwith.image}`}
                  alt=""
                  className="img-fluid h-100 rounded-circle w-100 object-fit-cover"
                />
              </div>
              <h4 className="text-muted py-2">Email : {chatwith.email}</h4>
            </center>{" "}
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
      <ReactScrollToBottom className="chat-section p-3">
        {messages.map(
          (item) =>
            ((item.receiver === user && item.sender === chatwith.name) ||
              (item.receiver === chatwith.name && item.sender === user)) && (
              <Message
                key={item.createdAt}
                message={item.data}
                sender={item.sender}
                receiver={item.receiver}
                senderImage={item.senderImage}
              />
            )
        )}
      </ReactScrollToBottom>

      <div className="input-container p-3 rounded d-flex align-items-center">
        <textarea
          type="text"
          ref={message}
          className="w-100 p-2 rounded border-0 me-2"
        />
        <button className="btn btn-success cursor-pointer" onClick={send}>
          <IoMdSend
            style={{
              fontSize: "1.5rem",
              paddingBottom: "2px",
              paddingLeft: "5px",
            }}
          />
        </button>
      </div>
    </>
  );
};

export default ChatSection;