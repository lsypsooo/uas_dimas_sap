import {
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineUserGroup,
} from "react-icons/hi";

const UserAdminTable = ({ users, onEdit, onDelete }) => {
  if (!Array.isArray(users) || users.length === 0) {
    return (
      <div className="card p-10 text-center">
        <HiOutlineUserGroup className="mx-auto h-12 w-12 text-slate-300" />
        <p className="mt-3 text-sm font-medium text-slate-500">
          Belum ada data user admin yang tersedia.
        </p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left">
              <th className="px-6 py-3.5 font-semibold text-slate-600">
                Username
              </th>
              <th className="px-6 py-3.5 font-semibold text-slate-600">
                Email
              </th>
              <th className="px-6 py-3.5 font-semibold text-slate-600">
                Perusahaan
              </th>
              <th className="px-6 py-3.5 font-semibold text-slate-600 text-right">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-slate-900">
                  {user.username}
                </td>
                <td className="px-6 py-4 text-slate-600">{user.email}</td>
                <td className="px-6 py-4 text-slate-600">
                  {user.perusahaan?.nama || "N/A"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="btn-ghost !p-2 !text-slate-500 hover:!text-primary-600"
                      title="Edit"
                    >
                      <HiOutlinePencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(user.id)}
                      className="btn-ghost !p-2 !text-slate-500 hover:!text-red-600"
                      title="Hapus"
                    >
                      <HiOutlineTrash className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserAdminTable;
