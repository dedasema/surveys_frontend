import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import './App.css';
import OfflineIndicator from './components/OfflineIndicator';
import ImpersonationBanner from './components/ImpersonationBanner';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Roles from './components/dashboard/roles';
import Canales from './components/dashboard/canales';
import EstadoDocumento from './components/dashboard/estado-documento';
import EstadoEntrega from './components/dashboard/estados-entrega';
import EstadosPago from './components/dashboard/estados-pago';
import TiposPregunta from './components/dashboard/tipos-pregunta';
import MetodoPago from './components/dashboard/metodos-pago';
import EstadosCampaña from './components/dashboard/estados-campana';
import Planes from './components/dashboard/planes';
import PerfilAdmin from './components/dashboard/perfil-admin';
import Auditoria from './components/dashboard/auditoria';
import AnunciosPage from './components/dashboard/anuncios';
import SuscriptoresPage from './components/dashboard/suscriptores';
import SuscriptorDetallePage from './components/dashboard/suscriptor-detalle';
import PerfilSuscriptor from './components/dashboard-suscriptor/perfil-suscriptor';
import ConfiguracionPage from './components/dashboard-suscriptor/configuracion';
import PlanesSuscriptorPage from './components/dashboard-suscriptor/planes';
import MiSuscripcion from './components/dashboard-suscriptor/mi-suscripcion';
import HistorialPagos from './components/dashboard-suscriptor/historial-pagos';
import EncuestaPage from './pages/EncuestaPage';
import EmailSentPage from './pages/EmailSentPage';
import VerifyRegistrationPage from './pages/VerifyRegistrationPage';
import CancelPage from './components/dashboard-suscriptor/cancel';
import SuccessPage from './components/dashboard-suscriptor/success';
import PrivateRoute from './components/PrivateRoute';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './components/dashboard-suscriptor/dashboard';
import PerfilOperador from './components/dashboard-operador/perfil-operador';

import AboutPage from './pages/AboutPage';
import SupportPage from './pages/SupportPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import DownloadAppPage from './pages/DownloadAppPage';
import UserManualPage from './pages/UserManualPage';
import ScrollToTop from './components/ScrollToTop';

// Domain-Driven Feature Containers (Screaming Architecture)
import { RecipientsContainer } from './features/recipients';
import { CampaignsContainer } from './features/campaigns';
import { DeliveriesContainer } from './features/deliveries';
import { SurveysContainer } from './features/surveys';
import { ResponsesContainer } from './features/responses';
import { OperatorsContainer } from './features/operators';

// Software 2 Intelligence & Analytics Containers
import { ClustersContainer } from './features/clusters';
import { FraudReviewContainer } from './features/fraud-review';
import { PredictiveContainer } from './features/predictive';
import { AgentLogsContainer } from './features/agent-logs';
import { RagAssistantContainer } from './features/rag-assistant';
import { NotificationsPage } from './features/notifications';
import { CopilotChatPage } from './features/copilot';
import AdaptiveSurveyPage from './pages/AdaptiveSurveyPage';

function CorporateRedirect() {
  const corporateUrl =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_CORPORATE_URL) ||
    (typeof process !== "undefined" && (process.env?.VITE_CORPORATE_URL || process.env?.REACT_APP_CORPORATE_URL)) ||
    "";

  React.useEffect(() => {
    if (corporateUrl && corporateUrl.trim() !== "") {
      window.location.replace(corporateUrl);
    }
  }, [corporateUrl]);

  if (!corporateUrl || corporateUrl.trim() === "") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-600">
      <p>Redirigiendo a Desesoft...</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Toaster position="top-right" richColors />
      <OfflineIndicator />
      <ImpersonationBanner />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/sobre-nosotros" element={<CorporateRedirect />} />
        <Route path="/about" element={<Navigate to="/sobre-nosotros" replace />} />
        <Route path="/soporte" element={<SupportPage />} />
        <Route path="/support" element={<Navigate to="/soporte" replace />} />
        <Route path="/ayuda" element={<Navigate to="/soporte" replace />} />
        <Route path="/privacidad" element={<PrivacyPolicyPage />} />
        <Route path="/privacy" element={<Navigate to="/privacidad" replace />} />
        <Route path="/terminos" element={<TermsPage />} />
        <Route path="/terms" element={<Navigate to="/terminos" replace />} />
        <Route path="/descargar-app" element={<DownloadAppPage />} />
        <Route path="/download-app" element={<Navigate to="/descargar-app" replace />} />
        <Route path="/app" element={<Navigate to="/descargar-app" replace />} />
        <Route path="/apk" element={<Navigate to="/descargar-app" replace />} />
        <Route path="/manual" element={<UserManualPage />} />
        <Route path="/manual-usuario" element={<UserManualPage />} />
        <Route path="/guia" element={<Navigate to="/manual" replace />} />
        <Route path="/encuestas/:token" element={<EncuestaPage />} />
        <Route path="/encuestas/:token/adaptativa" element={<AdaptiveSurveyPage />} />
        <Route path="/email-sent" element={<EmailSentPage />} />
        <Route path="/verify-registration" element={<VerifyRegistrationPage />} />
        <Route path="/verificar-registro" element={<VerifyRegistrationPage />} />

        {/* Ruta pública para cancelación y éxito */}
        <Route path="/dashboard-suscriptor/planes/cancel" element={<CancelPage />} />
        <Route path="/dashboard-suscriptor/planes/success" element={<SuccessPage />} />

        {/* Rutas protegidas - admin */}
        <Route path="/dashboard" element={<Navigate to="/dashboard/suscriptores" replace />} />
        <Route path="/admin/dashboard" element={<Navigate to="/dashboard/suscriptores" replace />} />
        <Route path="/admin/suscriptores" element={<Navigate to="/dashboard/suscriptores" replace />} />
        <Route path="/admin/roles" element={<Navigate to="/dashboard/suscriptores" replace />} />
        <Route path="/dashboard/suscriptores" element={
          <PrivateRoute requiredType="admin"><SuscriptoresPage /></PrivateRoute>
        } />
        <Route path="/dashboard/suscriptores/:id" element={
          <PrivateRoute requiredType="admin"><SuscriptorDetallePage /></PrivateRoute>
        } />
        <Route path="/dashboard/roles" element={<Navigate to="/dashboard/suscriptores" replace />} />
        <Route path="/dashboard/canales" element={
          <PrivateRoute requiredType="admin"><Canales /></PrivateRoute>
        } />
        <Route path="/dashboard/estado-documento" element={
          <PrivateRoute requiredType="admin"><EstadoDocumento /></PrivateRoute>
        } />
        <Route path="/dashboard/estados-entrega" element={
          <PrivateRoute requiredType="admin"><EstadoEntrega /></PrivateRoute>
        } />
        <Route path="/dashboard/estados-pago" element={
          <PrivateRoute requiredType="admin"><EstadosPago /></PrivateRoute>
        } />
        <Route path="/dashboard/tipos-pregunta" element={
          <PrivateRoute requiredType="admin"><TiposPregunta /></PrivateRoute>
        } />
        <Route path="/dashboard/metodos-pago" element={
          <PrivateRoute requiredType="admin"><MetodoPago /></PrivateRoute>
        } />
        <Route path="/dashboard/estados-campana" element={
          <PrivateRoute requiredType="admin"><EstadosCampaña /></PrivateRoute>
        } />
        <Route path="/dashboard/planes" element={
          <PrivateRoute requiredType="admin"><Planes /></PrivateRoute>
        } />
        <Route path="/dashboard/perfil-admin" element={
          <PrivateRoute requiredType="admin"><PerfilAdmin /></PrivateRoute>
        } />
        <Route path="/admin/auditoria" element={<Navigate to="/dashboard/auditoria" replace />} />
        <Route path="/dashboard/auditoria" element={
          <PrivateRoute requiredType="admin"><Auditoria /></PrivateRoute>
        } />
        <Route path="/admin/anuncios" element={<Navigate to="/dashboard/anuncios" replace />} />
        <Route path="/dashboard/anuncios" element={
          <PrivateRoute requiredType="admin"><AnunciosPage /></PrivateRoute>
        } />
        <Route path="/dashboard/copilot" element={<Navigate to="/dashboard/metricas" replace />} />

        {/* Rutas protegidas - suscriptor */}
        <Route path="/dashboard-suscriptor/plantillas" element={
          <PrivateRoute requiredType="suscriptor"><SurveysContainer role="suscriptor" /></PrivateRoute>
        } />
        <Route path="/dashboard-suscriptor/campanas" element={
          <PrivateRoute requiredType="suscriptor"><CampaignsContainer role="suscriptor" /></PrivateRoute>
        } />
        <Route path="/dashboard-suscriptor/destinatarios" element={
          <PrivateRoute requiredType="suscriptor"><RecipientsContainer role="suscriptor" /></PrivateRoute>
        } />
        <Route path="/dashboard-suscriptor/entregas" element={
          <PrivateRoute requiredType="suscriptor"><DeliveriesContainer role="suscriptor" /></PrivateRoute>
        } />
        <Route path="/dashboard-suscriptor/respuestas" element={
          <PrivateRoute requiredType="suscriptor"><ResponsesContainer role="suscriptor" /></PrivateRoute>
        } />
        <Route path="/dashboard-suscriptor/configuracion" element={
          <PrivateRoute requiredType="suscriptor"><ConfiguracionPage /></PrivateRoute>
        } />
        <Route path="/dashboard-suscriptor/planes" element={
          <PrivateRoute requiredType="suscriptor"><PlanesSuscriptorPage /></PrivateRoute>
        } />
        <Route path="/dashboard-suscriptor/mi-suscripcion" element={
          <PrivateRoute requiredType="suscriptor"><MiSuscripcion /></PrivateRoute>
        } />
        <Route path="/dashboard-suscriptor/historial-pagos" element={
          <PrivateRoute requiredType="suscriptor"><HistorialPagos /></PrivateRoute>
        } />
        <Route path="/dashboard-suscriptor/perfil-suscriptor" element={
          <PrivateRoute requiredType="suscriptor"><PerfilSuscriptor /></PrivateRoute>
        } />
        <Route path="/dashboard-suscriptor/operadores" element={
          <PrivateRoute requiredType="suscriptor"><OperatorsContainer role="suscriptor" /></PrivateRoute>
        } />
        <Route path="/dashboard-suscriptor/roles" element={
          <PrivateRoute requiredType="suscriptor"><Roles role="suscriptor" /></PrivateRoute>
        } />
        <Route path="/dashboard-suscriptor/auditoria" element={
          <PrivateRoute requiredType="suscriptor"><Auditoria role="suscriptor" /></PrivateRoute>
        } />
        <Route path="/dashboard-suscriptor/dashboard" element={
          <PrivateRoute requiredType="suscriptor"><DashboardPage /></PrivateRoute>
        } />
        <Route path="/dashboard-suscriptor/clusters" element={
          <PrivateRoute requiredType="suscriptor"><ClustersContainer role="suscriptor" /></PrivateRoute>
        } />
        <Route path="/dashboard-suscriptor/fraude" element={
          <PrivateRoute requiredType="suscriptor"><FraudReviewContainer role="suscriptor" /></PrivateRoute>
        } />
        <Route path="/dashboard-suscriptor/predictivo" element={
          <PrivateRoute requiredType="suscriptor"><PredictiveContainer role="suscriptor" /></PrivateRoute>
        } />
        <Route path="/dashboard-suscriptor/agente-logs" element={
          <PrivateRoute requiredType="suscriptor"><AgentLogsContainer role="suscriptor" /></PrivateRoute>
        } />
        <Route path="/dashboard-suscriptor/asistente-rag" element={
          <PrivateRoute requiredType="suscriptor"><RagAssistantContainer role="suscriptor" /></PrivateRoute>
        } />
        <Route path="/dashboard-suscriptor/copilot" element={
          <PrivateRoute requiredType="suscriptor"><CopilotChatPage role="suscriptor" /></PrivateRoute>
        } />
        <Route path="/dashboard-suscriptor/notificaciones" element={
          <PrivateRoute requiredType="suscriptor"><NotificationsPage role="suscriptor" /></PrivateRoute>
        } />
        <Route path="/dashboard-suscriptor/archivos" element={<Navigate to="/dashboard-suscriptor/plantillas" replace />} />
        <Route path="/dashboard-suscriptor/uso-sistema" element={<Navigate to="/dashboard-suscriptor/plantillas" replace />} />

        {/* Rutas protegidas - operador */}
        <Route path="/dashboard-operador/plantillas" element={
          <PrivateRoute requiredType="operator"><SurveysContainer role="operator" /></PrivateRoute>
        } />
        <Route path="/dashboard-operador/destinatarios" element={
          <PrivateRoute requiredType="operator"><RecipientsContainer role="operator" /></PrivateRoute>
        } />
        <Route path="/dashboard-operador/entregas" element={
          <PrivateRoute requiredType="operator"><DeliveriesContainer role="operator" /></PrivateRoute>
        } />
        <Route path="/dashboard-operador/notificaciones" element={
          <PrivateRoute requiredType="operator"><NotificationsPage role="operator" /></PrivateRoute>
        } />
        <Route path="/dashboard-operador/copilot" element={
          <PrivateRoute requiredType="operator"><CopilotChatPage role="operator" /></PrivateRoute>
        } />
        <Route path="/dashboard-operador/perfil-operador" element={
          <PrivateRoute requiredType="operator"><PerfilOperador /></PrivateRoute>
        } />

        {/* Rutas de autenticación */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
