import { useState, useMemo } from "react";
import {
  HiOutlineSearch,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi";

const PAGE_SIZE = 10;

export function useSearchPagination(data, searchFields, pageSize = PAGE_SIZE) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const q = searchQuery.toLowerCase();
    return data.filter((item) =>
      searchFields.some((field) => {
        const value = field.split(".").reduce((obj, key) => obj?.[key], item);
        return String(value ?? "")
          .toLowerCase()
          .includes(q);
      }),
    );
  }, [data, searchQuery, searchFields]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize,
  );

  return {
    searchQuery,
    setSearchQuery,
    currentPage: safeCurrentPage,
    setCurrentPage,
    filtered,
    paginated,
    totalPages,
    total: data.length,
    filteredTotal: filtered.length,
  };
}

export function SearchBar({ value, onChange, placeholder = "Cari..." }) {
  return (
    <div className="relative">
      <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input !pl-9 !py-2 max-w-xs"
      />
    </div>
  );
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  filteredTotal,
  total,
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-slate-200 px-6 py-3">
      <p className="text-xs text-slate-500">
        Menampilkan {filteredTotal} dari {total} data
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="btn-ghost !p-1.5 disabled:opacity-30"
        >
          <HiOutlineChevronLeft className="h-4 w-4" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(
            (page) =>
              page === 1 ||
              page === totalPages ||
              Math.abs(page - currentPage) <= 1,
          )
          .reduce((acc, page, idx, arr) => {
            if (idx > 0 && page - arr[idx - 1] > 1) acc.push("...");
            acc.push(page);
            return acc;
          }, [])
          .map((page, idx) =>
            page === "..." ? (
              <span key={`dots-${idx}`} className="px-1 text-slate-400">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`min-w-[32px] rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                  page === currentPage
                    ? "bg-primary-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {page}
              </button>
            ),
          )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="btn-ghost !p-1.5 disabled:opacity-30"
        >
          <HiOutlineChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
