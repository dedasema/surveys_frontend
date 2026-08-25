# SurveySaaS Frontend — Agent Development Rules & Persistence Protocol

Este archivo define las reglas inmutables de desarrollo, arquitectura y persistencia para todos los agentes de IA que trabajen en este repositorio.

---

## 1. 🧠 Protocolo de Persistencia Obligatoria en Engram (Mandatory Proof of Save)

1. **Persistencia Proactiva Inmediata:**  
   Al completar cualquier cambio de código, refactorización, corrección de errores, decisión de arquitectura o hito funcional, el agente **DEBE invocar de forma obligatoria la herramienta `mem_save` de Engram** antes de generar su respuesta final.

2. **Comprobante Obligatorio en la Respuesta (Receipt):**  
   Toda respuesta del agente que involucre modificaciones de código o entregables debe finalizar con el bloque de comprobante oficial de Engram:
   ```markdown
   > **Engram Receipt:** `#<ID>` (`<sync_id>`) — *<Título del Hito>*
   ```
   *Si este comprobante no está presente, la tarea se considera legalmente incompleta.*

3. **Resolución de Conflictos y Fijación (Pinning):**  
   Si `mem_save` reporta conflictos pendientes (`judgment_required=true`), el agente debe resolverlos de inmediato con `mem_judge`. Los hitos arquitectónicos mayores deben consolidarse y fijarse con `mem_pin`.

---

## 2. 🏗️ Estándares de Arquitectura y Código

* **Estructura Modular (Screaming Architecture):** Componentes organizados por dominio y rol (`dashboard/` para SuperAdmin, `dashboard-suscriptor/` para Empresas, `dashboard-operador/` para Operadores).
* **Gestión de Sesión & JWT:** Validación proactiva de expiración de token en el cliente (`isTokenExpired`) para redirigir inmediatamente a `/login` ante un 401 o token ausente/vencido.
* **Manejo de Errores & Feedback:** Uso estandarizado de `parseApiErrorMessage` y notificaciones tipo toast con `sonner`. Cero alerts nativos bloqueantes.
* **Componentes Responsivos y Accesibles:** Soporte nativo para modo colapsado/expandido en Sidebar (`w-20` vs `w-64`) con persistencia en `localStorage`.

---

## 3. 📦 Verificación y Despliegue

1. **Build Limpio:** Siempre verificar `npm run build` para asegurar 0 errores de sintaxis y tipado antes de dar por cerrada una tarea.
2. **Conventional Commits:** Usar formato estándar (`feat:`, `fix:`, `refactor:`, `chore:`, `style:`). **Nunca** agregar atribuciones de IA ni `Co-Authored-By`.
3. **Despliegue Continuo:** Realizar `git push origin main` para disparar el despliegue automático a producción en Vercel.
