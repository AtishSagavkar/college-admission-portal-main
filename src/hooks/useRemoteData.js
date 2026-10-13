import { useEffect, useEffectEvent, useState } from 'react'

export function useRemoteData(loader, key, initialData = null) {
  const load = useEffectEvent(loader)
  const [state, setState] = useState(() => ({ key, data: initialData, loading: true, error: '' }))

  useEffect(() => {
    let active = true
    let request

    try {
      request = load()
    } catch (requestError) {
      request = Promise.reject(requestError)
    }

    Promise.resolve(request)
      .then((result) => {
        if (active) setState({ key, data: result, loading: false, error: '' })
      })
      .catch((requestError) => {
        if (active) {
          setState({
            key,
            data: null,
            loading: false,
            error: requestError.message || 'Unable to load data.',
          })
        }
      })

    return () => {
      active = false
    }
  }, [key])

  const stateIsCurrent = state.key === key
  return {
    data: stateIsCurrent ? state.data : initialData,
    loading: !stateIsCurrent || state.loading,
    error: stateIsCurrent ? state.error : '',
  }
}