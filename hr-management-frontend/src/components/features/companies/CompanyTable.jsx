// src/components/CompanyTable.jsx

const CompanyTable = ({ companies, onEdit, onDelete }) => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto ">
        <table className="w-full table-auto text-black">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black  xl:pl-11">
                Nama Perusahaan
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black ">
                Alamat
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black ">
                Email
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black ">
                No Telpon
              </th>
              <th className="py-4 px-4 font-medium text-black ">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id}>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black ">{company.nama}</h5>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black ">{company.alamat}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black ">{company.email}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black ">{company.telepon}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <button
                      onClick={() => onEdit(company)}
                      className="hover:text-primary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(company.id)}
                      className="hover:text-primary text-red-500"
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

export default CompanyTable;
