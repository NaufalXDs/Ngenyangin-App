import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button.jsx";
import Form from "@/components/ui/Form.jsx";
import Alert from "@/components/ui/Alert.jsx";
import { updateUserAdmin } from "@/services/api.js";
import { FaXmark, FaCheck, FaUserPen } from "react-icons/fa6";

export default function UserEditDrawer({ isOpen, onClose, onSuccess, user }) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("USER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setUsername(user.username || "");
      setEmail(user.email || "");
      setRole(user.role || "USER");
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !username.trim() || !email.trim()) {
      setError("Name, username, and email are required.");
      return;
    }

    setLoading(true);

    try {
      await updateUserAdmin(user.id, { name, username, email, role });
      setLoading(false);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to update user");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-card border-l border-border shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/40">
            <div className="flex items-center gap-2">
              <FaUserPen className="text-primary" size={20} />
              <h2 className="text-xl font-bold text-foreground">Edit User Account</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
            >
              <FaXmark size={20} />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between overflow-y-auto">
            <div className="p-6 space-y-4">
              {error && <Alert type="error" message={error} onClose={() => setError("")} />}

              <div className="p-3 bg-muted/30 rounded-lg text-xs text-muted-foreground font-mono break-all">
                User ID: {user.id}
              </div>

              <Form
                label="Full Name"
                id="edit-user-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
              />

              <Form
                label="Username"
                id="edit-user-username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="john_doe"
              />

              <Form
                label="Email Address"
                id="edit-user-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
              />

              <div className="space-y-1">
                <label htmlFor="edit-user-role" className="block text-xs font-semibold text-foreground">
                  User Role
                </label>
                <select
                  id="edit-user-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-md border border-input px-3 py-2 text-sm bg-background shadow-xs focus:outline-none focus:ring-2 focus:ring-primary font-semibold"
                >
                  <option value="USER">USER</option>
                  <option value="REVIEWER">REVIEWER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>

            {/* Footer with Bottom-Right Save Button */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-muted/40">
              <Button variant="outline" size="md" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button variant="primary" size="md" loading={loading} type="submit">
                <FaCheck className="mr-1.5" /> Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
