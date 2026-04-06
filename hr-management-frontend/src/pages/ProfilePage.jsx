import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import apiClient from "../services/api";
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineIdentification,
  HiOutlineShieldCheck,
  HiOutlinePencil,
  HiOutlineLockClosed,
} from "react-icons/hi2";

const roleLabel = {
  superadmin: "Super Admin",
  admin_perusahaan: "Admin Perusahaan",
  karyawan: "Karyawan",
};

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await apiClient.put("/auth/profile", profileForm);
      const updatedUser = response.data.user;
      // Update context and localStorage
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Profil berhasil diperbarui.");
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.error || "Gagal memperbarui profil.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.warn("Konfirmasi password tidak cocok.");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.warn("Password baru minimal 6 karakter.");
      return;
    }
    setIsSaving(true);
    try {
      await apiClient.put("/auth/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success("Password berhasil diubah.");
      setIsChangingPassword(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.error || "Gagal mengubah password.");
    } finally {
      setIsSaving(false);
    }
  };

  const fields = [
    { icon: HiOutlineUser, label: "Nama", value: user?.username },
    { icon: HiOutlineEnvelope, label: "Email", value: user?.email },
    { icon: HiOutlineIdentification, label: "Username", value: user?.username },
  ];

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="page-title">Profil Saya</h1>
      <p className="page-subtitle mb-6">Informasi akun Anda</p>

      <div className="card overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-3xl font-bold text-white ring-4 ring-white/30">
            {user?.username?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <h2 className="mt-3 text-xl font-semibold text-white">
            {user?.username || "User"}
          </h2>
          <span className="mt-1 inline-block rounded-full bg-white/20 px-3 py-0.5 text-sm font-medium text-white">
            {roleLabel[user?.role?.toLowerCase()] || user?.role || "Role"}
          </span>
        </div>

        {/* Profile Info / Edit Form */}
        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
            <div>
              <label className="label">Username</label>
              <input
                type="text"
                className="input"
                value={profileForm.username}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, username: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                value={profileForm.email}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, email: e.target.value }))
                }
                required
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn btn-secondary"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="btn btn-primary"
              >
                {isSaving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="divide-y divide-slate-100">
              {fields.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-4 px-6 py-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                      {label}
                    </p>
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {value || "-"}
                    </p>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-4 px-6 py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <HiOutlineShieldCheck className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                    Role
                  </p>
                  <span className="inline-block rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-700">
                    {roleLabel[user?.role?.toLowerCase()] || user?.role || "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
              <button
                onClick={() => {
                  setProfileForm({
                    username: user?.username || "",
                    email: user?.email || "",
                  });
                  setIsEditing(true);
                }}
                className="btn btn-secondary"
              >
                <HiOutlinePencil className="h-4 w-4 mr-1.5" />
                Edit Profil
              </button>
              <button
                onClick={() => setIsChangingPassword(true)}
                className="btn btn-secondary"
              >
                <HiOutlineLockClosed className="h-4 w-4 mr-1.5" />
                Ganti Password
              </button>
            </div>
          </>
        )}
      </div>

      {/* Change Password Modal */}
      {isChangingPassword && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsChangingPassword(false);
          }}
        >
          <div className="card w-full max-w-md p-0 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Ganti Password
              </h2>
              <button
                onClick={() => setIsChangingPassword(false)}
                className="btn-ghost !p-1.5 !rounded-lg"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
              <div>
                <label className="label">Password Lama</label>
                <input
                  type="password"
                  className="input"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm((p) => ({
                      ...p,
                      currentPassword: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div>
                <label className="label">Password Baru</label>
                <input
                  type="password"
                  className="input"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm((p) => ({
                      ...p,
                      newPassword: e.target.value,
                    }))
                  }
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="label">Konfirmasi Password Baru</label>
                <input
                  type="password"
                  className="input"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm((p) => ({
                      ...p,
                      confirmPassword: e.target.value,
                    }))
                  }
                  required
                  minLength={6}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className="btn btn-secondary"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn btn-primary"
                >
                  {isSaving ? "Menyimpan..." : "Ubah Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
