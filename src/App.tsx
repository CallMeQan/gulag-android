import "./App.css";
import { useState } from "react";
import WebSocketManager from "./components/WebSocketManager";
import GpsTracker from "./components/GPSTracker";
import PasswordPrompt from "./components/PasswordPrompt";

function App() {
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [accuracy, setAccuracy] = useState<number | null>(null);
    const [logMsg, setLogMsg] = useState<string>(" ");
    const [webSocketMsg, setWebSocketMsg] = useState<string>(" ");
    const [wsUrl, setWsUrl] = useState("ws://1.54.87.29:8001");
    const [locked, setLocked] = useState(true);
    const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
    const [password, setPassword] = useState("");

    const handleGpsUpdate = (lat: number, lng: number, acc: number) => {
        setLatitude(lat);
        setLongitude(lng);
        setAccuracy(acc);
        console.log("GPS Updated:", lat, lng, acc);
    };

    const handleLogMessage = (message: string) => setLogMsg(message);
    const handleWebSocketMessage = (message: string) => setWebSocketMsg(message);

    const { socket, connectWebSocket } = WebSocketManager({ wsUrl, onMessage: handleWebSocketMessage });
    const { isTracking, toggleTracking } = GpsTracker({
        socket,
        onGpsUpdate: handleGpsUpdate,
        onLogMessage: handleLogMessage,
    });

    const checkPassword = () => {
        if (password === "admin123") {
            setLocked(false);
            setShowPasswordPrompt(false);
        } else {
            alert("Incorrect password!");
        }
    };

    return (
        <main className="container">
            <h1>Welcome to Gulag Runner!</h1>

            <div className="input-group" style={{ display: "flex" }}>
                <label>WebSocket URL:</label>
                <input type="text" value={wsUrl} onChange={(e) => setWsUrl(e.target.value)} disabled={locked} />
            </div>
            <button onClick={() => setShowPasswordPrompt(true)}>Unlock</button>

            <button onClick={() => connectWebSocket()}>Connect WebSocket</button>

            {showPasswordPrompt && (
                <PasswordPrompt password={password} setPassword={setPassword} onSubmit={checkPassword} onCancel={() => setShowPasswordPrompt(false)} />
            )}

            <button className={`tracking-btn ${isTracking ? "active" : ""}`} onClick={toggleTracking}>
                {isTracking ? "Tracking" : "Start tracking"}
            </button>

            <div className="log-panel">
                <p>Latitude: {latitude ?? "Not tracking"}</p>
                <p>Longitude: {longitude ?? "Not tracking"}</p>
                <p>Accuracy: {accuracy ? `${accuracy} meters` : "Unknown"}</p>
                <p>===================</p>
                <p>{logMsg}</p>
                <p>{webSocketMsg}</p>
            </div>
        </main>
    );
}

export default App;
