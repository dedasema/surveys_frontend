import * as authService from "../../../services/auth"
import * as apiService from "../../../services/api"

export const authApi = {
  login: authService.login,
  register: authService.register,
  getCurrentUser: authService.getCurrentUser,
  requestPasswordReset: authService.requestPasswordReset,
  resetPassword: authService.resetPassword,
  updateSuscriptor: apiService.updateSuscriptor,
  updateOperator: apiService.updateOperator,
  updateAdmin: (data) => authService.updateAdmin ? authService.updateAdmin(data) : apiService.updateSuscriptor(data),
}
