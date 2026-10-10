import { Topic } from '@/types';

export const LEVEL_7_TOPICS: Topic[] = [
  {
    id: '7.1',
    level: 7,
    levelTitle: 'Frameworks & Architecture',
    title: '7.1 Rendering Strategies (CSR, SSR, SSG, ISR) & Hydration',
    summary: 'In-depth web architecture comparison: where and when HTML is generated, and how hydration attaches interactivity.',
    whatIsIt: `Selecting the right rendering strategy dictates SEO capabilities, load performance (LCP), and infrastructure costs:

1. **CSR (Client-Side Rendering)**:
- The server delivers a virtually empty HTML shell (\`<div id="root"></div>\`) alongside a JavaScript bundle.
- The browser downloads and executes JavaScript to render the interface.
- Best suited for: Private admin dashboards and authenticated apps (where SEO is irrelevant).
2. **SSR (Server-Side Rendering)**:
- The server renders full HTML with fresh data on **every incoming HTTP request**.
- Ideal for: Highly dynamic, personalized content requiring robust SEO.
3. **SSG (Static Site Generation)**:
- HTML is generated **once at build time**.
- Served instantaneously from global CDN edges at near-zero compute cost.
- Ideal for: Blogs, documentation hubs, and marketing landing pages.
4. **ISR (Incremental Static Regeneration)**:
- Regenerates static pages in the background after a time interval (\`revalidate: 60\`) or on demand, combining SSG edge speeds with SSR freshness.

**What is Hydration?**:
The client-side process where downloaded React JavaScript "wakes up" the static server HTML by attaching event listeners and initializing reactive state to match the DOM tree.`,
    codeSnippet: `// Next.js App Router rendering strategy matrix:

// 1. SSG (Default when no dynamic server functions are used):
export default async function StaticPage() {
  return <h1>Generated once at build time</h1>;
}

// 2. ISR (Incremental regeneration every hour):
// export const revalidate = 3600;

// 3. SSR (Dynamic per request via dynamic headers or uncached fetch):
// import { headers } from 'next/headers';
// export default async function DynamicPage() {
//   const h = await headers(); ...
// }`,
    interviewTips: [
      'Explain "Hydration Mismatch": occurs when the server-rendered HTML tree differs from the first client-rendered virtual DOM tree (e.g., calling `new Date()`, `Math.random()`, or reading `window.localStorage` during render). React will throw a hydration mismatch error.',
      'Clean resolution for hydration mismatches: display a deterministic placeholder or defer rendering browser-dependent data until after mount using `useEffect` with an `isMounted` flag or dedicated mounted hook.'
    ],
    commonTraps: [
      'Defaulting to dynamic SSR for pages that change once a week, straining backend servers when SSG or ISR would provide superior performance and lower costs.',
      'Reading client-only values (`localStorage.getItem()`) directly in the initial JSX render pass.'
    ],
    keyTakeaway: 'SSG for edge CDN speed, SSR for per-request dynamism, ISR for hybrid caching, and CSR for authenticated portals.',
    componentKey: 'RenderingStrategiesDemo',
    tags: ['csr', 'ssr', 'ssg', 'isr', 'hydration', 'mismatch', 'nextjs']
  },
  {
    id: '7.2',
    level: 7,
    levelTitle: 'Frameworks & Architecture',
    title: '7.2 Next.js App Router (Modern Architecture)',
    summary: 'File-system routing with native Server Components, persistent nested layouts, and Route Handlers.',
    whatIsIt: `The Next.js App Router (\`app/\` directory) represents the modern architectural standard for scalable React applications:

Essential file conventions:
- \`layout.tsx\`: Defines shared UI across route segments (Navbars, Sidebars). **Preserves state and avoids re-rendering** across child page navigations.
- \`page.tsx\`: The unique content of a route segment visible to the user.
- \`loading.tsx\`: Automatic loading UI wrapped in a declarative \`<Suspense>\` boundary.
- \`error.tsx\`: Automatic error boundary catching runtime exceptions in child segments (must be a Client Component).
- \`not-found.tsx\`: UI for HTTP 404 responses.
- \`route.ts\`: Native HTTP REST API endpoints (**Route Handlers**).
- \`middleware.ts\`: Intercepts requests before reaching routes (redirects, authentication, cookies, rewrites).`,
    codeSnippet: `// app/blog/[slug]/page.tsx (Dynamic Route)
interface Params {
  params: Promise<{ slug: string }>;
}

// 1. Static route generation at build time (Dynamic SSG):
export async function generateStaticParams() {
  return [{ slug: 'react-19' }, { slug: 'nextjs-app-router' }];
}

// 2. Asynchronous Server Component:
export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  return (
    <article className="prose">
      <h1>Reading article: {slug}</h1>
      <p>Content rendered entirely on the server with zero client JS.</p>
    </article>
  );
}`,
    interviewTips: [
      'In Next.js 15+, route parameters `params` and `searchParams` are asynchronous Promises (`const { slug } = await params;`). Citing this recent architectural change shows deep currency with modern Next.js releases.',
      'Explain Next.js 4-tier caching system: Request Memoization (deduplicates identical fetches within a single render), Data Cache (persists data across requests), Full Route Cache (persists static HTML and RSC payloads at build), and Router Cache (in-memory client-side route cache).'
    ],
    commonTraps: [
      'Attempting to export metadata or `generateStaticParams` from a Client Component (`"use client"`). These functions must execute strictly in Server Components.',
      'Calling internal API routes (`fetch("/api/users")`) inside a Server Component instead of directly querying the database or data layer.'
    ],
    keyTakeaway: 'Next.js App Router unifies persistent layouts, async Server Components, and declarative file conventions.',
    componentKey: 'NextJsArchitectureDemo',
    tags: ['nextjs', 'app-router', 'layouts', 'server-components', 'route-handlers']
  },
  {
    id: '7.3',
    level: 7,
    levelTitle: 'Frameworks & Architecture',
    title: '7.3 Ecosystem: Remix / React Router v7 vs. Next.js vs. Vite',
    summary: 'Framework philosophy comparison: Web standards and loaders/actions in Remix vs Server Components in Next.js vs SPAs in Vite.',
    whatIsIt: `Framework choice determines development experience, mental models, and data architectures:

1. **Next.js (Vercel)**:
- Philosophy: **React Server Components (RSC) and Server Actions**.
- Deep server integration, progressive streaming, and edge infrastructure.
- Ideal for: Full-stack applications, e-commerce platforms, and global content sites.

2. **Remix / React Router v7 (Shopify)**:
- Philosophy: **Native web standards (Request, Response, FormData)** and progressive enhancement.
- Relies on \`loader\` functions for reading data and \`action\` functions for mutations before route rendering.
- Avoids RSC dependency; maintains an HTTP-first mental model.

3. **Vite**:
- Philosophy: Ultra-fast dev server powered by native ESM and esbuild.
- The standard successor to Create React App (CRA) for **pure Single Page Applications (SPAs)**.
- Ideal for: Internal enterprise portals, admin consoles, and apps that don't need SSR or SEO.`,
    codeSnippet: `// Data model comparison:

// In Remix / React Router v7:
// export async function loader({ request }: LoaderFunctionArgs) {
//   return json(await getData());
// }
// export async function action({ request }: ActionFunctionArgs) {
//   const form = await request.formData();
//   return redirect('/success');
// }

// In Next.js App Router:
// export default async function Page() {
//   const data = await getData(); // Direct async data fetch in component
//   return <UI data={data} />;
// }`,
    interviewTips: [
      'Explain the Remix and React Router unification: Remix v3 merged into **React Router v7**, allowing standard React Router applications to incrementally adopt server capabilities (SSR, pre-rendering, loaders) without a rewrite.',
      'Mention the deprecation of Create React App (CRA): CRA is officially dead, and the React documentation now recommends modern full-stack frameworks (Next.js, React Router/Remix) or Vite for client-only SPAs.'
    ],
    commonTraps: [
      'Starting a new project in 2026 using Create React App (CRA)—an instant red flag in any senior technical interview.',
      'Choosing Next.js with complex SSR for a purely internal admin panel behind authentication when a Vite SPA with TanStack Query would be simpler, faster to ship, and cheaper to host.'
    ],
    keyTakeaway: 'Next.js leads in RSC; React Router v7 leads in web standards and loaders; Vite is king for client SPAs.',
    componentKey: 'FrameworksComparisonDemo',
    tags: ['remix', 'react-router-v7', 'vite', 'nextjs', 'frameworks', 'comparison']
  },
  {
    id: '7.4',
    level: 7,
    levelTitle: 'Frameworks & Architecture',
    title: '7.4 Folder Architecture & Organization at Scale',
    summary: 'Feature-based Architecture vs Atomic Design. Modular encapsulation principles for large-scale enterprise applications.',
    whatIsIt: `Once a codebase grows beyond 50 components, organizing purely by technical file type (\`/components\`, \`/hooks\`, \`/services\`) degrades developer velocity and modularity.

**1. Feature-Based Architecture**:
Organizes code around business domains. Each directory represents an isolated feature exposing a clean public API:
\`\`\`
src/
  features/
    auth/
      components/
      hooks/
      api/
      types.ts
      index.ts       <- Public API consumed by the rest of the app
    cart/
      components/
      hooks/
      index.ts
  shared/            <- Primitive reusable UI components and generic utilities
    ui/ (Button, Modal, Input)
    hooks/ (useDebounce)
    utils/
\`\`\`
**Golden Rule**: Features must never import private internal files of other features directly. They should only consume what is exported through the public \`index.ts\` barrier, or promote shared logic into \`shared/\`.`,
    codeSnippet: `// Clean public API boundary in src/features/auth/index.ts:
// Export only what the rest of the application is allowed to consume:
export { AuthProvider, useAuth } from './hooks/useAuth';
export { LoginForm } from './components/LoginForm';
export type { UserProfile } from './types';
// Internal implementation details remain private inside the feature folder.`,
    interviewTips: [
      'Explain why deep cross-feature imports (`import x from "../auth/components/internals/Helper"`) should be banned: they create tight coupling, preventing safe refactoring or extracting features into standalone packages.',
      'Compare with Atomic Design: Atomic Design (Atoms, Molecules, Organisms, Templates) works wonderfully for pure design systems (`shared/ui`), but breaks down when applied to domain-heavy business logic, where Feature-Based architecture shines.'
    ],
    commonTraps: [
      'Creating a monolithic `utils/` or `helpers/` folder that becomes an unmaintained dumping ground for unrelated helper functions.',
      'Writing 1,500-line god components that mix HTTP requests, state management, business transformations, and JSX markup.'
    ],
    keyTakeaway: 'Organize by business features with explicit public APIs via `index.ts`, placing shared primitives in `shared/`.',
    componentKey: 'FolderArchitectureDemo',
    tags: ['folder-architecture', 'feature-based', 'atomic-design', 'modularity', 'scalability']
  },
  {
    id: '7.5',
    level: 7,
    levelTitle: 'Frameworks & Architecture',
    title: '7.5 Monorepos & Workspaces (Turborepo, Nx, pnpm)',
    summary: 'Manage multiple applications and shared packages in a single repository with cached build pipelines and atomic commits.',
    whatIsIt: `A **Monorepo** is a single Git repository hosting multiple interrelated projects or packages:
- \`apps/web\`: Customer-facing web app (Next.js).
- \`apps/admin\`: Internal admin dashboard.
- \`packages/ui\`: Shared component library and Design System.
- \`packages/tsconfig\`: Centralized TypeScript and ESLint configurations.

**Essential Tools**:
- **pnpm workspaces / npm workspaces**: Link local packages via symlinks without publishing intermediate artifacts to npm.
- **Turborepo / Nx**: Task orchestrators featuring **Intelligent Build Caching**.
  If you run \`build\` and no files in \`packages/ui\` have changed, Turborepo retrieves the build artifacts from cache in milliseconds rather than rebuilding.`,
    codeSnippet: `// turborepo.json (Pipeline definition and caching)
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
      'Core Monorepo benefits in interviews: 1) Atomic changes (refactor a shared component and update all consuming apps in a single commit/PR), 2) Immediate code reuse without publishing semantic version cycles to an npm registry.',
      'Trade-offs: Requires specialized CI/CD infrastructure, complex tooling, and repository scaling considerations (sparse checkouts) as git history expands.'
    ],
    commonTraps: [
      'Introducing circular package dependencies (Package A imports Package B while Package B imports Package A).',
      'Failing to configure Remote Caching in CI, forfeiting the primary speed benefit of Turborepo or Nx.'
    ],
    keyTakeaway: 'Monorepos with Turborepo and pnpm workspaces streamline multi-package workflows through incremental cached builds.',
    componentKey: 'MonorepoStructureDemo',
    tags: ['monorepo', 'turborepo', 'nx', 'pnpm-workspaces', 'build-cache']
  },
  {
    id: '7.6',
    level: 7,
    levelTitle: 'Frameworks & Architecture',
    title: '7.6 Micro-frontends & Module Federation',
    summary: 'Decompose web apps into independently deployable team sub-applications via runtime dynamic module loading.',
    whatIsIt: `Inspired by backend microservices, **Micro-frontends** break a monolithic frontend into autonomous sub-applications developed and deployed by independent engineering teams:

- **Host (Shell / Container)**: The primary application orchestrating layout, routing, and shared authentication.
- **Remotes (Micro-apps)**: Autonomous sub-applications (e.g., Checkout, Cart, Catalog) deployed independently to their own domains.

**Module Federation (Webpack 5 / Rspack)**:
The cornerstone technology that enables host applications to dynamically download components exported by remote applications at runtime, while **sharing singleton dependencies (like React and ReactDOM)** so libraries are not duplicated in memory.`,
    codeSnippet: `// webpack.config.js (Host consuming a remote micro-app)
// const { ModuleFederationPlugin } = require('webpack').container;
//
// plugins: [
//   new ModuleFederationPlugin({
//     name: 'shell_app',
//     remotes: {
//       cartApp: 'cart@https://cart.company.com/remoteEntry.js'
//     },
//     shared: {
//       react: { singleton: true, requiredVersion: '^19.0.0' },
//       'react-dom': { singleton: true }
//     }
//   })
// ]

// Consumption in React via dynamic lazy loading:
// const RemoteCart = lazy(() => import('cartApp/CartWidget'));`,
    interviewTips: [
      'Senior architectural perspective: "Micro-frontends are an organizational solution for coordinating dozens of autonomous squads, NOT a technical optimization". They introduce operational overhead, dependency complexity, and UX fragmentation risks. Unless you have 50+ engineers across multiple squads, they often represent unnecessary over-engineering.',
      'Explain `singleton: true` in shared dependencies: if the Host and Remote instantiate separate copies of React in the same browser context, hooks will crash due to multiple dispatcher instances.'
    ],
    commonTraps: [
      'Adopting micro-frontends in small teams hoping the website will be "faster". In practice, load times often increase due to downloading multiple bundles and manifests.',
      'Neglecting version coordination across shared foundational libraries, leaking multiple framework instances.'
    ],
    keyTakeaway: 'Module Federation loads remote modules at runtime with shared singletons; it solves organizational team scale.',
    componentKey: 'MicrofrontendsDemo',
    tags: ['micro-frontends', 'module-federation', 'webpack', 'team-scale', 'remotes']
  },
  {
    id: '7.7',
    level: 7,
    levelTitle: 'Frameworks & Architecture',
    title: '7.7 Design Systems & Storybook',
    summary: 'Design tokens, isolated component testing, and living documentation bridging design and engineering teams.',
    whatIsIt: `A **Design System** serves as the single source of truth for an organization's UI. It comprises:
1. **Design Tokens**: Primitive style values (hex colors, typography scales, border radii, spacing scales, box shadows).
2. **Accessible Component Library**: Reusable, strongly typed UI building blocks adhering to WCAG standards.
3. **Usage Guidelines & Documentation**: Voice, tone, accessibility specs, and implementation patterns.

**Storybook**:
The industry-standard development environment and visual catalog for building, testing, and documenting React components in **complete isolation**, without booting up backend servers, databases, or application routes.`,
    codeSnippet: `// Button.stories.tsx (Storybook CSF 3.0 Story)
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Design System/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'danger'] }
  }
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: 'primary', children: 'Submit' }
};

export const Disabled: Story = {
  args: { disabled: true, children: 'Unavailable' }
};`,
    interviewTips: [
      'Explain Storybook benefits for cross-functional teams: allows designers, QA engineers, and product managers to audit all component permutations (hover, focus, disabled, loading, responsive viewports) without having to reproduce complex states in the production app.',
      'Mention visual regression testing (Chromatic): captures pixel-perfect snapshots of every story across pull requests to detect unintended visual regressions automatically.'
    ],
    commonTraps: [
      'Hardcoding hex colors and arbitrary padding in components rather than consuming CSS variables or Tailwind tokens.',
      'Allowing Storybook stories to drift out of sync with actual component prop interfaces.'
    ],
    keyTakeaway: 'Storybook facilitates developing and testing accessible UI components in isolation driven by consistent design tokens.',
    componentKey: 'DesignSystemStoryDemo',
    tags: ['design-system', 'storybook', 'design-tokens', 'ui-catalog', 'chromatic']
  },
  {
    id: '7.8',
    level: 7,
    levelTitle: 'Frameworks & Architecture',
    title: '7.8 Frontend Authentication: HttpOnly Cookies vs. LocalStorage',
    summary: 'XSS risks with LocalStorage, secure session storage using HttpOnly + SameSite cookies, and token rotation.',
    whatIsIt: `Managing session credentials and JWTs in frontend applications is one of the most rigorously evaluated security topics:

1. **JWT in \`localStorage\` (Vulnerable Practice)**:
- Critical vulnerability: **Any injected script (XSS) can execute \`localStorage.getItem('token')\` and exfiltrate user sessions**.
- Only advantage: Trivial setup for basic client SPAs.
2. **Cookies with \`HttpOnly\`, \`Secure\`, and \`SameSite=Lax/Strict\` (Gold Standard)**:
- **\`HttpOnly\`** flag prevents client JavaScript (including malicious XSS scripts) from accessing the cookie via \`document.cookie\`.
- **\`Secure\`** flag ensures cookies travel only over encrypted HTTPS connections.
- **\`SameSite\`** flag mitigates Cross-Site Request Forgery (CSRF) attacks.
3. **Hybrid Strategy (In-memory Access Token + HttpOnly Refresh Token)**:
- Short-lived Access Token (e.g., 5-15 minutes) kept exclusively in JavaScript memory (React state).
- Long-lived Refresh Token stored in an HttpOnly cookie. When the access token expires, an interceptor silently requests a fresh token.`,
    codeSnippet: `// Conceptual auth fetch interceptor with silent token refresh:
async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  let res = await fetch(url, options);

  // If in-memory token expired (401 Unauthorized):
  if (res.status === 401) {
    // Attempt silent refresh using HttpOnly cookie on server
    const refreshRes = await fetch('/api/auth/refresh', { method: 'POST' });

    if (refreshRes.ok) {
      // Retry original request once
      res = await fetch(url, options);
    } else {
      // Session fully expired -> redirect to login
      window.location.href = '/login';
    }
  }

  return res;
}`,
    interviewTips: [
      'Key interview security tenet: "Frontend security is cosmetic for UX; actual authorization is always enforced on the backend". Hiding a delete button for non-admins improves UI clarity, but the backend API must reject unauthorized requests regardless of frontend state.',
      'Explain OAuth 2.0 with PKCE (Proof Key for Code Exchange): the required standard authorization flow for public Single Page Applications that cannot securely store client secrets.'
    ],
    commonTraps: [
      'Storing sensitive payment tokens, credentials, or PII in `localStorage` or `sessionStorage`.',
      'Relying solely on Next.js middleware for route protection: Server Actions and Route Handlers must also independently verify user sessions and permissions.'
    ],
    keyTakeaway: 'Use HttpOnly SameSite cookies to protect tokens against XSS, complemented by strict server-side authorization.',
    componentKey: 'AuthSecurityFlowDemo',
    tags: ['authentication', 'httponly-cookies', 'localstorage', 'jwt', 'xss-mitigation', 'oauth-pkce']
  },
  {
    id: '7.9',
    level: 7,
    levelTitle: 'Frameworks & Architecture',
    title: '7.9 Frontend Security: XSS, `dangerouslySetInnerHTML`, & Sanitization',
    summary: 'How React escapes strings by default, dangers of raw HTML injection, and mandatory sanitization with DOMPurify.',
    whatIsIt: `By default, React protects against **Cross-Site Scripting (XSS)** by automatically escaping values rendered inside JSX curly braces (\`<div>{userInput}</div>\`). A string like \`<script>alert(1)</script>\` renders harmlessly as plain text.

**Where do vulnerability vectors arise in React?**:
1. **\`dangerouslySetInnerHTML={{ __html: rawHtml }}\`**:
Designed for rendering CMS-authored rich text. If the HTML includes unvetted user input, attackers can inject arbitrary script execution.
**Mandatory mitigation**: Always sanitize markup using **\`DOMPurify\`** (\`DOMPurify.sanitize(rawHtml)\`).
2. **Malicious Protocol URLs**:
\`<a href={userUrl}>Link</a>\`. If a user supplies \`javascript:alert(document.cookie)\`, clicking the link executes the script. Validate that URLs begin strictly with \`https://\` or \`http://\`.
3. **Dynamic Evaluators**:
Using \`eval()\` or \`new Function()\` with dynamic strings.`,
    codeSnippet: `// import DOMPurify from 'dompurify'; // Industry-standard sanitizer

function SafeArticleContent({ userHtml }: { userHtml: string }) {
  // ❌ DANGEROUS: Opens XSS vulnerability if HTML contains malicious tags
  // <div dangerouslySetInnerHTML={{ __html: userHtml }} />

  // ✅ SAFE: DOMPurify strips <script> tags, onerror handlers, and dangerous attributes
  // const cleanHtml = DOMPurify.sanitize(userHtml);

  // Validate external URLs:
  const isSafeUrl = (url: string) => /^https?:\\/\\//i.test(url);

  return (
    <div>
      <div className="prose">
        {/* Render sanitized markup safely */}
        <p>Always sanitize untrusted HTML with DOMPurify before injecting it.</p>
      </div>
    </div>
  );
}`,
    interviewTips: [
      'Explain Content Security Policy (CSP): an HTTP response header (`Content-Security-Policy: default-src "self"; ...`) that restricts which domains can execute scripts, styles, and fonts, providing a robust defense-in-depth layer against XSS.',
      'Explain the deliberate naming `dangerously`: the React team purposefully prefixed `dangerouslySetInnerHTML` to alert developers that injecting raw markup bypasses React’s built-in escaping safeguards.'
    ],
    commonTraps: [
      'Attempting to sanitize HTML with custom regular expressions (`replace(/<script>/, "")`): attackers bypass regex filters using obfuscated vectors (`<img src=x onerror=alert(1)>`, `<svg onload=...>`). Always use battle-tested libraries like DOMPurify.',
      'Allowing links with `javascript:` protocol in dynamic `<a>` tags.'
    ],
    keyTakeaway: 'React escapes content by default; when using `dangerouslySetInnerHTML`, sanitize rigorously with DOMPurify.',
    componentKey: 'XssSanitizationDemo',
    tags: ['security', 'xss', 'dangerouslySetInnerHTML', 'dompurify', 'csp', 'sanitization']
  }
];
