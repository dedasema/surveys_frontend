import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCheck,
  Check,
  RotateCcw,
  Trash2,
  Search,
  RefreshCw,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Inbox,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { AppLayout } from '../../../shared/layouts/AppLayout';
import { useAuth } from '../../../context/AuthContext';
import { notificationsService } from '../services/notificationsService';

export const NotificationsPage = ({ role = 'suscriptor' }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'unread' | 'info' | 'alerts'
  const [searchQuery, setSearchQuery] = useState('');

  let authUser = null;
  try {
    const auth = useAuth();
    authUser = auth?.user;
  } catch {
    // Graceful fallback outside of AuthProvider
  }
  const userKey = authUser?.id ? String(authUser.id) : undefined;

  const loadNotifications = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      else setLoading(true);

      const data = await notificationsService.fetchNotifications(userKey);
      setNotifications(data);
      if (isManual) {
        toast.success('Notificaciones actualizadas');
      }
    } catch (err) {
      console.error('Error al cargar notificaciones:', err);
      toast.error('Error al cargar las notificaciones');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadNotifications();

    const handleUpdate = () => {
      loadNotifications();
    };

    window.addEventListener('notifications_updated', handleUpdate);
    return () => {
      window.removeEventListener('notifications_updated', handleUpdate);
    };
  }, [userKey]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const criticalCount = notifications.filter(
    (n) => n.tipo === 'warning' || n.tipo === 'error'
  ).length;

  const handleMarkAllAsRead = () => {
    if (unreadCount === 0) {
      toast.info('No hay notificaciones sin leer');
      return;
    }
    notificationsService.markAllNotificationsAsRead(notifications, userKey);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success('Todas las notificaciones marcadas como leídas');
  };

  const handleToggleRead = (item) => {
    if (item.isRead) {
      notificationsService.markNotificationAsUnread(item.id, userKey);
      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, isRead: false } : n))
      );
      toast.success('Notificación marcada como no leída');
    } else {
      notificationsService.markNotificationAsRead(item.id, userKey);
      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
      );
      toast.success('Notificación marcada como leída');
    }
  };

  const handleDismiss = (item) => {
    notificationsService.dismissNotificationItem(item.id, userKey);
    setNotifications((prev) => prev.filter((n) => n.id !== item.id));
    toast.info('Notificación descartada');
  };

  // Filtered notifications
  const filteredNotifications = notifications.filter((item) => {
    if (activeFilter === 'unread' && item.isRead) return false;
    if (activeFilter === 'info' && item.tipo !== 'info' && item.tipo !== 'success') return false;
    if (activeFilter === 'alerts' && item.tipo !== 'warning' && item.tipo !== 'error') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.titulo?.toLowerCase().includes(q);
      const matchMsg = item.mensaje?.toLowerCase().includes(q);
      if (!matchTitle && !matchMsg) return false;
    }

    return true;
  });

  const getTypeIcon = (tipo) => {
    switch (tipo) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getTypeBadge = (tipo) => {
    switch (tipo) {
      case 'warning':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            Advertencia
          </span>
        );
      case 'error':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
            Alerta Crítica
          </span>
        );
      case 'success':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Novedad
          </span>
        );
      case 'info':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            Informativo
          </span>
        );
    }
  };

  const getBorderColor = (tipo) => {
    switch (tipo) {
      case 'warning':
        return 'border-l-amber-500';
      case 'error':
        return 'border-l-red-500';
      case 'success':
        return 'border-l-emerald-500';
      case 'info':
      default:
        return 'border-l-blue-500';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <AppLayout role={role}>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Main Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 pb-5">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Centro de Avisos & Alertas
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Notificaciones del Sistema
            </h1>
            <p className="text-sm text-gray-600 mt-1 max-w-2xl">
              Avisos importantes de la plataforma, novedades del sistema y alertas de tu empresa.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => loadNotifications(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors shadow-xs"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-blue-600' : ''}`} />
              <span>Actualizar</span>
            </button>

            <button
              type="button"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg shadow-xs transition-colors ${
                unreadCount === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
              }`}
            >
              <CheckCheck className="w-4 h-4" />
              <span>Marcar todas como leídas</span>
            </button>
          </div>
        </div>

        {/* 3 KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Notificaciones
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                {notifications.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Registradas en tu cuenta</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bell className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No Leídas
                </p>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-blue-700 animate-pulse">
                    Pendientes
                  </span>
                )}
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600 mt-1">
                {unreadCount}
              </p>
              <p className="text-xs text-gray-500 mt-1">Requieren tu atención</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Inbox className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Alertas Críticas / Advertencias
              </p>
              <p
                className={`text-2xl sm:text-3xl font-bold mt-1 ${
                  criticalCount > 0 ? 'text-amber-600' : 'text-gray-900'
                }`}
              >
                {criticalCount}
              </p>
              <p className="text-xs text-gray-500 mt-1">Prioridad alta del sistema</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filter bar & Search */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('unread')}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeFilter === 'unread'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              No Leídas ({unreadCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('info')}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeFilter === 'info'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Informativas
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('alerts')}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeFilter === 'alerts'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Alertas y Errores ({criticalCount})
            </button>
          </div>

          {/* Search input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar notificaciones..."
              className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Notification Cards List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs animate-pulse space-y-3"
              >
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-xs">
            <Inbox className="w-12 h-12 text-gray-400 mx-auto mb-3 opacity-60" />
            <h3 className="text-base font-bold text-gray-900">
              No se encontraron notificaciones
            </h3>
            <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
              {searchQuery || activeFilter !== 'all'
                ? 'No hay avisos que coincidan con los filtros aplicados o tu término de búsqueda.'
                : 'No tienes notificaciones registradas actualmente.'}
            </p>
            {(searchQuery || activeFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setActiveFilter('all');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                Restablecer filtros
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredNotifications.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-xl border border-gray-200 border-l-4 ${getBorderColor(
                  item.tipo
                )} p-4 sm:p-5 shadow-xs transition hover:shadow-sm ${
                  !item.isRead ? 'bg-blue-50/20 ring-1 ring-blue-100' : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {getTypeIcon(item.tipo)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-bold text-gray-900 leading-snug">
                          {item.titulo}
                        </h4>
                        {getTypeBadge(item.tipo)}
                        {!item.isRead && (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700">
                            No leída
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed max-w-4xl">
                        {item.mensaje}
                      </p>
                      <p className="text-xs text-gray-400 pt-1">
                        {formatDate(item.creado_en)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-start flex-shrink-0 pt-2 sm:pt-0">
                    <button
                      type="button"
                      onClick={() => handleToggleRead(item)}
                      title={item.isRead ? 'Marcar como no leída' : 'Marcar como leída'}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                        item.isRead
                          ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                          : 'border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100'
                      }`}
                    >
                      {item.isRead ? (
                        <>
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Marcar no leída</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Marcar leída</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDismiss(item)}
                      title="Descartar notificación"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-200 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Descartar</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default NotificationsPage;
