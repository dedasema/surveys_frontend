import {
  getDestinatarios,
  createDestinatario,
  updateDestinatario,
  deleteDestinatario,
} from "../../../services/api"

export const recipientsApi = {
  getAll: getDestinatarios,
  create: createDestinatario,
  update: updateDestinatario,
  delete: deleteDestinatario,
  uploadExcel: async (file) => {
    const formData = new FormData()
    formData.append("file", file)
    const token = localStorage.getItem("token")
    const API_BASE_URL =
      process.env.REACT_APP_API_URL || "https://surveys-backend-83d9.onrender.com"

    const response = await fetch(`${API_BASE_URL}/destinatarios/upload-excel`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}))
      const errorMessage =
        errJson.detail || errJson.message || `Error del servidor (${response.status})`
      throw new Error(errorMessage)
    }

    return response.json()
  },
}
