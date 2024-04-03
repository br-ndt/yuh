import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  useEffect(() => {
    async function testFetch() {
      const res = await fetch("/test/");
      const json = await res.json();
      setMessage(json.text);
    }

    testFetch();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>{message}</p>
      </header>
    </div>
  );
}

export default App;
