import { useState } from "react";
import WebSocket from "@tauri-apps/plugin-websocket";

interface WebSocketManagerProps {
    wsUrl: string;
    onMessage: (msg: string) => void;
}

export default function WebSocketManager({ wsUrl, onMessage }: WebSocketManagerProps) {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    const connectWebSocket = async () => {
        if (socket) await socket.disconnect();
        const ws = await WebSocket.connect(wsUrl);
        if (!ws) {
            onMessage("Failed to connect to WebSocket");
            return;
        }
        ws.addListener((msg) => {
            if (msg.type === "Text") {
                onMessage(msg.data);
            } else if (msg.type === "Close") {
                onMessage(`${msg.data?.code} ${msg.data?.reason}`);
                setSocket(null);
            }
        });
        setSocket(ws);
    };

    return { socket, connectWebSocket };
}
