import { useMemo, useState } from 'react'
import { AppContext } from './AppContextValue'

export function AppProvider({ children }) {
  const [toast, setToast] = useState(null)

  const value = useMemo(
    () => ({
      toast,
      setToast,
    }),
    [toast],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
