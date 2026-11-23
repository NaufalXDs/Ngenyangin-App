import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { updateProfile } from "../services/api.js";
import { profileSchema } from "../utils/validation.js";
import Button from "../components/Button.jsx";
import Card from "../components/Card.jsx";
import Form from "../components/Form.jsx";
import Alert from "../components/Alert.jsx";
import { FaUserGear } from "react-icons/fa6";

export default function Profile() {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
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
      email,
      currentPassword: currentPassword || undefined,
      newPassword: newPassword || undefined,
      confirmPassword: confirmPassword || undefined,
    };

    const result = profileSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => {
        const path = err.path[0];
        fieldErrors[path] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const updatedUser = await updateProfile({
        name,
        email,
        ...(newPassword ? { currentPassword, newPassword } : {}),
      });

      updateUser(updatedUser);
      setSuccess("Profil berhasil diperbarui!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message || "Gagal memperbarui profil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col bg-orange-50/40">
      <div className="max-w-2xl mx-auto px-6 py-12 w-full space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#F3C743] text-[#31281F] rounded-xl border border-[#31281F] shadow-[3px_3px_0_#31281F]">
            <FaUserGear size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#31281F]">Pengaturan Profil</h1>
            <p className="text-sm text-gray-600">Perbarui informasi akun dan password Anda.</p>
          </div>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError("")} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess("")} />}

        <Card title="Informasi Akun">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Form
              label="Nama Lengkap"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              required
            />

            <Form
              label="Email"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              required
            />

            <hr className="border-gray-200 my-4" />

            <h3 className="font-bold text-[#31281F] text-base">Ubah Password (Opsional)</h3>

            <Form
              label="Password Saat Ini"
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              error={errors.currentPassword}
            />

            <Form
              label="Password Baru"
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
              error={errors.newPassword}
            />

            <Form
              label="Konfirmasi Password Baru"
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi password baru"
              error={errors.confirmPassword}
            />

            <div className="pt-4 flex justify-end">
              <Button type="submit" variant="primary" size="lg" loading={loading} fullWidth>
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
