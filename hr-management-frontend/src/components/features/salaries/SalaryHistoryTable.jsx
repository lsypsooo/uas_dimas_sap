import { HiOutlineCash, HiOutlineDownload } from "react-icons/hi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const monthNames = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(
    amount,
  );

const exportSlipGaji = (gaji) => {
  const doc = new jsPDF();
  const periode = `${monthNames[gaji.bulan - 1]} ${gaji.tahun}`;

  // Header
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("SLIP GAJI", 105, 25, { align: "center" });
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Periode: ${periode}`, 105, 33, { align: "center" });

  // Separator line
  doc.setDrawColor(79, 70, 229);
  doc.setLineWidth(0.8);
  doc.line(20, 38, 190, 38);

  // Detail table
  autoTable(doc, {
    startY: 45,
    margin: { left: 20, right: 20 },
    theme: "grid",
    headStyles: { fillColor: [79, 70, 229], fontSize: 11 },
    bodyStyles: { fontSize: 11 },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 60 } },
    body: [
      ["Periode", periode],
      ["Jumlah Gaji", formatCurrency(gaji.jumlah)],
      ["Status", gaji.status || "Dibayarkan"],
    ],
  });

  // Footer
  const finalY = doc.lastAutoTable.finalY + 15;
  doc.setFontSize(9);
  doc.setTextColor(128, 128, 128);
  doc.text(
    `Dicetak pada: ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`,
    20,
    finalY,
  );

  doc.save(`Slip_Gaji_${periode.replace(/\s/g, "_")}.pdf`);
};

const SalaryHistoryTable = ({ salaryHistory }) => {
  if (!Array.isArray(salaryHistory) || salaryHistory.length === 0) {
    return (
      <div className="card p-10 text-center">
        <HiOutlineCash className="mx-auto h-12 w-12 text-slate-300" />
        <p className="mt-3 text-sm font-medium text-slate-500">
          Belum ada riwayat gaji yang tercatat untuk Anda.
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
                Periode
              </th>
              <th className="px-6 py-3.5 font-semibold text-slate-600">
                Jumlah Gaji
              </th>
              <th className="px-6 py-3.5 font-semibold text-slate-600">
                Status
              </th>
              <th className="px-6 py-3.5 font-semibold text-slate-600 text-right">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {salaryHistory.map((gaji) => (
              <tr
                key={gaji.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-slate-900">
                  {monthNames[gaji.bulan - 1]} {gaji.tahun}
                </td>
                <td className="px-6 py-4 text-slate-900">
                  {formatCurrency(gaji.jumlah)}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                    {gaji.status || "Dibayarkan"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => exportSlipGaji(gaji)}
                    className="btn-ghost !p-2 !text-primary-600 hover:!bg-primary-50"
                    title="Download Slip Gaji"
                  >
                    <HiOutlineDownload className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalaryHistoryTable;
