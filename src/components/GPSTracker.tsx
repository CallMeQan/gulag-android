import { useState } from "react";
import WebSocket from "@tauri-apps/plugin-websocket";

interface GpsTrackerProps {
    socket: WebSocket | null;
    onGpsUpdate: (latitude: number, longitude: number, accuracy: number) => void;
    onLogMessage: (message: string) => void;
}

export default function GpsTracker({ socket, onGpsUpdate, onLogMessage }: GpsTrackerProps) {
    const [isTracking, setIsTracking] = useState(false);
    // @ts-ignore
    const [gpsInterval, setGpsInterval] = useState<NodeJS.Timeout | null>(null);

    const startTracking = () => {
        if ("geolocation" in navigator) {
            const interval = setInterval(() => {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        const acc = position.coords.accuracy;

                        onGpsUpdate(lat, lng, acc);
                        onLogMessage("GPS Updated");

                        if (socket) {
                            const gpsData = JSON.stringify({ latitude: lat, longitude: lng, accuracy: acc });
                            socket.send(gpsData).then(() => console.log("GPS Sent"));
                        }
                    },
                    (error) => {
                        console.error("Error getting location:", error);
                        onLogMessage("Failed to get GPS location.");
                    },
                    { enableHighAccuracy: true, timeout: 10000 }
                );
            }, 500);

            setGpsInterval(interval);
            setIsTracking(true);
        } else {
            onLogMessage("Geolocation is not supported by your browser.");
        }
    };

    const stopTracking = () => {
        if (gpsInterval) clearInterval(gpsInterval);
        setGpsInterval(null);
        setIsTracking(false);
    };

    const toggleTracking = () => {
        isTracking ? stopTracking() : startTracking();
    };

    return { isTracking, toggleTracking };
}
