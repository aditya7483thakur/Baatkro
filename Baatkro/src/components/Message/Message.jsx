import React, { useContext } from "react";
import "./Message.css";
import { ChatProviderContext } from "../../context/ChatProvider";
import { server } from "../../App";

const Message = ({ sender, message, senderImage }) => {
  let direction = "";
  const { user, chatwith } = useContext(ChatProviderContext);
  // console.log(`Chatwith.name: ${chatwith.name},receiver : ${receiver}`);
  if (sender === user) {
    direction = "right";
  } else {
    direction = "left";
  }

  return (
    <>
      <div className={`d-flex mb-3 ${direction}-allignment `}>
        <div style={{ height: "3rem", width: "3rem" }} className="mx-2">
          <img
            src={`${server}/image/${senderImage}`}
            alt=""
            className="img-fluid h-100 rounded-circle w-100 object-fit-cover"
          />
        </div>
        <span
          className={`p-2 ${direction}-colour`}
          style={{
            maxWidth: "60%",
            minHeight: "1rem",
            borderRadius: "0.8rem",
          }}
        >
          {message}
        </span>
      </div>
    </>
  );
};

export default Message;
