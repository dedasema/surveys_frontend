import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Megaphone,
  Plus,
  Trash2,
  Power,
  Info,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import DashboardLayout from "../dashboard-layout";
import {
  listarAnunciosAdmin,
  crearAnuncioAdmin,
  actualizarAnuncioAdmin,
  eliminarAnuncioAdmin,
} from "../../services/api-admin";

const TIPO_OPTIONS = [
  { value: "info", label: "Informativo (Azul)", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "warning", label: "Advertencia (Amarillo)", color: "bg-amber-50 text-amber-800 border-amber-200" },
  { value: "error", label: "Error / Urgente (Rojo)", color: "bg-red-50 text-red-700 border-red-200" },
  { value: "success", label: "Éxito / Novedad (Verde)", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
];

export default function AnunciosPage() {
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [form, setForm] = useState({
    titulo: "",
    mensaje: "",
    tipo: "info",
    activo: true,
  });

  const loadAnuncios = async () => {
    try {
      setLoading(true);
      const data = await listarAnunciosAdmin();
      setAnuncios(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar anuncios:", err);
      toast.error("Error al cargar los anuncios globales");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnuncios();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.titulo.trim() || !form.mensaje.trim()) {
      toast.error("Por favor completa el título y el mensaje");
      return;
    }

    try {
      setSubmitting(true);
      await crearAnuncioAdmin(form);
      toast.success("Anuncio global publicado exitosamente");
      setShowModal(false);
      setForm({ titulo: "", mensaje: "", tipo: "info", activo: true });
      loadAnuncios();
    } catch (err) {
      toast.error("Error al crear el anuncio: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActivo = async (anuncio) => {
    const nuevoEstado = !anuncio.activo;
    try {
      toast.loading(nuevoEstado ? "Activando anuncio..." : "Desactivando anuncio...", { id: "toggle" });
      await actualizarAnuncioAdmin(anuncio.id, { activo: nuevoEstado });
      setAnuncios((prev) =>
        prev.map((a) => (a.id === anuncio.id ? { ...a, activo: nuevoEstado } : a))
      );
      toast.success(`Anuncio ${nuevoEstado ? "activado" : "desactivado"} correctamente`, { id: "toggle" });
    } catch (err) {
      toast.error("Error al actualizar estado del anuncio: " + err.message, { id: "toggle" });
    }
  };

  const handleDelete = async (id, titulo) => {
    if (!window.confirm(`¿Estás seguro de eliminar permanentemente el anuncio "${titulo}"?`)) {
      return;
    }

    try {
      toast.loading("Eliminando anuncio...", { id: "delete" });
      await eliminarAnuncioAdmin(id);
      setAnuncios((prev) => prev.filter((a) => a.id !== id));
      toast.success("Anuncio eliminado exitosamente", { id: "delete" });
    } catch (err) {
      toast.error("Error al eliminar el anuncio: " + err.message, { id: "delete" });
    }
  };

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getTipoBadge = (tipo) => {
    const opt = TIPO_OPTIONS.find((o) => o.value === tipo) || TIPO_OPTIONS[0];
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${opt.color}`}>
        {getTipoIcon(tipo)}
        <span className="capitalize">{tipo}</span>
      </span>
    );
  };

  return (
    <DashboardLayout activeSection="anuncios">
      <div className="min-h-full p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/40">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-orange-600 text-white rounded-2xl shadow-md shadow-orange-500/20">
                <Megaphone className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  Anuncios Globales del Sistema
                </h1>
                <p className="text-slate-600 text-xs sm:text-sm">
                  Publica avisos, ventanas de mantenimiento y novedades visibles para todas las empresas y operadores
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md shadow-blue-600/25 transition-all active:scale-95 cursor-pointer flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Publicar Nuevo Anuncio</span>
          </button>
        </div>

        {/* Listado / Tabla de Anuncios */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/20 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : anuncios.length === 0 ? (
            <div className="p-12 text-center">
              <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-1">Sin anuncios publicados</h3>
              <p className="text-slate-500 text-xs max-w-sm mx-auto mb-4">
                No hay avisos o comunicados del sistema creados actualmente.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Crear el primer aviso</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="py-3.5 px-6">Título & Mensaje</th>
                    <th className="py-3.5 px-6">Tipo / Estilo</th>
                    <th className="py-3.5 px-6">Estado</th>
                    <th className="py-3.5 px-6">Fecha de Creación</th>
                    <th className="py-3.5 px-6 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {anuncios.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6 max-w-md">
                        <p className="font-bold text-slate-900 text-sm mb-0.5">{a.titulo}</p>
                        <p className="text-xs text-slate-600 line-clamp-2">{a.mensaje}</p>
                      </td>
                      <td className="py-4 px-6">{getTipoBadge(a.tipo)}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                            a.activo
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-500 border border-slate-200"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${a.activo ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`}
                          ></span>
                          {a.activo ? "Activo (Visible)" : "Inactivo (Oculto)"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-500 font-mono">
                        {a.creado_en ? new Date(a.creado_en).toLocaleString() : "-"}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleActivo(a)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                              a.activo
                                ? "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                                : "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                            }`}
                            title={a.activo ? "Desactivar y ocultar del sistema" : "Activar y mostrar a usuarios"}
                          >
                            <Power className="w-3.5 h-3.5" />
                            <span>{a.activo ? "Pausar" : "Activar"}</span>
                          </button>

                          <button
                            onClick={() => handleDelete(a.id, a.titulo)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                            title="Eliminar anuncio"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal para Crear Anuncio */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 sm:p-7">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Megaphone className="w-6 h-6 text-amber-600" />
                  <h3 className="text-lg font-bold text-slate-900">Publicar Aviso Global</h3>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                {/* Título */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Título del Aviso *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Mantenimiento Programado / Novedad"
                    value={form.titulo}
                    onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Tipo de Alerta */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tipo de Alerta / Color *
                  </label>
                  <select
                    value={form.tipo}
                    onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {TIPO_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mensaje */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mensaje / Contenido del Aviso *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Escribe el mensaje que verán todas las empresas y operadores..."
                    value={form.mensaje}
                    onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Checkbox Activo */}
                <div className="flex items-center gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="activo-check"
                    checked={form.activo}
                    onChange={(e) => setForm({ ...form, activo: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500"
                  />
                  <label htmlFor="activo-check" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Activar y publicar de inmediato para todas las empresas
                  </label>
                </div>

                {/* Vista Previa del Banner */}
                <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-200/60">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Vista Previa del Banner
                  </p>
                  <div
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                      form.tipo === "warning"
                        ? "bg-amber-500 text-slate-950 border-amber-600"
                        : form.tipo === "error"
                        ? "bg-red-600 text-white border-red-700"
                        : form.tipo === "success"
                        ? "bg-emerald-600 text-white border-emerald-700"
                        : "bg-blue-600 text-white border-blue-700"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-medium overflow-hidden">
                      <span className="font-extrabold uppercase text-[10px] px-1.5 py-0.5 rounded bg-black/15">
                        {form.titulo || "Título"}
                      </span>
                      <span className="truncate">{form.mensaje || "Mensaje del aviso..."}</span>
                    </div>
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? "Publicando..." : "Publicar Aviso"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
