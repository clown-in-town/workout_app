import React, { createContext, useContext, useReducer, useState, useEffect, useCallback } from 'react';

// ─── Local Storage Helper ─────────────────────────────────────────────────────

const isWeb = typeof window !== 'undefined' && window.localStorage;

const saveToStorage = (key: string, data: any) => {
  if (isWeb) {
    try {
      window.localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn('Error saving to localStorage', e);
    }
  }
};

const loadFromStorage = (key: string, defaultValue: any) => {
  if (isWeb) {
    try {
      const val = window.localStorage.getItem(key);
      return val ? JSON.parse(val) : defaultValue;
    } catch (e) {
      console.warn('Error loading from localStorage', e);
      return defaultValue;
    }
  }
  return defaultValue;
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WorkoutSet {
  id: string;
  reps: string;
  weight: string;
  done: boolean;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  muscle: string;
  equipment: string;
  emoji: string;
  sets: WorkoutSet[];
}

export interface ActiveSession {
  startTime: number; // Date.now()
  exercises: WorkoutExercise[];
  workoutName?: string; // e.g. "Rutina: Torso", "Pierna", "Manual"
}

export interface HistoryEntry {
  id: string;
  date: string;        // formatted display date
  dateMs: number;      // for sorting
  duration: string;    // "52 min"
  durationMs: number;
  exercises: WorkoutExercise[];
  totalSets: number;
  totalVolume: number; // kg
  workoutName?: string; // template name
}

export interface ProgressLog {
  id: string;
  date: string;       // "20 May 2026"
  dateMs: number;     // timestamp
  weight: string;     // kg
  waist: string;      // cintura (cm)
  chest: string;      // pecho (cm)
  hip: string;        // cadera (cm)
  photo?: string;     // base64 image or preloaded url
}

// ─── State & Actions ─────────────────────────────────────────────────────────

interface State {
  session: ActiveSession | null;
  history: HistoryEntry[];
  progress: ProgressLog[];
}

type Action =
  | { type: 'START_SESSION'; workoutName?: string; exercises?: WorkoutExercise[] }
  | { type: 'ADD_EXERCISE'; exercise: WorkoutExercise }
  | { type: 'REMOVE_EXERCISE'; exerciseId: string }
  | { type: 'ADD_SET'; exerciseId: string }
  | { type: 'REMOVE_SET'; exerciseId: string; setId: string }
  | { type: 'UPDATE_SET'; exerciseId: string; setId: string; field: 'reps' | 'weight'; value: string }
  | { type: 'TOGGLE_SET'; exerciseId: string; setId: string }
  | { type: 'FINISH_SESSION'; entry: HistoryEntry }
  | { type: 'CANCEL_SESSION' }
  | { type: 'ADD_PROGRESS_LOG'; log: ProgressLog }
  | { type: 'DELETE_PROGRESS_LOG'; logId: string };

// Preloaded mock progress history
const defaultProgressLogs: ProgressLog[] = [
  {
    id: 'mock-p1',
    date: '20 Abr 2026',
    dateMs: Date.now() - 30 * 24 * 60 * 60 * 1000,
    weight: '82.5',
    waist: '92',
    chest: '104',
    hip: '106',
    photo: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&auto=format&fit=crop&q=60'
  },
  {
    id: 'mock-p2',
    date: '05 May 2026',
    dateMs: Date.now() - 15 * 24 * 60 * 60 * 1000,
    weight: '80.8',
    waist: '89',
    chest: '105',
    hip: '104',
    photo: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=60'
  },
];

const initialState: State = {
  session: null,
  history: loadFromStorage('workout_history', []),
  progress: loadFromStorage('workout_progress', defaultProgressLogs),
};

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

function makeDefaultSet(): WorkoutSet {
  return { id: uid(), reps: '10', weight: '0', done: false };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'START_SESSION':
      return {
        ...state,
        session: {
          startTime: Date.now(),
          exercises: action.exercises || [],
          workoutName: action.workoutName || 'Entrenamiento Libre',
        },
      };

    case 'ADD_EXERCISE':
      if (!state.session) return state;
      return {
        ...state,
        session: {
          ...state.session,
          exercises: [...state.session.exercises, action.exercise],
        },
      };

    case 'REMOVE_EXERCISE':
      if (!state.session) return state;
      return {
        ...state,
        session: {
          ...state.session,
          exercises: state.session.exercises.filter((e) => e.id !== action.exerciseId),
        },
      };

    case 'ADD_SET':
      if (!state.session) return state;
      return {
        ...state,
        session: {
          ...state.session,
          exercises: state.session.exercises.map((e) =>
            e.id === action.exerciseId
              ? { ...e, sets: [...e.sets, makeDefaultSet()] }
              : e
          ),
        },
      };

    case 'REMOVE_SET':
      if (!state.session) return state;
      return {
        ...state,
        session: {
          ...state.session,
          exercises: state.session.exercises.map((e) =>
            e.id === action.exerciseId
              ? { ...e, sets: e.sets.filter((s) => s.id !== action.setId) }
              : e
          ),
        },
      };

    case 'UPDATE_SET':
      if (!state.session) return state;
      return {
        ...state,
        session: {
          ...state.session,
          exercises: state.session.exercises.map((e) =>
            e.id === action.exerciseId
              ? {
                  ...e,
                  sets: e.sets.map((s) =>
                    s.id === action.setId ? { ...s, [action.field]: action.value } : s
                  ),
                }
              : e
          ),
        },
      };

    case 'TOGGLE_SET':
      if (!state.session) return state;
      return {
        ...state,
        session: {
          ...state.session,
          exercises: state.session.exercises.map((e) =>
            e.id === action.exerciseId
              ? {
                  ...e,
                  sets: e.sets.map((s) =>
                    s.id === action.setId ? { ...s, done: !s.done } : s
                  ),
                }
              : e
          ),
        },
      };

    case 'FINISH_SESSION': {
      const history = [action.entry, ...state.history];
      saveToStorage('workout_history', history);
      return {
        ...state,
        session: null,
        history,
      };
    }

    case 'CANCEL_SESSION':
      return { ...state, session: null };

    case 'ADD_PROGRESS_LOG': {
      const progress = [action.log, ...state.progress].sort((a, b) => b.dateMs - a.dateMs);
      saveToStorage('workout_progress', progress);
      return { ...state, progress };
    }

    case 'DELETE_PROGRESS_LOG': {
      const progress = state.progress.filter((p) => p.id !== action.logId);
      saveToStorage('workout_progress', progress);
      return { ...state, progress };
    }

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

export type RestStatus = 'idle' | 'running' | 'paused' | 'finished';

interface WorkoutContextValue {
  state: State;
  startSession: (workoutName?: string, exercises?: WorkoutExercise[]) => void;
  addExercise: (ex: Omit<WorkoutExercise, 'id' | 'sets'>) => void;
  removeExercise: (exerciseId: string) => void;
  addSet: (exerciseId: string) => void;
  removeSet: (exerciseId: string, setId: string) => void;
  updateSet: (exerciseId: string, setId: string, field: 'reps' | 'weight', value: string) => void;
  toggleSet: (exerciseId: string, setId: string) => void;
  finishSession: () => void;
  cancelSession: () => void;

  // Rest Timer State
  restPreset: number;
  restRemaining: number;
  restStatus: RestStatus;
  setRestPreset: (seconds: number) => void;
  startRest: () => void;
  pauseRest: () => void;
  resetRest: () => void;
  addRestTime: (seconds: number) => void;
  skipRest: () => void;

  // Progress Log Actions
  addProgressLog: (log: Omit<ProgressLog, 'id' | 'dateMs'>) => void;
  deleteProgressLog: (logId: string) => void;
}

const WorkoutContext = createContext<WorkoutContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Rest timer state
  const [restPreset, _setRestPreset] = useState(90);
  const [restRemaining, setRestRemaining] = useState(90);
  const [restStatus, setRestStatus] = useState<RestStatus>('idle');

  // Rest timer ticker
  useEffect(() => {
    let timer: any = null;
    if (restStatus === 'running') {
      timer = setInterval(() => {
        setRestRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setRestStatus('finished');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timer) clearInterval(timer);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [restStatus]);

  const startSession = useCallback((workoutName?: string, exercises?: WorkoutExercise[]) => {
    dispatch({ type: 'START_SESSION', workoutName, exercises });
  }, []);

  const addExercise = useCallback((ex: Omit<WorkoutExercise, 'id' | 'sets'>) => {
    const exercise: WorkoutExercise = {
      ...ex,
      id: uid(),
      sets: [makeDefaultSet(), makeDefaultSet(), makeDefaultSet()],
    };
    dispatch({ type: 'ADD_EXERCISE', exercise });
  }, []);

  const removeExercise = useCallback((exerciseId: string) =>
    dispatch({ type: 'REMOVE_EXERCISE', exerciseId }), []);

  const addSet = useCallback((exerciseId: string) =>
    dispatch({ type: 'ADD_SET', exerciseId }), []);

  const removeSet = useCallback((exerciseId: string, setId: string) =>
    dispatch({ type: 'REMOVE_SET', exerciseId, setId }), []);

  const updateSet = useCallback(
    (exerciseId: string, setId: string, field: 'reps' | 'weight', value: string) =>
      dispatch({ type: 'UPDATE_SET', exerciseId, setId, field, value }),
    []
  );

  const toggleSet = useCallback((exerciseId: string, setId: string) =>
    dispatch({ type: 'TOGGLE_SET', exerciseId, setId }), []);

  const finishSession = useCallback(() => {
    if (!state.session) return;
    const durationMs = Date.now() - state.session.startTime;
    const mins = Math.round(durationMs / 60000);

    let totalVolume = 0;
    let totalSets = 0;
    state.session.exercises.forEach((ex) => {
      ex.sets.forEach((s) => {
        totalSets++;
        const w = parseFloat(s.weight) || 0;
        const r = parseFloat(s.reps) || 0;
        totalVolume += w * r;
      });
    });

    const now = new Date();
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const dateStr = `${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

    const entry: HistoryEntry = {
      id: uid(),
      date: dateStr,
      dateMs: now.getTime(),
      duration: mins < 1 ? '< 1 min' : `${mins} min`,
      durationMs,
      exercises: state.session.exercises,
      totalSets,
      totalVolume,
      workoutName: state.session.workoutName || 'Entrenamiento Libre',
    };

    dispatch({ type: 'FINISH_SESSION', entry });
  }, [state.session]);

  const cancelSession = useCallback(() => dispatch({ type: 'CANCEL_SESSION' }), []);

  // Rest Actions
  const setRestPreset = useCallback((seconds: number) => {
    _setRestPreset(seconds);
    setRestRemaining(seconds);
    setRestStatus('idle');
  }, []);

  const startRest = useCallback(() => {
    setRestStatus((current) => {
      if (restRemaining === 0) {
        setRestRemaining(restPreset);
      }
      return 'running';
    });
  }, [restRemaining, restPreset]);

  const pauseRest = useCallback(() => {
    setRestStatus('paused');
  }, []);

  const resetRest = useCallback(() => {
    setRestStatus('idle');
    setRestRemaining(restPreset);
  }, [restPreset]);

  const addRestTime = useCallback((seconds: number) => {
    setRestRemaining((prev) => {
      const next = prev + seconds;
      setRestStatus((status) => {
        if (status === 'finished') {
          return 'paused';
        }
        return status;
      });
      return next;
    });
  }, []);

  const skipRest = useCallback(() => {
    setRestStatus('finished');
    setRestRemaining(0);
  }, []);

  // Progress Log Actions
  const addProgressLog = useCallback((log: Omit<ProgressLog, 'id' | 'dateMs'>) => {
    let dateMs = Date.now();
    if (log.date) {
      const parsed = Date.parse(log.date);
      if (!isNaN(parsed)) dateMs = parsed;
    }
    const fullLog: ProgressLog = {
      ...log,
      id: uid(),
      dateMs,
    };
    dispatch({ type: 'ADD_PROGRESS_LOG', log: fullLog });
  }, []);

  const deleteProgressLog = useCallback((logId: string) => {
    dispatch({ type: 'DELETE_PROGRESS_LOG', logId });
  }, []);

  return (
    <WorkoutContext.Provider
      value={{
        state,
        startSession,
        addExercise,
        removeExercise,
        addSet,
        removeSet,
        updateSet,
        toggleSet,
        finishSession,
        cancelSession,

        // Rest timer
        restPreset,
        restRemaining,
        restStatus,
        setRestPreset,
        startRest,
        pauseRest,
        resetRest,
        addRestTime,
        skipRest,

        // Progress
        addProgressLog,
        deleteProgressLog,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useWorkout(): WorkoutContextValue {
  const ctx = useContext(WorkoutContext);
  if (!ctx) throw new Error('useWorkout must be used inside WorkoutProvider');
  return ctx;
}
