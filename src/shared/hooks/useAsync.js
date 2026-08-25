import { useState, useCallback } from "react"

export function useAsync(asyncFunction) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const execute = useCallback(
    async (...args) => {
      setLoading(true)
      setError(null)
      try {
        const response = await asyncFunction(...args)
        setData(response)
        return response
      } catch (err) {
        setError(err.message || "Ocurrió un error inesperado")
        throw err
      } finally {
        setLoading(false)
      }
    },
    [asyncFunction]
  )

  return { execute, loading, error, data, setData }
}
