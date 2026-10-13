export default function FileUpload({ label, files = [], onAdd, onRemove, accept = '.pdf,.jpg,.jpeg,.png' }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <label className="cursor-pointer rounded-xl border border-emerald-500 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
          Upload
          <input type="file" accept={accept} multiple className="hidden" onChange={onAdd} />
        </label>
      </div>

      {files.length ? (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div key={`${file.name}-${index}`} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
              <div>
                <div className="font-medium text-slate-800">{file.name}</div>
                <div>{file.type || 'File'} • {file.size}</div>
              </div>
              <button type="button" onClick={() => onRemove(index)} className="text-red-600 hover:text-red-700">Remove</button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-500">No file uploaded yet.</p>
      )}
    </div>
  )
}
