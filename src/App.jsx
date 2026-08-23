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
import PlantillasPage from './components/dashboard-suscriptor/plantillas';
import CampanasPage from './components/dashboard-suscriptor/campanas';
import DestinatariosPage from './components/dashboard-suscriptor/destinatarios';
import EntregasPage from './components/dashboard-suscriptor/entregas';
import RespuestasPage from './components/dashboard-suscriptor/respuestas';
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
import Operadores from './components/dashboard-suscriptor/Operadores';
import DashboardPage from './components/dashboard-suscriptor/dashboard';
import PlantillasOperadorPage from './components/dashboard-operador/plantillas';
import DestinatariosOperadorPage from './components/dashboard-operador/destinatarios';
import EntregasOperadorPage from './components/dashboard-operador/entregas';
import PerfilOperador from './components/dashboard-operador/perfil-operador';

function App() {
  return (
    <Router>
      <Toaster position="top-right" richColors />
      <OfflineIndicator />
      <ImpersonationBanner />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/encuestas/:token" element={<EncuestaPage />} />
        <Route path="/email-sent" element={<EmailSentPage />} />
        <Route path="/verify-registration" element={<VerifyRegistrationPage />} />

        {/* Ruta pública para cancelación y éxito */}
        <Route path="/dashboard-suscriptor/planes/cancel" element={<CancelPage />} />
        <Route path="/dashboard-suscriptor/planes/success" element={<SuccessPage />} />

        {/* Rutas protegidas - admin */}
        <Route path="/dashboard" element={<Navigate to="/dashboard/suscriptores" replace />} />
        <Route path="/admin/dashboard" element={<Navigate to="/dashboard/suscriptores" replace />} />
        <Route path="/admin/suscriptores" element={<Navigate to="/dashboard/suscriptores" replace />} />
        <Route path="/admin/roles" element={<Navigate to="/dashboard/roles" replace />} />
        <Route path="/dashboard/suscriptores" element={
          <PrivateRoute requiredType="admin"><SuscriptoresPage /></PrivateRoute>
        } />
        <Route path="/dashboard/suscriptores/:id" element={
          <PrivateRoute requiredType="admin"><SuscriptorDetallePage /></PrivateRoute>
        } />
        <Route path="/dashboard/roles" element={
          <PrivateRoute requiredType="admin"><Roles /></PrivateRoute>
        } />
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

        {/* Rutas protegidas - suscriptor */}
        <Route path="/dashboard-suscriptor/plantillas" element={
          <PrivateRoute requiredType="suscriptor"><PlantillasPage /></PrivateRoute>
        } />
        <Route path="/dashboard-suscriptor/campanas" element={
          <PrivateRoute requiredType="suscriptor"><CampanasPage /></PrivateRoute>
        } />
        <Route path="/dashboard-suscriptor/destinatarios" element={
          <PrivateRoute requiredType="suscriptor"><DestinatariosPage /></PrivateRoute>
        } />
        <Route path="/dashboard-suscriptor/entregas" element={
          <PrivateRoute requiredType="suscriptor"><EntregasPage /></PrivateRoute>
        } />
        <Route path="/dashboard-suscriptor/respuestas" element={
          <PrivateRoute requiredType="suscriptor"><RespuestasPage /></PrivateRoute>
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
          <PrivateRoute requiredType="suscriptor"><Operadores /></PrivateRoute>
        } />
        <Route path="/dashboard-suscriptor/dashboard" element={
          <PrivateRoute requiredType="suscriptor"><DashboardPage /></PrivateRoute>
        } />

        {/* Rutas protegidas - operador */}
        <Route path="/dashboard-operador/plantillas" element={
          <PrivateRoute requiredType="operator"><PlantillasOperadorPage /></PrivateRoute>
        } />
        <Route path="/dashboard-operador/destinatarios" element={
          <PrivateRoute requiredType="operator"><DestinatariosOperadorPage /></PrivateRoute>
        } />
        <Route path="/dashboard-operador/entregas" element={
          <PrivateRoute requiredType="operator"><EntregasOperadorPage /></PrivateRoute>
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
