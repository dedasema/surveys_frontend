import { ChatMessage, LandingChatResponse, ChatAction } from '../types';

const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'https://surveys-backend-83d9.onrender.com';

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Intelligent local knowledge-base responder based on SurveySaaS core pillars.
 * Ensures 100% resilience even if the backend chat endpoint is unavailable.
 */
export function getLocalKnowledgeResponse(query: string): LandingChatResponse {
  const norm = normalizeText(query);

  // 1. Registro / Empezar / Iniciar sesión (evaluated first to match account onboarding)
  if (
    norm.includes('crear cuenta') ||
    norm.includes('registr') ||
    norm.includes('empezar') ||
    norm.includes('iniciar') ||
    norm.includes('login') ||
    norm.includes('comenzar') ||
    norm.includes('signup') ||
    norm.includes('sign up') ||
    norm.includes('alta')
  ) {
    return {
      answer:
        '¡Comenzar con **SurveySaaS** es sumamente fácil y rápido!\n\n' +
        '• Podés **Crear cuenta gratis** en menos de 1 minuto sin requerir tarjeta de crédito.\n' +
        '• Tendrás acceso inmediato al **Plan Gratuito** con 3 plantillas y 100 respuestas mensuales.\n' +
        '• Podrás diseñar encuestas multicanal (enlaces web, voz o papel con OCR) desde tu panel.',
      actions: [
        { label: '🚀 Crear cuenta gratis', href: '/register' },
        { label: 'Iniciar sesión', href: '/login' },
      ],
    };
  }

  // 2. Precios / Planes
  if (
    norm.includes('precio') ||
    norm.includes('plan') ||
    norm.includes('costo') ||
    norm.includes('tarifa') ||
    norm.includes('suscrip') ||
    norm.includes('pagar') ||
    norm.includes('cuanto cuesta') ||
    norm.includes('gratis') ||
    norm.includes('gratuito') ||
    norm.includes('profesional') ||
    norm.includes('enterprise')
  ) {
    return {
      answer:
        'SurveySaaS ofrece 3 planes flexibles diseñados para cada etapa de tu negocio:\n\n' +
        '• **Gratuito ($0 / mes):** Ideal para comenzar. Incluye 3 plantillas, 2 campañas, hasta 100 respuestas/mes, 1 operador y recolección vía enlace web o email.\n' +
        '• **Profesional ($29.99 / mes):** Para equipos en crecimiento. Incluye 50 plantillas, 50 campañas, 5.000 respuestas/mes, 5 operadores, **asistente de voz con IA**, **escaneo OCR de papel** y analítica avanzada.\n' +
        '• **Enterprise ($99.99 / mes):** Para organizaciones. **Plantillas, campañas y respuestas ilimitadas**, operadores ilimitados, API completa, exportación masiva, SLA y soporte prioritario.\n\n' +
        'Todos los planes cuentan con cifrado de datos. Podés empezar gratis hoy mismo sin tarjeta de crédito.',
      actions: [
        { label: 'Ver tabla de planes', href: '#precios' },
        { label: 'Crear cuenta gratis', href: '/register' },
      ],
    };
  }

  // 3. Voz / Audio
  if (
    norm.includes('voz') ||
    norm.includes('audio') ||
    norm.includes('hablar') ||
    norm.includes('conversac') ||
    norm.includes('microfono') ||
    norm.includes('grabar') ||
    norm.includes('llamada') ||
    norm.includes('transcrip') ||
    norm.includes('escuchar')
  ) {
    return {
      answer:
        'Nuestras **Encuestas por Voz con IA** permiten a tus usuarios responder de forma natural hablando desde su navegador o teléfono móvil:\n\n' +
        '• **Transcripción automática instantánea:** Speech-to-Text de alta precisión en español con reconocimiento de dialectos.\n' +
        '• **Análisis de sentimiento y tono:** Detecta automáticamente emociones, nivel de satisfacción y urgencia en cada respuesta.\n' +
        '• **Mayor tasa de finalización:** Ideal para encuestas de campo, personas con dificultades para escribir o usuarios en movimiento.\n' +
        '• **Seguridad total:** Los audios son procesados de forma segura con cifrado extremo a extremo.',
      actions: [
        { label: 'Probar encuestas por voz', href: '/register' },
        { label: 'Ver planes con audio', href: '#precios' },
      ],
    };
  }

  // 4. Papel / OCR
  if (
    norm.includes('papel') ||
    norm.includes('ocr') ||
    norm.includes('imprim') ||
    norm.includes('pdf') ||
    norm.includes('escan') ||
    norm.includes('foto') ||
    norm.includes('camara') ||
    norm.includes('qr') ||
    norm.includes('fisic') ||
    norm.includes('planilla')
  ) {
    return {
      answer:
        'El módulo de **Papel & Escaneo OCR inteligente** combina lo físico con lo digital sin fricción:\n\n' +
        '• **PDFs listos para imprimir:** Generá formularios con códigos QR únicos por entrega para eventos presenciales, sucursales o auditorías.\n' +
        '• **Digitalización fotográfica:** Tomá fotos de las hojas con tu celular o cargá un lote escaneado en PDF.\n' +
        '• **Reconocimiento con IA (OCR):** Detecta automáticamente marcas, casillas de selección múltiple y texto manuscrito con verificación de consistencia.\n' +
        '• **Ahorro de horas de carga:** Convierte pilas de papel en datos tabulados y métricas al instante.',
      actions: [
        { label: 'Crear cuenta para probar OCR', href: '/register' },
        { label: 'Ver funcionalidades', href: '#funcionalidades' },
      ],
    };
  }

  // 5. Seguridad / Encriptación / Multi-tenancy
  if (
    norm.includes('segur') ||
    norm.includes('cifrad') ||
    norm.includes('encript') ||
    norm.includes('privacidad') ||
    norm.includes('datos') ||
    norm.includes('tenant') ||
    norm.includes('aislamiento') ||
    norm.includes('tls') ||
    norm.includes('aes') ||
    norm.includes('fraude')
  ) {
    return {
      answer:
        'La seguridad y privacidad empresarial son el núcleo de **SurveySaaS**:\n\n' +
        '• **Cifrado de grado bancario:** Datos protegidos con protocolo **TLS 1.3** en tránsito y cifrado **AES-256** en reposo.\n' +
        '• **Aislamiento Multi-Tenant estricto:** Separación lógica y de almacenamiento estricta por suscriptor y organización.\n' +
        '• **Detección inteligente de fraude:** Algoritmos automáticos que identifican respuestas duplicadas, bots o patrones anómalos.\n' +
        '• **Control de acceso basado en roles (RBAC):** Permisos específicos para administradores, operadores de campo y analistas.',
      actions: [
        { label: 'Empezar de forma segura', href: '/register' },
        { label: 'Explorar características', href: '#beneficios' },
      ],
    };
  }

  // 6. Contacto / Soporte
  if (
    norm.includes('contact') ||
    norm.includes('soporte') ||
    norm.includes('ayuda') ||
    norm.includes('humano') ||
    norm.includes('asesor') ||
    norm.includes('ventas')
  ) {
    return {
      answer:
        'Nuestro equipo está a tu disposición para ayudarte:\n\n' +
        '• Podés dejarnos tu consulta en la sección de contacto al final de esta página.\n' +
        '• Para integraciones a medida o planes Enterprise, nuestro equipo comercial se comunicará contigo rápidamente.',
      actions: [
        { label: 'Ir al formulario de contacto', href: '#contacto' },
        { label: 'Ver planes y precios', href: '#precios' },
      ],
    };
  }

  // Fallback default
  return {
    answer:
      '¡Hola! Como asesor virtual de **SurveySaaS**, puedo ayudarte con información sobre:\n\n' +
      '• **Planes y precios:** Opciones Gratuita ($0), Profesional ($29.99) y Enterprise ($99.99).\n' +
      '• **Encuestas por voz:** Captura asistida con inteligencia artificial y análisis de emociones.\n' +
      '• **Escaneo OCR de papel:** Digitalización automática de cuestionarios impresos con QR.\n' +
      '• **Seguridad:** Cifrado TLS 1.3 / AES-256 y arquitectura multi-tenant aislada.\n' +
      '• **Primeros pasos:** Creación de cuenta y configuración inicial.\n\n' +
      '¿Sobre qué tema te gustaría consultar?',
    actions: [
      { label: '💳 Ver planes y precios', href: '#precios' },
      { label: '🚀 Crear cuenta gratis', href: '/register' },
    ],
  };
}

/**
 * Send landing chat message to backend with fast timeout and resilient local fallback.
 */
export async function sendLandingMessage(
  message: string,
  history?: ChatMessage[]
): Promise<LandingChatResponse> {
  const endpoints = [
    `${API_BASE_URL}/chat/landing`,
    `${API_BASE_URL}/chat/publico`,
  ];

  for (const endpoint of endpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          history: history?.map((h) => ({
            sender: h.sender,
            text: h.text,
          })),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const answer =
          data.answer ||
          data.response ||
          data.message ||
          data.reply ||
          '';

        if (answer) {
          const actions: ChatAction[] = Array.isArray(data.actions)
            ? data.actions
            : [];
          return { answer, actions };
        }
      }
    } catch {
      // Continue to next endpoint or fallback
    }
  }

  // Resilient fallback to local knowledge base
  return getLocalKnowledgeResponse(message);
}

export const landingChatService = {
  sendLandingMessage,
  getLocalKnowledgeResponse,
};

export default landingChatService;
