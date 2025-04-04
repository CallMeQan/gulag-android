import "./SwitchButtonCSS.css";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

interface SwitchButtonProps {
    onSuccess: () => void;
    onFailure: () => void;
}

export default function SwitchButton({ onFailure, onSuccess }: SwitchButtonProps) {
    return (
        <div className="switch">
            <Label>GPS Tracker</Label>
            <Switch
                onCheckedChange={(e) => {
                    if (e) onSuccess();
                    else onFailure();
                }}
            />
        </div>
    );
}
