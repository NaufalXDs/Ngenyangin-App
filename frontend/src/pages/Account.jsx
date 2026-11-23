import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { updateProfile } from "../services/api.js";
import { profileSchema } from "../utils/validation.js";
import Button from "../components/Button.jsx";
import Card from "../components/Card.jsx";
import Form from "../components/Form.jsx";
import Alert from "../components/Alert.jsx";
import WorkspaceLayout from "../layouts/WorkspaceLayout.jsx";
import { FaUserGear, FaCamera } from "react-icons/fa6";

export default function Account() {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setError("");
    setSuccess("");

    const formData = {
      name,
      username,
      email,
      currentPassword: currentPassword || undefined,
      newPassword: newPassword || undefined,
      confirmPassword: confirmPassword || undefined,
    };

    const result = profileSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = {};
      const issues = result.error?.errors || result.error?.issues || [];
      issues.forEach((err) => {
        const path = err.path && err.path[0];
        if (path) {
          fieldErrors[path] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const updatedUser = await updateProfile({
        name,
        username,
        email,
        ...(newPassword ? { currentPassword, newPassword } : {}),
      });

      updateUser(updatedUser);
      setSuccess("Account updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message || "Failed to update account");
    } finally {
      setLoading(false);
    }
  };

  const initial = (name || username || email || "U").charAt(0).toUpperCase();

  return (
    <WorkspaceLayout>
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary text-primary-foreground rounded-xl shadow-xs">
            <FaUserGear size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Account Settings
            </h1>
            <p className="text-sm text-muted-foreground">
              Update your account details and password.
            </p>
          </div>
        </div>

        {error && (
          <Alert type="error" message={error} onClose={() => setError("")} />
        )}
        {success && (
          <Alert
            type="success"
            message={success}
            onClose={() => setSuccess("")}
          />
        )}

        {/* Full Width Two-Column Layout with Equal Height */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full items-stretch">
          {/* Left Column: Account Information Form (2 cols) */}
          <div className="xl:col-span-2 flex flex-col">
            <Card
              title="Account Information"
              className="h-full flex flex-col justify-between"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <Form
                  label="Username"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  error={errors.username}
                  required
                  placeholder="unique_username"
                />
                <Form
                  label="Name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={errors.name}
                  required
                  placeholder="Your Name"
                />
                <Form
                  label="Email Address"
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                  required
                  placeholder="name@email.com"
                />

                <hr className="border-border my-4" />

                <h3 className="font-bold text-foreground text-base">
                  Change Password (Optional)
                </h3>

                <Form
                  label="Current Password"
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  error={errors.currentPassword}
                />

                <Form
                  label="New Password"
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  error={errors.newPassword}
                />

                <Form
                  label="Confirm New Password"
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  error={errors.confirmPassword}
                />

                <div className="pt-4 flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    loading={loading}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Right Column: Profile Photo Card (1 col) */}
          <div className="xl:col-span-1 flex flex-col">
            <Card
              title="Profile Photo"
              className="h-full flex flex-col justify-between"
              bodyClassName="flex-1 flex flex-col justify-center items-center"
            >
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <div className="w-28 h-28 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-5xl font-black shadow-md">
                    {initial}
                  </div>
                  <button
                    type="button"
                    aria-label="Upload photo"
                    className="absolute bottom-0 right-0 p-3 bg-card text-foreground border border-border rounded-full shadow-md hover:bg-muted transition cursor-pointer"
                  >
                    <FaCamera size={16} />
                  </button>
                </div>

                <div className="text-center space-y-1">
                  <h3 className="font-bold text-foreground text-lg">
                    {username || "User"}
                  </h3>
                  <p className="text-xs text-primary font-semibold">
                    @{name || "name"}
                  </p>
                  <p className="text-xs text-muted-foreground">{email}</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-amber-100 text-amber-900 rounded-md text-[11px] font-bold uppercase tracking-wider">
                    {user?.role || "USER"}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground text-center px-4 pt-2">
                  Profile avatars use your account initials by default. Custom
                  photo uploads coming soon.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
