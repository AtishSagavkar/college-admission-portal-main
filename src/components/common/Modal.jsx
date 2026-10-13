import { useEffect } from 'react'
import { createPortal } from 'react-dom'

export default function Modal({ open, title, children, onClose }) {
  useEffect(() => {
    if (!open) return undefined

    const scrollTargets = [
      document.documentElement,
      document.body,
      ...document.querySelectorAll('main, .service-scroll-region'),
    ]
    const previousOverflow = scrollTargets.map((element) => element.style.overflow)
    scrollTargets.forEach((element) => {
      element.style.overflow = 'hidden'
    })

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      scrollTargets.forEach((element, index) => {
        element.style.overflow = previousOverflow[index]
      })
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/55 p-2 backdrop-blur-[2px] sm:p-4"
      style={{ overscrollBehavior: 'contain' }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      onTouchStart={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="my-auto flex max-h-[calc(100dvh-1rem)] w-full max-w-xl flex-col overflow-hidden rounded-[1.25rem] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.28)] [overscroll-behavior:contain] sm:max-h-[calc(100dvh-2rem)] sm:rounded-2xl"
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 px-4 py-3.5 sm:gap-4 sm:p-6">
          <h3 className="min-w-0 break-words text-lg font-semibold text-slate-900 sm:text-xl">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="shrink-0 rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600"
          >
            ✕
          </button>
        </div>
        <div className="min-h-0 overflow-y-auto overscroll-contain px-4 py-4 sm:p-6">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  )
}
