export interface SystemDesignCase {
  id: string;
  title: string;
  targetRole: 'Senior' | 'Staff / Principal';
  domain: 'Performance & Virtualization' | 'E-Commerce & SSR' | 'Real-Time & Collaboration' | 'Security & Architecture';
  summary: string;
  interviewProblem: string;
  functionalReqs: string[];
  nonFunctionalReqs: string[];
  architectureDiagramMermaid: string;
  keyComponents: {
    name: string;
    description: string;
    responsibilities: string[];
  }[];
  dataFlowSteps: {
    stepNumber: number;
    title: string;
    detail: string;
  }[];
  deepDives: {
    topic: string;
    analysis: string;
    seniorTradeoff: string;
  }[];
  interviewTrapsAndQuestions: {
    trapQuestion: string;
    howToAnswer: string;
  }[];
}

export const SYSTEM_DESIGN_CASES: SystemDesignCase[] = [
  {
    id: 'infinite-feed',
    title: 'High-Performance Infinite Feed (X / Instagram Architecture)',
    targetRole: 'Senior',
    domain: 'Performance & Virtualization',
    summary:
      'Architecture for a multimedia feed supporting 60 FPS infinite scrolling, dynamic-height element windowing, DOM node recycling, and offline playback.',
    interviewProblem:
      'Design the frontend architecture for an infinite feed like Twitter/Instagram where users can scroll past thousands of posts containing text, images, and videos without the browser running out of memory or dropping frames.',
    functionalReqs: [
      'Fluid rendering across thousands of posts with continuous scroll.',
      'Support for dynamic heights (single-line status updates up to long-form media posts).',
      'Auto-play videos only when intersecting the active viewport (IntersectionObserver).',
      'Background polling/push for new posts ("View new posts" badge).',
      'Offline reading support caching the last 50 viewed posts.'
    ],
    nonFunctionalReqs: [
      'Maintain 60 FPS without jank on mid-tier mobile hardware.',
      'Bounded DOM node pool (fewer than 40 heavy DOM elements mounted at any moment).',
      'Zero layout shifts ("Scroll Jumping") during asynchronous image decodes.',
      'Initial Time to Interactive (TTI) under 1.2 seconds.'
    ],
    architectureDiagramMermaid: `flowchart TD
    UI["Viewport UI (Visible Window)"]
    Virtualizer["Virtualizer Engine (Windowing O(log N))"]
    DomNodes["DOM Pool (~30-40 Recycled Nodes)"]
    Cache["IndexedDB Local Cache (Offline & Resume)"]
    Network["Network API Layer (Cursor Pagination)"]

    UI --> Virtualizer
    Virtualizer --> DomNodes
    Virtualizer --> Cache
    Network --> Cache
    Virtualizer -->|IntersectionObserver| Network`,
    keyComponents: [
      {
        name: 'Virtualizer Engine (DOM Windowing)',
        description: 'Computes in real time which items belong in the viewport plus overscan buffers.',
        responsibilities: [
          'Calculates visible item range: startIndex = floor(scrollTop / itemHeight) and endIndex.',
          'Applies translate3d(0, offset, 0) or top/bottom padding to preserve native scrollbar momentum.',
          'Recycles DOM wrappers by unmounting elements exiting the active overscan boundary.'
        ]
      },
      {
        name: 'Dynamic Height Cache (ResizeObserver)',
        description: 'Accurately measures rendered post dimensions and recomputes cumulative scroll offsets.',
        responsibilities: [
          'Maintains an indexed cache of measured heights: Map<postId, measuredHeight>.',
          'Recalculates offset sums via a Fenwick Tree (Binary Indexed Tree) for O(log N) offset queries.',
          'Prevents scroll jumping by adjusting scrollTop if items above the viewport mutate in height.'
        ]
      },
      {
        name: 'Prefetching & Media Pool',
        description: 'Orchestrates image decoding budgets and video player instances.',
        responsibilities: [
          'Leverages IntersectionObserver with a 300px rootMargin for asset prefetching.',
          'Guarantees at most 1 HTML5 <video> hardware decoder is playing concurrently; off-screen instances render poster thumbnails.'
        ]
      }
    ],
    dataFlowSteps: [
      {
        stepNumber: 1,
        title: 'Initial Cursor Pagination Request',
        detail:
          'Client queries /api/feed?cursor=initial&limit=20. Response yields post objects and nextCursor, immediately stored in IndexedDB.'
      },
      {
        stepNumber: 2,
        title: 'Scroll Threshold Detection',
        detail:
          'A transparent sentinel element at the bottom of the virtualized window fires an IntersectionObserver trigger when 5 items remain before boundary.'
      },
      {
        stepNumber: 3,
        title: 'Dynamic Measurement & DOM Recycling',
        detail:
          'As new posts mount, ResizeObserver records their exact heights. Items exceeding 1000px outside the viewport are safely recycled from the DOM.'
      }
    ],
    deepDives: [
      {
        topic: 'Cursor Pagination vs Offset/Page in Real-Time Feeds',
        analysis:
          'Traditional ?page=2 offset pagination breaks down in live feeds: if 5 new posts are published while reading, page 2 returns duplicate posts already seen on page 1.',
        seniorTradeoff:
          'Always adopt opaque cursor pagination (?cursor=created_at_id). Guarantees an immutable deterministic window independent of top-of-feed insertions.'
      },
      {
        topic: 'Preventing Scroll Jumping on Async Media',
        analysis:
          'When an image without dimensions finishes downloading, it expands from 0px to 400px height, jolting the entire feed downwards and ruining reader position.',
        seniorTradeoff:
          'The backend MUST supply pre-computed aspect-ratios (e.g., { width: 1080, height: 1350, ratio: 1.25 }). The frontend allocates CSS aspect-ratio placeholders before image bytes arrive.'
      }
    ],
    interviewTrapsAndQuestions: [
      {
        trapQuestion: 'Why not simply append to the DOM with infinite scroll without virtualization?',
        howToAnswer:
          'After scrolling through 200 posts, the DOM accumulates over 10,000 nodes with gigabytes of decoded image bitmaps in memory. This triggers heavy Garbage Collection pauses and mobile Out of Memory crashes.'
      },
      {
        trapQuestion: 'How do you preserve scroll position when a user navigates to a post detail and returns?',
        howToAnswer:
          'Snapshot scrollTop, the anchor postId, and the measured height map in sessionStorage or router history state (history.state) prior to navigating.'
      }
    ]
  },
  {
    id: 'global-ecommerce',
    title: 'Ultra-Performance Global E-Commerce (Shopify Architecture)',
    targetRole: 'Staff / Principal',
    domain: 'E-Commerce & SSR',
    summary:
      'Hybrid rendering architecture for millions of SKUs with React Server Components (RSC), aggressive Core Web Vitals optimization, and resilient offline cart.',
    interviewProblem:
      'Design the frontend architecture of a global e-commerce marketplace with 50 million products, where every 100ms LCP delay costs 1% in conversion rate, and cart operations must persist offline.',
    functionalReqs: [
      'Product Detail Pages (PDP) fully indexable by search engines with pristine SEO.',
      'Real-time localized inventory and currency pricing.',
      'Accessible shopping cart operable even with intermittent internet loss.',
      'Instant predictive search autocompletion under 50ms.'
    ],
    nonFunctionalReqs: [
      'Largest Contentful Paint (LCP) < 1.0s across 75th percentile of global traffic.',
      'Cumulative Layout Shift (CLS) = 0.00.',
      'Interaction to Next Paint (INP) < 100ms during variant and filter toggles.',
      'Zero currency/pricing flicker on regional switching.'
    ],
    architectureDiagramMermaid: `flowchart TD
    Edge["Edge CDN (Cloudflare / Vercel Edge)"]
    RSC["React Server Components (Zero-JS Payload)"]
    Islands["Client Islands (Add-to-Cart, Carousel, CartDrawer)"]
    IndexedDBCart["Client IndexedDB Cart (Offline Resilient)"]
    BackShop["Commerce API (Inventory & Pricing Engine)"]

    Edge -->|SSR Streaming HTML| RSC
    RSC -->|Hydrates Only| Islands
    Islands -->|Sync via Service Worker| IndexedDBCart
    IndexedDBCart -->|Background Sync| BackShop`,
    keyComponents: [
      {
        name: 'Hybrid Rendering Matrix (RSC + ISR + Edge)',
        description: 'Multi-tiered rendering strategy mapped to data volatility.',
        responsibilities: [
          'Static product information (title, description, specifications): Rendered with React Server Components (0 KB client JS sent).',
          'Hero images & assets: Served via Edge CDN using AVIF/WebP formats tailored to incoming User-Agent headers.',
          'Stock & Price: Streamed via Suspense chunks so dynamic database queries never delay initial HTML Time to First Byte (TTFB).'
        ]
      },
      {
        name: 'Islands Architecture (Surgical Client Boundaries)',
        description: 'Strict isolation of interactive components to minimal leaf nodes.',
        responsibilities: [
          'Only the "Add to Cart" button, variant picker, and drawer are marked "use client".',
          'Constrains total client hydrated bundle size to under 45 KB gzipped.'
        ]
      },
      {
        name: 'Offline-First Cart Engine',
        description: 'Client shopping cart state manager with optimistic persistence and conflict reconciliation.',
        responsibilities: [
          'Writes cart changes to IndexedDB immediately for 0ms perceived response times.',
          'Synchronizes with backend via Background Sync API or exponential retry queues.'
        ]
      }
    ],
    dataFlowSteps: [
      {
        stepNumber: 1,
        title: 'Edge HTML Streaming',
        detail:
          'Edge CDN streams initial RSC HTML shell in under 80ms. Title, images, and description arrive rendered without client hydration required.'
      },
      {
        stepNumber: 2,
        title: 'Streaming Dynamic Price & Stock',
        detail:
          'Dynamic price blocks arrive in subsequent stream chunks as resolved Suspense fallbacks without blocking LCP.'
      },
      {
        stepNumber: 3,
        title: 'Optimistic Cart Interaction',
        detail:
          'Clicking "Add to Cart" opens the drawer instantly (0ms perceived latency), persists to IndexedDB, and sends mutations asynchronously.'
      }
    ],
    deepDives: [
      {
        topic: 'Optimizing LCP & INP on Product Detail Pages',
        analysis:
          '90% of e-commerce LCP degradations stem from late-discovered hero images (inside hydrated client components) and third-party marketing tags blocking the main thread.',
        seniorTradeoff:
          'Inject server <link rel="preload" as="image" href="..." fetchpriority="high"> tags in the document head and execute marketing analytics off-thread via Web Workers using Partytown.'
      },
      {
        topic: 'Reconciling Offline Stock Collisions',
        analysis:
          'A user reserves the last remaining unit while on the subway offline. Upon reconnecting 20 minutes later, another customer already checked out the item.',
        seniorTradeoff:
          'Adopt an expiring reservation model: backend rejects the expired claim, triggering a graceful reconciliation dialog: "We apologize, inventory changed while you were disconnected".'
      }
    ],
    interviewTrapsAndQuestions: [
      {
        trapQuestion: 'Why not store the entire product page in Redux or Zustand?',
        howToAnswer:
          'In modern RSC architectures, product details are read-only server data. Pouring server data into client stores forces hydration of the entire DOM tree, bloating bundles unnecessarily.'
      },
      {
        trapQuestion: 'How do you prevent Hydration Mismatches when prices differ by country?',
        howToAnswer:
          'Resolve geolocation headers in Edge Middleware (e.g. x-vercel-ip-country) prior to server rendering so pre-rendered server HTML exactly matches client expectations.'
      }
    ]
  },
  {
    id: 'collaborative-editor',
    title: 'Real-Time Collaborative Rich Text Editor (Notion / Figma Architecture)',
    targetRole: 'Staff / Principal',
    domain: 'Real-Time & Collaboration',
    summary:
      'Multi-user real-time synchronization over WebSockets, lossless conflict resolution via CRDTs (Yjs), and scoped distributed Undo/Redo stacks.',
    interviewProblem:
      'Design the frontend architecture for a real-time collaborative document editor where 20 people can type concurrently in the same document, track live cursor selections, and withstand temporary network cuts.',
    functionalReqs: [
      'Synchronous collaborative text editing without overwriting co-author keystrokes.',
      'Live presence: real-time cursor coordinates, text selections, and user avatars.',
      'Selective Undo/Redo reversing only local user operations without reverting co-author edits.',
      'Offline editing support with deterministic convergence upon network reconnection.'
    ],
    nonFunctionalReqs: [
      'Visual delta propagation latency < 50ms across connected peers.',
      'Zero data loss during simultaneous typing collisions.',
      'Strong Eventual Consistency: all clients converge to identical document states.',
      'Compact bandwidth profile (stream compact binary delta patches, never entire documents).'
    ],
    architectureDiagramMermaid: `flowchart TD
    Editor["Editor DOM (ProseMirror / Slate / Lexical)"]
    CRDT["CRDT Engine (Yjs / Automerge Shared Doc)"]
    UndoManager["Local Undo Manager (Scoped to Local Client ID)"]
    Presence["Presence Module (Ephemeral Cursor Map)"]
    WebSocket["WebSocket / WebRTC Realtime Transport"]
    ServerMesh["Sync Gateway (Room Coordinator)"]

    Editor <-->|Binding| CRDT
    CRDT <--> UndoManager
    Presence <--> WebSocket
    CRDT <--> WebSocket
    WebSocket <--> ServerMesh`,
    keyComponents: [
      {
        name: 'CRDT Conflict Engine (Yjs Shared Types)',
        description: 'Conflict-free replicated data structure guaranteeing mathematical convergence.',
        responsibilities: [
          'Assigns every inserted character an immutable global ID (Client ID + monotonic Clock).',
          'Structures characters in a deterministic linked list, breaking simultaneous insertion ties deterministically by comparing Client IDs.',
          'Enables merging updates in any arrival order without requiring a central coordination arbiter.'
        ]
      },
      {
        name: 'Selective Undo/Redo Manager',
        description: 'Contextually scoped operation undo stack.',
        responsibilities: [
          'Filters document undo history to record only mutations originating from the local Client ID.',
          'Pressing Ctrl+Z inverts local operations without interfering with paragraphs edited concurrently by others.'
        ]
      },
      {
        name: 'Ephemeral Awareness / Presence Protocol',
        description: 'High-frequency transient state synchronization (cursor coordinates, selection ranges).',
        responsibilities: [
          'Bypasses persistent document history; transmitted as lightweight WebSocket/UDP packets debounced to 30ms.',
          'Maintains heartbeat timeouts to clean up stale cursors when peers close browser tabs.'
        ]
      }
    ],
    dataFlowSteps: [
      {
        stepNumber: 1,
        title: 'Instant Local Mutation',
        detail:
          'User types a character. Local editor renders it at 0ms latency and submits an atomic operation to the CRDT engine.'
      },
      {
        stepNumber: 2,
        title: 'Binary Delta Broadcast',
        detail:
          'CRDT engine encodes the insertion into a compact binary buffer (Uint8Array of ~20 bytes) and transmits it over WebSockets.'
      },
      {
        stepNumber: 3,
        title: 'Convergence and Remote Integration',
        detail:
          'Peers receive the binary delta, apply it to their local Yjs document, and editor bindings update the DOM without moving remote cursors.'
      }
    ],
    deepDives: [
      {
        topic: 'CRDTs (Conflict-free Replicated Data Types) vs OT (Operational Transformation)',
        analysis:
          'OT (traditionally used in Google Docs) relies on a centralized server to serialize and transform operations against global document versions. Under prolonged offline conditions, the transformation matrix scales with exponential complexity.',
        seniorTradeoff:
          'Modern CRDTs (like Yjs) achieve consistency decentralized via join-semilattices, supporting seamless offline and peer-to-peer collaboration.'
      },
      {
        topic: 'Reconnection Storms in Collaborative Documents',
        analysis:
          'When a peer returns online after 2 hours of disconnected editing with 500 queued operations, streaming 500 discrete events would saturate peer connections.',
        seniorTradeoff:
          'Yjs compresses pending deltas into a single composite state snapshot (Y.encodeStateAsUpdate). Peers merge the compound update in one atomic pass.'
      }
    ],
    interviewTrapsAndQuestions: [
      {
        trapQuestion: 'Why not transmit full document string payloads on every change over WebSockets?',
        howToAnswer:
          'Streaming full documents causes catastrophic O(N) bandwidth explosion per keystroke and induces severe race conditions where the slowest network packet overwrites other peers (destructive Last-Write-Wins).'
      },
      {
        trapQuestion: 'How do you anchor cursor positions when remote edits change document lengths?',
        howToAnswer:
          'Anchor cursor offsets to persistent CRDT character identifiers (Y.RelativePosition) rather than absolute integer indices that drift when text is inserted above.'
      }
    ]
  },
  {
    id: 'auth-silent-refresh',
    title: 'Secure Authentication & Silent Token Refresh System',
    targetRole: 'Senior',
    domain: 'Security & Architecture',
    summary:
      'Hardened session management in SPA/Next.js with HttpOnly JWT cookies, XSS/CSRF mitigation, and concurrency Mutex queues for silent refresh.',
    interviewProblem:
      'Design a frontend authentication architecture where an app issues 10 parallel API requests just as the Access Token expires. How do you prevent firing 10 redundant refresh calls while ensuring bulletproof security?',
    functionalReqs: [
      'Persistent sessions with short-lived Access Tokens (15 min) and long-lived Refresh Tokens (7 days).',
      'Seamless automated Refresh Token rotation without interrupting user navigation.',
      'Global logout terminating sessions across both client and server.',
      'Route protection across both client-side routers and SSR layers.'
    ],
    nonFunctionalReqs: [
      'Immunity against XSS (Cross-Site Scripting): JavaScript must never have access to Refresh Tokens.',
      'Immunity against CSRF (Cross-Site Request Forgery) via SameSite cookies and anti-forgery headers.',
      'Zero 401 Unauthorized errors surfaced to end-users during token renewal.'
    ],
    architectureDiagramMermaid: `flowchart TD
    Client["Client (React / Next.js)"]
    Interceptor["HTTP Interceptor with Mutex Queue"]
    AuthCookie["HttpOnly Secure Cookie (Refresh Token)"]
    MemoryState["In-Memory State (Access Token)"]
    APIServer["Backend Resource Server"]
    AuthServer["Auth Server (/api/auth/refresh)"]

    Client --> Interceptor
    Interceptor -->|Reads Access Token| MemoryState
    Interceptor -->|API Request| APIServer
    APIServer -->|401 Token Expired| Interceptor
    Interceptor -->|Enqueues Pending Requests| Interceptor
    Interceptor -->|Silent Refresh via Cookie| AuthServer
    AuthServer -->|New Access Token| MemoryState
    Interceptor -->|Retries Queued Requests| APIServer`,
    keyComponents: [
      {
        name: 'Layered Token Storage Architecture',
        description: 'Segregated storage policies based on credential sensitivity.',
        responsibilities: [
          'Access Token (15 min): Stored exclusively in JS memory (module closure or React Context). Malicious XSS payloads cannot harvest persistent session credentials.',
          'Refresh Token (7 days): Stored exclusively in an HttpOnly, Secure, SameSite=Lax/Strict cookie inaccessible to client scripts.'
        ]
      },
      {
        name: 'Concurrent Request Mutex Queue',
        description: 'Mutual exclusion coordinator managing in-flight network requests during refresh.',
        responsibilities: [
          'Tracks an isRefreshing boolean flag and an array of pending promise callbacks: Array<(token: string) => void>.',
          'The first 401 response initiates the refresh call; the remaining 9 requests enqueue callbacks without pinging the auth server.',
          'Upon receiving the fresh token, flushes the queue, retrying all queued calls with the new Authorization header.'
        ]
      }
    ],
    dataFlowSteps: [
      {
        stepNumber: 1,
        title: '401 Interceptor Detection',
        detail:
          'An API request receives a 401 Unauthorized status. The Axios/Fetch HTTP interceptor captures the rejection before returning it to the UI.'
      },
      {
        stepNumber: 2,
        title: 'Mutex Lock & Callback Enqueueing',
        detail:
          'If isRefreshing === true, the request returns new Promise((resolve) => queue.push(resolve)). No redundant refresh requests are emitted.'
      },
      {
        stepNumber: 3,
        title: 'Resolution and Atomic Replay',
        detail:
          'Silent refresh concludes successfully. Memory state updates with the new Access Token, queue.forEach(cb => cb(newToken)) fires, and all original requests retry seamlessly.'
      }
    ],
    deepDives: [
      {
        topic: 'Why You Must NEVER Store Authentication Tokens in localStorage in Production',
        analysis:
          'Any XSS vulnerability (e.g. from a compromised third-party package in node_modules or un-sanitized HTML) can execute localStorage.getItem("token") and exfiltrate credentials instantly.',
        seniorTradeoff:
          'HttpOnly cookies are inaccessible to JavaScript, completely preventing token theft via XSS.'
      },
      {
        topic: 'Refresh Token Rotation and Reuse Detection',
        analysis:
          'If an attacker captures a Refresh Token, the server must issue a new Refresh Token on every rotation and invalidate the prior one. If the server sees an already-invalidated token used again, it indicates credential theft.',
        seniorTradeoff:
          'Auth servers immediately revoke the user\'s entire token family, triggering an automated preventative logout across all devices.'
      }
    ],
    interviewTrapsAndQuestions: [
      {
        trapQuestion: 'What happens if the refresh token also expires while the tab is active?',
        howToAnswer:
          'The /api/auth/refresh endpoint returns 401. The interceptor catches this terminal failure, clears in-memory state, and redirects the user to /login preserving the return URL (?redirect=/dashboard).'
      },
      {
        trapQuestion: 'How is this managed in Next.js App Router with Server Components?',
        howToAnswer:
          'Server Components read the HttpOnly cookie using cookies() from next/headers and attach it to server-side fetches. If expired, Middleware or Server Actions handle renewal writing Set-Cookie response headers.'
      }
    ]
  }
];
