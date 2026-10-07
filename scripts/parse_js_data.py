import re
import json
import os

DOC_PATH = '/home/manrique20/proyectos/personal/javascript-entrevista.md'
DATA_DIR = '/home/manrique20/proyectos/personal/react-entrevista-lab/src/data/javascript'
TOPICS_DIR = os.path.join(DATA_DIR, 'topics')

os.makedirs(TOPICS_DIR, exist_ok=True)

with open(DOC_PATH, 'r', encoding='utf-8') as f:
    full_text = f.read()

# -------------------------------------------------------------
# 1. PARSE TOPICS / QUESTIONS (P1 - P81)
# -------------------------------------------------------------
levels_meta = [
    (1, 'Fundamentos', ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10', 'P11', 'P12', 'P13']),
    (2, 'Funciones', ['P14', 'P15', 'P16', 'P17', 'P18', 'P19', 'P20', 'P21']),
    (3, 'Scope, closures y `this`', ['P22', 'P23', 'P24', 'P25', 'P26', 'P27', 'P28', 'P29']),
    (4, 'Objetos, prototipos, clases y arrays', ['P30', 'P31', 'P32', 'P33', 'P34', 'P35', 'P36', 'P37', 'P38', 'P39', 'P40', 'P41', 'P42', 'P43']),
    (5, 'Asincronía', ['P44', 'P45', 'P46', 'P47', 'P48', 'P49', 'P50', 'P51', 'P52', 'P53', 'P54', 'P55']),
    (6, 'ES6+ y módulos', ['P56', 'P57', 'P58', 'P59', 'P60', 'P61', 'P62']),
    (7, 'DOM y navegador', ['P63', 'P64', 'P65', 'P66', 'P67', 'P68', 'P69', 'P70', 'P71', 'P72', 'P73']),
    (8, 'Avanzado', ['P74', 'P75', 'P76', 'P77', 'P78', 'P79', 'P80', 'P81'])
]

# Split questions
q_regex = re.compile(r'### P(\d+)\.\s*([^\n]+)\n(.*?)(?=\n### P|\n# Acertijos|\n# Nivel |\Z)', re.DOTALL)
q_matches = list(q_regex.finditer(full_text))

topics_by_num = {}

for m in q_matches:
    num = int(m.group(1))
    qid = f"P{num}"
    q_title = m.group(2).strip()
    raw_body = m.group(3).strip()

    # Determine which level it belongs to
    level_num = 1
    level_title = 'Fundamentos'
    for lvl_idx, lvl_name, p_list in levels_meta:
        if qid in p_list:
            level_num = lvl_idx
            level_title = lvl_name
            break

    # Extract code blocks
    code_matches = re.findall(r'```(?:js|javascript)?\n(.*?)\n```', raw_body, re.DOTALL)
    code_snippet = "\n\n".join(code_matches) if code_matches else ""

    # Remove code blocks to parse text
    text_without_code = re.sub(r'```(?:js|javascript)?\n.*?\n```', '', raw_body, flags=re.DOTALL).strip()

    # Extract "Respuesta:"
    resp_match = re.search(r'\*\*Respuesta:\*\*\s*(.*?)(?=\n\*\*|\n\n|\Z)', text_without_code, re.DOTALL)
    short_answer = resp_match.group(1).strip() if resp_match else ""

    # Extract "Explicación:"
    exp_match = re.search(r'\*\*Explicación:\*\*\s*(.*?)(?=\n\*\*(?:Buena práctica|Ojo|Regla|Salida)|$)', text_without_code, re.DOTALL)
    explanation = exp_match.group(1).strip() if exp_match else ""

    # If short_answer is empty, use the first sentence or whole text
    if not short_answer:
        lines = [l.strip() for l in text_without_code.split('\n') if l.strip()]
        short_answer = lines[0] if lines else q_title

    # If explanation is empty, use remaining text
    if not explanation:
        # Get everything after short_answer
        remaining = text_without_code.replace(f"**Respuesta:** {short_answer}", "").strip()
        explanation = remaining if remaining else short_answer

    # Extract Senior Tip / Buena práctica
    tip_match = re.search(r'\*\*(Buena práctica|Ojo|Regla[^:]*):\*\*\s*(.*)', text_without_code, re.DOTALL)
    senior_tip = f"{tip_match.group(1)}: {tip_match.group(2).strip()}" if tip_match else ""

    # Auto generate tags
    tags = ["javascript", f"nivel-{level_num}"]
    for word in ['hoisting', 'closure', 'this', 'prototype', 'promise', 'async', 'event loop', 'debounce', 'array', 'object', 'scope', 'proxy', 'dom', 'weakref', 'coercion', 'strict mode']:
        if word in q_title.lower() or word in text_without_code.lower():
            tags.append(word.replace(" ", "-"))

    interactive_type = 'console'
    if 'event loop' in q_title.lower() or qid in ['P44', 'P45']:
        interactive_type = 'event-loop'
    elif 'coerción' in q_title.lower() or qid in ['P4', 'P6', 'P10']:
        interactive_type = 'coercion'
    elif 'prototipo' in q_title.lower() or qid in ['P30', 'P31']:
        interactive_type = 'prototype'

    topics_by_num[qid] = {
        'id': qid,
        'level': level_num,
        'levelTitle': level_title,
        'question': q_title,
        'shortAnswer': short_answer,
        'explanation': explanation,
        'codeSnippet': code_snippet,
        'seniorTip': senior_tip,
        'tags': list(set(tags)),
        'interactiveDemo': interactive_type
    }

print(f"Parsed {len(topics_by_num)} topics.")

# Write topics by level
for lvl_idx, lvl_name, p_list in levels_meta:
    lvl_topics = [topics_by_num[pid] for pid in p_list if pid in topics_by_num]
    file_content = f"""import {{ JsTopic }} from '@/types/javascript';

export const level{lvl_idx}Topics: JsTopic[] = {json.dumps(lvl_topics, indent=2, ensure_ascii=False)};
"""
    file_path = os.path.join(TOPICS_DIR, f'level{lvl_idx}.ts')
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(file_content)

# Write aggregated topicsData.ts
topics_data_content = f"""import {{ JsTopic }} from '@/types/javascript';
import {{ level1Topics }} from './topics/level1';
import {{ level2Topics }} from './topics/level2';
import {{ level3Topics }} from './topics/level3';
import {{ level4Topics }} from './topics/level4';
import {{ level5Topics }} from './topics/level5';
import {{ level6Topics }} from './topics/level6';
import {{ level7Topics }} from './topics/level7';
import {{ level8Topics }} from './topics/level8';

export const allJsTopics: JsTopic[] = [
  ...level1Topics,
  ...level2Topics,
  ...level3Topics,
  ...level4Topics,
  ...level5Topics,
  ...level6Topics,
  ...level7Topics,
  ...level8Topics
];

export const jsTopicsByLevel: Record<number, JsTopic[]> = {{
  1: level1Topics,
  2: level2Topics,
  3: level3Topics,
  4: level4Topics,
  5: level5Topics,
  6: level6Topics,
  7: level7Topics,
  8: level8Topics
}};

export function getJsTopicById(id: string): JsTopic | undefined {{
  return allJsTopics.find(t => t.id === id);
}}
"""
with open(os.path.join(DATA_DIR, 'topicsData.ts'), 'w', encoding='utf-8') as f:
    f.write(topics_data_content)

print("Generated topics files successfully.")

# -------------------------------------------------------------
# 2. PARSE RIDDLES (A1 - A12)
# -------------------------------------------------------------
riddles_data = []
r_regex = re.compile(r'### A(\d+)\.\s*([^\n]+)\n(.*?)(?=\n### A|\n# Ejercicios|\Z)', re.DOTALL)
for m in r_regex.finditer(full_text):
    num = m.group(1)
    rid = f"A{num}"
    title = m.group(2).strip()
    body = m.group(3).strip()

    code_match = re.search(r'```(?:js|javascript)?\n(.*?)\n```', body, re.DOTALL)
    code = code_match.group(1).strip() if code_match else ""

    text_after = body[code_match.end():].strip() if code_match else body

    # Extract Salida
    out_m = re.search(r'\*\*Salida:\*\*\s*(.*?)(?=\n\*\*Por qué:\*\*|\n\n|\Z)', text_after, re.DOTALL)
    expected_out = out_m.group(1).strip() if out_m else ""

    # Extract Por qué
    why_m = re.search(r'\*\*Por qué:\*\*\s*(.*)', text_after, re.DOTALL)
    explanation = why_m.group(1).strip() if why_m else ""

    if not expected_out:
        expected_out = text_after.split('\n')[0] if text_after else "Comprobar ejecución"
    if not explanation:
        explanation = text_after

    # Trap explanation
    trap_explanation = "Atención con el orden de ejecución, coerción de tipos o binding implícito de 'this'."
    if "hoisting" in title.lower() or "hoisting" in text_after.lower():
        trap_explanation = "Trampa clásica de Hoisting y Temporal Dead Zone (TDZ). Las variables con let/const no pueden accederse antes de inicializarse."
    elif "coerción" in title.lower() or "coerciones" in text_after.lower():
        trap_explanation = "Reglas de coerción de ECMAScript: '+' convierte a string si uno es string, pero '-' o '+' unario fuerzan conversión numérica."
    elif "this" in title.lower() or "this" in text_after.lower():
        trap_explanation = "Pérdida de contexto 'this': al pasar una función como callback o invocarla sin objeto a la izquierda, this se pierde (undefined o window)."
    elif "promesas" in title.lower() or "timers" in text_after.lower():
        trap_explanation = "Microtareas (Promise.then, async/await) se vacían SIEMPRE antes de la siguiente macrotarea (setTimeout/setInterval)."
    elif "parseint" in title.lower():
        trap_explanation = "Array.prototype.map pasa 3 argumentos: (elemento, índice, array). parseInt recibe (string, radix) usando el índice como base numérica."

    options = [
        expected_out.replace('`', ''),
        "undefined",
        "Error en tiempo de ejecución (TypeError / ReferenceError)",
        "[object Object]"
    ]

    riddles_data.append({
        'id': rid,
        'title': title,
        'codeSnippet': code,
        'expectedOutput': expected_out.replace('`', ''),
        'explanation': explanation,
        'trapExplanation': trap_explanation,
        'options': list(dict.fromkeys(options))[:4]
    })

riddles_content = f"""import {{ JsRiddle }} from '@/types/javascript';

export const jsRiddlesData: JsRiddle[] = {json.dumps(riddles_data, indent=2, ensure_ascii=False)};
"""
with open(os.path.join(DATA_DIR, 'riddlesData.ts'), 'w', encoding='utf-8') as f:
    f.write(riddles_content)

print(f"Generated {len(riddles_data)} riddles in riddlesData.ts.")

# -------------------------------------------------------------
# 3. PARSE EXERCISES (E1 - E17)
# -------------------------------------------------------------
exercises_data = []
e_regex = re.compile(r'### E(\d+)\.\s*([^\n]+)\n(.*?)(?=\n### E|\n## Checklist|\Z)', re.DOTALL)

test_suites = {
    'E1': """// Test suite para debounce
const llamadas = [];
const fn = debounce((v) => llamadas.push(v), 50);
fn(1); fn(2); fn(3);
setTimeout(() => {
  console.assert(llamadas.length === 1 && llamadas[0] === 3, 'Test Debounce falló');
  console.log('✓ Debounce: ' + JSON.stringify(llamadas));
}, 100);""",
    'E2': """// Test suite para throttle
let conteo = 0;
const throttled = throttle(() => conteo++, 50);
throttled(); throttled(); throttled();
console.assert(conteo === 1, 'Throttle debe llamar 1 vez inmediatamente');
console.log('✓ Throttle inicial ejecutado: ' + conteo);""",
    'E3': """// Test suite para deepClone
const obj = { a: 1, fecha: new Date(), map: new Map([['x', 10]]) };
obj.circular = obj;
const copia = deepClone(obj);
console.assert(copia !== obj, 'Debe ser referencia distinta');
console.assert(copia.circular === copia, 'Debe resolver ciclos');
console.log('✓ deepClone superó ciclos y referencias');""",
    'E4': """// Test suite flatten
const res = flatten([1, [2, [3, [4]], 5]]);
console.assert(JSON.stringify(res) === '[1,2,3,4,5]', 'Flatten falló');
console.log('✓ Flatten resultado: ' + JSON.stringify(res));""",
    'E5': """// Test suite curry
const suma = (a, b, c) => a + b + c;
const curried = curry(suma);
console.assert(curried(1)(2)(3) === 6, 'Curry 1 falló');
console.assert(curried(1, 2)(3) === 6, 'Curry 2 falló');
console.log('✓ Curry ejecutado correctamente: ' + curried(1)(2)(3));""",
    'E6': """// Test suite compose y pipe
const sumar1 = x => x + 1;
const duplicar = x => x * 2;
console.assert(compose(duplicar, sumar1)(3) === 8, 'Compose falló');
console.assert(pipe(sumar1, duplicar)(3) === 8, 'Pipe falló');
console.log('✓ Compose y Pipe verificados');""",
    'E7': """// Test suite memoize
let ops = 0;
const fib = memoize((n) => { ops++; return n <= 1 ? n : fib(n - 1) + fib(n - 2); });
fib(10);
console.log('✓ Memoize calculó fib(10) en ' + ops + ' operaciones');""",
    'E8': """// Test suite once
let runCount = 0;
const init = once(() => runCount++);
init(); init(); init();
console.assert(runCount === 1, 'Once debe correr solo 1 vez');
console.log('✓ Once garantizó llamada única: ' + runCount);""",
    'E9': """// Test suite Polyfills
const obj = { x: 42 };
function ver(y) { return this.x + y; }
console.assert(ver.miCall(obj, 8) === 50, 'miCall falló');
console.assert([1, 2, 3].miMap(x => x * 2).join(',') === '2,4,6', 'miMap falló');
console.log('✓ Polyfills funcionando perfectamente');""",
    'E10': """// Test suite promiseAll
promiseAll([Promise.resolve(1), Promise.resolve(2), 3]).then(vals => {
  console.assert(JSON.stringify(vals) === '[1,2,3]', 'promiseAll falló');
  console.log('✓ Promise.all polyfill resolvió: ' + JSON.stringify(vals));
});""",
    'E11': """// Test suite promise pool
const tareas = [() => Promise.resolve(1), () => Promise.resolve(2), () => Promise.resolve(3)];
promisePool(tareas, 2).then(res => {
  console.assert(res.length === 3, 'Promise pool falló');
  console.log('✓ Promise pool procesó tareas concurrentes: ' + JSON.stringify(res));
});""",
    'E12': """// Test suite retry/sleep
retry(() => Promise.resolve('ok'), 3, 20).then(res => {
  console.assert(res === 'ok', 'Retry falló');
  console.log('✓ Retry exitoso con backoff');
});""",
    'E13': """// Test suite EventEmitter
const ee = new EventEmitter();
let recibido = 0;
ee.on('ping', n => { recibido += n; });
ee.emit('ping', 5);
console.assert(recibido === 5, 'EventEmitter falló');
console.log('✓ EventEmitter gestionó evento: recibido=' + recibido);""",
    'E14': """// Test suite groupBy / chunk
const grp = groupBy(['a', 'bb', 'c', 'dd'], s => s.length);
console.assert(grp[1].length === 2 && grp[2].length === 2, 'GroupBy falló');
console.log('✓ GroupBy verificado: ' + JSON.stringify(grp));""",
    'E15': """// Test suite LRU Cache
const cache = new LRU(2);
cache.set('a', 1); cache.set('b', 2); cache.get('a'); cache.set('c', 3);
console.assert(cache.get('b') === undefined, 'b debió ser expulsado de LRU');
console.log('✓ LRU Cache expulsó la clave menos reciente');""",
    'E16': """// Test suite Algoritmos
console.assert(JSON.stringify(twoSum([2, 7, 11, 15], 9)) === '[0,1]', 'TwoSum falló');
console.assert(balanceado('({[]})') === true, 'Balanceado falló');
console.log('✓ Algoritmos clásicos resueltos con éxito');""",
    'E17': """// Test suite aplanarObjeto
const plano = aplanarObjeto({ a: 1, b: { c: 2, d: { e: 3 } } });
console.assert(plano['b.c'] === 2 && plano['b.d.e'] === 3, 'Aplanar falló');
console.log('✓ aplanarObjeto resultado: ' + JSON.stringify(plano));"""
}

categories = {
    'E1': 'Funcional',
    'E2': 'Funcional',
    'E3': 'Objetos',
    'E4': 'Algoritmos',
    'E5': 'Funcional',
    'E6': 'Funcional',
    'E7': 'Funcional',
    'E8': 'Funcional',
    'E9': 'Polyfills',
    'E10': 'Asincronía',
    'E11': 'Asincronía',
    'E12': 'Asincronía',
    'E13': 'Estructuras de Datos',
    'E14': 'Algoritmos',
    'E15': 'Estructuras de Datos',
    'E16': 'Algoritmos',
    'E17': 'Objetos'
}

for m in e_regex.finditer(full_text):
    num = m.group(1)
    eid = f"E{num}"
    title = m.group(2).strip().replace('`', '')
    body = m.group(3).strip()

    code_match = re.search(r'```(?:js|javascript)?\n(.*?)\n```', body, re.DOTALL)
    code = code_match.group(1).strip() if code_match else ""

    text_desc = re.sub(r'```(?:js|javascript)?\n.*?\n```', '', body, flags=re.DOTALL).strip()
    if not text_desc:
        text_desc = f"Implementación canónica solicitada habitualmente en entrevistas técnicas para evaluar el dominio de {title}."

    test_code = test_suites.get(eid, f"console.log('Test para {title} ejecutado.');")

    hints = [
        f"Presta atención al manejo de argumentos y al contexto 'this'.",
        "Considera casos borde como entradas nulas o estructuras vacías.",
        "Asegúrate de no mutar objetos inesperadamente."
    ]

    exercises_data.append({
        'id': eid,
        'title': title,
        'category': categories.get(eid, 'Funcional'),
        'description': text_desc,
        'solutionCode': code,
        'testCasesCode': test_code,
        'hints': hints
    })

exercises_content = f"""import {{ JsImplementationExercise }} from '@/types/javascript';

export const jsExercisesData: JsImplementationExercise[] = {json.dumps(exercises_data, indent=2, ensure_ascii=False)};
"""
with open(os.path.join(DATA_DIR, 'exercisesData.ts'), 'w', encoding='utf-8') as f:
    f.write(exercises_content)

print(f"Generated {len(exercises_data)} exercises in exercisesData.ts.")
