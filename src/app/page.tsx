'use client'

import { useState } from 'react'

/* ─── DATA ────────────────────────────────────────────────── */

interface JourneyStop {
  id: number
  name: string
  location: string
  altitude: string
  date: string
  description: string
  icon: string
  x: number
  y: number
  phase: 'ida' | 'descubrimiento' | 'regreso' | 'retorno'
}

const journeyStops: JourneyStop[] = [
  {
    id: 1,
    name: 'Tinogasta',
    location: 'Provincia de Catamarca',
    altitude: '1.500 m',
    date: '13 de abril',
    description:
      'El equipo del Proyecto Pissis llega a Tinogasta. Compran provisiones y agua. Manuel visita la casa de Teresa pero no la encuentra. Prefiere quedarse en la hostería con el grupo.',
    icon: '🏠',
    x: 22,
    y: 38,
    phase: 'ida',
  },
  {
    id: 2,
    name: 'Campamento Base',
    location: 'Volcán Pissis',
    altitude: '4.600 m',
    date: '15 de abril',
    description:
      'A las 6:00 parten en tres camionetas 4x4 rumbo al Pissis. Pasan las lagunas Del Aparejo, la Azul y la Verde con flamencos rosados. Llegan al Campamento Base a las 16:00. Arman cuatro carpas. Se quedan dos días para aclimatarse. Los baqueanos dejan ofrendas de alcohol, tabaco y coca en la apacheta.',
    icon: '⛺',
    x: 28,
    y: 26,
    phase: 'ida',
  },
  {
    id: 3,
    name: 'Campamento de Altura 1',
    location: 'Volcán Pissis',
    altitude: '5.850 m',
    date: '18 de abril',
    description:
      'La expedición parte hacia el C1. La subida es dura, la falta de oxígeno se nota. Llegan a las 15:30 bastante agotados. Temperatura: -15°C. Arman las carpas, cenan sopas instantáneas y se van a dormir.',
    icon: '🏔️',
    x: 34,
    y: 18,
    phase: 'ida',
  },
  {
    id: 4,
    name: 'Campamento de Altura 2',
    location: 'Volcán Pissis',
    altitude: '6.350 m',
    date: '19 de abril',
    description:
      'El cuarto día es todavía más duro. Arman el C2 a 6.350 m. La consigna es hidratarse y descansar. A medianoche, Lucía presenta síntomas de mal de altura: dolor de cabeza y náuseas. Hay que bajarla de inmediato. Manuel la acompaña en el descenso nocturno con linternas, a -30°C.',
    icon: '⛰️',
    x: 40,
    y: 12,
    phase: 'ida',
  },
  {
    id: 5,
    name: 'La Cumbre — Descubrimiento',
    location: 'Volcán Pissis',
    altitude: '6.800 m',
    date: '20 de abril',
    description:
      'El equipo llega a la cumbre antes del mediodía. Vera marca cuatro cuadrículas. Al mediodía, Gabriel agita los brazos: ¡ha encontrado una estatuilla de spondylus rojo! En su cuadrícula se adivina el círculo de piedras del enterratorio. A las 15:00 liberan el fardo funerario. Gabriel levanta el fardo envuelto en un manto rojo. Todos lloran de emoción. Lo envuelven en gomaespuma y Chañás lo carga al C2.',
    icon: '🔴',
    x: 46,
    y: 6,
    phase: 'descubrimiento',
  },
  {
    id: 6,
    name: 'Descenso con la Momia',
    location: 'Pissis → C1',
    altitude: '5.850 m',
    date: '21 de abril',
    description:
      'Vera y Chañás bajan con la momia. Vera se siente liviana al llegar al C1, donde la espera Manuel. Lo abraza emocionada: "¡La encontramos, Acevedo!" Avisan a Gendarmería para que los espere en el Campamento Base con una camioneta y hielo seco.',
    icon: '📦',
    x: 40,
    y: 14,
    phase: 'descubrimiento',
  },
  {
    id: 7,
    name: 'Tinogasta → Salta (MAAM)',
    location: 'Museo de Arqueología de Alta Montaña',
    altitude: '1.200 m',
    date: '22-25 de abril',
    description:
      'El fardo viaja en vehículo con caja frigorífica desde Tinogasta hasta el MAAM en Salta. En los laboratorios del subsuelo, con la tecnología más moderna, beginsu estudio. Manuel siente que su corazón se ha partido en pedazos al ver el fardo en la montaña helada.',
    icon: '🏛️',
    x: 52,
    y: 32,
    phase: 'descubrimiento',
  },
  {
    id: 8,
    name: 'Salta → Maryland, EE.UU.',
    location: 'Universidad de Maryland',
    altitude: '50 m',
    date: 'Octubre 2008',
    description:
      'La momia viaja a la Universidad de Maryland para estudios avanzados. Científicos de Japón, Suecia y Alemania participan. Descubren que el sapo de oro del estómago contiene un diminuto quipu con tres nudos: un mensaje secreto a los dioses. El profesor González investiga incansablemente el significado del sapo como símbolo de la Pachamama.',
    icon: '🔬',
    x: 62,
    y: 48,
    phase: 'regreso',
  },
  {
    id: 9,
    name: 'Nueva York — Museo Metropolitano',
    location: 'The Met, Manhattan',
    altitude: '10 m',
    date: 'Noviembre 2008',
    description:
      'La Doncella es exhibida en el Museo Metropolitano de Nueva York, a pesar de los acuerdos con las comunidades. Vera descubre las verdaderas intenciones del gobernador: exposiciones en París, Berlín y Japón. Se siente traicionada. Comienza a escribirle a Manuel, pidiéndole disculpas.',
    icon: '🗽',
    x: 70,
    y: 40,
    phase: 'regreso',
  },
  {
    id: 10,
    name: 'Ezeiza — El Rescate',
    location: 'Aeropuerto de Ezeiza, Buenos Aires',
    altitude: '25 m',
    date: '2 de noviembre de 2008',
    description:
      'Sergio retira el container de la aduana usando los papeles que Vera envió por mail. Teresa lo espera en el estacionamiento con una camioneta cerrada. El hermanastro de Vera desvía la investigación. El container refrigerado (1.56 x 1.23 m) parte rumbo a Tinogasta, esquivando los puestos de la Policia Caminera.',
    icon: '🚐',
    x: 64,
    y: 62,
    phase: 'retorno',
  },
  {
    id: 11,
    name: 'Tinogasta — Preparación',
    location: 'Casa de Teresa, Tinogasta',
    altitude: '1.500 m',
    date: '10 de diciembre de 2008',
    description:
      'La Doncella pasa una semana en un freezer en casa de Teresa, sin sus joyas ni mantos, solo su túnica de alpaca. Manuel subió solo al Pissis el 28 de octubre para cavar el sitio funerario. La madrugada del 10 de diciembre, Manuel y Teresa cargan a la Doncella en una camioneta con hielo seco y parten de noche hacia Laguna Verde.',
    icon: '❄️',
    x: 22,
    y: 44,
    phase: 'retorno',
  },
  {
    id: 12,
    name: 'El Retorno a la Montaña',
    location: 'Cumbre del Volcán Pissis',
    altitude: '6.800 m',
    date: 'Diciembre 2008',
    description:
      'Manuel y Teresa escalan solos con el fardo de 35 kg. Hacen en un día lo que se hacía en dos. En el C2, una tormenta de nieve los despierta a medianoche. Teresa quiere llorar. Manuel la abraza: "Te quiero, Teresa." Al día siguiente llegan a la cumbre. Teresa le pone su manta de lana de alpaca con franjas magentas, verdes y naranjas. Vera envió un collar de ámbar. Manuel la baja a la misma tumba. Siente que los pedazos de su corazón se unen. El círculo se cierra.',
    icon: '❤️',
    x: 46,
    y: 6,
    phase: 'retorno',
  },
]

interface Artifact {
  id: number
  name: string
  description: string
  category: string
  material: string
  significance: string
  icon: string
}

const artifacts: Artifact[] = [
  {
    id: 1,
    name: 'Manto rojo de vicuña',
    description:
      'Manto externo del fardo funerario, de fina lana de vicuña de color rojo intenso. Era la capa más visible que protegía el cuerpo de la Doncella.',
    category: 'Textil',
    material: 'Lana de vicuña',
    significance:
      'Los tejidos incas registraban información. Ni el animal, ni la lana, ni la trama eran aleatorios: todo era un mensaje a los dioses.',
    icon: '🧣',
  },
  {
    id: 2,
    name: 'Manto de plumas amarillas',
    description:
      'Segundo manto, bordado con plumas amarillas probablemente de papagayo o guacamayo. Un trabajo de un año entero o más, cosido por Sarac (la Doncella) en el Acllahuasi.',
    category: 'Textil',
    material: 'Plumas de guacamayo sobre tela',
    significance:
      'Las plumas venían de la selva profunda. Los guacamayos eran alimentados con calabazas para intensificar los colores de sus plumas.',
    icon: '🪶',
  },
  {
    id: 3,
    name: 'Manto de alpaca con diseños',
    description:
      'El manto más fino, cubriendo directamente la momia, con diseños que señalaban su alto rango social. En sus pliegues se encontró una laminilla de oro enrollada.',
    category: 'Textil',
    material: 'Lana de alpaca',
    significance:
      'Los colores y diseños eran parte del mensaje a los dioses. La elección de alpaca indica la más fina y abrigada de las lanas.',
    icon: '🎨',
  },
  {
    id: 4,
    name: 'Manos teñidas de rojo',
    description:
      'Las manos de la Doncella estaban completamente teñidas de rojo, con las puntas de los dedos apoyadas sobre la frente, como cubriéndose la cara, aunque dejaba espacio entre las manos y el rostro.',
    category: 'Cuerpo',
    material: 'Tinte de achiote y cochinilla',
    significance:
      'El rojo proviene del achiote y la cochinilla. En el estómago se encontraron restos de achiote, el mismo vegetal usado para la tintura. El rojo simboliza la sangre y la vida.',
    icon: '🖐️',
  },
  {
    id: 5,
    name: 'Tocado de plumas azules',
    description:
      'Un impresionante tocado en forma de casco, con brillantes plumas azules. Fue cosido por Urpi, la mejor amiga de Sarac en el Acllahuasi.',
    category: 'Vestimenta',
    material: 'Plumas de guacamayo azul',
    significance:
      'El azul de estas plumas no era ni el del mar ni el del cielo: tenía reflejos únicos. Urpi lo bordó especialmente para la ceremonia de la Doncella.',
    icon: '👑',
  },
  {
    id: 6,
    name: 'Tupus de plata',
    description:
      'Dos prendedores o alfileres de plata que ajustaban el vestido de la Doncella a la altura del pecho.',
    category: 'Joyería',
    material: 'Plata',
    significance:
      'Los tupus eran símbolo de status y eran usados por las mujeres de alto rango para sujetar sus vestidos y mantos.',
    icon: '📌',
  },
  {
    id: 7,
    name: 'Pulseras de oro',
    description:
      'Dos anchas pulseras de oro en los antebrazos de la Doncella, indicando su alta posición social.',
    category: 'Joyería',
    material: 'Oro',
    significance:
      'El oro representaba al dios Sol (Inti). Las pulseras en los antebrazos señalaban que la Doncella era una Aclla del Sol, elegida para el sacrificio.',
    icon: '💍',
  },
  {
    id: 8,
    name: 'Collar de ámbar',
    description:
      'Un cordón con una piedra de ámbar del tamaño de una almendra en el cuello. Le fue puesto por su madre al nacer para que nada malo le sucediera.',
    category: 'Joyería',
    material: 'Ámbar',
    significance:
      'El ámbar era una protección. Su madre se lo colocó cuando nació. Cuando la devuelven a la montaña, Vera le pone un collar similar de plata y ámbar.',
    icon: '📿',
  },
  {
    id: 9,
    name: 'Sapo de oro (ajuar)',
    description:
      'Figura de oro finamente tallada del tamaño de un puño. Era hueca y en su interior contenía un diminuto quipu: un hilo de lana con tres nudos.',
    category: 'Orfebrería',
    material: 'Oro',
    significance:
      'El sapo representa a la Pachamama, la madre tierra. Símbolo de fertilidad y vida. Hiberna durante largo tiempo y despierta en la época propicia. El quipu interior lleva un mensaje secreto a los dioses.',
    icon: '🐸',
  },
  {
    id: 10,
    name: 'Sapo de oro miniatura (estómago)',
    description:
      'Una réplica exacta en miniatura del sapo del ajuar, encontrada en el fondo del estómago de la Doncella. También era hueca y contenía un quipu idéntico con tres nudos.',
    category: 'Orfebrería',
    material: 'Oro',
    significance:
      'La Doncella debió tragarlo la última noche antes del sacrificio. Era el guía para su viaje al otro mundo: se dormiría en este mundo para despertar en el mundo divino.',
    icon: '🐸',
  },
  {
    id: 11,
    name: 'Estatuilla de spondylus rojo',
    description:
      'Estatuilla de concha de spondylus de color rojo intenso, casi encandilante. Gabriel la encontró primero, lo que llevó al descubrimiento del enterratorio.',
    category: 'Ofrenda',
    material: 'Concha de spondylus',
    significance:
      'El spondylus rojo estaba presente en todos los enterratorios incas. Era considerado más valioso que el oro. Provenía de las profundidades del mar.',
    icon: '🐚',
  },
  {
    id: 12,
    name: '20 estatuillas antropomorfas',
    description:
      'Veinte figuras humanas de plata, oro y spondylus, ricamente vestidas con textiles y plumas, que acompañaban al fardo funerario.',
    category: 'Ofrenda',
    material: 'Plata, oro, spondylus',
    significance:
      'Representaban a los acompañantes de la Doncella en su viaje al otro mundo. Cada material tenía un significado: el oro al Sol, la plata a la Luna, el spondylus al mar.',
    icon: '🗿',
  },
  {
    id: 13,
    name: '30 figuras de llamas y vicuñas',
    description:
      'Treinta figuras de camélidos de diferentes tamaños, que formaban parte del ajuar funerario.',
    category: 'Ofrenda',
    material: 'Metal y otros',
    significance:
      'Las llamas y vicuñas eran esenciales para la vida andina: transporte, lana, alimento. Estas figuras las acompañarían en el más allá.',
    icon: '🦙',
  },
  {
    id: 14,
    name: 'Faja de colores con cordones',
    description:
      'Una faja de colores en la cadera, de la que se desprendían dos largos cordones de fibras vegetales terminados en borlas: una de lana y otra de cabello humano.',
    category: 'Vestimenta',
    material: 'Fibras vegetales, lana, cabello humano',
    significance:
      'Los cordones servían generalmente para atar animales. Las estatuillas de animales del ajuar también tenían cordelitos similares.',
    icon: '🪢',
  },
  {
    id: 15,
    name: 'Mocasines de cuero',
    description:
      'Mocasines de cuero terminados en un fino bordado en lana, calzados en los pies de la Doncella.',
    category: 'Vestimenta',
    material: 'Cuero y lana',
    significance:
      'Dos pares de sandalias adicionales fueron encontrados para cambiarse a lo largo de su prolongado viaje al otro mundo.',
    icon: '👢',
  },
  {
    id: 16,
    name: 'Laminilla de oro enrollada',
    description:
      'Una fina lámina de oro enrollada, encontrada entre los pliegues del manto de alpaca. Se cree que era una ofrenda para introducirse en el más allá.',
    category: 'Ofrenda',
    material: 'Oro',
    significance:
      'Las ofrendas de oro eran mensajes a los dioses. Esta lámina acompañaría a la Doncella en su tránsito al mundo divino.',
    icon: '✨',
  },
  {
    id: 17,
    name: 'Chuspas y vasijas',
    description:
      'Bolsitas ceremoniales (chuspas) para guardar hojas de coca. Vasijas con semillas, porotos cocidos y otros materiales orgánicos.',
    category: 'Ceremonial',
    material: 'Textil y cerámica',
    significance:
      'La coca era sagrada y se consumía en ceremonias. Las semillas —de calabaza, maíz y porotos— estaban destinadas a germinar en el otro mundo. 500 años después, fueron sembradas y brotaron.',
    icon: '🏺',
  },
  {
    id: 18,
    name: 'Dos uncus blancos',
    description:
      'Dos túnicas blancas (uncus), prolijamente dobladas como parte del ajuar. Eran prendas de vestir para el más allá.',
    category: 'Textil',
    material: 'Lana de alpaca blanca',
    significance:
      'El blanco representaba la pureza y lo sagrado. Dos túnicas para el largo viaje: una para este mundo y otra para el mundo divino.',
    icon: '👘',
  },
  {
    id: 19,
    name: 'Cabello trenzado',
    description:
      'La Doncella tenía el cabello completamente trenzado, un rasgo que contribuyó a su extraordinario estado de conservación.',
    category: 'Cuerpo',
    material: 'Cabello humano',
    significance:
      'Las trenzas eran parte de la preparación ceremonial. El Sacerdote del Sol trenzó su cabello durante la última noche antes del sacrificio.',
    icon: '💇',
  },
  {
    id: 20,
    name: '5 piezas textiles ceremoniales',
    description:
      'Cinco piezas textiles adicionales, presumiblemente regalos para los dioses, que acompañaban el ajuar funerario.',
    category: 'Textil',
    material: 'Diversas lanas',
    significance:
      'Cada pieza textil era un regalo precioso para los dioses. En los ritos de sacrificio, los tejidos se transformaban en un elemento esencial.',
    icon: '🧵',
  },
]

const categories = ['Todos', 'Textil', 'Joyería', 'Orfebrería', 'Ofrenda', 'Vestimenta', 'Ceremonial', 'Cuerpo']

/* ─── COMPONENTS ──────────────────────────────────────────── */

function MapTab() {
  const [selectedStop, setSelectedStop] = useState<JourneyStop | null>(null)
  const [activePhase, setActivePhase] = useState<string>('all')

  const phases = [
    { key: 'all', label: 'Todo el recorrido', color: '#92400e' },
    { key: 'ida', label: 'La subida', color: '#b45309' },
    { key: 'descubrimiento', label: 'El descubrimiento', color: '#dc2626' },
    { key: 'regreso', label: 'El viaje al exterior', color: '#7c3aed' },
    { key: 'retorno', label: 'El retorno a la montaña', color: '#059669' },
  ]

  const filteredStops =
    activePhase === 'all' ? journeyStops : journeyStops.filter((s) => s.phase === activePhase)

  const phaseColors: Record<string, string> = {
    ida: '#b45309',
    descubrimiento: '#dc2626',
    regreso: '#7c3aed',
    retorno: '#059669',
  }

  return (
    <div className="space-y-6">
      {/* Phase filters */}
      <div className="flex flex-wrap gap-2 justify-center">
        {phases.map((p) => (
          <button
            key={p.key}
            onClick={() => {
              setActivePhase(p.key)
              setSelectedStop(null)
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activePhase === p.key
                ? 'text-white shadow-lg scale-105'
                : 'bg-white/80 text-stone-600 hover:bg-white border border-stone-200'
            }`}
            style={activePhase === p.key ? { backgroundColor: p.color } : undefined}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* SVG Map */}
      <div className="relative bg-gradient-to-b from-sky-100 via-amber-50 to-green-100 rounded-2xl overflow-hidden shadow-inner border border-stone-200">
        <svg viewBox="0 0 100 70" className="w-full" style={{ minHeight: '400px' }}>
          {/* Background mountains */}
          <defs>
            <linearGradient id="mountainGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#64748b" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="pissisGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="30%" stopColor="#92400e" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
          </defs>

          {/* Mountain silhouettes */}
          <path d="M0,55 L10,35 L18,45 L28,20 L38,40 L48,5 L58,38 L68,25 L78,42 L88,30 L100,50 L100,70 L0,70Z" fill="url(#mountainGrad)" />
          
          {/* Pissis volcano peak */}
          <path d="M40,5 L46,0 L52,5 L50,12 L42,12Z" fill="url(#pissisGrad)" opacity="0.6" />
          <text x="46" y="-1" textAnchor="middle" fontSize="2.5" fill="#92400e" fontWeight="bold">Pissis 6.795m</text>

          {/* Route lines connecting stops */}
          {filteredStops.length > 1 &&
            filteredStops.slice(0, -1).map((stop, i) => {
              const next = filteredStops[i + 1]
              return (
                <line
                  key={`line-${stop.id}-${next.id}`}
                  x1={stop.x}
                  y1={stop.y}
                  x2={next.x}
                  y2={next.y}
                  stroke={phaseColors[stop.phase] || '#92400e'}
                  strokeWidth="0.5"
                  strokeDasharray="2,1"
                  opacity="0.6"
                />
              )
            })}

          {/* Stop markers */}
          {filteredStops.map((stop) => (
            <g
              key={stop.id}
              onClick={() => setSelectedStop(stop)}
              className="cursor-pointer"
            >
              {/* Glow effect */}
              <circle
                cx={stop.x}
                cy={stop.y}
                r={selectedStop?.id === stop.id ? '4' : '2.5'}
                fill={phaseColors[stop.phase] || '#92400e'}
                opacity={selectedStop?.id === stop.id ? '0.3' : '0.15'}
              />
              {/* Main dot */}
              <circle
                cx={stop.x}
                cy={stop.y}
                r={selectedStop?.id === stop.id ? '2.5' : '1.8'}
                fill={phaseColors[stop.phase] || '#92400e'}
                stroke="white"
                strokeWidth="0.4"
              />
              {/* Label */}
              <text
                x={stop.x}
                y={stop.y - 3}
                textAnchor="middle"
                fontSize="2.2"
                fill="#44403c"
                fontWeight={selectedStop?.id === stop.id ? 'bold' : 'normal'}
              >
                {stop.icon} {stop.name}
              </text>
            </g>
          ))}

          {/* Legend */}
          <g transform="translate(2, 58)">
            {phases.slice(1).map((p, i) => (
              <g key={p.key} transform={`translate(${i * 22}, 0)`}>
                <rect x="0" y="0" width="2" height="2" rx="0.5" fill={p.color} />
                <text x="3" y="1.5" fontSize="2" fill="#57534e">{p.label}</text>
              </g>
            ))}
          </g>
        </svg>
      </div>

      {/* Selected stop detail */}
      {selectedStop && (
        <div
          className="rounded-2xl p-6 shadow-lg border-2 transition-all animate-in fade-in slide-in-from-bottom-4"
          style={{ borderColor: phaseColors[selectedStop.phase] || '#92400e' }}
        >
          <div className="flex items-start gap-4">
            <span className="text-4xl">{selectedStop.icon}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-stone-800">{selectedStop.name}</h3>
                <span
                  className="text-xs px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: phaseColors[selectedStop.phase] }}
                >
                  {selectedStop.phase === 'ida' && 'Subida'}
                  {selectedStop.phase === 'descubrimiento' && 'Descubrimiento'}
                  {selectedStop.phase === 'regreso' && 'Viaje al exterior'}
                  {selectedStop.phase === 'retorno' && 'Retorno'}
                </span>
              </div>
              <p className="text-sm text-stone-500 mb-3">
                {selectedStop.location} &middot; {selectedStop.altitude} &middot; {selectedStop.date}
              </p>
              <p className="text-stone-700 leading-relaxed">{selectedStop.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-stone-700 text-center">Línea de tiempo del recorrido</h3>
        <div className="max-h-96 overflow-y-auto pr-2 space-y-2">
          {filteredStops.map((stop) => (
            <button
              key={stop.id}
              onClick={() => setSelectedStop(stop)}
              className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 ${
                selectedStop?.id === stop.id
                  ? 'bg-white shadow-md border-2 scale-[1.02]'
                  : 'bg-white/60 hover:bg-white/90 border border-stone-100'
              }`}
              style={
                selectedStop?.id === stop.id
                  ? { borderColor: phaseColors[stop.phase] }
                  : undefined
              }
            >
              <span className="text-2xl">{stop.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-800 text-sm">{stop.name}</span>
                  <span className="text-xs text-stone-400">{stop.altitude}</span>
                </div>
                <p className="text-xs text-stone-500 truncate">{stop.date}</p>
              </div>
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: phaseColors[stop.phase] }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function MuseumTab() {
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null)
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [searchTerm, setSearchTerm] = useState('')

  const filtered = artifacts.filter((a) => {
    const matchCat = activeCategory === 'Todos' || a.category === activeCategory
    const matchSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="space-y-6">
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Buscar pieza..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl border border-stone-200 bg-white/80 text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-amber-700 text-white shadow'
                  : 'bg-white/80 text-stone-600 hover:bg-white border border-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-stone-500 text-center">
        {filtered.length} piezas encontradas &middot; El ajuar completo constaba de 80 piezas
      </p>

      {/* Artifacts grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((artifact) => (
          <button
            key={artifact.id}
            onClick={() => setSelectedArtifact(artifact)}
            className={`text-left p-4 rounded-2xl bg-white/80 border transition-all hover:shadow-md hover:scale-[1.02] ${
              selectedArtifact?.id === artifact.id
                ? 'border-amber-600 shadow-lg'
                : 'border-stone-200'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{artifact.icon}</span>
              <div>
                <h4 className="font-semibold text-stone-800 text-sm">{artifact.name}</h4>
                <p className="text-xs text-amber-700">{artifact.category} &middot; {artifact.material}</p>
              </div>
            </div>
            <p className="text-xs text-stone-500 line-clamp-2">{artifact.description}</p>
            {/* Placeholder for image */}
            <div className="mt-3 h-24 bg-gradient-to-br from-amber-50 to-stone-100 rounded-xl flex items-center justify-center border border-dashed border-amber-200">
              <span className="text-xs text-amber-400">Imagen: {artifact.name}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Selected artifact detail */}
      {selectedArtifact && (
        <div className="rounded-2xl p-6 bg-white shadow-lg border-2 border-amber-600 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-start gap-4">
            <span className="text-5xl">{selectedArtifact.icon}</span>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-stone-800">{selectedArtifact.name}</h3>
              <p className="text-sm text-amber-700 mb-3">
                {selectedArtifact.category} &middot; Material: {selectedArtifact.material}
              </p>
              <p className="text-stone-700 leading-relaxed mb-4">{selectedArtifact.description}</p>
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                <h4 className="font-semibold text-amber-800 text-sm mb-1">Significado cultural</h4>
                <p className="text-sm text-amber-900 leading-relaxed">{selectedArtifact.significance}</p>
              </div>
            </div>
          </div>
          {/* Larger placeholder for image */}
          <div className="mt-4 h-40 bg-gradient-to-br from-amber-50 to-stone-100 rounded-xl flex items-center justify-center border-2 border-dashed border-amber-300">
            <div className="text-center">
              <span className="text-3xl">{selectedArtifact.icon}</span>
              <p className="text-sm text-amber-500 mt-1">Espacio para agregar imagen</p>
              <p className="text-xs text-amber-400">{selectedArtifact.name}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function DecisionTab() {
  const [choice, setChoice] = useState<'museo' | 'montaña' | null>(null)
  const [fragments, setFragments] = useState<number[]>([])
  const [showResult, setShowResult] = useState(false)

  const heartFragments = [
    { id: 1, text: 'La ciencia puede leer su mensaje y descifrar su historia', side: 'museo' as const },
    { id: 2, text: 'La montaña es su hogar sagrado, el Apu la espera', side: 'montaña' as const },
    { id: 3, text: 'Las comunidades originarias dicen: "Nuestra niña no está muerta, duerme"', side: 'montaña' as const },
    { id: 4, text: 'Los estudios científicos revelan secretos de hace 500 años', side: 'museo' as const },
    { id: 5, text: 'El equilibrio con la naturaleza se rompe al sacarla de la montaña', side: 'montaña' as const },
    { id: 6, text: 'El MAMCA puede mostrar su cultura al mundo entero', side: 'museo' as const },
    { id: 7, text: 'El sapo hiberna y despierta cuando el tiempo es propicio', side: 'montaña' as const },
    { id: 8, text: 'Las semillas de su ajuar brotaron después de 500 años gracias a la ciencia', side: 'museo' as const },
  ]

  const museumAdvantages = [
    'Preservación garantizada con tecnología de punta',
    'Estudios científicos que revelan información invaluable sobre la cultura inca',
    'Educación: millones de personas pueden conocer y valorar esta cultura',
    'Protección contra el huaqueo y el mercado negro',
    'Las semillas del ajuar pudieron germinar tras 500 años de hibernación',
    'Se descubre el secreto del sapo de oro y el quipu en su interior',
  ]

  const museumDisadvantages = [
    'Riesgo de explotación comercial y política',
    'El gobernador traicionó los acuerdos con las comunidades',
    'Se planeaban exposiciones en el extranjero sin consentimiento',
    'Se rompe el equilibrio sagrado entre la montaña y la Doncella',
    'La momia se convierte en objeto de circo turístico',
    'Intereses económicos por encima del respeto cultural',
  ]

  const mountainAdvantages = [
    'Se restaura el equilibrio sagrado con la naturaleza y el Apu',
    'Se respeta la cosmovisión andina: ella duerme, no está muerta',
    'Las comunidades originarias recuperan a "su niña"',
    'La Doncella vuelve a ser la mensajera de los dioses',
    'El sapo puede seguir hibernando hasta que el tiempo sea propicio',
    'Se cumple la ley 25.517 de restitución de restos mortales',
  ]

  const mountainDisadvantages = [
    'Riesgo de que huaqueros encuentren y roben la momia',
    'Se pierde la oportunidad de estudios científicos',
    'Sin difusión, la cultura corre riesgo de ser olvidada',
    'Las condiciones en la montaña pueden deteriorar el cuerpo',
    'Es difícil garantizar la seguridad a 6.800 metros',
    'La ciencia pierde acceso a un hallazgo único en el mundo',
  ]

  const toggleFragment = (id: number) => {
    setFragments((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))
  }

  const handleFinalChoice = () => {
    if (choice) {
      setShowResult(true)
    }
  }

  const totalFragments = heartFragments.length
  const selectedFragments = fragments.length

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold text-stone-800">¿Qué hacer con la Doncella Roja?</h2>
        <p className="text-stone-600 max-w-2xl mx-auto leading-relaxed">
          Manuel está dividido. Su corazón se ha partido en pedazos. De un lado, Vera y la ciencia;
          del otro, Teresa y las comunidades originarias. De un lado, la preservación a través del
          conocimiento; del otro, el respeto por lo sagrado. Antes de decidir, elegí los fragmentos
          del corazón de Manuel que resuenan con tu elección.
        </p>
      </div>

      {/* Heart fragments */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-stone-700 text-center">
          Fragmentos del corazón de Manuel
        </h3>
        <p className="text-sm text-stone-500 text-center">
          Elegí los fragmentos que te convencen ({selectedFragments}/{totalFragments} elegidos)
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {heartFragments.map((frag) => (
            <button
              key={frag.id}
              onClick={() => toggleFragment(frag.id)}
              className={`p-4 rounded-xl text-left transition-all flex items-start gap-3 ${
                fragments.includes(frag.id)
                  ? frag.side === 'museo'
                    ? 'bg-violet-100 border-2 border-violet-400 shadow-md'
                    : 'bg-emerald-100 border-2 border-emerald-400 shadow-md'
                  : 'bg-white/80 border border-stone-200 hover:bg-white'
              }`}
            >
              <span className="text-lg">{frag.side === 'museo' ? '🔬' : '⛰️'}</span>
              <span className="text-sm text-stone-700">{frag.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Two columns: Museum vs Mountain */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Museum side */}
        <button
          onClick={() => setChoice('museo')}
          className={`text-left p-6 rounded-2xl transition-all ${
            choice === 'museo'
              ? 'bg-violet-50 border-2 border-violet-500 shadow-xl scale-[1.02]'
              : 'bg-white/80 border border-stone-200 hover:shadow-md'
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center text-2xl">
              🏛️
            </div>
            <div>
              <h3 className="text-lg font-bold text-violet-800">Exhibir en el Museo</h3>
              <p className="text-xs text-violet-600">La postura de Vera y la ciencia</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-semibold text-green-700 mb-1 flex items-center gap-1">
                ✅ Ventajas
              </h4>
              <ul className="space-y-1">
                {museumAdvantages.map((adv, i) => (
                  <li key={i} className="text-xs text-stone-600 flex items-start gap-1.5">
                    <span className="text-green-500 mt-0.5">•</span>
                    {adv}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-red-700 mb-1 flex items-center gap-1">
                ❌ Desventajas
              </h4>
              <ul className="space-y-1">
                {museumDisadvantages.map((dis, i) => (
                  <li key={i} className="text-xs text-stone-600 flex items-start gap-1.5">
                    <span className="text-red-400 mt-0.5">•</span>
                    {dis}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4 p-3 bg-violet-100/50 rounded-xl">
            <p className="text-xs italic text-violet-800">
              &ldquo;No es posible entender lo que no se conoce. Menos aún se puede cuidar ni amar
              lo que no se conoce. Exhibir a la Doncella, si se lo hacía con respeto, era mostrar
              todo su mundo, sus creencias, sus valores.&rdquo; — Vera Larsen
            </p>
          </div>
        </button>

        {/* Mountain side */}
        <button
          onClick={() => setChoice('montaña')}
          className={`text-left p-6 rounded-2xl transition-all ${
            choice === 'montaña'
              ? 'bg-emerald-50 border-2 border-emerald-500 shadow-xl scale-[1.02]'
              : 'bg-white/80 border border-stone-200 hover:shadow-md'
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-2xl">
              ⛰️
            </div>
            <div>
              <h3 className="text-lg font-bold text-emerald-800">Devolver a la Montaña</h3>
              <p className="text-xs text-emerald-600">La postura de Teresa y las comunidades</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-semibold text-green-700 mb-1 flex items-center gap-1">
                ✅ Ventajas
              </h4>
              <ul className="space-y-1">
                {mountainAdvantages.map((adv, i) => (
                  <li key={i} className="text-xs text-stone-600 flex items-start gap-1.5">
                    <span className="text-green-500 mt-0.5">•</span>
                    {adv}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-red-700 mb-1 flex items-center gap-1">
                ❌ Desventajas
              </h4>
              <ul className="space-y-1">
                {mountainDisadvantages.map((dis, i) => (
                  <li key={i} className="text-xs text-stone-600 flex items-start gap-1.5">
                    <span className="text-red-400 mt-0.5">•</span>
                    {dis}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4 p-3 bg-emerald-100/50 rounded-xl">
            <p className="text-xs italic text-emerald-800">
              &ldquo;Para los andinos la montaña es Dios. La montaña, el sol, el rayo, la luna no
              representan a los dioses, SON los dioses. Al arrancar a la Doncella de la montaña,
              están rompiendo un equilibrio sagrado.&rdquo; — Sergio Vargas, La Voz de los Andes
            </p>
          </div>
        </button>
      </div>

      {/* Confirm button */}
      {choice && !showResult && (
        <div className="text-center animate-in fade-in">
          <button
            onClick={handleFinalChoice}
            className={`px-8 py-3 rounded-xl text-white font-bold text-lg shadow-lg transition-all hover:scale-105 ${
              choice === 'museo' ? 'bg-violet-600 hover:bg-violet-700' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            Confirmar mi elección: {choice === 'museo' ? '🏛️ Exhibir en el Museo' : '⛰️ Devolver a la Montaña'}
          </button>
        </div>
      )}

      {/* Result */}
      {showResult && (
        <div
          className={`rounded-2xl p-8 text-center animate-in fade-in slide-in-from-bottom-4 ${
            choice === 'museo' ? 'bg-violet-50 border-2 border-violet-300' : 'bg-emerald-50 border-2 border-emerald-300'
          }`}
        >
          {/* Heart animation */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <svg width="120" height="120" viewBox="0 0 120 120">
                {/* Heart shape */}
                <path
                  d="M60,100 C60,100 15,65 15,40 C15,20 30,10 45,15 C52,18 57,25 60,30 C63,25 68,18 75,15 C90,10 105,20 105,40 C105,65 60,100 60,100Z"
                  fill={choice === 'museo' ? '#8b5cf6' : '#059669'}
                  opacity="0.2"
                />
                {/* Fragments that are "united" */}
                {fragments.length > 0 && (
                  <path
                    d="M60,100 C60,100 15,65 15,40 C15,20 30,10 45,15 C52,18 57,25 60,30 C63,25 68,18 75,15 C90,10 105,20 105,40 C105,65 60,100 60,100Z"
                    fill={choice === 'museo' ? '#8b5cf6' : '#059669'}
                    opacity={Math.max(0.3, fragments.length / totalFragments)}
                  />
                )}
                {/* Quipu knot symbol */}
                <circle cx="60" cy="45" r="4" fill="none" stroke={choice === 'museo' ? '#7c3aed' : '#047857'} strokeWidth="2" />
                <circle cx="50" cy="55" r="3" fill="none" stroke={choice === 'museo' ? '#7c3aed' : '#047857'} strokeWidth="2" />
                <circle cx="70" cy="55" r="3" fill="none" stroke={choice === 'museo' ? '#7c3aed' : '#047857'} strokeWidth="2" />
                <line x1="60" y1="49" x2="50" y2="52" stroke={choice === 'museo' ? '#7c3aed' : '#047857'} strokeWidth="1.5" />
                <line x1="60" y1="49" x2="70" y2="52" stroke={choice === 'museo' ? '#7c3aed' : '#047857'} strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          {choice === 'museo' ? (
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-violet-800">
                Elegiste la ciencia y la preservación
              </h3>
              <p className="text-violet-700 max-w-lg mx-auto">
                Como Vera, creés que el conocimiento es la forma de proteger y valorar la cultura.
                La Doncella puede ser estudiada, su mensaje puede ser leído, y millones de personas
                pueden aprender sobre el mundo inca a través de ella.
              </p>
              <div className="bg-white/60 rounded-xl p-4 mt-4">
                <p className="text-sm italic text-stone-700">
                  &ldquo;Sembrar muertos para cosechar vivos&rdquo; — Sentencia inca que Vera cita.
                  La Doncella cosechará más vida para su cultura a través del conocimiento.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-emerald-800">
                Elegiste lo sagrado y el respeto
              </h3>
              <p className="text-emerald-700 max-w-lg mx-auto">
                Como Teresa y las comunidades originarias, creés que la Doncella debe volver a su
                hogar sagrado. Ella no es un objeto: es una mensajera que duerme un sueño sagrado
                en lo alto del Apu, garantizando el equilibrio del mundo.
              </p>
              <div className="bg-white/60 rounded-xl p-4 mt-4">
                <p className="text-sm italic text-stone-700">
                  &ldquo;No sirve de nada un corazón descuartizado. Sirve un corazón sano y entero.&rdquo;
                  — Abuela Lucero. Los pedazos del corazón de Manuel se unen cuando la Doncella
                  vuelve a la montaña.
                </p>
              </div>
            </div>
          )}

          <div className="mt-6">
            <p className="text-sm text-stone-500">
              Fragmentos elegidos: {selectedFragments}/{totalFragments} — Corazón{' '}
              {selectedFragments >= totalFragments * 0.7
                ? 'casi completo'
                : selectedFragments >= totalFragments * 0.4
                ? 'a medio camino'
                : 'fragmentado'}
            </p>
          </div>

          <button
            onClick={() => {
              setChoice(null)
              setShowResult(false)
              setFragments([])
            }}
            className="mt-4 px-6 py-2 rounded-xl bg-stone-200 text-stone-700 text-sm hover:bg-stone-300 transition-colors"
          >
            Volver a elegir
          </button>
        </div>
      )}

      {/* Key quotes section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-violet-50 rounded-xl border border-violet-200">
          <p className="text-xs text-violet-400 mb-1 font-semibold">Vera Larsen — Antropóloga</p>
          <p className="text-sm italic text-violet-800">
            &ldquo;No estaba a favor de la exhibición de las momias como si fueran objetos. Pero
            exhibir a la Doncella, si se lo hacía con respeto, era mostrar todo su mundo, sus
            creencias, sus valores. Era una forma de defender esa cultura.&rdquo;
          </p>
        </div>
        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
          <p className="text-xs text-emerald-400 mb-1 font-semibold">Teresa — Comunidad originaria</p>
          <p className="text-sm italic text-emerald-800">
            &ldquo;Para nosotros, nuestra niña no está muerta; duerme allá, en lo más alto, un
            sueño sagrado. Al arrancarla de la montaña, la están matando. El sueño de la niña
            aseguraba un equilibrio con la naturaleza.&rdquo;
          </p>
        </div>
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
          <p className="text-xs text-amber-400 mb-1 font-semibold">Abuela Lucero — Chamana</p>
          <p className="text-sm italic text-amber-800">
            &ldquo;No sirve de nada un corazón descuartizado. Sirve un corazón sano y entero. Ya
            sabrá qué hacer. Y cuando la Pacha reúna sus pedazos, lo sabrá en su corazón,
            propiamente.&rdquo;
          </p>
        </div>
        <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
          <p className="text-xs text-stone-400 mb-1 font-semibold">Manuel — El corazón dividido</p>
          <p className="text-sm italic text-stone-700">
            &ldquo;Se sentía partido por la mitad. Dividido entre Vera y Teresa. Entre su gente y
            la ciencia. Como un montón de pedazos sostenidos por la tela de araña de la voz de su
            abuela.&rdquo;
          </p>
        </div>
      </div>

      {/* Key facts from the book */}
      <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200">
        <h4 className="font-semibold text-stone-700 mb-3">Datos clave de la historia</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="text-xs text-stone-600 flex items-start gap-2">
            <span className="text-amber-500">📜</span>
            <span>La Doncella tenía ~15 años y murió entre 1520-1530</span>
          </div>
          <div className="text-xs text-stone-600 flex items-start gap-2">
            <span className="text-amber-500">📜</span>
            <span>Murió sin violencia: fue adormecida con chicha y coca</span>
          </div>
          <div className="text-xs text-stone-600 flex items-start gap-2">
            <span className="text-amber-500">📜</span>
            <span>El sapo de oro en su estómago contenía un quipu con 3 nudos</span>
          </div>
          <div className="text-xs text-stone-600 flex items-start gap-2">
            <span className="text-amber-500">📜</span>
            <span>El quipu era idéntico al de la abuela Lucero de Manuel</span>
          </div>
          <div className="text-xs text-stone-600 flex items-start gap-2">
            <span className="text-amber-500">📜</span>
            <span>Las semillas de su ajuar brotaron tras 500 años</span>
          </div>
          <div className="text-xs text-stone-600 flex items-start gap-2">
            <span className="text-amber-500">📜</span>
            <span>En la novela, Manuel y Teresa la devuelven a la montaña</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── MAIN PAGE ───────────────────────────────────────────── */

const tabs = [
  { id: 'mapa', label: 'Mapa del Recorrido', icon: '🗺️' },
  { id: 'museo', label: 'Museo de Piezas', icon: '🏛️' },
  { id: 'decision', label: '¿Qué hacer?', icon: '❤️' },
]

export default function Home() {
  const [activeTab, setActiveTab] = useState('mapa')

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-stone-50 to-emerald-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-900 via-red-900 to-amber-900 text-white py-6 px-4 shadow-lg">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">La Doncella Roja</h1>
          <p className="text-amber-200 text-sm md:text-base">
            Sandra Siemens — Una novela sobre el encuentro entre la ciencia y lo sagrado
          </p>
        </div>
      </header>

      {/* Tab navigation */}
      <nav className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm shadow-sm border-b border-stone-200">
        <div className="max-w-5xl mx-auto flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-2 text-sm font-medium transition-all flex items-center justify-center gap-2 border-b-2 ${
                activeTab === tab.id
                  ? 'border-amber-700 text-amber-800 bg-amber-50/50'
                  : 'border-transparent text-stone-500 hover:text-stone-700 hover:bg-stone-50'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-5xl mx-auto p-4 md:p-6">
        {activeTab === 'mapa' && <MapTab />}
        {activeTab === 'museo' && <MuseumTab />}
        {activeTab === 'decision' && <DecisionTab />}
      </main>

      {/* Footer */}
      <footer className="bg-stone-100 border-t border-stone-200 py-4 px-4 mt-8">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs text-stone-400">
            Basado en la novela &ldquo;La Doncella Roja&rdquo; de Sandra Siemens — Actividad educativa
          </p>
        </div>
      </footer>
    </div>
  )
}
