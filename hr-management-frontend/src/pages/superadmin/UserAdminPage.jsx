import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { HiOutlinePlus } from "react-icons/hi";
import apiClient from "../../services/api";
import UserAdminTable from "../../components/features/users/UserAdminTable";
import UserAdminModal from "../../components/features/users/UserAdminModal";

const UserAdminPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUserAdmins = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get("/users");
      const allUsers = response.data;
      const adminUsers = allUsers.filter(
        (user) => user.role?.toLowerCase() === "admin_perusahaan",
      );
      setUsers(adminUsers);
    } catch {
      toast.error("Gagal mengambil data user admin.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAdmins();
  }, []);

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSaveUser = async (formData) => {
    const payload = { ...formData };
    if (editingUser && !payload.password) {
      delete payload.password;
    }

    try {
      if (editingUser) {
        await apiClient.put(`/users/${editingUser.id}`, payload);
        toast.success("User admin berhasil diperbarui.");
      } else {
        await apiClient.post("/users", {
          ...payload,
          role: "ADMIN_PERUSAHAAN",
        });
        toast.success("User admin berhasil ditambahkan.");
      }
      handleCloseModal();
      fetchUserAdmins();
    } catch (error) {
      toast.error(error.response?.data?.error || "Gagal menyimpan user admin.");
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Yakin ingin menghapus user ini?")) {
      try {
        await apiClient.delete(`/users/${id}`);
        toast.success("User admin berhasil dihapus.");
        fetchUserAdmins();
      } catch (error) {
        toast.error(
          error.response?.data?.error || "Gagal menghapus user admin.",
        );
      }
    }
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">Manajemen User Admin</h1>
          <p className="page-subtitle">Kelola akun admin perusahaan.</p>
        </div>
        <button onClick={handleOpenAddModal} className="btn-primary">
          <HiOutlinePlus className="h-5 w-5" />
          Tambah User Admin
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      ) : (
        <UserAdminTable
          users={users}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteUser}
        />
      )}

      <UserAdminModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveUser}
        userToEdit={editingUser}
      />
    </>
  );
};

export default UserAdminPage;
