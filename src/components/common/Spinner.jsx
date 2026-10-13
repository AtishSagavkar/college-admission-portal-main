export default function Spinner({ className = 'h-6 w-6 border-2' }) {
  return <span className={`inline-block animate-spin rounded-full border-emerald-600 border-t-transparent ${className}`} aria-label="Loading" />
}
