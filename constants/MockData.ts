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
  'Hombros',
  'Bíceps',
  'Tríceps',
  'Piernas',
  'Glúteos',
  'Core',
];

export const equipment = ['Todo', 'Barra', 'Mancuernas', 'Máquina', 'Polea', 'Peso Corporal', 'Kettlebell'];

export const mockExercises = [
  { id: 'x1', name: 'Press Banca', muscle: 'Pecho', equipment: 'Barra', difficulty: 'Intermedio', emoji: '🏋️' },
  { id: 'x2', name: 'Sentadilla', muscle: 'Piernas', equipment: 'Barra', difficulty: 'Avanzado', emoji: '🦵' },
  { id: 'x3', name: 'Peso Muerto', muscle: 'Espalda', equipment: 'Barra', difficulty: 'Avanzado', emoji: '⚡' },
  { id: 'x4', name: 'Dominadas', muscle: 'Espalda', equipment: 'Peso Corporal', difficulty: 'Intermedio', emoji: '💪' },
  { id: 'x5', name: 'Press Militar', muscle: 'Hombros', equipment: 'Barra', difficulty: 'Intermedio', emoji: '🎯' },
  { id: 'x6', name: 'Curl Bíceps con Barra', muscle: 'Bíceps', equipment: 'Barra', difficulty: 'Principiante', emoji: '💪' },
  { id: 'x7', name: 'Extensión Tríceps Polea', muscle: 'Tríceps', equipment: 'Polea', difficulty: 'Principiante', emoji: '🔧' },
  { id: 'x8', name: 'Hip Thrust', muscle: 'Glúteos', equipment: 'Barra', difficulty: 'Intermedio', emoji: '🍑' },
  { id: 'x9', name: 'Plancha', muscle: 'Core', equipment: 'Peso Corporal', difficulty: 'Principiante', emoji: '🧱' },
  { id: 'x10', name: 'Jalón al Pecho', muscle: 'Espalda', equipment: 'Polea', difficulty: 'Principiante', emoji: '🏋️' },
  { id: 'x11', name: 'Remo con Mancuerna', muscle: 'Espalda', equipment: 'Mancuernas', difficulty: 'Principiante', emoji: '🚣' },
  { id: 'x12', name: 'Elevaciones Laterales', muscle: 'Hombros', equipment: 'Mancuernas', difficulty: 'Principiante', emoji: '✈️' },
  { id: 'x13', name: 'Prensa de Piernas', muscle: 'Piernas', equipment: 'Máquina', difficulty: 'Principiante', emoji: '🦵' },
  { id: 'x14', name: 'Press Inclinado DB', muscle: 'Pecho', equipment: 'Mancuernas', difficulty: 'Intermedio', emoji: '💪' },
  { id: 'x15', name: 'Fondos en Paralelas', muscle: 'Tríceps', equipment: 'Peso Corporal', difficulty: 'Intermedio', emoji: '⬇️' },
  { id: 'x16', name: 'Curl Martillo', muscle: 'Bíceps', equipment: 'Mancuernas', difficulty: 'Principiante', emoji: '🔨' },
  { id: 'x17', name: 'Zancadas', muscle: 'Piernas', equipment: 'Mancuernas', difficulty: 'Principiante', emoji: '🚶' },
  { id: 'x18', name: 'Face Pull', muscle: 'Hombros', equipment: 'Polea', difficulty: 'Principiante', emoji: '🎯' },
  { id: 'x19', name: 'Swing con Kettlebell', muscle: 'Glúteos', equipment: 'Kettlebell', difficulty: 'Intermedio', emoji: '🏑' },
  { id: 'x20', name: 'Crunch Abdominal', muscle: 'Core', equipment: 'Peso Corporal', difficulty: 'Principiante', emoji: '🧘' },
];

// ─── Info para el Dashboard (Inicio) ─────────────────────────────────────────
export const mockDashboard = {
  lastWorkout: mockHistory[0],
  workoutsThisWeek: 3,
  weeklyGoal: 4,
  currentRestPreset: '90 seg',
  recentExercises: mockExercises.slice(0, 4),
};
