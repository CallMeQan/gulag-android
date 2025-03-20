import "./App.css";
import { useEffect, useRef, useState } from "react";
import WebSocketManager from "./components/WebSocketManager";
import GpsTracker from "./components/GPSTracker";
import SwitchButton from "./components/SwitchButton.tsx";

function App() {
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [accuracy, setAccuracy] = useState<number | null>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const [wsUrl, setWsUrl] = useState("ws://113.22.8.129:32400");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef != null) {
            const area = textareaRef.current;
            area!.scrollTop = area!.scrollHeight;
        }
    });

    // Display information
    const logger = (msg: string) => {
        function getDateTimeFormat(): string {
            const now = new Date();
            return now.toISOString().slice(11, -1); // Formats as HH:MM:SS.sssZ
        }
        msg = `[${getDateTimeFormat()}]`.concat(" ", msg);
        setLogs((prevLogs) => [...prevLogs, msg]);
    };
    const handleGpsUpdate = (lat: number, lng: number, acc: number) => {
        setLatitude(lat);
        setLongitude(lng);
        setAccuracy(acc);
        logger(`GPS Updated: ${lat} ${lng} ${acc}`);
        console.log(`GPS Updated: ${lat} ${lng} ${acc}`);
    };

    // Services
    const { socket, connectWebSocket } = WebSocketManager({ wsUrl, logger: logger });
    const { startTracking, stopTracking } = GpsTracker({
        socket,
        onGpsUpdate: handleGpsUpdate,
        logger: logger,
    });

    return (
        <main className="container">
            <div className="title-box">
                <h1>Welcome to Gulag Runner!</h1>
            </div>

            <div className="content-box">
                <div className="websocket-setting-panel">
                    <label>WebSocket URL:</label>
                    <input type="text" value={wsUrl} onChange={(e) => setWsUrl(e.target.value)} />
                    <button style={{ marginTop: "5px" }} onClick={() => connectWebSocket()}>
                        Connect WebSocket
                    </button>
                </div>

                <div className="gps-switch-box">
                    <p>GPS Tracker</p>
                    <SwitchButton onSuccess={startTracking} onFailure={stopTracking} />
                </div>
                <div className="gps-log-panel">
                    <p>Latitude: {latitude ?? "Not tracking"}</p>
                    <p>Longitude: {longitude ?? "Not tracking"}</p>
                    <p>Accuracy: {accuracy ? `${accuracy} meters` : "Unknown"}</p>
                </div>
            </div>
            <div className="console-panel">
                <textarea readOnly={true} value={logs.join("\n")} ref={textareaRef} style={{ width: "100%", height: "100%" }} />
            </div>
        </main>
    );
}

export default App;
