import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  Edit,
  Trash2,
  Crown,
  CheckCircle,
  Layers,
  Send,
  Users,
  Mic,
  FileText,
  Brain,
  Download,
  X,
  CreditCard,
  Check,
} from "lucide-react";
import DashboardLayout from "../dashboard-layout";
import {
  listarPlanes,
  crearPlan,
  actualizarPlan,
  eliminarPlan,
} from "../../services/api-admin";

const defaultFormData = {
  nombre: "",
  descripcion: "",
  precio_mensual: 0,
  max_plantillas: 5,
  max_campanas: 5,
  max_entregas: 500,
  max_operadores: 1,
  permite_email: true,
  permite_audio_voz: false,
  permite_papel: false,
  permite_ia_analisis: false,
  permite_exportacion: true,
  caracteristicas: "",
  stripe_price_id: "",
  activo: true,
};

const PlanesPage = () => {
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState(defaultFormData);

  const fetchPlanes = async () => {
    try {
      setLoading(true);
      const data = await listarPlanes();
      setPlanes(data);
    } catch (error) {
      console.error("Error al cargar planes:", error);
      toast.error("Error al cargar los planes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanes();
  }, []);

  const handleOpenCreate = () => {
    setEditingPlan(null);
    setFormData(defaultFormData);
    setShowModal(true);
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      nombre: plan.nombre || "",
      descripcion: plan.descripcion || "",
      precio_mensual: plan.precio_mensual !== undefined ? parseFloat(plan.precio_mensual) : 0,
      max_plantillas: plan.max_plantillas !== undefined ? plan.max_plantillas : 5,
      max_campanas: plan.max_campanas !== undefined ? plan.max_campanas : 5,
      max_entregas: plan.max_entregas !== undefined ? plan.max_entregas : 500,
      max_operadores: plan.max_operadores !== undefined ? plan.max_operadores : 1,
      permite_email: plan.permite_email !== undefined ? Boolean(plan.permite_email) : true,
      permite_audio_voz: plan.permite_audio_voz !== undefined ? Boolean(plan.permite_audio_voz) : false,
      permite_papel: plan.permite_papel !== undefined ? Boolean(plan.permite_papel) : false,
      permite_ia_analisis: plan.permite_ia_analisis !== undefined ? Boolean(plan.permite_ia_analisis) : false,
      permite_exportacion: plan.permite_exportacion !== undefined ? Boolean(plan.permite_exportacion) : true,
      caracteristicas: plan.caracteristicas || "",
      stripe_price_id: plan.stripe_price_id || "",
      activo: plan.activo !== undefined ? Boolean(plan.activo) : true,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este plan?")) {
      try {
        await eliminarPlan(id);
        setPlanes(planes.filter((p) => p.id !== id));
        toast.success("Plan eliminado correctamente");
      } catch (error) {
        toast.error("Error al eliminar el plan: " + error.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        precio_mensual: parseFloat(formData.precio_mensual) || 0,
        max_plantillas: parseInt(formData.max_plantillas, 10),
        max_campanas: parseInt(formData.max_campanas, 10),
        max_entregas: parseInt(formData.max_entregas, 10),
        max_operadores: parseInt(formData.max_operadores, 10),
      };

      if (editingPlan) {
        const updated = await actualizarPlan(editingPlan.id, payload);
        setPlanes(planes.map((p) => (p.id === updated.id ? updated : p)));
        toast.success("Plan actualizado exitosamente");
      } else {
        const nuevo = await crearPlan(payload);
        setPlanes([...planes, nuevo]);
        toast.success("Plan creado exitosamente");
      }
      setShowModal(false);
      setEditingPlan(null);
      setFormData(defaultFormData);
    } catch (error) {
      toast.error("Error al guardar el plan: " + error.message);
    }
  };

  const formatLimit = (val) => {
    if (val === -1 || val === "-1" || val === 0 || val === "0" || val === null || val === undefined) {
      return "Ilimitado";
    }
    return val.toLocaleString ? val.toLocaleString() : val;
  };

  return (
    <DashboardLayout activeSection="planes">
      <div className="min-h-full p-4 sm:p-6 bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/50">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-1">
              Planes de Suscripción
            </h1>
            <p className="text-slate-600 text-sm sm:text-base">
              Configura límites cuantitativos, canales habilitados y precios comerciales
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-500/25 transition-all duration-200"
          >
            <Plus className="h-5 w-5" />
            <span>Nuevo Plan</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100/80 rounded-xl text-blue-600">
                <Crown className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Planes</p>
                <p className="text-2xl font-bold text-slate-900">{planes.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100/80 rounded-xl text-emerald-600">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Planes Activos</p>
                <p className="text-2xl font-bold text-emerald-700">
                  {planes.filter((p) => p.activo !== false).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100/80 rounded-xl text-purple-600">
                <Mic className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Con Voz & IA</p>
                <p className="text-2xl font-bold text-purple-700">
                  {planes.filter((p) => p.permite_audio_voz).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de Planes */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {planes.map((plan) => {
              const precio = parseFloat(plan.precio_mensual) || 0;
              const isActivo = plan.activo !== false;

              return (
                <div
                  key={plan.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
                >
                  {/* Header de la tarjeta */}
                  <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/30">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-slate-900">{plan.nombre}</h3>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              isActivo
                                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                : "bg-slate-100 text-slate-600 border border-slate-200"
                            }`}
                          >
                            {isActivo ? "Activo" : "Inactivo"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{plan.descripcion}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-2xl font-extrabold text-slate-900">
                          {precio === 0 ? "Gratis" : `$${precio}`}
                        </span>
                        {precio > 0 && <span className="text-xs text-slate-500 font-medium block">/mes</span>}
                      </div>
                    </div>
                  </div>

                  {/* Cuotas Cuantitativas */}
                  <div className="p-6 space-y-4 flex-1">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                        Límites y Cuotas
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                          <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-0.5">
                            <Layers className="w-3.5 h-3.5" />
                            <span>Plantillas</span>
                          </div>
                          <span className="font-bold text-slate-800">
                            {formatLimit(plan.max_plantillas)}
                          </span>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                          <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-0.5">
                            <Send className="w-3.5 h-3.5" />
                            <span>Entregas / mes</span>
                          </div>
                          <span className="font-bold text-slate-800">
                            {formatLimit(plan.max_entregas)}
                          </span>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                          <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-0.5">
                            <Users className="w-3.5 h-3.5" />
                            <span>Operadores</span>
                          </div>
                          <span className="font-bold text-slate-800">
                            {formatLimit(plan.max_operadores)}
                          </span>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                          <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-0.5">
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Campañas</span>
                          </div>
                          <span className="font-bold text-slate-800">
                            {formatLimit(plan.max_campanas)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Canales y Permisos */}
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                        Canales y Funciones
                      </p>
                      <div className="flex flex-wrap gap-1.5 text-xs">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium ${
                            plan.permite_email !== false
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-slate-100 text-slate-400 line-through"
                          }`}
                        >
                          <Check className="w-3 h-3" /> Email / Web
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium ${
                            plan.permite_audio_voz
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : "bg-slate-100 text-slate-400 line-through"
                          }`}
                        >
                          <Mic className="w-3 h-3" /> Voz con IA
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium ${
                            plan.permite_papel
                              ? "bg-orange-50 text-orange-700 border border-orange-200"
                              : "bg-slate-100 text-slate-400 line-through"
                          }`}
                        >
                          <FileText className="w-3 h-3" /> Papel & OCR
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium ${
                            plan.permite_ia_analisis
                              ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                              : "bg-slate-100 text-slate-400 line-through"
                          }`}
                        >
                          <Brain className="w-3 h-3" /> Análisis Gemini
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium ${
                            plan.permite_exportacion !== false
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-400 line-through"
                          }`}
                        >
                          <Download className="w-3 h-3" /> Exportación PDF/CSV
                        </span>
                      </div>
                    </div>

                    {/* Características Comerciales */}
                    {plan.caracteristicas && (
                      <div className="border-t border-slate-100 pt-3">
                        <ul className="space-y-1.5 text-xs text-slate-600">
                          {plan.caracteristicas.split(";").map((c, idx) => {
                            const trimmed = c.trim();
                            if (!trimmed) return null;
                            return (
                              <li key={idx} className="flex items-center gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                                <span>{trimmed}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Footer con Acciones */}
                  <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-mono truncate max-w-[180px]">
                      {plan.stripe_price_id ? `Stripe: ${plan.stripe_price_id}` : "Sin ID Stripe"}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(plan)}
                        className="p-1.5 text-blue-600 hover:bg-blue-100/70 rounded-lg transition-colors"
                        title="Editar plan"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(plan.id)}
                        className="p-1.5 text-red-600 hover:bg-red-100/70 rounded-lg transition-colors"
                        title="Eliminar plan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal de Creación / Edición */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col my-auto">
              {/* Modal Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">
                      {editingPlan ? `Editar Plan: ${editingPlan.nombre}` : "Crear Nuevo Plan de Suscripción"}
                    </h3>
                    <p className="text-xs text-blue-100">Configura precios, cuotas y permisos de canales</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
                {/* 1. Datos Generales */}
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                    1. Información Comercial
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Nombre del Plan *</label>
                      <input
                        type="text"
                        required
                        placeholder="ej: Profesional, Enterprise"
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Precio Mensual ($/€) *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        placeholder="0.00"
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.precio_mensual}
                        onChange={(e) => setFormData({ ...formData, precio_mensual: e.target.value })}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-slate-700 mb-1">Descripción Breve *</label>
                      <textarea
                        rows="2"
                        required
                        placeholder="Para equipos medianos que requieren encuestas por voz y análisis inteligente..."
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.descripcion}
                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Stripe Price ID (Opcional)
                      </label>
                      <input
                        type="text"
                        placeholder="price_1NXXXXXXXXXXXX"
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-xs"
                        value={formData.stripe_price_id}
                        onChange={(e) => setFormData({ ...formData, stripe_price_id: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-6">
                      <input
                        type="checkbox"
                        id="plan_activo"
                        checked={formData.activo}
                        onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      />
                      <label htmlFor="plan_activo" className="text-xs font-medium text-slate-800 cursor-pointer">
                        Plan Activo (Visible para suscriptores)
                      </label>
                    </div>
                  </div>
                </div>

                {/* 2. Cuotas y Límites Numéricos */}
                <div className="border-t border-slate-200 pt-5">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    2. Cuotas Cuantitativas (Usa -1 para ilimitado)
                  </h4>
                  <p className="text-xs text-slate-500 mb-3">
                    Establece el número máximo de recursos que puede utilizar el suscriptor.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-xs font-medium text-slate-700">Max. Plantillas de Encuestas</label>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              max_plantillas: formData.max_plantillas === -1 ? 5 : -1,
                            })
                          }
                          className={`text-xs px-2 py-0.5 rounded font-semibold transition-colors ${
                            formData.max_plantillas === -1
                              ? "bg-blue-600 text-white"
                              : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                          }`}
                        >
                          {formData.max_plantillas === -1 ? "Ilimitado ✓" : "Hacer Ilimitado"}
                        </button>
                      </div>
                      <input
                        type="number"
                        min="-1"
                        required
                        disabled={formData.max_plantillas === -1}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white disabled:bg-slate-100 disabled:text-slate-400 font-semibold"
                        value={formData.max_plantillas}
                        onChange={(e) => setFormData({ ...formData, max_plantillas: e.target.value })}
                      />
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-xs font-medium text-slate-700">Max. Entregas / Respuestas al Mes</label>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              max_entregas: formData.max_entregas === -1 ? 500 : -1,
                            })
                          }
                          className={`text-xs px-2 py-0.5 rounded font-semibold transition-colors ${
                            formData.max_entregas === -1
                              ? "bg-blue-600 text-white"
                              : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                          }`}
                        >
                          {formData.max_entregas === -1 ? "Ilimitado ✓" : "Hacer Ilimitado"}
                        </button>
                      </div>
                      <input
                        type="number"
                        min="-1"
                        required
                        disabled={formData.max_entregas === -1}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white disabled:bg-slate-100 disabled:text-slate-400 font-semibold"
                        value={formData.max_entregas}
                        onChange={(e) => setFormData({ ...formData, max_entregas: e.target.value })}
                      />
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-xs font-medium text-slate-700">Max. Operadores de Equipo</label>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              max_operadores: formData.max_operadores === -1 ? 1 : -1,
                            })
                          }
                          className={`text-xs px-2 py-0.5 rounded font-semibold transition-colors ${
                            formData.max_operadores === -1
                              ? "bg-blue-600 text-white"
                              : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                          }`}
                        >
                          {formData.max_operadores === -1 ? "Ilimitado ✓" : "Hacer Ilimitado"}
                        </button>
                      </div>
                      <input
                        type="number"
                        min="-1"
                        required
                        disabled={formData.max_operadores === -1}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white disabled:bg-slate-100 disabled:text-slate-400 font-semibold"
                        value={formData.max_operadores}
                        onChange={(e) => setFormData({ ...formData, max_operadores: e.target.value })}
                      />
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-xs font-medium text-slate-700">Max. Campañas Activas</label>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              max_campanas: formData.max_campanas === -1 ? 5 : -1,
                            })
                          }
                          className={`text-xs px-2 py-0.5 rounded font-semibold transition-colors ${
                            formData.max_campanas === -1
                              ? "bg-blue-600 text-white"
                              : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                          }`}
                        >
                          {formData.max_campanas === -1 ? "Ilimitado ✓" : "Hacer Ilimitado"}
                        </button>
                      </div>
                      <input
                        type="number"
                        min="-1"
                        required
                        disabled={formData.max_campanas === -1}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white disabled:bg-slate-100 disabled:text-slate-400 font-semibold"
                        value={formData.max_campanas}
                        onChange={(e) => setFormData({ ...formData, max_campanas: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Permisos de Canales y Funciones */}
                <div className="border-t border-slate-200 pt-5">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                    3. Canales y Funciones Habilitadas
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-blue-50/50 border border-slate-200 rounded-xl cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.permite_email}
                        onChange={(e) => setFormData({ ...formData, permite_email: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      />
                      <div>
                        <p className="font-semibold text-slate-900 text-xs">Canal Email & Enlace Web</p>
                        <p className="text-[11px] text-slate-500">Envío masivo por correo y enlaces públicos</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-purple-50/50 border border-slate-200 rounded-xl cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.permite_audio_voz}
                        onChange={(e) => setFormData({ ...formData, permite_audio_voz: e.target.checked })}
                        className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
                      />
                      <div>
                        <p className="font-semibold text-slate-900 text-xs">Encuestas Asistidas por Voz (IA)</p>
                        <p className="text-[11px] text-slate-500">Síntesis TTS, dictado y transcripción</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-orange-50/50 border border-slate-200 rounded-xl cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.permite_papel}
                        onChange={(e) => setFormData({ ...formData, permite_papel: e.target.checked })}
                        className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500"
                      />
                      <div>
                        <p className="font-semibold text-slate-900 text-xs">Canal Papel & Digitalización OCR</p>
                        <p className="text-[11px] text-slate-500">Generación de PDF con QR y procesamiento OCR</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 rounded-xl cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.permite_ia_analisis}
                        onChange={(e) => setFormData({ ...formData, permite_ia_analisis: e.target.checked })}
                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                      />
                      <div>
                        <p className="font-semibold text-slate-900 text-xs">Análisis con Gemini AI</p>
                        <p className="text-[11px] text-slate-500">Deducción de opciones y chatbot analítico</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 rounded-xl cursor-pointer transition-colors sm:col-span-2">
                      <input
                        type="checkbox"
                        checked={formData.permite_exportacion}
                        onChange={(e) => setFormData({ ...formData, permite_exportacion: e.target.checked })}
                        className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                      />
                      <div>
                        <p className="font-semibold text-slate-900 text-xs">Exportación Avanzada (PDF & CSV)</p>
                        <p className="text-[11px] text-slate-500">Descarga de reportes ejecutivos y bases de datos completas</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* 4. Viñetas Comerciales */}
                <div className="border-t border-slate-200 pt-5">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    4. Viñetas de Características Comerciales
                  </h4>
                  <p className="text-xs text-slate-500 mb-2">
                    Escribe los beneficios visibles para el cliente separados por punto y coma (;)
                  </p>
                  <textarea
                    rows="3"
                    placeholder="Hasta 15 plantillas activas; 5.000 respuestas al mes; Asistente de voz con IA; Soporte prioritario 24/7"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                    value={formData.caracteristicas}
                    onChange={(e) => setFormData({ ...formData, caracteristicas: e.target.value })}
                  ></textarea>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-100 font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 transition-all"
                  >
                    {editingPlan ? "Actualizar Plan" : "Guardar y Crear Plan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PlanesPage;
