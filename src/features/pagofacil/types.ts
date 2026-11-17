export interface TipoCambioResponse {
  valor: number;
  fuente: string;
  moneda: string;
  fecha?: string;
  es_fallback: boolean;
}

export interface GenerarQRPayload {
  plan_id: number | string;
  document_id?: string;
  document_type?: number;
  phone_number?: string;
  client_name?: string;
  email?: string;
  callback_url?: string;
}

export interface GenerarQRResponse {
  success: boolean;
  payment_number: string;
  transaction_id?: string;
  status: string;
  qr_base64?: string;
  checkout_url?: string;
  deep_link?: string;
  deepLink?: string;
  qr_content_url?: string;
  universal_url?: string;
  expiration_date?: string;
  fecha_vencimiento?: string;
  monto: number;
  monto_real_bob?: number;
  monto_qr?: number;
  tipo_cambio?: number;
  es_fallback_tc?: boolean;
  moneda: string;
  plan_nombre: string;
}

export interface ConsultarTransaccionResponse {
  success?: boolean;
  payment_number: string;
  status?: "pendiente" | "completado" | "expirado" | "fallido" | string;
  estado?: string;
  pagado?: boolean;
  monto: number;
  monto_qr?: number;
  tipo_cambio?: number;
  moneda?: string;
  pagofacil_transaction_id?: string;
  fecha_pago?: string;
  mensaje?: string;
}

export type PaymentMethodType = 'stripe' | 'pagofacil';
