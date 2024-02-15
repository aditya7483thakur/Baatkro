import React, { useContext } from "react";
import { server } from "../../App";
import { ChatProviderContext } from "../../context/ChatProvider";
import toast from "react-hot-toast";

const Contact = ({ item }) => {
  const { user, setChatWith, setMessages, setLoading } =
    useContext(ChatProviderContext);

  const fetchChat = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${server}/messages`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: user,
          receiver: item.name,
        }),
      });
      const json = await response.json();

      setLoading(false);
      if (json.success) {
        setMessages(json.chats);
      } else {
        toast.error("Some error occurred");
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const fetchGroupChat = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${server}/group-messages`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiver: "Chat With All", // or the name of the group chat you want to fetch messages for
        }),
      });
      const json = await response.json();

      setLoading(false);
      if (json.success) {
        setMessages(json.chats);
      } else {
        toast.error("Some error occurred");
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const handleChatWith = () => {
    if (item.name === "Chat With All") {
      fetchGroupChat();
    } else {
      fetchChat();
    }
    setChatWith({
      name: item.name,
      image: item.imagePath,
      email: item.email,
    });
  };

  return (
    <div
      onClick={handleChatWith}
      className="text-light py-2 contact"
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.5)",
      }}
    >
      <div className="d-flex position-relative">
        <div
          style={{
            height: "4rem",
            width: "4rem",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <img
            src={item.imagePath}
            alt=""
            className="img-fluid h-100 rounded-circle w-100 h-100 object-fit-cover"
          />
          <div className={item.isOnline ? "green-circle" : "red-circle"}></div>
        </div>
        <h4 className="my-auto ms-3">{item.name}</h4>
      </div>
    </div>
  );
};

export default Contact;
