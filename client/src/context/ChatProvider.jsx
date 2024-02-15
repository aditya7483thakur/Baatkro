import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";

export const ChatProviderContext = createContext();

//fetching products from api
const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [chatwith, setChatWith] = useState({});
  const [messages, setMessages] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [senderImage, setSenderImage] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <ChatProviderContext.Provider
      value={{
        user,
        setUser,
        chatwith,
        setChatWith,
        messages,
        setMessages,
        isAuthenticated,
        setIsAuthenticated,
        senderImage,
        setSenderImage,
        setUserId,
        userId,
        setLoading,
        loading,
      }}
    >
      {children}
    </ChatProviderContext.Provider>
  );
};

export default ChatProvider;
