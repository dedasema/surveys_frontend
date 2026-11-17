export interface GenerarQRPayload {
  plan_id: number;
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
  monto: number;
  moneda: string;
  plan_nombre: string;
}

export interface ConsultarTransaccionResponse {
  success: boolean;
  payment_number: string;
  estado: string;
  pagado: boolean;
  monto: number;
  moneda: string;
  pagofacil_transaction_id?: string;
  fecha_pago?: string;
  mensaje: string;
}

export type PaymentMethodType = 'stripe' | 'pagofacil';
