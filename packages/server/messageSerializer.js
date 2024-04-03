export default function messageSerializer(newMessage) {
  return {
    role: newMessage.username === "assistant" ? "assistant" : "user",
    content:
      newMessage.username === "assistant"
        ? newMessage.content
        : `${newMessage.username} says ${newMessage.content}`,
  };
}
