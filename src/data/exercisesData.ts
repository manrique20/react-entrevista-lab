import { ExerciseItem } from '@/types';

export const EXERCISES: ExerciseItem[] = [
  {
    id: 'ex1',
    title: '1. Contador Avanzado con Historial y Límites',
    description: 'Implementa un contador con incremento, decremento, reset, límites máximo/mínimo configurables e historial paso a paso de cambios.',
    difficulty: 'Básico',
    topicsTested: ['useState', 'Actualizaciones funcionales', 'Inmutabilidad de arrays', 'Props'],
    componentKey: 'CounterExercise',
    hints: [
      'Usa setCount(prev => ...) para evitar valores obsoletos.',
      'Guarda el historial como un array de objetos con timestamp y delta.',
      'Controla los límites antes de actualizar el estado.'
    ]
  },
  {
    id: 'ex2',
    title: '2. To-do List Completo (CRUD + Filtros + Persistencia)',
    description: 'Lista de tareas con creación, marcado de completado, eliminación, edición rápida, filtros (Todas / Pendientes / Completadas) y persistencia en localStorage.',
    difficulty: 'Básico',
    topicsTested: ['useState', 'Listas y prop key', 'useEffect / localStorage', 'Eventos de formulario'],
    componentKey: 'TodoExercise',
    hints: [
      'Genera IDs únicos estables usando crypto.randomUUID().',
      'Nunca uses el índice del array como key de la tarea.',
      'Usa actualización inmutable con .map() para toggle y .filter() para borrar.'
    ]
  },
  {
    id: 'ex3',
    title: '3. Buscador en Tiempo Real con Debounce y Cancelación',
    description: 'Input de búsqueda que retrasa las peticiones a una API simulada mediante un custom hook `useDebounce`, con estados de carga (loading), error, indicador de debounce y cancelación de peticiones desfasadas.',
    difficulty: 'Intermedio',
    topicsTested: ['Custom hooks', 'useDebounce', 'useEffect cleanup', 'Manejo de peticiones asíncronas'],
    componentKey: 'DebounceSearchExercise',
    hints: [
      'Implementa un timeout en el hook useDebounce que se limpie en la función de retorno del useEffect.',
      'Controla condiciones de carrera con una bandera de montaje o AbortController.'
    ]
  },
  {
    id: 'ex4',
    title: '4. Fetch de Datos con Paginación, Loading y Error',
    description: 'Consume datos simulados con estados explícitos de `isLoading`, `error` y `data`, controles de paginación anterior/siguiente y selector de tamaño de página.',
    difficulty: 'Intermedio',
    topicsTested: ['Data Fetching', 'AbortController', 'Manejo de errores', 'Componentes controlados'],
    componentKey: 'PaginatedFetchExercise',
    hints: [
      'Reinicia el estado de carga antes de iniciar la nueva petición.',
      'Utiliza AbortController para cancelar la petición pendiente si el usuario cambia de página antes de terminar.'
    ]
  },
  {
    id: 'ex5',
    title: '5. Infinite Scroll con IntersectionObserver',
    description: 'Listado que detecta automáticamente cuando el usuario llega al final del scroll mediante la API `IntersectionObserver` y carga un lote adicional de elementos sin parpadeos.',
    difficulty: 'Intermedio',
    topicsTested: ['useRef para nodo centinela', 'IntersectionObserver en useEffect', 'Gestión de arrays acumulativos'],
    componentKey: 'InfiniteScrollExercise',
    hints: [
      'Crea un ref centinela <div ref={sentinelRef} /> al final de la lista.',
      'Desconecta el observador en la función de limpieza del useEffect.'
    ]
  },
  {
    id: 'ex6',
    title: '6. Modal Accesible con createPortal y Manejo de Teclado',
    description: 'Modal flotante renderizado directamente en `document.body` mediante `createPortal`, con backdrop desenfocado, cierre con tecla Escape, trap de foco y animación suave.',
    difficulty: 'Intermedio',
    topicsTested: ['createPortal', 'useEffect global listeners', 'Accesibilidad (role="dialog", aria-modal)', 'Event bubbling'],
    componentKey: 'PortalModalExercise',
    hints: [
      'Verifica que el componente esté montado antes de intentar acceder a document.body para evitar errores de SSR.',
      'Usa e.stopPropagation() en el contenedor del diálogo para evitar cerrar al hacer clic dentro.'
    ]
  },
  {
    id: 'ex7',
    title: '7. Sistema de Tabs Accesible (WAI-ARIA)',
    description: 'Componente de pestañas con navegación fluida, atributos semánticos `role="tablist"`, `role="tab"` y `role="tabpanel"`, con soporte para flechas de teclado.',
    difficulty: 'Intermedio',
    topicsTested: ['Compound components', 'Accesibilidad WAI-ARIA', 'Manejo de eventos de teclado'],
    componentKey: 'TabsExercise',
    hints: [
      'Asocia cada tab con su panel mediante aria-controls y aria-labelledby.',
      'Gestiona el tabIndex (0 para la pestaña activa, -1 para las inactivas).'
    ]
  },
  {
    id: 'ex8',
    title: '8. Acordeón Colapsable con Modo Simple y Múltiple',
    description: 'Componente interactivo tipo FAQ/Acordeón con soporte para modo exclusivo (un ítem abierto a la vez) o modo múltiple (múltiples ítems abiertos simultáneamente).',
    difficulty: 'Básico',
    topicsTested: ['Gestión de estado condicional', 'Set / Array de IDs abiertos', 'Animaciones de colapso'],
    componentKey: 'AccordionExercise',
    hints: [
      'Para modo múltiple, representa el estado como un Set<string> o string[].',
      'Usa aria-expanded en los botones de encabezado.'
    ]
  },
  {
    id: 'ex9',
    title: '9. Autocomplete con Selección por Teclado',
    description: 'Input de autocompletado inteligente con lista desplegable, resaltado de texto coincidente y navegación completa por teclado (Flecha Arriba, Flecha Abajo, Enter para seleccionar, Escape para cerrar).',
    difficulty: 'Avanzado',
    topicsTested: ['Gestión de foco', 'Eventos onKeyDown', 'Sincronización de índices activos', 'useRef'],
    componentKey: 'AutocompleteExercise',
    hints: [
      'Mantén un estado activeIndex para el elemento seleccionado con las flechas.',
      'Haz scroll automático del elemento activo si la lista desplegable tiene scroll.'
    ]
  },
  {
    id: 'ex10',
    title: '10. Laboratorio de Custom Hooks Esenciales',
    description: 'Colección interactiva para probar y aprender los 4 hooks más solicitados en entrevistas: `useFetch`, `useLocalStorage`, `usePrevious` y `useDebounce`.',
    difficulty: 'Avanzado',
    topicsTested: ['useLocalStorage', 'usePrevious con useRef', 'useDebounce', 'useFetch con abort'],
    componentKey: 'CustomHooksExercise',
    hints: [
      'usePrevious almacena el valor en ref.current dentro de un useEffect, por lo que durante el render aún tiene el valor anterior.',
      'useLocalStorage debe manejar excepciones JSON.parse y errores de cuota.'
    ]
  },
  {
    id: 'ex11',
    title: '11. Formulario Profesional con Zod y React Hook Form',
    description: 'Formulario de registro robusto con validación de esquema en tiempo real usando Zod y React Hook Form, inputs no controlados de alto rendimiento, estados de submit e informes de errores.',
    difficulty: 'Avanzado',
    topicsTested: ['React Hook Form', 'Validación Zod', 'Inputs no controlados', 'Accesibilidad de errores'],
    componentKey: 'ValidatedFormExercise',
    hints: [
      'Define el schema con z.object({ email: z.string().email(), ... }).',
      'Usa zodResolver(schema) con useForm para vincular la validación fuertemente tipada.'
    ]
  }
];
