import Message from "./Message";
import { useSocket } from "./SocketContext";

export default function MessageList() {
  const { messageList } = useSocket();
  // hold on, reverse it
  const reversedMessageList = [...messageList].reverse();

  return (
    <div className="messageList">
      {reversedMessageList.map((message, index) => (
        <Message
          key={index}
          content={message.content}
          username={message.username}
        />
      ))}
    </div>
  );
}
