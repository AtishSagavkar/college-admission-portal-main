export default function AdminSettingsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="mt-2 text-sm text-slate-600">System preferences and administrative controls.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Admission Configuration</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between"><span>Application deadline</span><span className="font-medium text-slate-900">15 Aug 2026</span></div>
            <div className="flex items-center justify-between"><span>Document checklist</span><span className="font-medium text-slate-900">Enabled</span></div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Notifications</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between"><span>Student alerts</span><span className="font-medium text-slate-900">On</span></div>
            <div className="flex items-center justify-between"><span>Email reminders</span><span className="font-medium text-slate-900">Scheduled</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
