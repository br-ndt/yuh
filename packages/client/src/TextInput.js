import { useRef, useState } from "react";
import { useSocket } from "./SocketContext";

function TextInput() {
  const [inputValue, setInputValue] = useState("");
  const formRef = useRef();
  const { sendMessage } = useSocket();

  function handleInputChange(e) {
    setInputValue(e.target.value);
  }

  function handleSubmit(e) {
    if (e.which === 13 && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
      setInputValue("");
    }
  }

  return (
    <div className="textInput">
      <form ref={formRef}>
        <label>
          <textarea
            name="userInput"
            placeholder="Provide a command"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleSubmit}
            style={{ backgroundColor:"lightgrey", minHeight: "100px", minWidth: "600px" }}
          />
        </label>
      </form>
    </div>
  );
}

export default TextInput;
