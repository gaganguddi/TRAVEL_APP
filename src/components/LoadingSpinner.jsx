import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ message = "Loading..." }) {
    return (
        <div className="spinner-wrap">
            <div className="spinner-ring">
                <Loader2 size={28} className="spinner-icon" />
            </div>
            <p className="spinner-msg">{message}</p>
            <style>{`
        .spinner-wrap {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; gap: 16px; padding: 48px;
        }
        .spinner-ring {
          width: 60px; height: 60px; border-radius: 50%;
          background: var(--gradient-primary);
          display: flex; align-items: center; justify-content: center;
          color: white; box-shadow: var(--shadow-glow);
        }
        .spinner-icon { animation: spin 1s linear infinite; }
        .spinner-msg { color: var(--text-secondary); font-size: 0.9rem; }
      `}</style>
        </div>
    );
}
