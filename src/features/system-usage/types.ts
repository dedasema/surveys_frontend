export interface EspacioUsadoInfo {
  bytes: number;
  mb: number;
  limite_mb: number;
  porcentaje_usado: number;
  unidad: string;
  formateado: string;
}

export interface GraficaDiaUso {
  fecha: string;
  cantidad: number;
}

export interface DiaPicoInfo {
  fecha: string;
  cantidad: number;
}

export interface TopUsuarioUso {
  usuario_id: string;
  email: string;
  nombre: string;
  rol: string;
  total_operaciones: number;
}

export interface CudPorcentajes {
  crear: number;
  modificar: number;
  eliminar: number;
  otros: number;
}

export interface TiposOperacionesCud {
  crear: number;
  modificar: number;
  eliminar: number;
  otros: number;
  total: number;
  porcentajes: CudPorcentajes;
}

export interface SystemUsageMetricsResponse {
  ultima_sesion: string;
  espacio_usado: EspacioUsadoInfo;
  pago_total_acumulado: number;
  moneda: string;
  frecuencia_pago: string;
  plan_nombre: string;
  estado_suscripcion: string;
  proximo_pago: string;
  grafica_dias_mayor_uso: GraficaDiaUso[];
  dia_pico: DiaPicoInfo;
  top_5_usuarios: TopUsuarioUso[];
  tipos_operaciones_cud: TiposOperacionesCud;
}
