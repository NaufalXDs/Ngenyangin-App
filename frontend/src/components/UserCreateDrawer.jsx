import React, { useState } from "react";
import Button from "./Button.jsx";
import Form from "./Form.jsx";
import Alert from "./Alert.jsx";
import { createUser } from "../services/api.js";
import { FaXmark, FaCheck, FaUserPlus } from "react-icons/fa6";

export default function UserCreateDrawer({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !username.trim() || !email.trim() || !password.trim()) {
      setError("Name, username, email, and password are required.");
      return;
    }

    setLoading(true);

    try {
      await createUser({ name, username, email, password, role });
      setLoading(false);
      onSuccess?.();
      onClose();
      // Reset form
      setName("");
      setUsername("");
      setEmail("");
      setPassword("");
      setRole("USER");
    } catch (err) {
      setError(err.message || "Failed to create user");
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
              <FaUserPlus className="text-primary" size={20} />
              <h2 className="text-xl font-bold text-foreground">Add New User</h2>
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

              <Form
                label="Full Name"
                id="user-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
              />

              <Form
                label="Username"
                id="user-username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="john_doe"
              />

              <Form
                label="Email Address"
                id="user-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
              />

              <Form
                label="Password"
                id="user-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
              />

              <div className="space-y-1">
                <label htmlFor="user-role" className="block text-xs font-semibold text-foreground">
                  User Role
                </label>
                <select
                  id="user-role"
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
                <FaCheck className="mr-1.5" /> Save User
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
