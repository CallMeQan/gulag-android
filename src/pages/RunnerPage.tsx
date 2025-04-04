import { Label } from "@/components/ui/label";
import { useState, useRef, useEffect } from "react";
import { log } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RunnerPage() {
    const [gpsEnabled, setGpsEnabled] = useState(false);
    const [ip, setIp] = useState("183.80.166.96");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isConnected, setIsConnected] = useState(false);

    const socketRef = useRef<WebSocket | null>(null);
    const gpsInterval = useRef<NodeJS.Timeout | null>(null);

    // Handle manual connection
    const handleConnect = () => {
        const wsUrl = `ws://${ip}:32400`;
        const socket = new WebSocket(wsUrl);
        socketRef.current = socket;

        socket.onopen = () => {
            console.log("Connected to", wsUrl);
            setIsConnected(true);
        };

        socket.onerror = (err) => {
            console.error("WebSocket error:", err);
            setIsConnected(false);
        };

        socket.onclose = () => {
            console.warn("WebSocket closed");
            setIsConnected(false);
        };
    };

    // GPS Tracker Logic
    useEffect(() => {
        if (gpsEnabled) {
            gpsInterval.current = setInterval(() => {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const data = {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                                accuracy: position.coords.accuracy,
                                timestamp: new Date().toISOString(),
                            };
                            console.log(log("GPS Data: " + JSON.stringify(data)));

                            if (socketRef.current?.readyState === WebSocket.OPEN) {
                                socketRef.current.send(JSON.stringify(data));
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
                <div className="flex gap-2">
                    <Label className="block text-2xl mb-2">Email</Label>
                    <Input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. example@gmail.com"
                    />
                </div>
                <div className="flex gap-2">
                    <Label className="block text-2xl mb-2">Password</Label>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="flex-1 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder=""
                    />
                </div>
            </div>

            {/* IP Input + Connect Button */}
            <div className="w-full max-w-md mb-6">
                <Label className="block text-2xl mb-2">WebSocket IP</Label>
                <div className="flex gap-2">
                    <Input
                        type="text"
                        value={ip}
                        onChange={(e) => setIp(e.target.value)}
                        className="flex-1 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. 192.168.1.100"
                    />
                    <Button
                        onClick={handleConnect}
                        className="px-4 py-2 rounded-md font-semibold"
                    >
                        Connect
                    </Button>
                </div>

                {/* Connection status */}
                <Label className={`mt-2 text-sm ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                    {isConnected ? "Connected" : "Not connected"}
                </Label>
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