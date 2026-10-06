import { Lock } from "lucide-react";

export default function AdminEntry() {
  const openAdmin = () => {
    window.location.hash = "admin";
  };

  return (
    <button
      type="button"
      className="admin-entry"
      onClick={openAdmin}
      aria-label="Admin login"
      title="Admin login"
    >
      <Lock size={18} aria-hidden="true" />
    </button>
  );
}
