import { useState } from "react";
import WebSocket from "@tauri-apps/plugin-websocket";

interface WebSocketManagerProps {
    wsUrl: string;
    logger: (msg: string) => void;
}

export default function WebSocketManager({ wsUrl, logger }: WebSocketManagerProps) {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    const connectWebSocket = async () => {
        if (socket) await socket.disconnect();
        const ws = await WebSocket.connect(wsUrl);
        if (!ws) {
            logger("Failed to connect to WebSocket");
            return;
        }
        ws.addListener((msg) => {
            if (msg.type === "Close") {
                logger(`${msg.data?.code} ${msg.data?.reason}`);
                setSocket(null);
            }else if(msg.type === "Ping") {
                ws.send({type: "Pong", data: msg.data});
            }
            else{
                logger(`Websocket ${msg.type.toString()}: ${msg.data.toString()}`)
            }
        });
        setSocket(ws);
    };

    return { socket, connectWebSocket };
}
