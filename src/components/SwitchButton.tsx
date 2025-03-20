import './SwitchButtonCSS.css'
import React from "react";

interface SwitchButtonProps {
    onSuccess: () => void;
    onFailure: () => void;
}

export default function SwitchButton({onFailure, onSuccess}: SwitchButtonProps) {

    const onSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.checked)onSuccess();
        else onFailure();
    }

    return (
        <label className="switch">
            <input type="checkbox" onChange={onSwitchChange}/>
            <span className="slider"></span>
        </label>
    )
}