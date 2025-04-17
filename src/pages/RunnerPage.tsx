import { Label } from "@/components/ui/label";
import { useState, useRef, useEffect } from "react";
import { log } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthContext";
import { socket } from "@/lib/socket";

export default function RunnerPage() {
    const [gpsEnabled, setGpsEnabled] = useState(false);
    const [timeStart, setTimeStart] = useState<number | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const gpsInterval = useRef<NodeJS.Timeout | null>(null);

    const { user } = useAuth();

    // Handle manual connection
    const handleReload = () => {
        if (!socket.connected) {
            socket.connect();
            setIsConnected(true);
        }
    };

    // Connection listeners
    useEffect(() => {
        function handleConnect() {
            setIsConnected(true);
            socket.emit('joined', {});
        }

        function handleDisconnect() {
            setIsConnected(false);
        }

        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);

        return () => {
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
        };
    }, []);

    // GPS Tracker Logic
    useEffect(() => {
        if (gpsEnabled) {
            gpsInterval.current = setInterval(() => {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const data = {
                                hashed_timestamp: user?.hashed_timestamp,
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                                time_start: timeStart,
                                created_at: new Date().toISOString(),
                            };
                            console.log(log("GPS Data: " + JSON.stringify(data)));

                            if (socket.connected) {
                                socket.emit('updated_info_on_room', data);
                            }
                        },
                        (error) => {
                            console.log(log("GPS Error: " + error.message));
                        }
                    );
                }
            }, 3000);
        } else {
            if (gpsInterval.current) {
                clearInterval(gpsInterval.current);
                gpsInterval.current = null;
            }
        }

        return () => {
            if (gpsInterval.current) clearInterval(gpsInterval.current);
        };
    }, [gpsEnabled]);

    const handleGpsToggle = () => {
        if (timeStart === null) {
            setTimeStart(Math.floor(Date.now() / 1000));
        }
        if (!gpsEnabled) {
            setGpsEnabled(true);
        } else {
            setGpsEnabled(false);
        }
    }

    return (
        <div>
            <h1 className="text-4xl font-bold mb-8 text-red-800">Gulag Runner</h1>
            <div className="w-full max-w-md mb-6">
                {/* Connection status */}
                <Label className={`mt-2 text-sm ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                    {isConnected ? "Connected" : "Not connected"}
                </Label>
                <Button
                    onClick={handleReload}
                    className="px-4 py-2 rounded-md font-semibold"
                >
                    Reload
                </Button>
            </div>

            {/* GPS Tracker Switch */}
            <div>
                <div className="flex items-center gap-2">
                    <Label htmlFor="gps-tracker" className="text-2xl">GPS Tracker</Label>
                    <Button onClick={handleGpsToggle} >{gpsEnabled ? "Stop tracking" : "Start tracking"}</Button>
                </div>
                <Label className={`mt-2 text-sm ${gpsEnabled ? 'text-green-400' : 'text-red-400'}`}>
                    {gpsEnabled ? "GPS Started" : "GPS Stopped"}
                </Label>
            </div>
        </div>
    );
}