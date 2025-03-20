import { useState } from "react";
import WebSocket from "@tauri-apps/plugin-websocket";

interface GpsTrackerProps {
    socket: WebSocket | null;
    onGpsUpdate: (latitude: number, longitude: number, accuracy: number) => void;
    logger: (message: string) => void;
}

export default function GpsTracker({ socket, onGpsUpdate, logger }: GpsTrackerProps) {
    const [isTracking, setIsTracking] = useState(false);
    // @ts-ignore
    const [gpsInterval, setGpsInterval] = useState<NodeJS.Timeout | null>(null);

    const stopTracking = () => {
        if (gpsInterval) clearInterval(gpsInterval);
        setGpsInterval(null);
        setIsTracking(false);
        onGpsUpdate(0,0,0);
        logger("GPS Stop");
    };

    const startTracking = () => {
        if (isTracking) stopTracking(); // block unexpect bug happen
        if ("geolocation" in navigator) {
            const interval = setInterval(() => {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        const acc = position.coords.accuracy;

                        onGpsUpdate(lat, lng, acc);
                        if (socket) {
                            const gpsData = JSON.stringify({ latitude: lat, longitude: lng, accuracy: acc });
                            socket.send(gpsData).then(() => {
                                console.log("GPS Sent");
                                logger("GPS Sent");
                            });
                        }
                    },
                    (error) => {
                        onGpsUpdate(0,0,0);
                        console.error("Error getting location:", error);
                        logger("Failed to get GPS location.");
                    },
                    { enableHighAccuracy: true, timeout: 10000 }
                );
            }, 500);

            setGpsInterval(interval);
            setIsTracking(true);
        } else {
            logger("Geolocation is not supported by your browser.");
        }
    };

    return { startTracking, stopTracking };
}
