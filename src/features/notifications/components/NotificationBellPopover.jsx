import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Bell,
  Check,
  CheckCheck,
  Info,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../../context/AuthContext';
import { notificationsService } from '../services/notificationsService';

export const NotificationBellPopover = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const popoverRef = useRef(null);
  const location = useLocation();

  let authUser = null;
  try {
    const auth = useAuth();
    authUser = auth?.user;
  } catch {
    // Graceful fallback when outside of AuthProvider
  }
  const userKey = authUser?.id ? String(authUser.id) : undefined;

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationsService.fetchNotifications(userKey);
      setNotifications(data);
    } catch (err) {
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
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

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleToggle = () => {
    if (!isOpen) {
      loadNotifications();
    }
    setIsOpen((prev) => !prev);
  };

  const handleMarkAllAsRead = (e) => {
    e.stopPropagation();
    notificationsService.markAllNotificationsAsRead(notifications, userKey);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success('Todas las notificaciones marcadas como leídas');
  };

  const handleItemClick = (item) => {
    if (!item.isRead) {
      notificationsService.markNotificationAsRead(item.id, userKey);
      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
      );
    }
  };

  const isOperator = location.pathname.startsWith('/dashboard-operador');
  const targetUrl = isOperator
    ? '/dashboard-operador/notificaciones'
    : '/dashboard-suscriptor/notificaciones';

  const getTypeIcon = (tipo) => {
    switch (tipo) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getTypeBg = (tipo) => {
    switch (tipo) {
      case 'warning':
        return 'bg-amber-100';
      case 'error':
        return 'bg-red-100';
      case 'success':
        return 'bg-emerald-100';
      case 'info':
      default:
        return 'bg-blue-100';
    }
  };

  const formatRelativeTime = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return 'Hace un momento';
      if (diffMins < 60) return `Hace ${diffMins} min`;
      if (diffHours < 24) return `Hace ${diffHours} h`;
      if (diffDays === 1) return 'Ayer';
      if (diffDays < 7) return `Hace ${diffDays} d`;
      return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    } catch {
      return '';
    }
  };

  return (
    <div className="relative inline-block text-left" ref={popoverRef}>
      {/* Bell Trigger */}
      <button
        type="button"
        onClick={handleToggle}
        aria-label="Notificaciones"
        aria-expanded={isOpen}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover overlay */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white shadow-xl border border-gray-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="px-4 py-3 bg-gray-50/90 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-900">Notificaciones</h3>
              {unreadCount > 0 && (
                <span className="text-[11px] font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  {unreadCount} no leídas
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  title="Marcar todas como leídas"
                  className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Marcar leídas</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
            {loading && notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-400">Cargando avisos...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Check className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                <p className="text-sm font-semibold text-gray-800">¡Todo al día!</p>
                <p className="text-xs text-gray-500 mt-0.5">No tienes notificaciones pendientes</p>
              </div>
            ) : (
              notifications.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleItemClick(item);
                    }
                  }}
                  className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer text-left ${
                    item.isRead ? 'bg-white hover:bg-gray-50' : 'bg-blue-50/50 hover:bg-blue-50/80'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${getTypeBg(
                      item.tipo
                    )}`}
                  >
                    {getTypeIcon(item.tipo)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <p className={`text-xs sm:text-sm font-semibold text-gray-900 truncate`}>
                        {item.titulo}
                      </p>
                      {!item.isRead && (
                        <span
                          className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1.5"
                          title="No leída"
                        />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 mt-0.5 leading-relaxed">
                      {item.mensaje}
                    </p>
                    <span className="text-[11px] text-gray-400 mt-1 block">
                      {formatRelativeTime(item.creado_en)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-gray-50/90 border-t border-gray-100 text-center">
            <Link
              to={targetUrl}
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50/80 w-full py-1.5 px-3 rounded-lg transition-colors"
            >
              <span>Ver todas las notificaciones</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBellPopover;
