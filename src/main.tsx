import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { checkPermissions, requestPermissions } from "@tauri-apps/plugin-geolocation";
import { AuthProvider } from "@/components/AuthContext";

const WEB_DEBUG = false;

async function startApp() {
    let permissions = await checkPermissions();

    if (permissions.location === "prompt" || permissions.location === "prompt-with-rationale") {
        permissions = await requestPermissions(["location"]);
    }

    if (permissions.location === "granted") {
        ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
            <AuthProvider>
                <React.StrictMode>
                    <App />
                </React.StrictMode>
            </AuthProvider>
        );
    } else {
        console.error("Location permission denied.");
    }
}

// Call the function to start the app
if (!WEB_DEBUG) startApp();
else {
    ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
        <AuthProvider>
            <React.StrictMode>
                <App />
            </React.StrictMode>
        </AuthProvider>
    );
}
