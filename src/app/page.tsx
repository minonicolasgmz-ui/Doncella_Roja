'use client'

import { useState, type KeyboardEvent } from 'react'
import dynamic from 'next/dynamic'
import { ArrowDown, ArrowRight, BookOpen, Check, Compass, Heart, MapPin, Mountain, Route, Sparkles } from 'lucide-react'
import ExpeditionArt from './ExpeditionArt'
import MuseumActivity from './MuseumActivity'

/* ═══════════════════════════════════════════════════════════
   DATA — extracted from the OCR text of the novel
   ═══════════════════════════════════════════════════════════ */

interface JourneyStop {
  id: number
  name: string
  lat: number
  lng: number
  altitude: string
  date: string
  description: string
  icon: string
  phase: 'ida' | 'descubrimiento' | 'regreso' | 'retorno'
  distanceFromPrev?: string
}

const journeyStops: JourneyStop[] = [
  {
    id: 1,
    name: 'Tinogasta',
    lat: -28.0639,
    lng: -67.5642,
    altitude: '1.500 m',
    date: '13 de abril',
    description:
      'El equipo del Proyecto Pissis llegó a Tinogasta. Esa noche durmieron en una hostería porque al día siguiente tenían que terminar de comprar las provisiones y el agua. Manuel fue hasta la casa de Teresa, pero tal como ella le había dicho, no estaba.',
    icon: '🏠',
    phase: 'ida',
  },
  {
    id: 2,
    name: 'Campamento Base — Volcán Pissis',
    lat: -27.772,
    lng: -68.767,
    altitude: '4.600 m',
    date: '15 de abril',
    description:
      'A las seis en punto, los tres vehículos partieron rumbo al Pissis. Desde la ventanilla se veían las lagunas Del Aparejo, la Azul, la Verde con sus flamencos rosados. A las cuatro de la tarde llegaron al Campamento Base. Armaron cuatro carpas. Se quedarían dos días para aclimatarse. En el Campamento Base había una apacheta donde los que subían dejaban sus ofrendas a la Pachamama. Alcohol, tabaco, coca.',
    icon: '⛺',
    phase: 'ida',
    distanceFromPrev: '~120 km por huella',
  },
  {
    id: 3,
    name: 'Campamento de Altura 1 (C1)',
    lat: -27.768,
    lng: -68.788,
    altitude: '5.850 m',
    date: '18 de abril',
    description:
      'A las nueve de la mañana del tercer día, la expedición partió hacia el C1. La subida había sido dura. La falta de oxígeno se notaba en el cansancio de todos. Llegaron a las tres y media de la tarde, bastante agotados. La temperatura había descendido a quince grados bajo cero y el viento era tolerable.',
    icon: '🏔️',
    phase: 'ida',
    distanceFromPrev: '~8 km de trekking',
  },
  {
    id: 4,
    name: 'Campamento de Altura 2 (C2)',
    lat: -27.764,
    lng: -68.795,
    altitude: '6.350 m',
    date: '19 de abril',
    description:
      'El cuarto día fue todavía más duro. La consigna fue hidratarse y descansar porque al día siguiente se levantarían temprano para llegar a la cumbre. A medianoche Vera llamó a la carpa de Manuel. Lucía no estaba bien. Tenía síntomas de mal de altura. Dolor de cabeza y náuseas. Había que bajarla de inmediato. Manuel la acompañó en el descenso nocturno a -30°C con linternas.',
    icon: '⛰️',
    phase: 'ida',
    distanceFromPrev: '~4 km de trekking',
  },
  {
    id: 5,
    name: 'Cumbre del Pissis — Descubrimiento',
    lat: -27.7636,
    lng: -68.7928,
    altitude: '6.800 m',
    date: '20 de abril',
    description:
      'Llegaron antes del mediodía. Vera marcó cuatro cuadrículas. Al mediodía, Gabriel empezó a agitar los brazos: "¡Doctora Larsen!" — había encontrado una estatuilla de spondylus rojo, tan rojo que casi encandilaba. Ya se adivinaba el círculo de piedras que protegía el enterratorio. A las tres de la tarde habían liberado el fardo funerario. Gabriel lo levantó envuelto en un manto rojo. "Una piedra preciosa en medio de las cumbres nevadas de los Andes." Mark se abrazó con Vera y, debajo de las antiparras, lloraban los dos.',
    icon: '🔴',
    phase: 'descubrimiento',
    distanceFromPrev: '~3 km de escalada',
  },
  {
    id: 6,
    name: 'Descenso con la Momia — C1',
    lat: -27.768,
    lng: -68.788,
    altitude: '5.850 m',
    date: '21 de abril',
    description:
      'Vera y Chañás bajaron con la momia. A medida que bajaban había más oxígeno. Cuando llegó al C1, Vera se sentía liviana como una pluma. Apuró los últimos pasos casi saltando hasta donde la esperaba Manuel. Y lo abrazó: "¡La encontramos, Acevedo! ¡La encontramos!" Avisaron a Gendarmería para que los esperaran en el Campamento Base con una camioneta lista y con hielo seco.',
    icon: '📦',
    phase: 'descubrimiento',
    distanceFromPrev: '~4 km de descenso',
  },
  {
    id: 7,
    name: 'MAAM — Salta',
    lat: -24.7883,
    lng: -65.4106,
    altitude: '1.200 m',
    date: '22-25 de abril',
    description:
      'El fardo pasaría a un vehículo con caja frigorífica para hacer el trayecto hasta el Museo de Arqueología de Alta Montaña, en Salta. El mismo lugar donde estaban las momias de los niños del volcán Llullaillaco. En los laboratorios del subsuelo del museo contaban con la tecnología más moderna para preservar a la momia. Manuel sintió que su corazón se había partido en pedazos.',
    icon: '🏛️',
    phase: 'descubrimiento',
    distanceFromPrev: '~450 km por ruta',
  },
  {
    id: 8,
    name: 'Universidad de Maryland — EE.UU.',
    lat: 38.9869,
    lng: -76.9426,
    altitude: '50 m',
    date: 'Octubre 2008',
    description:
      'Cinco especialistas de Japón, Suecia y Alemania confirmaron su presencia para estudiar a "La Doncella Roja". Descubrieron que el pequeñísimo sapo de oro que la Doncella tenía en su estómago también era hueco. Y habían detectado materia orgánica: podría contener un diminuto quipu. "La Doncella Roja" sería el tema principal del próximo congreso internacional sobre momias.',
    icon: '🔬',
    phase: 'regreso',
    distanceFromPrev: '~8.400 km en vuelo',
  },
  {
    id: 9,
    name: 'Museo Metropolitano — Nueva York',
    lat: 40.7794,
    lng: -73.9632,
    altitude: '10 m',
    date: 'Noviembre 2008',
    description:
      'La Doncella fue exhibida en el Met a pesar de los acuerdos con las comunidades. Vera descubrió que el gobernador había firmado preacuerdos secretos para exposiciones con el Met de Nueva York, el Museo del Hombre de París, el Altes Museum de Berlín, y cinco ciudades japonesas. Se sintió traicionada. Comenzó a escribirle a Manuel, pidiéndole disculpas.',
    icon: '🗽',
    phase: 'regreso',
    distanceFromPrev: '~320 km por tierra',
  },
  {
    id: 10,
    name: 'Aeropuerto de Ezeiza — El Robo',
    lat: -34.8222,
    lng: -58.5358,
    altitude: '25 m',
    date: '2 de noviembre de 2008',
    description:
      'Sergio retiró el container de la aduana usando los papeles que Vera escaneó y envió por mail. Teresa lo esperaba en el estacionamiento con una camioneta cerrada. El hermanastro de Vera dio una descripción falsa del retirador para desviar la investigación. El container refrigerado de 1,56 por 1,23 partió rumbo a Tinogasta, esquivando los puestos de la Policía Caminera.',
    icon: '🚐',
    phase: 'retorno',
    distanceFromPrev: '~8.400 km en vuelo',
  },
  {
    id: 11,
    name: 'Casa de Teresa — Tinogasta',
    lat: -28.0639,
    lng: -67.5642,
    altitude: '1.500 m',
    date: 'Noviembre-Diciembre 2008',
    description:
      '"La Doncella Roja" estuvo exactamente una semana en un freezer, en la casa de Teresa, en Tinogasta. No tenía sus joyas, ni sus mantos lujosos, ni su tocado de plumas. Solo su túnica de lana de alpaca. La madrugada del 10 de diciembre, Manuel y Teresa cargaron a la Doncella en una camioneta 4x4 envuelta en hielo seco y gomaespuma y partieron de noche hacia Laguna Verde.',
    icon: '❄️',
    phase: 'retorno',
    distanceFromPrev: '~1.600 km por ruta',
  },
  {
    id: 12,
    name: 'El Retorno — Cumbre del Pissis',
    lat: -27.7636,
    lng: -68.7928,
    altitude: '6.800 m',
    date: 'Diciembre 2008',
    description:
      'Manuel y Teresa escalaron solos con el fardo de 35 kilos a más de 6.000 metros de altura. Hicieron en un solo día lo que se hacía en dos. En el C2 una tormenta de nieve los despertó. Manuel la abrazó: "Te quiero, Teresa." Llegaron a la cumbre antes del mediodía. Teresa le puso su manta preferida de lana de alpaca con franjas magentas, verdes y naranjas. Vera quiso que le pusieran su colgante de plata con piedra de ámbar. Manuel, con sumo cuidado, la bajó a la misma tumba. "Muy adentro sintió que los pedazos de su corazón se habían unido. El círculo otra vez estaba cerrado."',
    icon: '❤️',
    phase: 'retorno',
    distanceFromPrev: '~120 km + escalada',
  },
]

/* ─── Museum artifacts with exact text fragments ────────── */

interface ArtifactItem {
  id: string
  name: string
  icon: string
  momentId: string
  shortDesc: string
  exactQuote: string
  novelPage: string
  howItEnded: string
}

interface DiscoveryMoment {
  id: string
  title: string
  description: string
  icon: string
  order: number
}

const discoveryMoments: DiscoveryMoment[] = [
  {
    id: 'cumbre-senial',
    title: 'La primera señal en la cumbre',
    description: 'Gabriel excava su cuadrícula y grita el nombre de Vera...',
    icon: '🏔️',
    order: 1,
  },
  {
    id: 'fardo-desenvuelto',
    title: 'Desenvuelven el fardo',
    description: 'Quitan los mantos y ven el cuerpo por primera vez...',
    icon: '🔴',
    order: 2,
  },
  {
    id: 'vestimenta-doncella',
    title: 'La vestimenta de la Doncella',
    description: 'En los laboratorios del MAAM estudian cada prenda...',
    icon: '👘',
    order: 3,
  },
  {
    id: 'ajuar-completo',
    title: 'El ajuar funerario — 80 piezas',
    description: 'Dos días más tardan en desenterrar y fotografiar el ajuar completo...',
    icon: '🏺',
    order: 4,
  },
  {
    id: 'sapo-secreto',
    title: 'El secreto del sapo de oro',
    description: 'Los estudios en Maryland revelan lo que esconde la Doncella...',
    icon: '🐸',
    order: 5,
  },
  {
    id: 'sacrificio-doncella',
    title: 'Cómo llegó al entierro',
    description: 'La voz de Sarac narra la ceremonia y el sacrificio...',
    icon: '🌙',
    order: 6,
  },
]

const artifactItems: ArtifactItem[] = [
  {
    id: 'spondylus',
    name: 'Estatuilla de spondylus rojo',
    icon: '🐚',
    momentId: 'cumbre-senial',
    shortDesc: 'Concha roja brillante que guía al enterratorio',
    exactQuote:
      'Una estatuilla de spondylus rojo. Tan rojo que casi encandilaba. Una estatuilla igual a la que ella guardaba en Catamarca.',
    novelPage: 'p.40',
    howItEnded:
      'El spondylus estaba presente en todos los enterratorios incas. Era considerado más valioso que el oro y venía de las profundidades del mar. La estatuilla fue lo que el andinista polaco encontró primero y cuyas coordenadas llevaron a Vera directo al enterratorio.',
  },
  {
    id: 'manto-rojo',
    name: 'Manto rojo de vicuña',
    icon: '🧣',
    momentId: 'fardo-desenvuelto',
    shortDesc: 'La capa externa del fardo funerario',
    exactQuote:
      'El fardo estaba envuelto por numerosas piezas textiles. La más externa, un manto rojo, de fina lana de vicuña.',
    novelPage: 'p.48',
    howItEnded:
      'Los tejidos nunca estaban hechos al azar. Los incas registraban en sus telas toda clase de información. Ni el animal escogido, ni el tipo de lana, ni la trama, ni el hilado eran aleatorios. La elección de los colores y los diseños eran parte del mensaje que enviaban a sus dioses.',
  },
  {
    id: 'manos-rojas',
    name: 'Manos teñidas de rojo',
    icon: '🖐️',
    momentId: 'fardo-desenvuelto',
    shortDesc: 'Las manos cubriendo la cara con tinte rojo',
    exactQuote:
      'Lo primero que saltaba a la vista eran sus manos, completamente teñidas de rojo. Las puntas de los dedos se apoyaban sobre la frente, como si estuviera cubriéndose la cara. Sin embargo, había bastante espacio entre las manos y la cara.',
    novelPage: 'p.48',
    howItEnded:
      'En su estómago se encontraron restos de achiote, el mismo vegetal que se utilizó para la tintura de las manos. Sarac narra cómo preparaba el tinte: "Urpi había puesto los insectos en un recipiente de madera y los había aplastado con una pequeña piedra redonda hasta formar una pasta." La cochinilla y el achiote daban el rojo sangre.',
  },
  {
    id: 'manto-plumas',
    name: 'Manto de plumas amarillas',
    icon: '🪶',
    momentId: 'fardo-desenvuelto',
    shortDesc: 'Bordado con plumas de papagayo',
    exactQuote:
      'Debajo de él, otro manto bordado con plumas amarillas, probablemente de papagayo.',
    novelPage: 'p.48',
    howItEnded:
      'Sarac lo bordó ella misma: "Yo hacía varios meses que estaba bordando un gran manto con plumas amarillas. Era un trabajo lento. Un trabajo de un año entero. O tal vez más." Las plumas venían de guacamayos traídos de la selva. Las acllas les daban calabazas para que las plumas tuvieran colores más intensos.',
  },
  {
    id: 'tocado-plumas',
    name: 'Tocado de plumas azules',
    icon: '👑',
    momentId: 'vestimenta-doncella',
    shortDesc: 'Casco de plumas azules brillantes',
    exactQuote:
      'La Doncella tenía el cabello completamente trenzado y un impresionante tocado en forma de casco de brillantes plumas azules.',
    novelPage: 'p.51',
    howItEnded:
      'Fue cosido por Urpi, la mejor amiga de Sarac: "Urpi trabajaba en un impresionante tocado de plumas azules. Ni el azul del mar ni el azul del cielo tenían esos reflejos." Sarac lo vio antes del sacrificio: "He visto el tocado que me han de poner. Es el de plumas azules de guacamayo. El que cosió Urpi."',
  },
  {
    id: 'pulseras-oro',
    name: 'Pulseras de oro',
    icon: '💍',
    momentId: 'vestimenta-doncella',
    shortDesc: 'Dos anchas pulseras en los antebrazos',
    exactQuote:
      'En los antebrazos, dos anchas pulseras de oro, y en el cuello, un cordón con una piedra de ámbar del tamaño de una almendra.',
    novelPage: 'p.51',
    howItEnded:
      'El oro representaba al dios Sol (Inti). Las pulseras señalaban que era una Aclla del Sol, elegida para el sacrificio capacocha. El oro no era un metal precioso para los incas como lo es para nosotros: era el sudor del sol, sagrado.',
  },
  {
    id: 'collar-ambar',
    name: 'Collar de ámbar',
    icon: '📿',
    momentId: 'vestimenta-doncella',
    shortDesc: 'Piedra de ámbar en el cuello',
    exactQuote:
      'En el cuello, un cordón con una piedra de ámbar del tamaño de una almendra.',
    novelPage: 'p.51',
    howItEnded:
      'Su madre se lo puso al nacer. Sarac narra: "Mientras acariciaba el collar de ámbar que mi madre me había puesto para que nada malo me sucediera, el cuy seguía quieto." Cuando la devuelven a la montaña, Vera le pone un collar similar: "Vera quiso que le pusieran su colgante de plata, una cadena con una piedra de ámbar."',
  },
  {
    id: 'sapo-oro',
    name: 'Sapo de oro (ajuar)',
    icon: '🐸',
    momentId: 'ajuar-completo',
    shortDesc: 'Figura hueca del tamaño de un puño',
    exactQuote:
      'Entre las figuras de animales se destacaba la de un sapo de oro finamente tallado, del tamaño de un puño.',
    novelPage: 'p.52',
    howItEnded:
      'El profesor González descubre su significado: "El sapo era la representación de la Pachamama, la madre tierra. Era símbolo de la fertilidad y de la vida. El sapo hibernaba durante largo tiempo, para salir luego en la época propicia." Dentro del sapo había un quipu con tres nudos: un mensaje secreto a los dioses.',
  },
  {
    id: 'estatuillas',
    name: '20 estatuillas antropomorfas',
    icon: '🗿',
    momentId: 'ajuar-completo',
    shortDesc: 'Figuras de plata, oro y spondylus',
    exactQuote:
      'Había veinte estatuillas antropomorfas, de plata, oro y spondylus, ricamente vestidas con textiles y plumas.',
    novelPage: 'p.51',
    howItEnded:
      'Las estatuillas representaban a los acompañantes de la Doncella en su viaje al otro mundo. Cada material tenía un significado: el oro al Sol, la plata a la Luna, el spondylus al mar. Iban ricamente vestidas porque la Doncella no viajaba sola al mundo divino.',
  },
  {
    id: 'llamas-vicunas',
    name: '30 figuras de llamas y vicuñas',
    icon: '🦙',
    momentId: 'ajuar-completo',
    shortDesc: 'Figuras de camélidos de diferentes tamaños',
    exactQuote:
      'Otras treinta figuras de llamas y vicuñas de diferentes tamaños.',
    novelPage: 'p.51-52',
    howItEnded:
      'Las llamas eran esenciales para el mundo andino. En la ceremonia: "Doscientos cordeles de colores atados a los doscientos cogotes blancos que serían cortados para mostrar la pena que sentía el imperio por la muerte del Inka." Las figuras de llamas acompañarían a la Doncella en el más allá.',
  },
  {
    id: 'sapo-miniatura',
    name: 'Sapo de oro miniatura (estómago)',
    icon: '🐸',
    momentId: 'sapo-secreto',
    shortDesc: 'Réplica en miniatura hallada en el estómago',
    exactQuote:
      'En el fondo de su estómago aparecía un cuerpo extraño. Una figura de metal que los primeros estudios mostraron como una réplica exacta, en miniatura, del sapo de oro hallado entre las piezas del ajuar.',
    novelPage: 'p.77',
    howItEnded:
      'La Doncella debió tragarlo la última noche. El Sacerdote del Sol se lo dio: "Me ha mostrado, el Sacerdote, el hamp\'atu de oro que tiene en su vientre el mensaje para los dioses. En la última noche antes de quedarme sola, después de comer achiote y de tomar la chicha sagrada, tendré que tragarlo." Dentro tenía un quipu idéntico al del sapo grande: tres nudos.',
  },
  {
    id: 'quipu-nudos',
    name: 'Quipu con tres nudos',
    icon: '🪢',
    momentId: 'sapo-secreto',
    shortDesc: 'El mensaje secreto dentro del sapo',
    exactQuote:
      'Habían descubierto que adentro de la figura del sapo había un elemento orgánico. Lo más probable era que se tratara de una pieza de lana. Un quipu. Una sola cuerda de lana con tres nudos. Era exactamente igual al quipu de su abuela Lucero. Tres nudos. Dos de ellos superpuestos y otro en la mitad de la cuerda restante.',
    novelPage: 'p.80',
    howItEnded:
      'El quipu era el mensaje secreto que la Doncella llevaba a los dioses. El profesor González sabía que era imposible de descifrar. Pero Manuel reconoció el quipu: era idéntico al de su abuela Lucero, la chamana. La abuela le había dicho: "Ya sabrá qué hacer. Y cuando la Pacha reúna sus pedazos, lo sabrá en su corazón, propiamente."',
  },
  {
    id: 'manto-alpaca',
    name: 'Manto de alpaca con diseños',
    icon: '🎨',
    momentId: 'vestimenta-doncella',
    shortDesc: 'Manto fino que señalaba alto rango',
    exactQuote:
      'Debajo del manto de lana roja y del manto de plumas amarillas, la Doncella estaba envuelta en uno más fino, con diseños que señalaban su alto rango social. En medio de los pliegues de este último se encontró una fina laminilla de oro enrollada.',
    novelPage: 'p.51',
    howItEnded:
      'Los colores y diseños del manto indicaban que Sarac era una Aclla del Sol, de la clase más alta. Ella misma tejió su lliclla: "La tejí yo misma con franjas magentas, verdes y naranjas." Teresa le puso una manta similar al devolverla: "Su manta preferida, una que ella misma había tejido en lana de alpaca con franjas de colores, magentas, verdes y naranjas."',
  },
  {
    id: 'tupus-plata',
    name: 'Tupus de plata',
    icon: '📌',
    momentId: 'vestimenta-doncella',
    shortDesc: 'Dos prendedores que ajustaban el vestido',
    exactQuote:
      'Dos tupus, o prendedores de plata, ajustaban su vestido y en la cadera tenía una faja de colores, de la que se desprendían dos largos cordones de fibras vegetales que terminaban en sendas borlas: una de lana y la otra, confeccionada con cabello humano.',
    novelPage: 'p.51',
    howItEnded:
      'Los tupus eran símbolo de status de las mujeres de alto rango. Los cordones con borlas servían para atar animales, y las estatuillas del ajuar también tenían cordelitos similares. La borla de cabello humano era particularmente significativa: el cabello tenía poder sagrado.',
  },
  {
    id: 'moccasins',
    name: 'Mocasines de cuero',
    icon: '👢',
    momentId: 'vestimenta-doncella',
    shortDesc: 'Fino bordado en lana sobre cuero',
    exactQuote:
      'En los pies llevaba mocasines de cuero terminados en un fino bordado en lana.',
    novelPage: 'p.51',
    howItEnded:
      'Junto con los mocasines encontraron "dos pares de sandalias para cambiarse a lo largo de su prolongado viaje." Los incas creían que el viaje al otro mundo era largo, por eso la Doncella necesitaba calzado de repuesto.',
  },
  {
    id: 'chuspas-vasijas',
    name: 'Chuspas y vasijas con semillas',
    icon: '🏺',
    momentId: 'ajuar-completo',
    shortDesc: 'Bolsitas de coca y vasijas con alimentos',
    exactQuote:
      'Chuspas, bolsitas ceremoniales en las que se guardaban las hojas de coca. Vasijas con semillas, porotos cocidos y otros materiales orgánicos.',
    novelPage: 'p.52',
    howItEnded:
      'Las semillas eran para el otro mundo, pero brotaron en este. Manuel pidió las semillas para su Museo del Hombre: "Semillas de calabaza, maíz, variedades de porotos y otras." Cuando se inauguró el MAMCA, "todas, absolutamente todas las semillas habían echado sus brotes después de haber hibernado durante quinientos años."',
  },
  {
    id: 'cabello-trenzado',
    name: 'Cabello completamente trenzado',
    icon: '💇',
    momentId: 'fardo-desenvuelto',
    shortDesc: 'Trenzas ceremoniales intactas',
    exactQuote:
      'La Doncella tenía el cabello completamente trenzado y un impresionante tocado en forma de casco de brillantes plumas azules.',
    novelPage: 'p.51',
    howItEnded:
      'El Sacerdote del Sol trenzó su cabello la última noche: "Después de que pintaran mi cuerpo, después de que comiera el achiote, de que trenzaran mi cabello." Las trenzas eran parte de la preparación sagrada antes del sacrificio.',
  },
  {
    id: 'doncella-sacrificio',
    name: 'La Doncella elegida — Sarac',
    icon: '🌙',
    momentId: 'sacrificio-doncella',
    shortDesc: 'La voz de la Doncella narra su elección',
    exactQuote:
      'La Mamacona me buscó. El Sacerdote del Sol quería estar a solas conmigo. Las maripositas negras me arrancaron el ánima por la boca y me desmayé. Yo era la elegida.',
    novelPage: 'p.103',
    howItEnded:
      'Sarac narra su camino al sacrificio: "Me darían coca y chicha y me iría durmiendo dulcemente. Sin dolor. En el final sí estaría sola, me dijo el Sacerdote. Envuelta en mis mantos. Rodeada de ofrendas. Ya sería sagrada. La mensajera sagrada. Yo sola podría cruzar al otro lado, donde los dioses me estarían esperando."',
  },
]

/* ─── Decision quotes — extracted verbatim ───────────────── */

const museumQuotes = [
  {
    id: 'v1',
    speaker: 'Vera Larsen',
    quote:
      'No estaba a favor de la exhibición de las momias como si fueran objetos. Una momia mezclada con vasijas de cerámica. No. "La Doncella Roja", las momias andinas, merecen respeto.',
    page: 'p.72',
  },
  {
    id: 'v2',
    speaker: 'Vera Larsen',
    quote:
      'Exhibir "La Doncella Roja", si se lo hacía con respeto, era mostrar todo su mundo, sus creencias, sus valores. Eso, a su juicio, era una forma de defender esa cultura. Estaba más a la vista. Más presente. Más viva.',
    page: 'p.72',
  },
  {
    id: 'v3',
    speaker: 'Vera Larsen',
    quote:
      'Los incas tenían una sentencia: "Sembrar muertos para cosechar vivos". Creo que "La Doncella Roja" será quien coseche más vida para su cultura.',
    page: 'p.73',
  },
  {
    id: 'v4',
    speaker: 'Vera Larsen',
    quote:
      'No era posible entender lo que no se conocía. Menos aún se podía cuidar ni amar lo que no se conocía.',
    page: 'p.72',
  },
  {
    id: 'v5',
    speaker: 'Narración',
    quote:
      'Había gente que le había contado lo conmovida que se había sentido al entrar al MAAM. Decían haber tenido un verdadero privilegio al poder observar las momias de esos niños. Pero no por observar una momia como un objeto exótico. Entrar al MAAM era entrar a un mundo ajeno. Un mundo sagrado y que desconocían por completo.',
    page: 'p.72',
  },
  {
    id: 'v6',
    speaker: 'Manuel Acevedo',
    quote:
      'Sacar la momia había sido protegerla. Eso era lo que Teresa no quería entender. Con el dato del andinista polaco dando vueltas, el huaqueo del sitio era cuestión de tiempo y la momia se perdería para siempre.',
    page: 'p.86',
  },
]

const mountainQuotes = [
  {
    id: 'm1',
    speaker: 'Sergio Vargas (La Voz de los Andes)',
    quote:
      'Para los andinos la montaña es Dios. Muchas veces nuestra formación occidental nos impide comprender este concepto en toda su amplitud. La montaña, el sol, el rayo, la luna no representan a los dioses, SON los dioses.',
    page: 'p.69',
  },
  {
    id: 'm2',
    speaker: 'Narración',
    quote:
      'Los integrantes de las comunidades andinas llamaban a la momia "nuestra niña". Para ellos, sus niños no estaban muertos; dormían allá, en lo más alto, un sueño sagrado, y al arrancarlos de la montaña, los estaban matando.',
    page: 'p.56',
  },
  {
    id: 'm3',
    speaker: 'Narración',
    quote:
      'El sueño de la niña en las cumbres heladas aseguraba un equilibrio con la naturaleza. Una armonía. Ella estaba allí para eso. Si la arrancaban de la montaña, el equilibrio se rompería en mil pedazos.',
    page: 'p.56',
  },
  {
    id: 'm4',
    speaker: 'Teresa (chat con Sergio)',
    quote:
      '¡EN CATAMARCA NO, PERO EN ESTADOS UNIDOS SÍ! ¡Y DESPUÉS EUROPA! QUIÉN TE DICE, ¡JA!',
    page: 'p.74',
  },
  {
    id: 'm5',
    speaker: 'Ley 25.517 (citada por Teresa)',
    quote:
      'Los restos mortales de aborígenes, cualquiera fuere su característica étnica, que formen parte de museos y/o colecciones públicas o privadas, deberán ser puestos a disposición de los pueblos indígenas y/o comunidades de pertenencia que lo reclamen.',
    page: 'p.79',
  },
  {
    id: 'm6',
    speaker: 'Abuela Lucero (en sueños de Manuel)',
    quote:
      'No sirve de nada un corazón descuartizado. Sirve un corazón sano y entero. No se preocupe, mi queridito, mi Sapito, ya sabrá qué hacer. Y cuando la Pacha reúna sus pedazos, lo sabrá en su corazón, propiamente.',
    page: 'p.81',
  },
]

/* ═══════════════════════════════════════════════════════════
   MAP TAB — Real map with Leaflet
   ═══════════════════════════════════════════════════════════ */

const MapComponent = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => <div className="map-loading"><Compass size={28} className="loading-compass" /><span>Cargando mapa...</span></div>,
})

const phases = [
  { key: 'all', label: 'Todo el recorrido', color: '#294b3f' },
  { key: 'ida', label: 'La subida', color: '#b48a50' },
  { key: 'descubrimiento', label: 'El descubrimiento', color: '#a84232' },
  { key: 'regreso', label: 'Viaje al exterior', color: '#71618a' },
  { key: 'retorno', label: 'El retorno', color: '#294b3f' },
]

function MapTab() {
  const [selectedStop, setSelectedStop] = useState<JourneyStop | null>(null)
  const [activePhase, setActivePhase] = useState('all')
  const filteredStops = activePhase === 'all' ? journeyStops : journeyStops.filter((s) => s.phase === activePhase)

  return (
    <div className="map-activity">
      <div className="activity-intro">
        <div><p className="eyebrow">01 / EL RECORRIDO</p><h2 className="section-title">Mapa del Recorrido</h2></div>
        <span className="activity-count"><Route size={16} />{journeyStops.length} paradas <span>·</span> 4 etapas</span>
      </div>
      <div className="phase-filters" aria-label="Filtrar etapas del recorrido">
        {phases.map((phase) => (
          <button key={phase.key} aria-pressed={activePhase === phase.key}
            onClick={() => { setActivePhase(phase.key); setSelectedStop(null) }}
            className={activePhase === phase.key ? 'phase-filter is-active' : 'phase-filter'}
            style={{ '--phase-color': phase.color } as React.CSSProperties}>
            <span className="phase-dot" />{phase.label}
          </button>
        ))}
      </div>
      <div className="journey-workspace">
        <div className="journey-map panel">
          <div className="map-panel-heading"><span><Compass size={16} /> La Doncella Roja</span><span>MAPA INTERACTIVO</span></div>
          <div className="map-canvas">
            <MapComponent stops={filteredStops} selectedStop={selectedStop} onSelectStop={setSelectedStop} activePhase={activePhase} />
          </div>
          <div className="map-panel-footer"><MapPin size={14} /><span>Elegí un punto del mapa para explorar el recorrido.</span></div>
        </div>
        <aside className="journey-stops panel" aria-label="Paradas del recorrido">
          <div className="stops-heading"><h3>Paradas del recorrido</h3><span>{filteredStops.length.toString().padStart(2, '0')}</span></div>
          <div className="stop-list">
            {filteredStops.map((stop) => (
              <button key={stop.id} onClick={() => setSelectedStop(stop)} aria-pressed={selectedStop?.id === stop.id}
                className={selectedStop?.id === stop.id ? 'stop-card is-selected' : 'stop-card'}>
                <span className="stop-number" style={{ '--phase-color': phases.find((phase) => phase.key === stop.phase)?.color } as React.CSSProperties}>{stop.id.toString().padStart(2, '0')}</span>
                <span className="stop-content"><strong>{stop.name}</strong><span>{stop.altitude} <span className="stop-separator">/</span> {stop.date}</span>
                  {stop.distanceFromPrev && <small>{stop.distanceFromPrev}</small>}
                </span>
                <ArrowRight size={14} className="stop-arrow" />
              </button>
            ))}
          </div>
        </aside>
      </div>
      {selectedStop ? (
        <article className="stop-detail panel" aria-live="polite">
          <div className="detail-marker" aria-hidden="true">{selectedStop.icon}</div>
          <div><p className="eyebrow">PARADA {selectedStop.id.toString().padStart(2, '0')} / {journeyStops.length}</p>
            <h3>{selectedStop.name}</h3>
            <div className="detail-meta"><span><Mountain size={14} />{selectedStop.altitude}</span><span>{selectedStop.date}</span>{selectedStop.distanceFromPrev && <span><Route size={14} />{selectedStop.distanceFromPrev}</span>}</div>
            <p className="detail-description">{selectedStop.description}</p>
          </div>
        </article>
      ) : (
        <div className="journey-hint"><BookOpen size={18} /><p>Elegí una parada del recorrido para leer su historia.</p><ArrowDown size={16} /></div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   DECISION TAB — Real quotes from the text
   ═══════════════════════════════════════════════════════════ */

function DecisionTab() {
  const [choice, setChoice] = useState<'museo' | 'montaña' | null>(null)
  const [selectedQuotes, setSelectedQuotes] = useState<string[]>([])
  const [showResult, setShowResult] = useState(false)

  const allQuotes = [...museumQuotes, ...mountainQuotes]
  const totalQuotes = allQuotes.length
  const selectedCount = selectedQuotes.length

  const toggleQuote = (id: string) => {
    setSelectedQuotes((prev) => (prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]))
  }

  const handleConfirm = () => {
    if (choice) setShowResult(true)
  }

  const reset = () => {
    setChoice(null)
    setShowResult(false)
    setSelectedQuotes([])
  }

  const museumAdvantages = [
    'Preservación garantizada con tecnología de punta en el MAAM/MAMCA',
    'Estudios científicos que revelan información invaluable (ADN, tomografías, radiografías)',
    'Educación: millones de personas pueden conocer y valorar esta cultura',
    'Protección contra el huaqueo y el mercado negro de bienes culturales',
    'Las semillas del ajuar brotaron después de 500 años gracias a la ciencia',
    'Se descubre el secreto del sapo de oro y el quipu con tres nudos',
  ]

  const museumDisadvantages = [
    'El gobernador traicionó los acuerdos con las comunidades y firmó preacuerdos secretos',
    'Se planeaban exposiciones en el Met, París, Berlín y cinco ciudades japonesas sin consentimiento',
    'Intereses económicos: hotel 5 estrellas, restaurantes, negocio turístico',
    'La momia se convierte en objeto de circo político y mediático',
    'Se rompe el equilibrio sagrado entre la montaña y la Doncella',
    'Los coleccionistas privados del mercado negro esperan la oportunidad',
  ]

  const mountainAdvantages = [
    'Se restaura el equilibrio sagrado con la naturaleza y el Apu',
    'Se respeta la cosmovisión andina: "nuestra niña no está muerta, duerme"',
    'Las comunidades originarias recuperan a "su niña"',
    'La Doncella vuelve a ser la mensajera de los dioses en su templo',
    'El sapo puede seguir hibernando hasta que los tiempos sean propicios',
    'Se cumple la ley 25.517 de restitución de restos mortales',
  ]

  const mountainDisadvantages = [
    'Riesgo de que huaqueros encuentren y roben la momia para el mercado negro',
    'Se pierde la oportunidad de estudios científicos que revelen su historia',
    'Sin difusión en museos, la cultura corre riesgo de ser olvidada',
    'Las condiciones en la montaña pueden deteriorar el cuerpo con el tiempo',
    'Es imposible garantizar la seguridad permanente a 6.800 metros',
    'La ciencia pierde acceso a un hallazgo único en el mundo',
  ]

  return (
    <div className="decision-activity space-y-8">
      {/* Introduction */}
      <div className="decision-intro">
        <p className="eyebrow">03 / TU DECISIÓN</p>
        <h2 className="section-title">¿Qué hacer con la Doncella Roja?</h2>
        <p className="decision-description body-copy">
          Manuel está dividido. Su corazón se ha partido en pedazos. De un lado, Vera y la ciencia;
          del otro, Teresa y las comunidades. Leé las frases reales del texto y elegí los fragmentos
          del corazón de Manuel que resuenan con tu postura. Después, tomá una decisión.
        </p>
      </div>

      {/* Real quotes from the text — tablet-optimized with larger touch targets */}
      <section className="decision-fragments">
        <div className="fragments-heading"><h3>
          Fragmentos del corazón de Manuel — Frases reales del texto
        </h3>
        <p className="selection-count" aria-live="polite">
          Elegí los fragmentos que te convencen ({selectedCount}/{totalQuotes})
        </p></div>
        <div className="quote-columns">
          {/* Museum quotes */}
          <div>
            <h4 className="quote-column-heading science-heading">
              🏛️ La postura de Vera y la ciencia
            </h4>
            <div className="space-y-2">
              {museumQuotes.map((q) => (
                <button
                  key={q.id}
                  onClick={() => toggleQuote(q.id)}
                  aria-pressed={selectedQuotes.includes(q.id)}
                  className={`quote-card w-full text-left p-4 rounded-xl transition-all min-h-[56px] ${
                    selectedQuotes.includes(q.id)
                      ? 'bg-violet-100 border-2 border-violet-400 shadow'
                      : 'bg-white/80 border border-stone-200 hover:bg-white active:bg-violet-50'
                  }`}
                >
                  <span className="quote-select-mark" aria-hidden="true">{selectedQuotes.includes(q.id) ? <Check size={13} /> : <span />}</span>
                  <p className="text-sm italic text-stone-700 leading-relaxed">&ldquo;{q.quote}&rdquo;</p>
                  <p className="text-xs text-violet-500 mt-1 font-medium">— {q.speaker} ({q.page})</p>
                </button>
              ))}
            </div>
          </div>
          {/* Mountain quotes */}
          <div>
            <h4 className="quote-column-heading mountain-heading">
              ⛰️ La postura de Teresa y las comunidades
            </h4>
            <div className="space-y-2">
              {mountainQuotes.map((q) => (
                <button
                  key={q.id}
                  onClick={() => toggleQuote(q.id)}
                  aria-pressed={selectedQuotes.includes(q.id)}
                  className={`quote-card w-full text-left p-4 rounded-xl transition-all min-h-[56px] ${
                    selectedQuotes.includes(q.id)
                      ? 'bg-emerald-100 border-2 border-emerald-400 shadow'
                      : 'bg-white/80 border border-stone-200 hover:bg-white active:bg-emerald-50'
                  }`}
                >
                  <span className="quote-select-mark" aria-hidden="true">{selectedQuotes.includes(q.id) ? <Check size={13} /> : <span />}</span>
                  <p className="text-sm italic text-stone-700 leading-relaxed">&ldquo;{q.quote}&rdquo;</p>
                  <p className="text-xs text-emerald-500 mt-1 font-medium">— {q.speaker} ({q.page})</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Two columns: Museum vs Mountain — larger touch targets */}
      <div className="decision-choices grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Museum side */}
        <button
          onClick={() => { setChoice('museo'); setShowResult(false) }}
          aria-pressed={choice === 'museo'}
          className={`choice-card text-left p-5 rounded-2xl transition-all ${
            choice === 'museo'
              ? 'bg-violet-50 border-2 border-violet-500 shadow-xl'
              : 'bg-white/80 border border-stone-200 hover:shadow-md active:bg-violet-50'
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🏛️</span>
            <div>
              <h3 className="text-lg font-bold text-violet-800">Exhibir en el Museo</h3>
              <p className="text-xs text-violet-600">La postura de Vera y la ciencia</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-bold text-green-700 mb-1">✅ Ventajas</h4>
              <ul className="space-y-1">
                {museumAdvantages.map((a, i) => (
                  <li key={i} className="text-sm text-stone-600 flex items-start gap-2">
                    <span className="text-green-500">•</span>{a}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-red-700 mb-1">❌ Desventajas</h4>
              <ul className="space-y-1">
                {museumDisadvantages.map((d, i) => (
                  <li key={i} className="text-sm text-stone-600 flex items-start gap-2">
                    <span className="text-red-400">•</span>{d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </button>

        {/* Mountain side */}
        <button
          onClick={() => { setChoice('montaña'); setShowResult(false) }}
          aria-pressed={choice === 'montaña'}
          className={`choice-card text-left p-5 rounded-2xl transition-all ${
            choice === 'montaña'
              ? 'bg-emerald-50 border-2 border-emerald-500 shadow-xl'
              : 'bg-white/80 border border-stone-200 hover:shadow-md active:bg-emerald-50'
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">⛰️</span>
            <div>
              <h3 className="text-lg font-bold text-emerald-800">Devolver a la Montaña</h3>
              <p className="text-xs text-emerald-600">La postura de Teresa y las comunidades</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-bold text-green-700 mb-1">✅ Ventajas</h4>
              <ul className="space-y-1">
                {mountainAdvantages.map((a, i) => (
                  <li key={i} className="text-sm text-stone-600 flex items-start gap-2">
                    <span className="text-green-500">•</span>{a}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-red-700 mb-1">❌ Desventajas</h4>
              <ul className="space-y-1">
                {mountainDisadvantages.map((d, i) => (
                  <li key={i} className="text-sm text-stone-600 flex items-start gap-2">
                    <span className="text-red-400">•</span>{d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </button>
      </div>

      {/* Confirm — larger button for tablet */}
      {choice && !showResult && (
        <div className="text-center">
          <button
            onClick={handleConfirm}
            className={`confirm-choice px-8 py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all min-h-[56px] active:scale-95 ${
              choice === 'museo' ? 'bg-violet-600 hover:bg-violet-700 active:bg-violet-800' : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800'
            }`}
          >
            Confirmar: {choice === 'museo' ? '🏛️ Exhibir en el Museo' : '⛰️ Devolver a la Montaña'}
          </button>
        </div>
      )}

      {/* Result */}
      {showResult && (
        <div
          role="status" className={`decision-result rounded-2xl p-8 text-center ${
            choice === 'museo' ? 'bg-violet-50 border-2 border-violet-300' : 'bg-emerald-50 border-2 border-emerald-300'
          }`}
        >
          {/* Heart with quipu */}
          <div className="mb-4 flex justify-center">
            <svg width="100" height="100" viewBox="0 0 120 120">
              <path
                d="M60,100 C60,100 15,65 15,40 C15,20 30,10 45,15 C52,18 57,25 60,30 C63,25 68,18 75,15 C90,10 105,20 105,40 C105,65 60,100 60,100Z"
                fill={choice === 'museo' ? '#8b5cf6' : '#059669'}
                opacity={Math.max(0.2, selectedCount / totalQuotes * 0.8 + 0.2)}
              />
              <circle cx="60" cy="50" r="5" fill="none" stroke="white" strokeWidth="2" />
              <circle cx="50" cy="62" r="4" fill="none" stroke="white" strokeWidth="2" />
              <circle cx="70" cy="62" r="4" fill="none" stroke="white" strokeWidth="2" />
              <line x1="60" y1="55" x2="50" y2="58" stroke="white" strokeWidth="1.5" />
              <line x1="60" y1="55" x2="70" y2="58" stroke="white" strokeWidth="1.5" />
            </svg>
          </div>

          {choice === 'museo' ? (
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-violet-800">Elegiste la ciencia y la preservación</h3>
              <p className="text-violet-700 text-sm max-w-lg mx-auto">
                Como Vera, creés que el conocimiento es la forma de proteger y valorar la cultura.
              </p>
              <div className="bg-white/60 rounded-xl p-4 mt-3 max-w-lg mx-auto">
                <p className="text-sm italic text-stone-700">
                  &ldquo;Sembrar muertos para cosechar vivos&rdquo; — Sentencia inca citada por Vera Larsen (p.73)
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-emerald-800">Elegiste lo sagrado y el respeto</h3>
              <p className="text-emerald-700 text-sm max-w-lg mx-auto">
                Como Teresa y las comunidades, creés que la Doncella debe volver a su hogar sagrado.
              </p>
              <div className="bg-white/60 rounded-xl p-4 mt-3 max-w-lg mx-auto">
                <p className="text-sm italic text-stone-700">
                  &ldquo;No sirve de nada un corazón descuartizado. Sirve un corazón sano y entero. Y cuando la Pacha reúna sus pedazos, lo sabrá en su corazón, propiamente.&rdquo; — Abuela Lucero (p.81)
                </p>
              </div>
            </div>
          )}
          <p className="text-xs text-stone-400 mt-3">
            Fragmentos elegidos: {selectedCount}/{totalQuotes} — Corazón{' '}
            {selectedCount >= totalQuotes * 0.7 ? 'casi completo' : selectedCount >= totalQuotes * 0.4 ? 'a medio camino' : 'fragmentado'}
          </p>
          <button
            onClick={reset}
            className="mt-4 px-6 py-3 rounded-xl bg-stone-200 text-stone-600 text-sm hover:bg-stone-300 min-h-[48px] active:bg-stone-400"
          >
            Volver a elegir
          </button>
        </div>
      )}

      {/* What happened in the novel */}
      <div className="novel-ending p-5 bg-amber-50 rounded-2xl border border-amber-200">
        <h4 className="font-bold text-amber-800 mb-2 text-sm">📖 ¿Qué pasó en la novela?</h4>
        <p className="text-sm text-amber-900 leading-relaxed">
          Manuel y Teresa robaron la momia del aeropuerto de Ezeiza y la devolvieron a la montaña.
          Manuel subió solo primero para cavar el sitio funerario. Luego subieron juntos con el fardo de 35 kilos.
          Teresa le puso su manta de lana de alpaca y Vera envió un collar de ámbar. Manuel la bajó a la misma tumba
          donde había dormido durante quinientos años. &ldquo;Muy adentro sintió que los pedazos de su corazón se habían
          unido. El círculo otra vez estaba cerrado.&rdquo; (p.116)
        </p>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE — Tablet-optimized
   ═══════════════════════════════════════════════════════════ */

const tabs = [
  { id: 'mapa', label: 'Mapa del Recorrido', Icon: Compass, count: journeyStops.length + ' paradas' },
  { id: 'museo', label: 'Museo de Piezas', Icon: Sparkles, count: artifactItems.length + ' piezas' },
  { id: 'decision', label: '¿Qué hacer?', Icon: Heart, count: (museumQuotes.length + mountainQuotes.length) + ' fragmentos' },
]

export default function Home() {
  const [activeTab, setActiveTab] = useState('mapa')

  const activateTab = (id: string) => {
    const activities = document.getElementById('actividades')
    const navigationIsSticky = activities && activities.getBoundingClientRect().top <= 0
    setActiveTab(id)
    if (navigationIsSticky) {
      requestAnimationFrame(() => activities.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
        block: 'start',
      }))
    }
  }

  const handleTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length
    else if (event.key === 'ArrowLeft') nextIndex = (index + tabs.length - 1) % tabs.length
    else if (event.key === 'Home') nextIndex = 0
    else if (event.key === 'End') nextIndex = tabs.length - 1
    else return
    event.preventDefault()
    activateTab(tabs[nextIndex].id)
    document.getElementById('tab-' + tabs[nextIndex].id)?.focus({ preventScroll: true })
  }

  const explore = () => {
    setActiveTab('mapa')
    document.getElementById('actividades')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })
    document.getElementById('tab-mapa')?.focus({ preventScroll: true })
  }

  return (
    <div className="app-shell" id="inicio">
      <a className="skip-link" href="#actividades">Ir a las actividades</a>
      <header className="site-header">
        <div className="page-width header-inner">
          <a href="#inicio" className="brand" aria-label="La Doncella Roja, inicio"><span className="brand-symbol"><BookOpen size={21} strokeWidth={1.5} /></span><span>La Doncella Roja<small>RECORRIDO INTERACTIVO</small></span></a>
          <span className="school-badge"><span className="badge-dot" />LITERATURA <span className="badge-divider">/</span> 5.º AÑO</span>
        </div>
      </header>
      <section className="hero page-width" aria-labelledby="app-title">
        <div className="hero-copy">
          <p className="hero-author"><span /> SANDRA SIEMENS</p>
          <h1 id="app-title">La Doncella <em>Roja</em><span className="title-period" aria-hidden="true">.</span></h1>
          <p className="hero-description">Una novela sobre el encuentro entre la ciencia y lo sagrado</p>
          <button className="action-button hero-button" onClick={explore}>Explorar el recorrido <ArrowRight size={18} /></button>
          <div className="hero-footnote"><BookOpen size={14} /><span>Una lectura. Tres formas de explorar.</span></div>
        </div>
        <ExpeditionArt />
      </section>
      <div className="activities-wrap" id="actividades">
        <nav className="activity-navigation" aria-label="Actividades de la novela">
          <div className="page-width activity-tabs" role="tablist" aria-label="Elegir actividad">
            {tabs.map((tab, index) => (
              <button key={tab.id} id={'tab-' + tab.id} role="tab" aria-selected={activeTab === tab.id}
                aria-controls={'panel-' + tab.id} tabIndex={activeTab === tab.id ? 0 : -1}
                onClick={() => activateTab(tab.id)} onKeyDown={(event) => handleTabKey(event, index)}
                className={activeTab === tab.id ? 'activity-tab is-active' : 'activity-tab'}>
                <span className="tab-index">0{index + 1}</span><tab.Icon size={21} strokeWidth={1.6} className="tab-icon" />
                <span className="tab-copy"><strong>{tab.label}</strong><small>{tab.count}</small></span><ArrowRight size={16} className="tab-arrow" />
              </button>
            ))}
          </div>
        </nav>
        <main className="activity-main page-width">
          <div id="panel-mapa" role="tabpanel" aria-labelledby="tab-mapa" hidden={activeTab !== 'mapa'} tabIndex={0}><MapTab /></div>
          <div id="panel-museo" role="tabpanel" aria-labelledby="tab-museo" hidden={activeTab !== 'museo'} tabIndex={0}><MuseumActivity artifacts={artifactItems} moments={discoveryMoments} /></div>
          <div id="panel-decision" role="tabpanel" aria-labelledby="tab-decision" hidden={activeTab !== 'decision'} tabIndex={0}><DecisionTab /></div>
        </main>
      </div>
      <footer className="site-footer"><div className="page-width footer-inner"><BookOpen size={16} /><p>Basado en la novela &ldquo;La Doncella Roja&rdquo; de Sandra Siemens — Actividad educativa</p><a href="#inicio">Volver al inicio <ArrowRight size={14} /></a></div></footer>
    </div>
  )
}
