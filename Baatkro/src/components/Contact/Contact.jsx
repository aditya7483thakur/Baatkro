import React, { useContext, useState } from "react";
import { server } from "../../App";
import { ChatProviderContext } from "../../context/ChatProvider";

const Contact = ({ item }) => {
  const { user, setChatWith, setMessages } = useContext(ChatProviderContext);
  const fetchChat = async () => {
    try {
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
      if (json.success) {
        setMessages(json.chats);
        console.log(json.chats);
      } else {
        console.log("some error occured");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChatWith = () => {
    setChatWith({
      name: item.name,
      image: item.imagePath,
      email: item.email,
    });
    fetchChat();
  };

  return (
    <div
      onClick={handleChatWith}
      className=" text-light py-2 contact"
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.5)",
      }}
    >
      <div className="d-flex">
        <div style={{ height: "4rem", width: "4rem", overflow: "hidden" }}>
          <img
            src={`${server}/image/${item.imagePath}
            `}
            alt=""
            className="img-fluid h-100 rounded-circle w-100 h-100 object-fit-cover"
          />
        </div>
        <h4 className="my-auto ms-3">{item.name}</h4>
      </div>
    </div>
  );
};

export default Contact;
