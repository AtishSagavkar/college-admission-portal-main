export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <button type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50">Previous</button>
      {Array.from({ length: totalPages }).map((_, index) => {
        const number = index + 1
        return (
          <button
            key={number}
            type="button"
            onClick={() => onPageChange(number)}
            className={`rounded-lg px-3 py-2 text-sm ${number === page ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white text-slate-700'}`}
          >
            {number}
          </button>
        )
      })}
      <button type="button" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50">Next</button>
    </div>
  )
}
