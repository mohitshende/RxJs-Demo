import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [screen, setScreen] = useState("First Screen");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:8000");

    eventSource.addEventListener(
      "NEW_LOG",
      (event) => {
        const data = JSON.parse(event.data);
        setStatus(data.status);
      },
      false
    );
    eventSource.onerror = () => {
      eventSource.close();
    };
    return () => {
      console.log("Closing eventSource");
      eventSource.close();
    };
  }, [screen]);

  const statusColor = {
    Pending: "#FAD9A1",
    "In Progress": "#F9F9C5",
    Completed: "#D9F8C4",
    Failed: "#F37878",
  };
  return (
    <div>
      {screen === "Second Screen" ? (
        <button onClick={() => setScreen("First Screen")}>
          Goto First Screen
        </button>
      ) : (
        <button onClick={() => setScreen("Second Screen")}>
          Goto Second Screen
        </button>
      )}
      <div style={{ backgroundColor: statusColor[status] }}>
        {screen === "First Screen" ? <h1> {screen}</h1> : <h1> {screen}</h1>}
      </div>
    </div>
  );
}

export default App;
