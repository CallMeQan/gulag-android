interface PasswordPromptProps {
    password: string;
    setPassword: (password: string) => void;
    onSubmit: () => void;
    onCancel: () => void;
}

export default function PasswordPrompt({ password, setPassword, onSubmit, onCancel }: PasswordPromptProps) {
    return (
        <div className="form-unlock">
            <h2>Enter Admin Password</h2>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={onSubmit}>Submit</button>
            <button onClick={onCancel}>Cancel</button>
        </div>
    );
}
