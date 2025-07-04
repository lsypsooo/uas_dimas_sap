import { useState, useEffect } from "react";
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
      // 1. Mengambil SEMUA user, karena controller tidak menyediakan filter by role
      const response = await apiClient.get("/users");
      const allUsers = response.data;

      // 2. Melakukan filter di sisi frontend
      // Sesuaikan 'ADMIN' jika nama peran di database Anda berbeda (misal: 'Admin Perusahaan')
      const adminUsers = allUsers.filter(
        (user) => user.role.toUpperCase() === "ADMIN_PERUSAHAAN"
      );

      setUsers(adminUsers);
    } catch (error) {
      console.error("Gagal mengambil data user admin:", error);
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
    // 3. Menyesuaikan payload dengan yang diharapkan backend
    const payload = { ...formData };
    if (editingUser && !payload.password) {
      delete payload.password;
    }

    try {
      if (editingUser) {
        // Endpoint PUT sudah benar
        await apiClient.put(`/users/${editingUser.id}`, payload);
        alert("User admin berhasil diperbarui.");
      } else {
        // 4. Endpoint POST diubah dan role ditambahkan ke payload
        await apiClient.post("/users", {
          ...payload,
          role: "ADMIN_PERUSAHAAN",
        });
        alert("User admin berhasil ditambahkan.");
      }
      handleCloseModal();
      fetchUserAdmins();
    } catch (error) {
      console.error("Gagal menyimpan user admin:", error);
      const errorMessage =
        error.response?.data?.error || "Gagal menyimpan user admin.";
      alert(errorMessage);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Yakin ingin menghapus user ini?")) {
      try {
        await apiClient.delete(`/users/${id}`);
        alert("User admin berhasil dihapus.");
        fetchUserAdmins();
      } catch (error) {
        console.error("Gagal menghapus user admin:", error);
        const errorMessage =
          error.response?.data?.error || "Gagal menghapus user admin.";
        alert(errorMessage);
      }
    }
  };

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-black ">
          Manajemen User Admin
        </h2>
        <button
          onClick={handleOpenAddModal}
          className="rounded-md bg-primary py-3 px-8 text-center font-medium text-white hover:bg-opacity-90"
        >
          Tambah User Admin
        </button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
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
