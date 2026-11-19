import { obtenerAnunciosActivos } from '../../../services/api';
import { Notification, NotificationType } from '../types';

export const resolveUserKey = (userKey?: string): string => {
  if (userKey) return userKey;
  try {
    const lastId = typeof localStorage !== 'undefined' ? localStorage.getItem('last_user_id') : null;
    if (lastId) return lastId;
    const userStr = typeof localStorage !== 'undefined' ? localStorage.getItem('user') : null;
    if (userStr) {
      const parsed = JSON.parse(userStr);
      if (parsed?.id) return String(parsed.id);
    }
  } catch {
    // Ignore storage parse errors
  }
  return 'default';
};

export const getReadIds = (userKey: string): string[] => {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(`notifications_read_${userKey}`) : null;
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const getDismissedIds = (userKey: string): string[] => {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(`notifications_dismissed_${userKey}`) : null;
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveReadIds = (ids: string[], userKey: string): void => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(`notifications_read_${userKey}`, JSON.stringify(ids));
    }
  } catch (e) {
    console.error('Error saving read notifications:', e);
  }
};

const saveDismissedIds = (ids: string[], userKey: string): void => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(`notifications_dismissed_${userKey}`, JSON.stringify(ids));
    }
  } catch (e) {
    console.error('Error saving dismissed notifications:', e);
  }
};

const notifyChange = (): void => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('notifications_updated'));
  }
};

export const FALLBACK_NOTIFICATIONS: Notification[] = [
  {
    id: 'system_welcome',
    titulo: 'Bienvenido a SurveySaaS',
    mensaje: 'Configura tus plantillas y canales para comenzar a enviar encuestas multicanal de alto impacto.',
    tipo: 'info',
    activo: true,
    creado_en: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'system_ai_ready',
    titulo: 'Asistente IA Activado',
    mensaje: 'El módulo de análisis predictivo y clusters semánticos se encuentra sincronizado y listo para procesar respuestas.',
    tipo: 'success',
    activo: true,
    creado_en: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'system_security_check',
    titulo: 'Recomendación de Seguridad',
    mensaje: 'Recuerda auditar las cuentas asignadas a tus operadores en la pestaña de Equipo > Operadores.',
    tipo: 'warning',
    activo: true,
    creado_en: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

export const fetchNotifications = async (userKey?: string): Promise<Notification[]> => {
  const key = resolveUserKey(userKey);
  const readIds = getReadIds(key);
  const dismissedIds = getDismissedIds(key);

  let rawList: any[] = [];
  try {
    const data = await obtenerAnunciosActivos();
    if (Array.isArray(data) && data.length > 0) {
      rawList = data;
    }
  } catch (err) {
    console.error('Error al obtener anuncios activos:', err);
  }

  if (rawList.length === 0) {
    rawList = FALLBACK_NOTIFICATIONS;
  }

  return rawList
    .filter((item) => item.activo !== false)
    .filter((item) => !dismissedIds.includes(String(item.id)))
    .map((item) => {
      const validType: NotificationType = ['info', 'warning', 'error', 'success'].includes(item.tipo)
        ? (item.tipo as NotificationType)
        : 'info';

      return {
        id: String(item.id),
        titulo: item.titulo || 'Aviso del Sistema',
        mensaje: item.mensaje || '',
        tipo: validType,
        activo: item.activo !== false,
        creado_en: item.creado_en || item.fecha || new Date().toISOString(),
        isRead: readIds.includes(String(item.id)),
      };
    });
};

export const markNotificationAsRead = (id: string, userKey?: string): void => {
  const key = resolveUserKey(userKey);
  const current = getReadIds(key);
  const strId = String(id);
  if (!current.includes(strId)) {
    saveReadIds([...current, strId], key);
    notifyChange();
  }
};

export const markNotificationAsUnread = (id: string, userKey?: string): void => {
  const key = resolveUserKey(userKey);
  const current = getReadIds(key);
  const strId = String(id);
  if (current.includes(strId)) {
    saveReadIds(current.filter((item) => item !== strId), key);
    notifyChange();
  }
};

export const markAllNotificationsAsRead = (notifications: Notification[], userKey?: string): void => {
  const key = resolveUserKey(userKey);
  const current = getReadIds(key);
  const newIds = Array.from(new Set([...current, ...notifications.map((n) => String(n.id))]));
  saveReadIds(newIds, key);
  notifyChange();
};

export const dismissNotificationItem = (id: string, userKey?: string): void => {
  const key = resolveUserKey(userKey);
  const current = getDismissedIds(key);
  const strId = String(id);
  if (!current.includes(strId)) {
    saveDismissedIds([...current, strId], key);
    notifyChange();
  }
};

export const notificationsService = {
  fetchNotifications,
  getReadIds,
  getDismissedIds,
  markNotificationAsRead,
  markNotificationAsUnread,
  markAllNotificationsAsRead,
  dismissNotificationItem,
  resolveUserKey,
  FALLBACK_NOTIFICATIONS,
};
