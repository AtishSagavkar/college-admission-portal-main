import { Bell } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { markAsRead, subscribeToUserNotifications } from '../../services/notificationService'

export default function StudentNotificationBell() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const wrapperRef = useRef(null)
  const buttonRef = useRef(null)
  const panelRef = useRef(null)
  const [notifications, setNotifications] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState('')
  const [panelPosition, setPanelPosition] = useState(null)

  useEffect(() => {
    if (!currentUser?.uid) return undefined
    return subscribeToUserNotifications(
      currentUser.uid,
      setNotifications,
      (subscriptionError) => setError(subscriptionError.message || 'Unable to load notifications.'),
    )
  }, [currentUser?.uid])

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target) &&
        !panelRef.current?.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  useEffect(() => {
    if (!isOpen) return undefined

    const positionPanel = () => {
      const button = buttonRef.current
      if (!button) return

      const bounds = button.getBoundingClientRect()
      const width = Math.min(352, window.innerWidth - 32)
      const desiredHeight = Math.min(520, window.innerHeight - 32)
      const belowSpace = window.innerHeight - bounds.bottom - 28
      const aboveSpace = bounds.top - 28
      const top = belowSpace >= Math.min(desiredHeight, 240) || belowSpace >= aboveSpace
        ? bounds.bottom + 12
        : Math.max(16, bounds.top - desiredHeight - 12)
      const left = Math.max(16, Math.min(bounds.right - width, window.innerWidth - width - 16))

      setPanelPosition({ left, top, width, maxHeight: window.innerHeight - top - 16 })
    }

    positionPanel()
    window.addEventListener('resize', positionPanel)
    window.addEventListener('scroll', positionPanel, true)
    return () => {
      window.removeEventListener('resize', positionPanel)
      window.removeEventListener('scroll', positionPanel, true)
    }
  }, [isOpen])

  const unreadCount = notifications.filter((notification) => !notification.read).length

  const openNotifications = async (notification) => {
    setError('')
    if (notification && !notification.read) {
      try {
        await markAsRead(notification.id)
      } catch (readError) {
        setError(readError.message || 'Unable to mark notification as read.')
        return
      }
    }
    setIsOpen(false)
    navigate('/student/notifications')
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
        className="relative rounded-full border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:border-emerald-200 hover:text-emerald-600"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-emerald-500 px-1.5 text-center text-[10px] leading-5 text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && panelPosition && createPortal(
        <div
          ref={panelRef}
          className="fixed z-[100] flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
          style={{
            left: panelPosition.left,
            top: panelPosition.top,
            width: panelPosition.width,
            maxHeight: panelPosition.maxHeight,
          }}
        >
          <div className="border-b border-slate-200 px-4 py-3">
            <h2 className="text-sm font-semibold text-slate-900">Notifications</h2>
            <p className="mt-1 text-xs text-slate-500">Updates about your service requests</p>
          </div>
          {error && <p role="alert" className="px-4 py-3 text-xs text-red-600">{error}</p>}
          <div className="min-h-0 flex-1 overflow-y-auto">
            {notifications.length ? notifications.slice(0, 8).map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => openNotifications(notification)}
                className="flex w-full items-start gap-3 border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50"
              >
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${notification.read ? 'bg-slate-200' : 'bg-emerald-500'}`} />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-slate-800">{notification.title}</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-600">{notification.message}</span>
                  <span className="mt-1 block text-[11px] text-slate-400">
                    {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : 'Just now'}
                  </span>
                </span>
              </button>
            )) : (
              <p className="px-4 py-6 text-center text-sm text-slate-500">No notifications yet.</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => openNotifications()}
            className="w-full border-t border-slate-200 px-4 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
          >
            View all notifications
          </button>
        </div>,
        document.body,
      )}
    </div>
  )
}