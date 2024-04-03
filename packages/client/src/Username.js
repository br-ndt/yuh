import { useSocket } from "./SocketContext";

function Username() {
  const { username } = useSocket();


  return (
    <div className="username">
      <p>{username}</p>
    </div>
  );
}

export default Username;
