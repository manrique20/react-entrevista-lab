import { Topic } from '@/types';

export const LEVEL_7_TOPICS: Topic[] = [
  {
    id: '7.1',
    level: 7,
    levelTitle: 'Frameworks y Arquitectura',
    title: '7.1 Estrategias de Renderizado (CSR, SSR, SSG, ISR) e Hidratación',
    summary: 'Comparativa profunda de arquitectura web: dónde y cuándo se genera el HTML y el proceso de hidratación.',
    whatIsIt: `Elegir la estrategia adecuada determina el SEO, la velocidad de carga (LCP) y los costos de infraestructura:

1. **CSR (Client-Side Rendering)**:
- El servidor envía un archivo HTML prácticamente vacío (\`<div id="root"></div>\`) y un bundle JS.
- El navegador descarga el JS, lo ejecuta y renderiza la interfaz.
- Ideal para: Paneles de administración privados y dashboards tras login (SEO irrelevante).
2. **SSR (Server-Side Rendering)**:
- El servidor genera el HTML completo con datos frescos **en cada petición HTTP entrante**.
- Excelente para: Contenido altamente dinámico y personalizado con requerimientos de SEO.
3. **SSG (Static Site Generation)**:
- El HTML se compila **una sola vez durante el proceso de build**.
- Se sirve instantáneamente desde CDNs globales con costo casi cero.
- Ideal para: Blogs, documentación técnica, landing pages de marketing.
4. **ISR (Incremental Static Regeneration)**:
- Permite regenerar páginas estáticas en segundo plano tras un intervalo de tiempo (\`revalidate: 60\`) o bajo demanda, combinando la velocidad de SSG con la frescura de SSR.

**¿Qué es la Hidratación?**:
Es el proceso donde el JavaScript del cliente se descarga y React "conecta" los controladores de eventos y el estado reactivo al HTML que el servidor ya envió.`,
    codeSnippet: `// Matriz de estrategias en Next.js App Router:

// 1. SSG (Por defecto si no hay funciones dinámicas):
export default async function PaginaEstatica() {
  return <h1>Generado una vez en build time</h1>;
}

// 2. ISR (Regeneración incremental cada hora):
// export const revalidate = 3600;

// 3. SSR (Dinámico en cada request mediante cabeceras dinámicas):
// import { headers } from 'next/headers';
// export default async function PaginaDinamica() {
//   const h = await headers(); ...
// }`,
    interviewTips: [
      'Explica el concepto de "Hydration Mismatch": ocurre cuando el árbol de HTML generado por el servidor difiere del primer render que calcula el navegador en cliente (ej: usar `new Date()`, `Math.random()` o leer `window.localStorage` en el render). React arrojará un error de mismatch.',
      'Solución elegante a mismatch de hidratación: mostrar un placeholder seguro o diferir la renderización del dato dependiente del navegador hasta después del montaje con un `useEffect` y bandera `isMounted`.'
    ],
    commonTraps: [
      'Usar SSR dinámico para páginas que cambian una vez a la semana, sobrecargando los servidores de backend innecesariamente en vez de usar SSG o ISR.',
      'Renderizar datos dependientes del cliente (`localStorage.getItem()`) directamente en el JSX inicial.'
    ],
    keyTakeaway: 'SSG para velocidad y CDN, SSR para dinamismo por request, ISR para equilibrio híbrido, y CSR para dashboards privados.',
    componentKey: 'RenderingStrategiesDemo',
    tags: ['csr', 'ssr', 'ssg', 'isr', 'hidratacion', 'mismatch', 'nextjs']
  },
  {
    id: '7.2',
    level: 7,
    levelTitle: 'Frameworks y Arquitectura',
    title: '7.2 Next.js App Router (Arquitectura moderna)',
    summary: 'Enrutamiento basado en archivos con Server Components nativos, layouts anidados persistentes y Route Handlers.',
    whatIsIt: `Next.js App Router (directorio \`app/\`) es el estándar contemporáneo de arquitectura para aplicaciones React:

Convenciones de archivos esenciales:
- \`layout.tsx\`: Define UI compartida entre rutas (Navbars, Sidebars). **Conserva su estado y no se re-renderiza** al navegar entre páginas hijas.
- \`page.tsx\`: El contenido único del segmento de ruta visible al usuario.
- \`loading.tsx\`: Esqueleto de carga automático envuelto en un límite de \`<Suspense>\`.
- \`error.tsx\`: Límite de error automático envuelto en un Error Boundary de React (debe ser un Client Component).
- \`not-found.tsx\`: Interfaz para estados HTTP 404.
- \`route.ts\`: Endpoints de API REST nativos (**Route Handlers**).
- \`middleware.ts\`: Intercepta peticiones antes de llegar al enrutador (redirecciones, autenticación, cookies).`,
    codeSnippet: `// app/blog/[slug]/page.tsx (Ruta Dinámica)
interface Params {
  params: Promise<{ slug: string }>;
}

// 1. Generación de rutas estáticas en build time (SSG dinámico):
export async function generateStaticParams() {
  return [{ slug: 'react-19' }, { slug: 'nextjs-app-router' }];
}

// 2. Server Component asíncrono:
export default async function ArticuloPage({ params }: Params) {
  const { slug } = await params;
  return (
    <article className="prose">
      <h1>Leyendo artículo: {slug}</h1>
      <p>Contenido renderizado en servidor con cero JS de cliente.</p>
    </article>
  );
}`,
    interviewTips: [
      'En Next.js 15+, los parámetros de ruta `params` y `searchParams` pasaron a ser Promesas asíncronas (`const { slug } = await params;`). Mencionar este cambio reciente demuestra que estás completamente al día con la última versión de Next.js.',
      'Explica el sistema de Caché de Next.js de 4 capas: Request Memoization (deduplica fetch en un mismo render), Data Cache (persiste entre requests), Full Route Cache (guarda HTML estático en build) y Router Cache (en memoria del navegador en cliente).'
    ],
    commonTraps: [
      'Intentar exportar funciones de metadata o `generateStaticParams` dentro de un Client Component (`"use client"`). Estas funciones solo pueden ejecutarse en Server Components.',
      'Hacer llamadas a endpoints de API de tu propio proyecto Next.js (`fetch("/api/users")`) dentro de un Server Component en vez de consultar la base de datos o servicio directamente.'
    ],
    keyTakeaway: 'Next.js App Router unifica layouts persistentes, Server Components asíncronos y convenciones declarativas.',
    componentKey: 'NextJsArchitectureDemo',
    tags: ['nextjs', 'app-router', 'layouts', 'server-components', 'route-handlers']
  },
  {
    id: '7.3',
    level: 7,
    levelTitle: 'Frameworks y Arquitectura',
    title: '7.3 Ecosistema: Remix / React Router v7 vs. Next.js vs. Vite',
    summary: 'Comparativa de filosofía de frameworks: estándares web y loaders/actions de Remix vs Server Components de Next.js vs SPAs con Vite.',
    whatIsIt: `La elección de framework define la experiencia de desarrollo y el modelo de datos:

1. **Next.js (Vercel)**:
- Filosofía: **React Server Components (RSC) y Server Actions**.
- Fuerte orientación al servidor, streaming progresivo y computación Edge.
- Ideal para: Aplicaciones web completas, plataformas de comercio electrónico y contenido global.

2. **Remix / React Router v7 (Shopify)**:
- Filosofía: **Estándares web nativos (Request, Response, FormData)** y mejora progresiva.
- Utiliza funciones \`loader\` para cargar datos y \`action\` para mutaciones antes de renderizar la ruta.
- No depende de RSC; mantiene un modelo mental más cercano al protocolo HTTP tradicional.

3. **Vite**:
- Filosofía: Dev server ultrarrápido impulsado por ESM nativo y esbuild.
- Es el reemplazo definitivo de Create React App (CRA) para **Single Page Applications (SPA) puras**.
- Ideal para: Paneles de administración internos que no requieren SSR ni SEO.`,
    codeSnippet: `// Comparativa del modelo de datos:

// En Remix / React Router v7:
// export async function loader({ request }: LoaderFunctionArgs) {
//   return json(await obtenerDatos());
// }
// export async function action({ request }: ActionFunctionArgs) {
//   const form = await request.formData();
//   return redirect('/exito');
// }

// En Next.js App Router:
// export default async function Pagina() {
//   const datos = await obtenerDatos(); // Fetch directo en el componente
//   return <UI datos={datos} />;
// }`,
    interviewTips: [
      'Explica la unificación de Remix y React Router: Remix v3 se fusionó oficialmente en **React Router v7**, permitiendo a cualquier proyecto que use React Router habilitar capacidades de servidor (SSR, pre-rendering, loaders) de forma gradual.',
      'Menciona el fin de Create React App (CRA): CRA está oficialmente descontinuado y la documentación oficial de React recomienda usar frameworks (Next.js, React Router/Remix) o Vite para SPAs.'
    ],
    commonTraps: [
      'Iniciar un proyecto nuevo en 2026 con Create React App (CRA). Es una bandera roja inmediata en cualquier prueba técnica.',
      'Elegir Next.js con SSR para una herramienta puramente interna detrás de autenticación estricta donde una SPA simple con Vite y TanStack Query hubiera sido más rápida de desplegar y mantener.'
    ],
    keyTakeaway: 'Next.js lidera en RSC; React Router v7 en estándares web y loaders; Vite es el rey para SPAs puras.',
    componentKey: 'FrameworksComparisonDemo',
    tags: ['remix', 'react-router-v7', 'vite', 'nextjs', 'frameworks', 'comparativa']
  },
  {
    id: '7.4',
    level: 7,
    levelTitle: 'Frameworks y Arquitectura',
    title: '7.4 Arquitectura de Carpetas y Organización a Escala',
    summary: 'Feature-based Architecture vs Atomic Design. Principios de encapsulamiento y modularidad para proyectos grandes.',
    whatIsIt: `A medida que una base de código supera los 50 componentes, organizarlos simplemente por tipo técnico (\`/components\`, \`/hooks\`, \`/services\`) colapsa la productividad.

**1. Arquitectura orientada a Funcionalidades (Feature-based)**:
Organiza el código alrededor del dominio del negocio. Cada carpeta representa una característica aislada con su propia API pública:
\`\`\`
src/
  features/
    auth/
      components/
      hooks/
      api/
      types.ts
      index.ts       <- API pública expuesta al resto de la app
    carrito/
      components/
      hooks/
      index.ts
  shared/            <- Componentes UI primitivos y utilitarios genéricos
    ui/ (Button, Modal, Input)
    hooks/ (useDebounce)
    utils/
\`\`\`
**Regla de oro**: Las features no deben importar archivos internos de otras features directamente. Solo pueden consumir lo exportado en el \`index.ts\` público de otra feature, o elevar código compartido a \`shared/\`.`,
    codeSnippet: `// Ejemplo de API pública limpia en src/features/auth/index.ts:
// Exportamos solo lo que el resto de la app tiene permitido usar:
export { AuthProvider, useAuth } from './hooks/useAuth';
export { LoginForm } from './components/LoginForm';
export type { UserProfile } from './types';
// Los detalles de implementación internos permanecen privados dentro de la feature.`,
    interviewTips: [
      'Explica por qué evitar imports cruzados profundos (`import x from "../auth/components/internals/Auxiliar"`): acopla fuertemente los módulos e imposibilita refactorizar o extraer una funcionalidad a un paquete independiente.',
      'Compara con Atomic Design: Atomic Design (Átomos, Moléculas, Organismos, Plantillas) es excelente para Design Systems puros (`shared/ui`), pero menos práctico para lógica de negocio de gran escala, donde Feature-based resulta superior.'
    ],
    commonTraps: [
      'Crear una carpeta `utils/` o `helpers/` gigante que se convierte en un basurero de funciones inconexas.',
      'Tener archivos de 1,500 líneas que mezclan lógica de llamadas HTTP, transformación de datos, estados de UI y JSX.'
    ],
    keyTakeaway: 'Organiza por funcionalidades (features) con APIs públicas claras en `index.ts` y agrupa componentes primitivos en `shared/`.',
    componentKey: 'FolderArchitectureDemo',
    tags: ['arquitectura-carpetas', 'feature-based', 'atomic-design', 'modularidad', 'escalabilidad']
  },
  {
    id: '7.5',
    level: 7,
    levelTitle: 'Frameworks y Arquitectura',
    title: '7.5 Monorepos y Espacios de Trabajo (Turborepo, Nx, pnpm)',
    summary: 'Manejar múltiples aplicaciones y paquetes compartidos en un solo repositorio con builds cacheados y cambios atómicos.',
    whatIsIt: `Un **Monorepo** es un único repositorio de Git que alberga múltiples proyectos o paquetes relacionados:
- \`apps/web\`: Sitio público para clientes (Next.js).
- \`apps/admin\`: Panel de administración interno.
- \`packages/ui\`: Biblioteca de componentes y Design System compartido.
- \`packages/tsconfig\`: Configuraciones compartidas de TypeScript y ESLint.

**Herramientas esenciales del ecosistema**:
- **pnpm workspaces / npm workspaces**: Enlazan los paquetes locales mediante symlinks sin publicarlos en npm.
- **Turborepo / Nx**: Orquestadores de tareas con **Caché Inteligente de Builds**.
  Si ejecutas \`build\` y ningún archivo de \`packages/ui\` cambió, Turborepo recupera el resultado compilado de la caché en milisegundos en lugar de compilarlo de nuevo.`,
    codeSnippet: `// turborepo.json (Definición de pipeline y caché)
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "lint": {},
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}`,
    interviewTips: [
      'Ventajas clave de un Monorepo en entrevistas: 1) Cambios atómicos (puedes actualizar una función en el paquete compartido y adaptar ambas aplicaciones consumidoras en un solo commit/pull request), 2) Reutilización inmediata de código sin ciclo de versionado semántico en npm registry.',
      'Trade-offs: Exige tooling más complejo, CI/CD más sofisticado y requiere estrategias de clonación ligera si el repositorio crece a gigabytes.'
    ],
    commonTraps: [
      'Crear paquetes en un monorepo que se importan de forma circular (A depende de B y B depende de A).',
      'No configurar caché remota en el CI (Remote Caching), perdiendo la principal ventaja de velocidad de Turborepo o Nx.'
    ],
    keyTakeaway: 'Monorepos con Turborepo y pnpm workspaces unifican paquetes y aplicaciones compartiendo código con caché incremental.',
    componentKey: 'MonorepoStructureDemo',
    tags: ['monorepo', 'turborepo', 'nx', 'pnpm-workspaces', 'cache-builds']
  },
  {
    id: '7.6',
    level: 7,
    levelTitle: 'Frameworks y Arquitectura',
    title: '7.6 Micro-frontends y Module Federation',
    summary: 'Descomponer aplicaciones web en despliegues independientes por equipo mediante carga dinámica de módulos en runtime.',
    whatIsIt: `Inspirado en la arquitectura de microservicios en el backend, un **Micro-frontend** divide una aplicación frontend monolítica en módulos autónomos desplegados por equipos de ingeniería independientes:

- **Host (Shell / Contenedor)**: La aplicación principal que orquesta la navegación, layout y autenticación.
- **Remotes (Micro-apps)**: Aplicaciones secundarias (ej: Checkout, Carrito, Catálogo) que se despliegan en sus propios dominios y servidores.

**Module Federation (Webpack 5 / Rspack)**:
Es la tecnología que revolucionó los micro-frontends al permitir que una aplicación host descargue dinámicamente en tiempo de ejecución (runtime) componentes exportados por una aplicación remota, **compartiendo dependencias comunes (como React y ReactDOM) como singleton** para no descargarlas por duplicado.`,
    codeSnippet: `// webpack.config.js (Host consumiendo una micro-app remota)
// const { ModuleFederationPlugin } = require('webpack').container;
//
// plugins: [
//   new ModuleFederationPlugin({
//     name: 'shell_app',
//     remotes: {
//       carritoApp: 'carrito@https://carrito.empresa.com/remoteEntry.js'
//     },
//     shared: {
//       react: { singleton: true, requiredVersion: '^19.0.0' },
//       'react-dom': { singleton: true }
//     }
//   })
// ]

// Consumo en React con lazy loading dinámico:
// const CarritoRemoto = lazy(() => import('carritoApp/WidgetCarrito'));`,
    interviewTips: [
      'Enfoque senior crítico sobre Micro-frontends: "Los micro-frontends son una solución organizacional para coordinar decenas de equipos autónomos, NO una optimización técnica". Introduce sobrecarga operativa, fragmentación de dependencias y riesgo de inconsistencias de UX. Si no tienes más de 50 ingenieros en múltiples squads, suele ser sobre-ingeniería innecesaria.',
      'Explica la importancia de `singleton: true` en las dependencias compartidas: si el Host y el Remote cargan dos instancias distintas de React en la misma pestaña del navegador, los hooks fallarán con errores de dispatcher inválido.'
    ],
    commonTraps: [
      'Adoptar micro-frontends en un equipo pequeño esperando que la web sea "más rápida". Habitualmente aumenta el tiempo de carga por la descarga de múltiples configuraciones.',
      'No coordinar las versiones compartidas de librerías base, descargando múltiples copias de frameworks.'
    ],
    keyTakeaway: 'Module Federation carga módulos remotos en runtime con dependencias singleton; es una solución para escala de equipos.',
    componentKey: 'MicrofrontendsDemo',
    tags: ['micro-frontends', 'module-federation', 'webpack', 'escalabilidad-equipos', 'remotes']
  },
  {
    id: '7.7',
    level: 7,
    levelTitle: 'Frameworks y Arquitectura',
    title: '7.7 Design Systems y Storybook',
    summary: 'Tokens de diseño, componentes atómicos testeados en aislamiento y documentación viva para equipos de diseño y desarrollo.',
    whatIsIt: `Un **Design System** es la fuente única de verdad para el diseño de interfaces de una compañía. Consta de:
1. **Design Tokens**: Valores primitivos de variables (colores hexadecimales, escalas tipográficas, radios de borde, espaciados y sombras).
2. **Componentes Accesibles**: Biblioteca de piezas de UI reutilizables fuertemente tipadas.
3. **Pautas y Documentación**: Guías de tono, accesibilidad y casos de uso.

**Storybook**:
Es el entorno de desarrollo y catálogo visual estándar de la industria para construir y probar componentes de React **en total aislamiento**, sin necesidad de ejecutar la aplicación completa, bases de datos ni backends.`,
    codeSnippet: `// Boton.stories.tsx (Historia de Storybook con CSF 3.0)
import type { Meta, StoryObj } from '@storybook/react';
import { Boton } from './Boton';

const meta: Meta<typeof Boton> = {
  title: 'Design System/Boton',
  component: Boton,
  tags: ['autodocs'],
  argTypes: {
    variante: { control: 'select', options: ['primario', 'secundario', 'peligro'] }
  }
};
export default meta;

type Story = StoryObj<typeof Boton>;

export const Primario: Story = {
  args: { variante: 'primario', children: 'Aceptar' }
};

export const Deshabilitado: Story = {
  args: { disabled: true, children: 'No disponible' }
};`,
    interviewTips: [
      'Explica las ventajas de Storybook en equipos multidisciplinarios: permite a los diseñadores de UI/UX y a los QA verificar todos los estados de un componente (hover, focus, disabled, loading, responsive) sin tener que reproducir estados complejos en la app real.',
      'Menciona el testing de regresión visual (Chromatic): toma capturas de pantalla de cada historia en cada pull request y detecta cambios inesperados de píxeles automáticamente.'
    ],
    commonTraps: [
      'Hardcodear colores y valores de espaciado en los componentes en lugar de utilizar tokens de diseño CSS o variables de Tailwind.',
      'Dejar que la documentación de Storybook quede desactualizada respecto a las props reales del componente.'
    ],
    keyTakeaway: 'Storybook permite crear y auditar componentes en aislamiento impulsados por design tokens coherentes.',
    componentKey: 'DesignSystemStoryDemo',
    tags: ['design-system', 'storybook', 'design-tokens', 'ui-catalog', 'chromatic']
  },
  {
    id: '7.8',
    level: 7,
    levelTitle: 'Frameworks y Arquitectura',
    title: '7.8 Autenticación en Frontend: Cookies HttpOnly vs. LocalStorage',
    summary: 'Riesgos de XSS con LocalStorage, almacenamiento seguro con Cookies HttpOnly + SameSite y rotación de tokens.',
    whatIsIt: `La gestión de credenciales y tokens JWT en el frontend es uno de los temas de seguridad más rigurosamente evaluados:

1. **JWT en \`localStorage\` (Práctica vulnerable)**:
- Vulnerabilidad crítica: **Cualquier script malicioso inyectado (XSS) puede leer \`localStorage.getItem('token')\` y exfiltrar la sesión**.
- Único pro: Simplicidad para SPAs simples.
2. **Cookies \`HttpOnly\`, \`Secure\` y \`SameSite=Lax/Strict\` (Estándar de Oro)**:
- La bandera **\`HttpOnly\`** impide que el código JavaScript (incluso código malicioso) pueda leer la cookie con \`document.cookie\`.
- La bandera **\`Secure\`** garantiza que solo viaje por conexiones encriptadas HTTPS.
- La bandera **\`SameSite\`** previene ataques de falsificación de peticiones en sitios cruzados (CSRF).
3. **Estrategia híbrida (Access Token en memoria + Refresh Token en cookie HttpOnly)**:
- Access Token corto (ej: 5-15 minutos) almacenado únicamente en memoria de JavaScript (en un estado o variable).
- Refresh Token largo (días) guardado en cookie HttpOnly. Si el access token expira, un interceptor hace una petición silenciosa para renovarlo.`,
    codeSnippet: `// Demostración conceptual de interceptor de autenticación con refresco silencioso:
async function fetchConAuth(url: string, opciones: RequestInit = {}): Promise<Response> {
  let res = await fetch(url, opciones);

  // Si el token en memoria expiró (401 Unauthorized):
  if (res.status === 401) {
    // Intentamos refrescar usando la cookie HttpOnly en el servidor
    const resRefresco = await fetch('/api/auth/refresh', { method: 'POST' });

    if (resRefresco.ok) {
      // Reintentamos la petición original una sola vez
      res = await fetch(url, opciones);
    } else {
      // Sesión expirada por completo -> Redirigir a login
      window.location.href = '/login';
    }
  }

  return res;
}`,
    interviewTips: [
      'Frase clave de seguridad en entrevistas: "La seguridad en el frontend es cosmética para la UX; la autorización real siempre se valida en el backend". Ocultar un botón de eliminar si el usuario no es admin solo evita confusiones visuales, pero el endpoint debe rechazar peticiones no autorizadas.',
      'Explica el flujo OAuth 2.0 con PKCE (Proof Key for Code Exchange): es el estándar requerido para aplicaciones Single Page sin backend secreto confiable.'
    ],
    commonTraps: [
      'Guardar tokens sensibles de pago o credenciales de usuario en `localStorage` o `sessionStorage`.',
      'Confiar en que un middleware de Next.js es la única barrera de seguridad: las Server Actions y Route Handlers también deben validar individualmente la sesión del usuario.'
    ],
    keyTakeaway: 'Usa Cookies HttpOnly con SameSite para neutralizar XSS en la lectura de tokens, complementado con validación en servidor.',
    componentKey: 'AuthSecurityFlowDemo',
    tags: ['autenticacion', 'httponly-cookies', 'localstorage', 'jwt', 'xss-mitigation', 'oauth-pkce']
  },
  {
    id: '7.9',
    level: 7,
    levelTitle: 'Frameworks y Arquitectura',
    title: '7.9 Seguridad Frontend: XSS, `dangerouslySetInnerHTML` y Sanitización',
    summary: 'Cómo React escapa strings por defecto, los peligros de inyección de HTML crudo y desinfección obligatoria con DOMPurify.',
    whatIsIt: `Por defecto, React protege contra **Cross-Site Scripting (XSS)** escapando automáticamente cualquier valor insertado dentro de llaves JSX (\`<div>{usuarioInput}</div>\`). Un string como \`<script>alert(1)</script>\` se renderiza como texto plano inofensivo.

**¿Dónde residen los vectores de vulnerabilidad en React?**:
1. **\`dangerouslySetInnerHTML={{ __html: htmlCrudo }}\`**:
Diseñado para renderizar HTML proveniente de un CMS (ej: artículos enriquecidos). Si ese HTML contiene entradas no filtradas de usuarios, atacantes pueden inyectar scripts maliciosos.
**Mitigación obligatoria**: Sanitizar previamente el contenido con **\`DOMPurify\`** (\`DOMPurify.sanitize(html)\`).
2. **Enlaces con protocolo malicioso**:
\`<a href={urlUsuario}>Enlace</a>\`. Si el usuario envía \`javascript:alert(document.cookie)\`, el navegador ejecutará el script al hacer clic. Se debe validar que la URL comience por \`https://\` o \`http://\`.
3. **Inyecciones en evaluadores**:
Uso de \`eval()\` o \`new Function()\` con datos dinámicos.`,
    codeSnippet: `// import DOMPurify from 'dompurify'; // Sanitizador estándar de la industria

function ContenidoArticuloSeguro({ htmlDelUsuario }: { htmlDelUsuario: string }) {
  // ❌ PELIGROSO: Permite XSS si el HTML contiene etiquetas maliciosas
  // <div dangerouslySetInnerHTML={{ __html: htmlDelUsuario }} />

  // ✅ SEGURO: DOMPurify elimina etiquetas <script>, eventos onerror, etc.
  // const htmlLimpio = DOMPurify.sanitize(htmlDelUsuario);

  // Validación de enlaces externos seguros:
  const esUrlSegura = (url: string) => /^https?:\\/\\//i.test(url);

  return (
    <div>
      <div className="prose">
        {/* Renderizado seguro sanitizado */}
        <p>Siempre sanitiza el HTML con DOMPurify antes de inyectarlo.</p>
      </div>
    </div>
  );
}`,
    interviewTips: [
      'Explica qué es una política CSP (Content Security Policy): es una cabecera HTTP enviada por el servidor (`Content-Security-Policy: default-src "self"; ...`) que le indica al navegador qué dominios tienen autorización para ejecutar scripts o cargar fuentes, actuando como segunda línea de defensa impenetrable ante fallas de XSS.',
      'Explica el prefijo deliberado `dangerously`: el equipo de React nombró la propiedad con la palabra `dangerously` para recordar activamente al desarrollador que está abriendo una brecha de seguridad si no sanitiza el contenido.'
    ],
    commonTraps: [
      'Intentar sanitizar HTML usando expresiones regulares caseras (`replace(/<script>/, "")`): los atacantes pueden evadir regexes con variantes ofuscadas (`<img src=x onerror=alert(1)>`, `<svg onload=...>`). Siempre usa librerías dedicadas como DOMPurify.',
      'Permitir enlaces con protocolo `javascript:...` en elementos `<a>`.'
    ],
    keyTakeaway: 'React escapa texto por defecto; si usas `dangerouslySetInnerHTML`, desinfecta obligatoriamente con DOMPurify.',
    componentKey: 'XssSanitizationDemo',
    tags: ['seguridad', 'xss', 'dangerouslySetInnerHTML', 'dompurify', 'csp', 'sanitizacion']
  }
];
