export default function Message({ username, content }) {
  return (
    <div
      className={`message ${username === "assistant" ? "assistant" : "user"}`}
    >
      <p>
        <span>{new Date().toLocaleString()} </span>
        <strong>{username}:</strong> {content}
      </p>
    </div>
  );
}
