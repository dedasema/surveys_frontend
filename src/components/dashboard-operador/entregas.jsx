// src/components/dashboard-operador/entregas.jsx
import DashboardOperadorLayout from "./layout"
import EntregasView from "../dashboard-suscriptor/entregas"

export default function EntregasOperador() {
  return <EntregasView LayoutComponent={DashboardOperadorLayout} />
}
