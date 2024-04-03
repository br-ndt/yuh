import { useState } from "react";
import TextInput from "./TextInput";
import Title from "./Title";
import Username from "./Username";
import MessageList from "./MessageList";
import "./App.css";
import SocketProvider from "./SocketContext";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <SocketProvider>
          <Title />
          <TextInput />
          <MessageList />
        </SocketProvider>
      </header>
    </div>
  );
}

export default App;
