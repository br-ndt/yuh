import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext({
  socket: null,
  isConnected: false,
  messageList: [],
  sendMessage: () => undefined,
  username: "",
});

export default function SocketProvider({ children }) {
  const [socket, setSocket] = useState(
    io("http://localhost:8000", { path: "/socket.io" })
  );
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState("Loading ur dude's name...");
  const [usernameLoaded, setUsernameLoaded] = useState(false);
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });
    socket.on("username", (newUsername) => {
      setUsername(newUsername);
      setUsernameLoaded(true);
    });
    socket.on("messageUpdate", (newMessages) => {
      setMessageList((prevList) => [...prevList, ...newMessages.newMessages]);
    });
    socket.on("disconnect", () => {
      setUsername("Not Connected");
      setUsernameLoaded(false);
      setIsConnected(false);
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  const sendMessage = useCallback(
    (message) => {
      console.log(socket);
      if (socket && socket.connected) socket.emit("chatMessage", message);
    },
    [socket]
  );

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        messageList,
        sendMessage,
        username,
        usernameLoaded,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  if (!SocketContext) {
    throw new Error("SocketContext must be defined!");
  }
  return useContext(SocketContext);
}
