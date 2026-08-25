import { useState, useEffect, useCallback, useMemo } from "react"
import { toast } from "sonner"
import { useAuth } from "../../../context/AuthContext"
import { operatorsApi } from "../services/operatorsApi"

export function useOperators() {
  const { user } = useAuth()
  const [operators, setOperators] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const loadOperators = useCallback(async (userId) => {
    if (!userId) return
    setLoading(true)
    try {
      const data = await operatorsApi.list(userId)
      const list = Array.isArray(data) ? data : []
      setOperators(list)
      localStorage.setItem(`operadores_${userId}`, JSON.stringify(list))
    } catch (err) {
      console.error("Error loading operators:", err)
      const local = localStorage.getItem(`operadores_${userId}`)
      if (local) {
        setOperators(JSON.parse(local))
      } else {
        toast.error(err.message || "Error al cargar operadores")
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user?.id) {
      loadOperators(user.id)
    }
  }, [user?.id, loadOperators])

  const registerOperator = async (formData) => {
    if (!user?.id) return
    try {
      await operatorsApi.register({
        ...formData,
        suscriptor_id: user.id,
        password: "Temporal123!",
      })
      toast.success("Operador registrado exitosamente")
      await loadOperators(user.id)
      return true
    } catch (err) {
      console.error("Error registering operator:", err)
      toast.error(err.message || "No se pudo registrar el operador")
      throw err
    }
  }

  const filteredOperators = useMemo(() => {
    if (!searchTerm.trim()) return operators
    const term = searchTerm.toLowerCase()
    return operators.filter(
      (op) =>
        op.nombre_completo?.toLowerCase().includes(term) ||
        op.email?.toLowerCase().includes(term)
    )
  }, [operators, searchTerm])

  return {
    operators,
    filteredOperators,
    loading,
    searchTerm,
    setSearchTerm,
    registerOperator,
  }
}
