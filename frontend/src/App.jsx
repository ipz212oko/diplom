import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

const socket = io("http://ws.localhost:80/");


function App() {
    const [count, setCount] = useState(0);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [apiData, setApiData] = useState("");

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected to server:", socket.id);
        });

        socket.on("receive_message", (data) => {
            setMessages((prev) => [...prev, data]);
        });
    }, []);

    const sendMessage = () => {
        if (message.trim()) {
            socket.emit("send_message", { roomId: "default", message });
            setMessage("");
        }
    };

    const fetchApiData = async () => {
        try {
            const response = await fetch("http://localhost:80/api");


            const contentType = response.headers.get("content-type");

            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                setApiData(data.message);
            } else {
                const text = await response.text();
                console.log("Received non-JSON data:", text);
                setApiData(text);
            }
        } catch (error) {
            console.error(error);
            setApiData("Error fetching data");
        }
    };


    return (
        <>
            <div>
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Vite + React + Socket.IO</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    Edit <code>src/App.jsx</code> and save to test HMR
                </p>
            </div>
            <div>
                <h2>Chat</h2>
                <div style={{ marginBottom: "1rem" }}>
                    {messages.map((msg, index) => (
                        <p key={index}>
                            <strong>{msg.sender}:</strong> {msg.message} ({msg.timestamp})
                        </p>
                    ))}
                </div>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message..."
                    style={{ padding: "0.5rem", marginRight: "0.5rem" }}
                />
                <button onClick={sendMessage} style={{ padding: "0.5rem 1rem" }}>
                    Send
                </button>
            </div>
            <div>
                <h2>API Data</h2>
                <button onClick={fetchApiData} style={{ padding: "0.5rem 1rem" }}>
                    Fetch API Data
                </button>
                <p>{apiData}</p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    );
}

export default App;
