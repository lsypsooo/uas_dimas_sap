import React from "react";

const UserAdminTable = ({ users, onEdit, onDelete }) => {
  if (!Array.isArray(users) || users.length === 0) {
    return (
      <div className="rounded-sm border border-stroke bg-white px-5 py-10 text-center shadow-default dark:border-strokedark dark:bg-boxdark">
        <p className="font-medium text-black ">
          Belum ada data user admin yang tersedia.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black  xl:pl-11">
                Username
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black ">
                Email
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black ">
                Perusahaan
              </th>
              <th className="py-4 px-4 font-medium text-black ">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black ">
                    {user.username} {/* Menggunakan 'username' */}
                  </h5>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black ">{user.email}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black ">
                    {user.perusahaan?.nama || "N/A"}{" "}
                    {/* Menggunakan 'perusahaan.nama' */}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <button
                      onClick={() => onEdit(user)}
                      className="hover:text-primary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(user.id)}
                      className="text-red-500 hover:text-primary"
                    >
                      Hapus
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
