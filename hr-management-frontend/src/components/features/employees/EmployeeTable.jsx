import {
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineUsers,
} from "react-icons/hi";

const EmployeeTable = ({ employees, onEdit, onDelete }) => {
  if (!Array.isArray(employees) || employees.length === 0) {
    return (
      <div className="card p-10 text-center">
        <HiOutlineUsers className="mx-auto h-12 w-12 text-slate-300" />
        <p className="mt-3 text-sm font-medium text-slate-500">
          Belum ada data karyawan di perusahaan ini.
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
                Nama Karyawan
              </th>
              <th className="px-6 py-3.5 font-semibold text-slate-600">
                Email
              </th>
              <th className="px-6 py-3.5 font-semibold text-slate-600">
                Jabatan
              </th>
              <th className="px-6 py-3.5 font-semibold text-slate-600">
                Departemen
              </th>
              <th className="px-6 py-3.5 font-semibold text-slate-600 text-right">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {employees.map((employee) => (
              <tr
                key={employee.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-slate-900">
                  {employee.user?.username || "N/A"}
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {employee.user?.email || "N/A"}
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {employee.jabatan || "N/A"}
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {employee.departemen || "N/A"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(employee)}
                      className="btn-ghost !p-2 !text-slate-500 hover:!text-primary-600"
                      title="Edit"
                    >
                      <HiOutlinePencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(employee.id)}
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

export default EmployeeTable;
