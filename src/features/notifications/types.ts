export type NotificationType = 'info' | 'warning' | 'error' | 'success';

export interface Notification {
  id: string;
  titulo: string;
  mensaje: string;
  tipo: NotificationType;
  activo?: boolean;
  creado_en: string;
  isRead?: boolean;
}

export type NotificationFilter = 'all' | 'unread' | 'info' | 'alerts';
