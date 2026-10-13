import { ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export default function FilterSelect({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const wrapperRef = useRef(null)
  const triggerRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const handlePointerDown = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setOpen(false)
    }
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  const selectedOption = options.find((option) => option.value === value) || options[0]

  const handleTriggerKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex(Math.max(0, options.findIndex((option) => option.value === value)))
      setOpen(true)
    }
  }

  const handleOptionKeyDown = (event, index) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const direction = event.key === 'ArrowDown' ? 1 : -1
      const nextIndex = (index + direction + options.length) % options.length
      setActiveIndex(nextIndex)
      wrapperRef.current?.querySelectorAll('[role="option"]')[nextIndex]?.focus()
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onChange(options[index].value)
      setOpen(false)
      triggerRef.current?.focus()
    }
  }

  return (
    <div ref={wrapperRef} className="relative min-w-0">
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleTriggerKeyDown}
        className="flex w-full min-w-0 items-center justify-between gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-left text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      >
        <span className="truncate">{selectedOption?.label}</span>
        <ChevronDown size={16} className="shrink-0 text-slate-500" />
      </button>
      {open && (
        <div
          role="listbox"
          aria-label={label}
          className="absolute inset-x-0 top-full z-30 mt-1 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl"
        >
          {options.map((option, index) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              tabIndex={activeIndex === index ? 0 : -1}
              onClick={() => {
                onChange(option.value)
                setOpen(false)
                triggerRef.current?.focus()
              }}
              onKeyDown={(event) => handleOptionKeyDown(event, index)}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm capitalize ${
                option.value === value
                  ? 'bg-emerald-50 font-semibold text-emerald-800'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
