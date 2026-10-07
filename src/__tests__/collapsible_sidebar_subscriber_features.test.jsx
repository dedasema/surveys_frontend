import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppLayout } from '../shared/layouts/AppLayout';
import Auditoria from '../components/dashboard/auditoria';
import RolesPage from '../components/dashboard/roles';

// Mock AuthContext
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    logout: vi.fn(),
    user: { id: '1', nombre: 'Test Suscriptor', email: 'suscriptor@test.com' },
  }),
}));

// Mock auth service
vi.mock('../services/auth', () => ({
  getCurrentUser: vi.fn().mockResolvedValue({
    id: '1',
    nombre: 'Test Suscriptor',
    email: 'suscriptor@test.com',
  }),
  getAvatarUrl: vi.fn((url) => url),
}));

// Mock chatbot
vi.mock('../features/chatbot', () => ({
  ChatbotWidget: () => <div data-testid="mock-chatbot" />,
}));

// Mock api-admin
vi.mock('../services/api-admin', () => ({
  listarAuditoria: vi.fn().mockResolvedValue({
    items: [
      {
        id: '1',
        usuario_email: 'op@empresa.com',
        modulo: 'PLANTILLAS',
        accion: 'CREAR_PLANTILLA',
        entidad_id: 'pl-1',
        detalles: {},
        ip_address: '127.0.0.1',
      },
    ],
    total: 1,
  }),
  obtenerFiltrosAuditoria: vi.fn().mockResolvedValue({
    modulos: ['PLANTILLAS', 'CAMPANAS', 'PLANES', 'SUSCRIPTORES', 'ANUNCIOS'],
    acciones: ['CREAR', 'ACTUALIZAR', 'ELIMINAR'],
  }),
  listarRolesDetalle: vi.fn().mockResolvedValue([
    {
      id: 'r-admin',
      nombre: 'admin',
      descripcion: 'Administrador total',
      permisos: [{ id: 'p1', codigo: 'admin.all', nombre: 'Admin Total', modulo: 'empresas' }],
    },
    {
      id: 'r-empresa',
      nombre: 'empresa',
      descripcion: 'Rol de empresa',
      permisos: [
        { id: 'p2', codigo: 'plantillas.crear', nombre: 'Crear Plantillas', modulo: 'plantillas' },
        { id: 'p3', codigo: 'planes.gestionar', nombre: 'Gestionar Planes', modulo: 'planes' },
      ],
    },
    {
      id: 'r-operator',
      nombre: 'operator',
      descripcion: 'Operador de la empresa',
      permisos: [
        { id: 'p2', codigo: 'plantillas.crear', nombre: 'Crear Plantillas', modulo: 'plantillas' },
      ],
    },
  ]),
  listarPermisos: vi.fn().mockResolvedValue([
    { id: 'p2', codigo: 'plantillas.crear', nombre: 'Crear Plantillas', modulo: 'plantillas' },
    { id: 'p3', codigo: 'planes.gestionar', nombre: 'Gestionar Planes', modulo: 'planes' },
    { id: 'p4', codigo: 'suscriptores.ver', nombre: 'Ver Suscriptores', modulo: 'suscriptores' },
    { id: 'p5', codigo: 'campanas.crear', nombre: 'Crear Campañas', modulo: 'campanas' },
  ]),
  asignarPermisosARol: vi.fn().mockResolvedValue({}),
  crearRol: vi.fn().mockResolvedValue({ id: 'r-new' }),
  actualizarRol: vi.fn().mockResolvedValue({}),
  eliminarRol: vi.fn().mockResolvedValue({}),
}));

describe('Universal Collapsible Sidebar (AppLayout)', () => {
  beforeEach(() => {
    localStorage.clear();
    window.innerWidth = 1024;
  });

  it('renders sidebar and toggles collapse state with localStorage persistence', () => {
    render(
      <MemoryRouter>
        <AppLayout role="suscriptor">
          <div>Main Content</div>
        </AppLayout>
      </MemoryRouter>
    );

    // Initial state: not collapsed
    expect(localStorage.getItem('sidebar_collapsed')).toBeNull();

    // Trigger button should be visible on desktop as well (no md:hidden)
    const trigger = screen.getByRole('button', { name: /alternar menú lateral/i });
    expect(trigger).toBeInTheDocument();

    // Click trigger on desktop to collapse
    fireEvent.click(trigger);
    expect(localStorage.getItem('sidebar_collapsed')).toBe('true');

    // Click trigger again to expand
    fireEvent.click(trigger);
    expect(localStorage.getItem('sidebar_collapsed')).toBe('false');
  });

  it('contains "Roles y Permisos" and "Auditoría" in suscriptor navigation', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard-suscriptor/dashboard']}>
        <AppLayout role="suscriptor">
          <div>Main Content</div>
        </AppLayout>
      </MemoryRouter>
    );

    expect(screen.getByText('Roles y Permisos')).toBeInTheDocument();
    expect(screen.getByText('Auditoría')).toBeInTheDocument();
  });
});

describe('Audit Logs for Subscribers (Auditoria)', () => {
  it('renders company audit title and filters out superadmin modules when role is suscriptor', async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard-suscriptor/auditoria']}>
        <Auditoria role="suscriptor" />
      </MemoryRouter>
    );

    // Verify company header
    await waitFor(() => {
      expect(screen.getByText('Registro de Auditoría de la Empresa')).toBeInTheDocument();
    });
    expect(
      screen.getByText(/Trazabilidad y registro de acciones realizadas por los operadores/i)
    ).toBeInTheDocument();

    // Verify module filter excludes PLANES, SUSCRIPTORES, ANUNCIOS
    await waitFor(() => {
      const moduleSelect = screen.getByDisplayValue('Todos los módulos');
      expect(moduleSelect).toBeInTheDocument();
    });

    // Check available options
    expect(screen.queryByRole('option', { name: 'PLANES' })).not.toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'SUSCRIPTORES' })).not.toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'ANUNCIOS' })).not.toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'PLANTILLAS' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'CAMPANAS' })).toBeInTheDocument();
  });
});

describe('Roles and Permissions for Subscribers (Roles)', () => {
  it('renders team roles title, excludes "admin" role, and filters superadmin modules when role is suscriptor', async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard-suscriptor/roles']}>
        <RolesPage role="suscriptor" />
      </MemoryRouter>
    );

    // Verify company header
    await waitFor(() => {
      expect(screen.getByText('Roles y Permisos del Equipo')).toBeInTheDocument();
    });
    expect(
      screen.getByText(/Configura roles personalizados y permisos de acceso para los operadores/i)
    ).toBeInTheDocument();

    // Verify "admin" role is excluded
    await waitFor(() => {
      expect(screen.getAllByText(/empresa/i).length).toBeGreaterThan(0);
    });
    expect(screen.queryByText(/^admin$/i)).not.toBeInTheDocument();
    expect(screen.getByText('operator')).toBeInTheDocument();

    // Verify superadmin modules (planes, suscriptores) are excluded from permissions matrix
    expect(screen.queryByText(/Gestionar Planes/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Ver Suscriptores/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Crear Plantillas/i)).toBeInTheDocument();
  });
});
