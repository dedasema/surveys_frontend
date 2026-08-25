import { registerOperator, listOperadores } from "../../../services/api"

export const operatorsApi = {
  list: listOperadores,
  register: registerOperator,
}
