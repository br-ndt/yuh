import { useSocket } from "./SocketContext";

export default function Title() {
  const { username, usernameLoaded } = useSocket();
  return (
    <div className="title">
      <h1>{usernameLoaded ? `${username}, ` : ""}YUH IN THE DUNGEON</h1>
    </div>
  );
}
