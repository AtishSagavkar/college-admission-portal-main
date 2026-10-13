import { getNotificationsForUser } from '../../services/notificationService'
import { useAuth } from '../../hooks/useAuth'
import { useRemoteData } from '../../hooks/useRemoteData'
import AsyncState from '../../components/common/AsyncState'

const STATUS_COPY = {
  approved: { label: 'Approved', action: 'approved' },
  rejected: { label: 'Rejected', action: 'rejected' },
  processing: { label: 'Processing', action: 'being processed' },
  completed: { label: 'Completed', action: 'completed' },
}

const getNotificationContent = (notification) => {
  if (notification.type !== 'service_request_status') {
    return {
      title: notification.title || 'Notification',
      message: notification.message || 'You have a new update.',
      status: '',
    }
  }

  const titleStatusMatch = notification.title?.match(/\b(approved|rejected|processing|completed)\b/i)
  const messageStatusMatch = notification.message?.match(/\b(approved|rejected|processing|completed)\b/i)
  const status = (notification.status || titleStatusMatch?.[1] || messageStatusMatch?.[1] || '').toLowerCase()

  const serviceName = (
    notification.serviceName ||
    notification.title?.replace(/\s+request\s+.*$/i, '') ||
    'Service'
  )

  const copy = STATUS_COPY[status]
  if (!copy) {
    const fallbackTitle = notification.title || 'Service request update'
    return { title: fallbackTitle, message: notification.message || 'You have a new service update.', status: '' }
  }

  const requestNumber = notification.requestNumber ? `Request ${notification.requestNumber}` : 'Your request'
  const message = `${requestNumber} ${copy.action}.`

  return {
    title: `${serviceName} request ${copy.label}`,
    message,
    status,
  }
}

export default function NotificationsPage() {
  const { currentUser } = useAuth()
  const { data: notifications, loading, error } = useRemoteData(
    () => getNotificationsForUser(currentUser.uid),
    currentUser?.uid || '',
    [],
  )

  if (loading || error) return <AsyncState loading={loading} error={error} />

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
      <div className="mt-6 space-y-4">
        {notifications.length ? notifications.map((item) => {
          const content = getNotificationContent(item)
          const statusClass = item.read ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-700'

          return (
            <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {!item.read && <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />}
                  <h2 className="text-lg font-semibold text-slate-900">{content.title}</h2>
                </div>
                <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] ${statusClass}`}>
                  {content.status || item.type.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{content.message}</p>
              {item.createdAt && (
                <p className="mt-3 text-[11px] uppercase tracking-[0.15em] text-slate-400">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              )}
            </div>
          )
        }) : <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">No notifications yet.</div>}
      </div>
    </div>
  )
}
