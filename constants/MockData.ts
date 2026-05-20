// ─── Datos simulados para el prototipo de la App de Fitness ───────────────────

export const mockUser = {
  name: 'David',
  avatar: 'https://i.pravatar.cc/150?img=12',
  streak: 5,
  weeklyGoal: 4,
};

export const mockWeeklyWorkouts = [
  { day: 'L', done: true },
  { day: 'M', done: true },
  { day: 'X', done: false },
  { day: 'J', done: true },
  { day: 'V', done: true },
  { day: 'S', done: false },
  { day: 'D', done: false },
];

// ─── Historial de entrenamientos ──────────────────────────────────────────────
export const mockHistory = [
  {
    id: '1',
    name: 'Empuje – Pecho y Tríceps',
    date: 'Lun, 19 May 2026',
    duration: '52 min',
    volume: '8,420 kg',
    exercises: 6,
    sets: 18,
    emoji: '💪',
    exercises_detail: [
      { name: 'Press Banca', sets: 4, reps: '8', weight: '80 kg' },
      { name: 'Press Inclinado DB', sets: 3, reps: '10', weight: '30 kg' },
      { name: 'Fondos en Paralelas', sets: 3, reps: '12', weight: 'Peso corp.' },
      { name: 'Extensión Tríceps Polea', sets: 4, reps: '15', weight: '20 kg' },
    ],
  },
  {
    id: '2',
    name: 'Tirón – Espalda y Bíceps',
    date: 'Mar, 20 May 2026',
    duration: '48 min',
    volume: '7,900 kg',
    exercises: 5,
    sets: 16,
    emoji: '🏋️',
    exercises_detail: [
      { name: 'Jalón al Pecho', sets: 4, reps: '10', weight: '65 kg' },
      { name: 'Remo con Barra', sets: 3, reps: '8', weight: '70 kg' },
      { name: 'Curl Bíceps Barra', sets: 3, reps: '12', weight: '40 kg' },
      { name: 'Face Pull', sets: 3, reps: '15', weight: '15 kg' },
    ],
  },
  {
    id: '3',
    name: 'Piernas – Cuádriceps y Glúteos',
    date: 'Jue, 15 May 2026',
    duration: '65 min',
    volume: '12,300 kg',
    exercises: 7,
    sets: 22,
    emoji: '🦵',
    exercises_detail: [
      { name: 'Sentadilla', sets: 5, reps: '5', weight: '100 kg' },
      { name: 'Prensa de Piernas', sets: 4, reps: '12', weight: '180 kg' },
      { name: 'Extensión de Cuádriceps', sets: 3, reps: '15', weight: '50 kg' },
      { name: 'Hip Thrust', sets: 4, reps: '10', weight: '80 kg' },
    ],
  },
  {
    id: '4',
    name: 'Full Body – Fuerza',
    date: 'Lun, 12 May 2026',
    duration: '70 min',
    volume: '10,100 kg',
    exercises: 6,
    sets: 20,
    emoji: '🔥',
    exercises_detail: [
      { name: 'Peso Muerto', sets: 4, reps: '5', weight: '120 kg' },
      { name: 'Press Militar', sets: 4, reps: '8', weight: '55 kg' },
      { name: 'Dominadas', sets: 3, reps: '8', weight: 'Peso corp.' },
    ],
  },
];

// ─── Sesión activa de ejemplo (Pantalla Entrenar) ─────────────────────────────
export const mockActiveSession = {
  name: 'Empuje – Pecho y Tríceps',
  template: 'PPL Push Day A',
  exercises: [
    {
      id: 'e1',
      name: 'Press Banca con Barra',
      muscle: 'Pecho',
      sets: [
        { setNum: 1, reps: 8, weight: 80, done: false },
        { setNum: 2, reps: 8, weight: 80, done: false },
        { setNum: 3, reps: 6, weight: 85, done: false },
        { setNum: 4, reps: 6, weight: 85, done: false },
      ],
    },
    {
      id: 'e2',
      name: 'Press Inclinado con Mancuernas',
      muscle: 'Pecho Superior',
      sets: [
        { setNum: 1, reps: 10, weight: 28, done: false },
        { setNum: 2, reps: 10, weight: 28, done: false },
        { setNum: 3, reps: 8, weight: 30, done: false },
      ],
    },
    {
      id: 'e3',
      name: 'Fondos en Paralelas',
      muscle: 'Tríceps / Pecho',
      sets: [
        { setNum: 1, reps: 12, weight: 0, done: false },
        { setNum: 2, reps: 10, weight: 0, done: false },
        { setNum: 3, reps: 10, weight: 0, done: false },
      ],
    },
    {
      id: 'e4',
      name: 'Extensión Tríceps en Polea',
      muscle: 'Tríceps',
      sets: [
        { setNum: 1, reps: 15, weight: 18, done: false },
        { setNum: 2, reps: 15, weight: 20, done: false },
        { setNum: 3, reps: 12, weight: 22, done: false },
      ],
    },
  ],
};

// ─── Biblioteca de ejercicios ─────────────────────────────────────────────────
export const muscleGroups = [
  'Todos',
  'Pecho',
  'Espalda',
  'Piernas',
  'Hombros',
  'Brazos',
  'Core',
];

export const equipment = ['Todo', 'Barra', 'Mancuernas', 'Máquina', 'Polea', 'Peso Corporal', 'Kettlebell'];

export const mockExercises = [
  {
    id: 'x1',
    name: 'Press de Banca',
    muscle: 'Pecho',
    equipment: 'Barra',
    difficulty: 'Intermedio',
    emoji: '🏋️',
    description: 'Acuéstate en un banco plano. Sujeta la barra con las manos ligeramente más abiertas que el ancho de los hombros. Baja la barra de forma controlada hacia la parte media del pecho y empújala con fuerza hacia arriba extendiendo los brazos sin bloquear los codos.',
    secondaryMuscles: ['Tríceps', 'Hombro Anterior'],
    benefits: ['Aumento de fuerza y masa muscular en el pectoral.', 'Mejora de la fuerza de empuje del tren superior.', 'Estabilidad en hombros y codos.']
  },
  {
    id: 'x2',
    name: 'Sentadilla con Barra',
    muscle: 'Piernas',
    equipment: 'Barra',
    difficulty: 'Avanzado',
    emoji: '🦵',
    description: 'Coloca la barra sobre los trapecios. Con los pies al ancho de los hombros y puntas ligeramente hacia afuera, desciende flexionando las caderas y rodillas como si fueras a sentarte. Mantén la espalda recta y baja hasta pasar los 90 grados. Empuja con los talones para volver a subir.',
    secondaryMuscles: ['Glúteos', 'Femoral', 'Core'],
    benefits: ['Desarrollo integral de la fuerza del tren inferior.', 'Estimula la producción hormonal de forma natural.', 'Mejora la densidad ósea y fuerza del core.']
  },
  {
    id: 'x3',
    name: 'Peso Muerto Convencional',
    muscle: 'Espalda',
    equipment: 'Barra',
    difficulty: 'Avanzado',
    emoji: '⚡',
    description: 'Colócate frente a la barra con los pies al ancho de las caderas. Flexiona la cadera y rodillas para sujetar la barra con agarre prono. Con la espalda completamente recta y la mirada al frente, levanta la barra extendiendo rodillas y caderas hasta quedar erguido, contrayendo glúteos y espalda alta.',
    secondaryMuscles: ['Piernas', 'Core', 'Glúteos'],
    benefits: ['Ejercicio definitivo para la cadena posterior.', 'Desarrolla fuerza de agarre excepcional.', 'Gran transferencia a la postura y actividades cotidianas.']
  },
  {
    id: 'x4',
    name: 'Dominadas Pronas',
    muscle: 'Espalda',
    equipment: 'Peso Corporal',
    difficulty: 'Intermedio',
    emoji: '💪',
    description: 'Cuélgate de una barra de dominadas con las palmas mirando hacia afuera (pronación), separadas más del ancho de los hombros. Tira de tu cuerpo hacia arriba concentrando el esfuerzo en los dorsales hasta que tu barbilla pase la barra. Desciende de manera controlada.',
    secondaryMuscles: ['Bíceps', 'Hombros'],
    benefits: ['Máximo desarrollo de la anchura de la espalda (dorsal ancho).', 'Fortalece los bíceps y antebrazos de forma natural.', 'Mejora la fuerza relativa del cuerpo entero.']
  },
  {
    id: 'x5',
    name: 'Press Militar con Barra',
    muscle: 'Hombros',
    equipment: 'Barra',
    difficulty: 'Intermedio',
    emoji: '🎯',
    description: 'De pie, sujeta la barra al nivel de los hombros con las manos ligeramente separadas. Mantén el abdomen y glúteos apretados. Empuja la barra directamente sobre tu cabeza hasta extender los brazos por completo. Evita arquear la espalda baja.',
    secondaryMuscles: ['Tríceps', 'Core'],
    benefits: ['Construcción de hombros fuertes y tridimensionales.', 'Mejora la estabilidad y fuerza general de pie.', 'Fortalecimiento de los músculos estabilizadores del core.']
  },
  {
    id: 'x6',
    name: 'Curl de Bíceps con Barra',
    muscle: 'Brazos',
    equipment: 'Barra',
    difficulty: 'Principiante',
    emoji: '💪',
    description: 'Sujeta una barra con las palmas hacia arriba (supinación) al ancho de tus hombros. Manteniendo los codos fijos a los lados del torso, levanta la barra hacia los hombros contrayendo los bíceps. Baja lentamente a la posición inicial sin balancear el torso.',
    secondaryMuscles: ['Antebrazos'],
    benefits: ['Aislamiento y desarrollo directo de los bíceps.', 'Mejora de la fuerza de flexión del codo.', 'Aumento de volumen en la porción anterior del brazo.']
  },
  {
    id: 'x7',
    name: 'Extensión de Tríceps en Polea',
    muscle: 'Brazos',
    equipment: 'Polea',
    difficulty: 'Principiante',
    emoji: '🔧',
    description: 'Colócate frente a la polea alta con una cuerda o barra corta. Sujeta el agarre, flexiona ligeramente las rodillas e inclina el torso. Con los codos pegados a las costillas, extiende los brazos hacia abajo apretando los tríceps al final del movimiento.',
    secondaryMuscles: ['Hombros'],
    benefits: ['Aislamiento excelente de las tres cabezas del tríceps.', 'Poca tensión en los codos comparado con pesos libres.', 'Tensión constante durante todo el rango del recorrido.']
  },
  {
    id: 'x8',
    name: 'Hip Thrust con Barra',
    muscle: 'Piernas',
    equipment: 'Barra',
    difficulty: 'Intermedio',
    emoji: '🍑',
    description: 'Apoya la espalda alta en un banco estable y coloca una barra acolchada sobre tu pelvis. Con los pies firmes en el suelo a 90 grados, empuja las caderas hacia arriba contrayendo fuertemente los glúteos hasta que el torso quede paralelo al suelo. Baja de manera controlada.',
    secondaryMuscles: ['Femoral', 'Core'],
    benefits: ['El mejor ejercicio para el desarrollo del glúteo mayor.', 'Mejora el rendimiento en sprints y saltos.', 'Baja compresión espinal en comparación con sentadillas.']
  },
  {
    id: 'x9',
    name: 'Plancha Abdominal',
    muscle: 'Core',
    equipment: 'Peso Corporal',
    difficulty: 'Principiante',
    emoji: '🧱',
    description: 'Colócate boca abajo apoyando los antebrazos y las puntas de los pies. Mantén el cuerpo en una línea recta perfecta desde la cabeza hasta los talones. Aprieta activamente el abdomen, los glúteos y los cuádriceps, evitando que la pelvis se caiga.',
    secondaryMuscles: ['Hombros', 'Glúteos'],
    benefits: ['Construye un core ultra resistente y estable.', 'Previene y alivia el dolor lumbar.', 'Mejora la postura corporal y equilibrio.']
  },
  {
    id: 'x10',
    name: 'Jalón al Pecho en Polea',
    muscle: 'Espalda',
    equipment: 'Polea',
    difficulty: 'Principiante',
    emoji: '🏋️',
    description: 'Siéntate en la máquina de jalón ajustando el soporte de rodillas. Sujeta la barra con agarre ancho prono. Tira de la barra hacia la parte superior de tu pecho, llevando los hombros y codos hacia abajo y atrás. Controla el regreso sintiendo el estiramiento.',
    secondaryMuscles: ['Bíceps', 'Hombros'],
    benefits: ['Excelente alternativa a las dominadas para ganar fuerza inicial.', 'Desarrolla la amplitud y musculatura de la espalda alta.', 'Bajo riesgo de lesión y fácil control del peso.']
  },
  {
    id: 'x11',
    name: 'Remo con Mancuerna a una Mano',
    muscle: 'Espalda',
    equipment: 'Mancuernas',
    difficulty: 'Principiante',
    emoji: '🚣',
    description: 'Apoya una rodilla y la misma mano sobre un banco plano. Con la espalda recta, sujeta una mancuerna con la mano libre. Lleva el codo hacia atrás y arriba pegado al cuerpo, jalando la mancuerna hacia tu cadera. Desciende controlando el peso.',
    secondaryMuscles: ['Bíceps', 'Hombros'],
    benefits: ['Corrige desequilibrios de fuerza entre el lado izquierdo y derecho.', 'Excelente trabajo de estabilización unilateral.', 'Permite un rango de movimiento profundo y seguro.']
  },
  {
    id: 'x12',
    name: 'Elevaciones Laterales',
    muscle: 'Hombros',
    equipment: 'Mancuernas',
    difficulty: 'Principiante',
    emoji: '✈️',
    description: 'De pie, sujeta una mancuerna en cada mano a los lados de los muslos. Con una ligera flexión en los codos, eleva los brazos lateralmente hasta que queden paralelos al suelo (altura del hombro). Baja lentamente las mancuernas a la posición inicial.',
    secondaryMuscles: ['Hombros Posterior'],
    benefits: ['Aísla la porción lateral del deltoides para dar aspecto ancho.', 'Mejora la estética del hombro (forma redonda).', 'Mejora la movilidad de la articulación del hombro.']
  },
  {
    id: 'x13',
    name: 'Prensa de Piernas Inclinada',
    muscle: 'Piernas',
    equipment: 'Máquina',
    difficulty: 'Principiante',
    emoji: '🦵',
    description: 'Siéntate en la prensa apoyando la espalda en el respaldo. Coloca los pies en la plataforma al ancho de los hombros. Quita los seguros y flexiona las rodillas a 90 grados controlando el peso. Empuja la plataforma con fuerza sin llegar a bloquear las rodillas.',
    secondaryMuscles: ['Glúteos', 'Femoral'],
    benefits: ['Permite cargar más peso de forma extremadamente segura.', 'Aislamiento máximo de los cuádriceps sin fatiga lumbar.', 'Ajuste fácil de posición de pies para enfocar diferentes zonas.']
  },
  {
    id: 'x14',
    name: 'Press Inclinado con Mancuernas',
    muscle: 'Pecho',
    equipment: 'Mancuernas',
    difficulty: 'Intermedio',
    emoji: '💪',
    description: 'Ajusta un banco a unos 30-45 grados. Siéntate con una mancuerna en cada mano apoyada en los muslos. Échate hacia atrás y empuja las mancuernas sobre tu pecho. Baja las mancuernas abriendo los codos a 45 grados hasta sentir estiramiento en el pecho superior, y empuja.',
    secondaryMuscles: ['Tríceps', 'Hombro Anterior'],
    benefits: ['Desarrollo del pectoral superior (pecho alto).', 'Mayor rango de movimiento y libertad articular que la barra.', 'Trabajo unilateral que evita desequilibrios musculares.']
  },
  {
    id: 'x15',
    name: 'Fondos en Paralelas',
    muscle: 'Brazos',
    equipment: 'Peso Corporal',
    difficulty: 'Intermedio',
    emoji: '⬇️',
    description: 'Apoya tus manos en las barras paralelas y eleva el cuerpo con los brazos extendidos. Flexiona los codos descendiendo el cuerpo con un ligero ángulo inclinado hacia adelante hasta que tus hombros pasen la altura del codo. Empuja con fuerza usando tus tríceps y pectorales.',
    secondaryMuscles: ['Pecho', 'Hombros'],
    benefits: ['Ejercicio de empuje de gran efectividad para tríceps y pecho bajo.', 'Desarrolla fuerza en estiramiento máximo.', 'Gran capacidad de sobrecarga añadiendo lastre.']
  },
  {
    id: 'x16',
    name: 'Curl de Bíceps Martillo',
    muscle: 'Brazos',
    equipment: 'Mancuernas',
    difficulty: 'Principiante',
    emoji: '🔨',
    description: 'Sujeta las mancuernas a los lados con agarre neutro (las palmas se miran entre sí). Eleva las mancuernas manteniendo este agarre sin rotar las muñecas. Contrae activamente el bíceps y braquial. Baja controladamente.',
    secondaryMuscles: ['Antebrazos'],
    benefits: ['Desarrollo del braquiorradial y braquial, dando grosor al brazo.', 'Menor estrés en la muñeca que el curl supino.', 'Fortalecimiento directo del agarre de la mano.']
  },
  {
    id: 'x17',
    name: 'Zancadas con Mancuernas',
    muscle: 'Piernas',
    equipment: 'Mancuernas',
    difficulty: 'Principiante',
    emoji: '🚶',
    description: 'De pie, sujeta una mancuerna en cada mano. Da un paso largo al frente flexionando ambas rodillas. La rodilla trasera debe quedar a centímetros del suelo y la delantera no debe pasar la punta del pie. Empuja con el pie delantero para regresar y repite con la otra pierna.',
    secondaryMuscles: ['Glúteos', 'Femoral', 'Core'],
    benefits: ['Excelente trabajo de equilibrio, coordinación y estabilidad.', 'Entrenamiento unilateral que previene compensaciones musculares.', 'Gran activación de glúteos y cuádriceps de forma dinámica.']
  },
  {
    id: 'x18',
    name: 'Face Pull en Polea',
    muscle: 'Hombros',
    equipment: 'Polea',
    difficulty: 'Principiante',
    emoji: '🎯',
    description: 'Coloca la polea a la altura de tu rostro con un agarre de cuerda doble. Sujeta la cuerda con las manos enfrentadas. Da un paso atrás, flexiona rodillas y jala la cuerda hacia tu frente abriendo los codos y rotando las manos hacia afuera para apretar los deltoides posteriores.',
    secondaryMuscles: ['Espalda Alta', 'Rotadores'],
    benefits: ['Fortalece el deltoides posterior y la musculatura escapular.', 'Fundamental para corregir hombros adelantados (cifosis).', 'Salud del manguito rotador y estabilidad de hombros.']
  },
  {
    id: 'x19',
    name: 'Swing con Kettlebell',
    muscle: 'Piernas',
    equipment: 'Kettlebell',
    difficulty: 'Intermedio',
    emoji: '🏑',
    description: 'Con los pies un poco más anchos que las caderas, sujeta la kettlebell al frente con ambas manos. Flexiona ligeramente las rodillas e inclina la cadera empujándola hacia atrás. Impulsa de forma explosiva las caderas hacia adelante para balancear la kettlebell a la altura del pecho sin usar los brazos.',
    secondaryMuscles: ['Glúteos', 'Espalda', 'Core'],
    benefits: ['Desarrollo de potencia y explosividad en la cadera.', 'Excelente ejercicio híbrido de fuerza y cardio.', 'Gran quemador de calorías y activador del metabolismo.']
  },
  {
    id: 'x20',
    name: 'Rueda Abdominal',
    muscle: 'Core',
    equipment: 'Peso Corporal',
    difficulty: 'Avanzado',
    emoji: '🎡',
    description: 'Arrodíllate en el suelo y sujeta los mangos de la rueda. Con el core ultra apretado y la espalda redondeada, rueda hacia adelante estirando los brazos y extendiendo la cadera de forma controlada hasta donde puedas mantener la tensión sin arquear la espalda baja. Regresa tirando con el abdomen.',
    secondaryMuscles: ['Hombros', 'Dorsal'],
    benefits: ['Uno de los ejercicios de core con mayor activación abdominal comprobada.', 'Desarrolla fuerza anti-extensión extrema.', 'Fortalece la conexión neuromuscular del torso completo.']
  }
];

// ─── Info para el Dashboard (Inicio) ─────────────────────────────────────────
export const mockDashboard = {
  lastWorkout: mockHistory[0],
  workoutsThisWeek: 3,
  weeklyGoal: 4,
  currentRestPreset: '90 seg',
  recentExercises: mockExercises.slice(0, 4),
};
