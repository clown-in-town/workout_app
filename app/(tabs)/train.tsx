import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  StatusBar, TextInput, Modal, FlatList, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useWorkout, WorkoutExercise } from '@/context/WorkoutContext';
import { mockExercises, muscleGroups } from '@/constants/MockData';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// ─── Rutinas Predefinidas (Plantillas) ──────────────────────────────────────────

const ROUTINE_TEMPLATES = [
  {
    name: 'Rutina: Torso',
    desc: 'Empuje y tracción de calidad para el tren superior.',
    emoji: '💪',
    exercises: [
      { name: 'Press de Banca', muscle: 'Pecho', equipment: 'Barra', emoji: '🏋️', setsCount: 3, reps: '10', weight: '50' },
      { name: 'Dominadas Pronas', muscle: 'Espalda', equipment: 'Peso Corporal', emoji: '💪', setsCount: 3, reps: '8', weight: '0' },
      { name: 'Press Militar con Barra', muscle: 'Hombros', equipment: 'Barra', emoji: '🎯', setsCount: 3, reps: '10', weight: '30' },
      { name: 'Curl de Bíceps con Barra', muscle: 'Brazos', equipment: 'Barra', emoji: '💪', setsCount: 3, reps: '12', weight: '20' },
    ]
  },
  {
    name: 'Rutina: Pierna',
    desc: 'Enfoque integral en cuádriceps, glúteos y femoral.',
    emoji: '🦵',
    exercises: [
      { name: 'Sentadilla con Barra', muscle: 'Piernas', equipment: 'Barra', emoji: '🦵', setsCount: 4, reps: '10', weight: '60' },
      { name: 'Prensa de Piernas Inclinada', muscle: 'Piernas', equipment: 'Máquina', emoji: '🦵', setsCount: 3, reps: '12', weight: '100' },
      { name: 'Hip Thrust con Barra', muscle: 'Piernas', equipment: 'Barra', emoji: '🍑', setsCount: 3, reps: '10', weight: '50' },
      { name: 'Zancadas con Mancuernas', muscle: 'Piernas', equipment: 'Mancuernas', emoji: '🚶', setsCount: 3, reps: '12', weight: '12' },
    ]
  },
  {
    name: 'Rutina: Push (Empuje)',
    desc: 'Musculación enfocada en pecho, hombros y tríceps.',
    emoji: '⚡',
    exercises: [
      { name: 'Press de Banca', muscle: 'Pecho', equipment: 'Barra', emoji: '🏋️', setsCount: 4, reps: '8', weight: '60' },
      { name: 'Press Inclinado con Mancuernas', muscle: 'Pecho', equipment: 'Mancuernas', emoji: '💪', setsCount: 3, reps: '10', weight: '24' },
      { name: 'Press Militar con Barra', muscle: 'Hombros', equipment: 'Barra', emoji: '🎯', setsCount: 3, reps: '10', weight: '35' },
      { name: 'Fondos en Paralelas', muscle: 'Brazos', equipment: 'Peso Corporal', emoji: '⬇️', setsCount: 3, reps: '10', weight: '0' },
    ]
  },
  {
    name: 'Rutina: Pull (Tracción)',
    desc: 'Musculación enfocada en espalda alta y bíceps.',
    emoji: '🎣',
    exercises: [
      { name: 'Peso Muerto Convencional', muscle: 'Espalda', equipment: 'Barra', emoji: '⚡', setsCount: 3, reps: '8', weight: '80' },
      { name: 'Jalón al Pecho en Polea', muscle: 'Espalda', equipment: 'Polea', emoji: '🏋️', setsCount: 3, reps: '10', weight: '50' },
      { name: 'Remo con Mancuerna a una Mano', muscle: 'Espalda', equipment: 'Mancuernas', emoji: '🚣', setsCount: 3, reps: '10', weight: '22' },
      { name: 'Curl de Bíceps Martillo', muscle: 'Brazos', equipment: 'Mancuernas', emoji: '🔨', setsCount: 3, reps: '12', weight: '14' },
    ]
  },
  {
    name: 'Rutina: Full Body',
    desc: 'Estímulo general de fuerza para todo el cuerpo.',
    emoji: '🔥',
    exercises: [
      { name: 'Sentadilla con Barra', muscle: 'Piernas', equipment: 'Barra', emoji: '🦵', setsCount: 3, reps: '10', weight: '50' },
      { name: 'Press de Banca', muscle: 'Pecho', equipment: 'Barra', emoji: '🏋️', setsCount: 3, reps: '10', weight: '50' },
      { name: 'Dominadas Pronas', muscle: 'Espalda', equipment: 'Peso Corporal', emoji: '💪', setsCount: 3, reps: '8', weight: '0' },
      { name: 'Plancha Abdominal', muscle: 'Core', equipment: 'Peso Corporal', emoji: '🧱', setsCount: 3, reps: '1', weight: '0' },
    ]
  }
];

// ─── Exercise Picker Modal ────────────────────────────────────────────────────

function ExercisePickerModal({
  visible,
  onClose,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (ex: Omit<WorkoutExercise, 'id' | 'sets'>) => void;
}) {
  const [search, setSearch] = useState('');
  const [muscle, setMuscle] = useState('Todos');
  const [customName, setCustomName] = useState('');
  const [tab, setTab] = useState<'library' | 'custom'>('library');

  const filtered = mockExercises.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
    const matchMuscle = muscle === 'Todos' || e.muscle === muscle;
    return matchSearch && matchMuscle;
  });

  const handleSelect = (ex: typeof mockExercises[0]) => {
    onSelect({ name: ex.name, muscle: ex.muscle, equipment: ex.equipment, emoji: ex.emoji });
    setSearch(''); setMuscle('Todos');
    onClose();
  };

  const handleCustom = () => {
    if (!customName.trim()) return;
    onSelect({ name: customName.trim(), muscle: 'Personalizado', equipment: '-', emoji: '🏋️' });
    setCustomName('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={ps.overlay}>
        <View style={ps.sheet}>
          <View style={ps.handle} />
          <View style={ps.header}>
            <Text style={ps.title}>Añadir Ejercicio</Text>
            <TouchableOpacity onPress={onClose} style={ps.closeBtn}>
              <Ionicons name="close" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={ps.tabs}>
            {(['library', 'custom'] as const).map((t) => (
              <TouchableOpacity key={t} style={[ps.tabBtn, tab === t && ps.tabBtnActive]} onPress={() => setTab(t)}>
                <Text style={[ps.tabText, tab === t && ps.tabTextActive]}>
                  {t === 'library' ? 'Biblioteca' : 'Personalizado'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {tab === 'library' ? (
            <>
              <TextInput
                style={ps.searchInput}
                placeholder="Buscar ejercicio..."
                placeholderTextColor={Colors.textMuted}
                value={search}
                onChangeText={setSearch}
              />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={ps.muscleScroll}>
                {muscleGroups.map((g) => (
                  <TouchableOpacity key={g} style={[ps.chip, muscle === g && ps.chipActive]} onPress={() => setMuscle(g)}>
                    <Text style={[ps.chipText, muscle === g && ps.chipTextActive]}>{g}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <FlatList
                data={filtered}
                keyExtractor={(i) => i.id}
                style={{ maxHeight: 340 }}
                renderItem={({ item }) => (
                  <TouchableOpacity style={ps.exRow} onPress={() => handleSelect(item)}>
                    <Text style={ps.exEmoji}>{item.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={ps.exName}>{item.name}</Text>
                      <Text style={ps.exMeta}>{item.muscle} · {item.equipment}</Text>
                    </View>
                    <Ionicons name="add-circle" size={24} color={Colors.accent} />
                  </TouchableOpacity>
                )}
              />
            </>
          ) : (
            <View style={ps.customWrap}>
              <Text style={ps.customLabel}>Nombre del ejercicio</Text>
              <TextInput
                style={ps.customInput}
                placeholder="Ej: Curl predicador"
                placeholderTextColor={Colors.textMuted}
                value={customName}
                onChangeText={setCustomName}
                returnKeyType="done"
                onSubmitEditing={handleCustom}
              />
              <TouchableOpacity style={[ps.addCustomBtn, !customName.trim() && ps.addCustomBtnDisabled]} onPress={handleCustom}>
                <Text style={ps.addCustomText}>Añadir ejercicio</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

// ─── Summary Modal ────────────────────────────────────────────────────────────

function SummaryModal({ visible, elapsed, onClose }: { visible: boolean; elapsed: number; onClose: () => void }) {
  const { state, finishSession } = useWorkout();
  const session = state.session;
  if (!session) return null;

  const totalSets = session.exercises.reduce((a, e) => a + e.sets.length, 0);
  const doneSets = session.exercises.reduce((a, e) => a + e.sets.filter((s) => s.done).length, 0);
  let volume = 0;
  session.exercises.forEach((e) => e.sets.forEach((s) => { volume += (parseFloat(s.weight) || 0) * (parseFloat(s.reps) || 0); }));

  const handleFinish = () => { finishSession(); onClose(); };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={sm.overlay}>
        <View style={sm.sheet}>
          <View style={sm.handle} />
          <Text style={sm.emoji}>🏁</Text>
          <Text style={sm.title}>{session.workoutName || '¡Entrenamiento terminado!'}</Text>
          <Text style={sm.subtitle}>{formatElapsed(elapsed)} de trabajo duro</Text>
          <View style={sm.statsRow}>
            {[
              { label: 'Ejercicios', value: String(session.exercises.length) },
              { label: 'Series', value: `${doneSets}/${totalSets}` },
              { label: 'Volumen', value: `${volume.toFixed(0)} kg` },
            ].map((s) => (
              <View key={s.label} style={sm.stat}>
                <Text style={sm.statValue}>{s.value}</Text>
                <Text style={sm.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={sm.saveBtn} onPress={handleFinish}>
            <Ionicons name="checkmark-done" size={18} color={Colors.background} />
            <Text style={sm.saveBtnText}>Guardar en historial</Text>
          </TouchableOpacity>
          <TouchableOpacity style={sm.backBtn} onPress={onClose}>
            <Text style={sm.backBtnText}>Seguir entrenando</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─── Set Row ──────────────────────────────────────────────────────────────────

function SetRow({
  setNum, set, exerciseId,
}: { setNum: number; set: { id: string; reps: string; weight: string; done: boolean }; exerciseId: string }) {
  const { updateSet, toggleSet, removeSet } = useWorkout();
  const [showDelete, setShowDelete] = useState(false);

  return (
    <View style={[sr.row, set.done && sr.rowDone]}>
      <TouchableOpacity onLongPress={() => setShowDelete((v) => !v)} onPress={() => setShowDelete(false)}>
        <View style={sr.numBox}>
          {showDelete
            ? <Ionicons name="trash" size={14} color={Colors.danger} />
            : <Text style={sr.num}>{setNum}</Text>}
        </View>
      </TouchableOpacity>

      {showDelete ? (
        <TouchableOpacity style={sr.deleteBtn} onPress={() => removeSet(exerciseId, set.id)}>
          <Text style={sr.deleteBtnText}>Eliminar serie</Text>
        </TouchableOpacity>
      ) : (
        <>
          <View style={[sr.input, { flex: 1 }]}>
            <TextInput
              style={sr.inputText}
              value={set.reps}
              keyboardType="numeric"
              selectTextOnFocus
              editable={!set.done}
              onChangeText={(v) => updateSet(exerciseId, set.id, 'reps', v)}
              placeholderTextColor={Colors.textMuted}
            />
          </View>
          <Text style={sr.separator}>×</Text>
          <View style={[sr.input, { flex: 1.3 }]}>
            <TextInput
              style={sr.inputText}
              value={set.weight === '0' ? '' : set.weight}
              keyboardType="numeric"
              selectTextOnFocus
              editable={!set.done}
              placeholder="kg"
              onChangeText={(v) => updateSet(exerciseId, set.id, 'weight', v)}
              placeholderTextColor={Colors.textMuted}
            />
          </View>
          <TouchableOpacity style={sr.doneBtn} onPress={() => toggleSet(exerciseId, set.id)}>
            <Ionicons
              name={set.done ? 'checkmark-circle' : 'ellipse-outline'}
              size={28}
              color={set.done ? Colors.accent : Colors.textMuted}
            />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

// ─── Exercise Card ────────────────────────────────────────────────────────────

function ExerciseCard({ exercise }: { exercise: WorkoutExercise }) {
  const { addSet, removeExercise } = useWorkout();
  const done = exercise.sets.filter((s) => s.done).length;

  return (
    <View style={ec.card}>
      <View style={ec.header}>
        <Text style={ec.emoji}>{exercise.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={ec.name}>{exercise.name}</Text>
          <Text style={ec.muscle}>{exercise.muscle}</Text>
        </View>
        <View style={ec.progress}>
          <Text style={ec.progressText}>{done}/{exercise.sets.length}</Text>
        </View>
        <TouchableOpacity onPress={() => removeExercise(exercise.id)} style={ec.deleteExBtn}>
          <Ionicons name="trash-outline" size={16} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>

      <View style={ec.colHeaders}>
        <Text style={[ec.col, { width: 32 }]}>#</Text>
        <Text style={[ec.col, { flex: 1 }]}>Reps</Text>
        <Text style={[ec.col, { width: 14 }]} />
        <Text style={[ec.col, { flex: 1.3 }]}>Peso</Text>
        <Text style={[ec.col, { width: 36 }]}>✓</Text>
      </View>

      {exercise.sets.map((s, i) => (
        <SetRow key={s.id} setNum={i + 1} set={s} exerciseId={exercise.id} />
      ))}

      <TouchableOpacity style={ec.addSet} onPress={() => addSet(exercise.id)}>
        <Ionicons name="add" size={15} color={Colors.accent} />
        <Text style={ec.addSetText}>Añadir serie</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({
  onStart,
  onLoadRoutine
}: {
  onStart: () => void;
  onLoadRoutine: (routine: typeof ROUTINE_TEMPLATES[0]) => void;
}) {
  return (
    <ScrollView style={es.scroll} contentContainerStyle={es.scrollContent} showsVerticalScrollIndicator={false}>
      <Text style={es.screenTitle}>Comenzar Entrenamiento</Text>
      <Text style={es.screenSubtitle}>Selecciona un entrenamiento libre o carga una plantilla predefinida.</Text>

      {/* Manual training card */}
      <View style={es.manualCard}>
        <View style={es.manualHeader}>
          <Text style={es.manualEmoji}>📝</Text>
          <View style={{ flex: 1 }}>
            <Text style={es.manualTitle}>Entrenamiento Libre</Text>
            <Text style={es.manualDesc}>Comienza una sesión vacía y registra tus ejercicios sobre la marcha.</Text>
          </View>
        </View>
        <TouchableOpacity style={es.manualBtn} onPress={onStart}>
          <Ionicons name="play" size={16} color={Colors.background} />
          <Text style={es.manualBtnText}>Empezar entrenamiento vacío</Text>
        </TouchableOpacity>
      </View>

      {/* Templates Heading */}
      <Text style={es.routinesTitle}>Plantillas de Rutina</Text>

      {/* Templates Grid / List */}
      {ROUTINE_TEMPLATES.map((routine) => (
        <View key={routine.name} style={es.routineCard}>
          <View style={es.routineHeader}>
            <View style={es.routineIcon}>
              <Text style={es.routineEmoji}>{routine.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={es.routineName}>{routine.name}</Text>
              <Text style={es.routineDesc}>{routine.desc}</Text>
            </View>
          </View>

          {/* Exercise Preview */}
          <View style={es.exercisePreviewWrapper}>
            {routine.exercises.map((ex, idx) => (
              <View key={idx} style={es.previewChip}>
                <Text style={es.previewChipText}>
                  {ex.emoji} {ex.name} ({ex.setsCount}s)
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={es.loadBtn} onPress={() => onLoadRoutine(routine)}>
            <Ionicons name="flash-outline" size={15} color={Colors.background} />
            <Text style={es.loadBtnText}>Cargar Plantilla</Text>
          </TouchableOpacity>
        </View>
      ))}
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function TrainScreen() {
  const { state, startSession, cancelSession, addExercise } = useWorkout();
  const { session } = state;

  const [elapsed, setElapsed] = useState(0);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [summaryVisible, setSummaryVisible] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (session) {
      setElapsed(Math.floor((Date.now() - session.startTime) / 1000));
      intervalRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    } else {
      setElapsed(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [session?.startTime]);

  const handleCancel = useCallback(() => {
    Alert.alert(
      'Cancelar entrenamiento',
      '¿Seguro? Se perderán todos los datos de la sesión actual.',
      [
        { text: 'Seguir entrenando', style: 'cancel' },
        { text: 'Cancelar sesión', style: 'destructive', onPress: cancelSession },
      ]
    );
  }, [cancelSession]);

  const handleLoadRoutine = useCallback((routine: typeof ROUTINE_TEMPLATES[0]) => {
    const exercises = routine.exercises.map((ex) => {
      const sets = Array.from({ length: ex.setsCount }).map(() => ({
        id: Math.random().toString(36).slice(2, 9),
        reps: ex.reps,
        weight: ex.weight,
        done: false,
      }));

      return {
        id: Math.random().toString(36).slice(2, 9),
        name: ex.name,
        muscle: ex.muscle,
        equipment: ex.equipment,
        emoji: ex.emoji,
        sets,
      };
    });

    startSession(routine.name, exercises);
  }, [startSession]);

  if (!session) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
        <EmptyState
          onStart={() => startSession('Entrenamiento Libre', [])}
          onLoadRoutine={handleLoadRoutine}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {session.workoutName || 'Entrenamiento'}
            </Text>
            <Text style={styles.headerSub}>{session.exercises.length} ejercicio{session.exercises.length !== 1 ? 's' : ''}</Text>
          </View>
          <View style={styles.timerBadge}>
            <Ionicons name="time-outline" size={14} color={Colors.accent} />
            <Text style={styles.timerText}>{formatElapsed(elapsed)}</Text>
          </View>
        </View>

        {/* Exercises */}
        {session.exercises.map((ex) => (
          <ExerciseCard key={ex.id} exercise={ex} />
        ))}

        {/* Add exercise */}
        <TouchableOpacity style={styles.addExBtn} onPress={() => setPickerVisible(true)}>
          <Ionicons name="add-circle-outline" size={20} color={Colors.accent} />
          <Text style={styles.addExText}>Agregar ejercicio</Text>
        </TouchableOpacity>

        {/* Session actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.finishBtn} onPress={() => setSummaryVisible(true)}>
            <Ionicons name="checkmark-done" size={18} color={Colors.background} />
            <Text style={styles.finishText}>Terminar</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>

      <ExercisePickerModal
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onSelect={(ex) => { addExercise(ex); setPickerVisible(false); }}
      />
      <SummaryModal
        visible={summaryVisible}
        elapsed={elapsed}
        onClose={() => setSummaryVisible(false)}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: 20, paddingTop: 56 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.text, letterSpacing: -0.5 },
  headerSub: { fontSize: 13, color: Colors.textSecondary, marginTop: 3 },
  timerBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.accentMuted, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 7 },
  timerText: { fontSize: 16, fontWeight: '800', color: Colors.accent, fontVariant: ['tabular-nums'] },
  addExBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.surface, borderRadius: 16, paddingVertical: 14, marginBottom: 16, borderWidth: 1, borderColor: Colors.surfaceBorder },
  addExText: { fontSize: 15, color: Colors.accent, fontWeight: '700' },
  actions: { flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, paddingVertical: 16, borderRadius: 16, alignItems: 'center', backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.surfaceBorder },
  cancelText: { fontSize: 15, fontWeight: '700', color: Colors.textSecondary },
  finishBtn: { flex: 2, paddingVertical: 16, borderRadius: 16, alignItems: 'center', backgroundColor: Colors.accent, flexDirection: 'row', justifyContent: 'center', gap: 8 },
  finishText: { fontSize: 15, fontWeight: '800', color: Colors.background },
});

// Exercise card styles
const ec = StyleSheet.create({
  card: { backgroundColor: Colors.surface, borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.surfaceBorder },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  emoji: { fontSize: 26 },
  name: { fontSize: 15, fontWeight: '700', color: Colors.text },
  muscle: { fontSize: 12, color: Colors.accent, fontWeight: '600', marginTop: 1 },
  progress: { backgroundColor: Colors.surfaceElevated, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
  progressText: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary },
  deleteExBtn: { padding: 6 },
  colHeaders: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 2, marginBottom: 6 },
  col: { fontSize: 11, fontWeight: '700', color: Colors.textMuted, textAlign: 'center' },
  addSet: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, marginTop: 4, borderRadius: 12, borderWidth: 1.5, borderStyle: 'dashed', borderColor: Colors.accent + '55' },
  addSetText: { fontSize: 13, color: Colors.accent, fontWeight: '600' },
});

// Set row styles
const sr = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 5, paddingHorizontal: 2, borderRadius: 10, marginBottom: 4 },
  rowDone: { backgroundColor: Colors.accentMuted },
  numBox: { width: 28, height: 28, borderRadius: 8, backgroundColor: Colors.surfaceElevated, alignItems: 'center', justifyContent: 'center' },
  num: { fontSize: 12, fontWeight: '800', color: Colors.textSecondary },
  input: { backgroundColor: Colors.surfaceElevated, borderRadius: 10, paddingVertical: 9, paddingHorizontal: 8 },
  inputText: { fontSize: 14, fontWeight: '600', color: Colors.text, textAlign: 'center' },
  separator: { fontSize: 14, color: Colors.textMuted, fontWeight: '600' },
  doneBtn: { width: 36, alignItems: 'center' },
  deleteBtn: { flex: 1, alignItems: 'center', paddingVertical: 8, backgroundColor: Colors.danger + '22', borderRadius: 10 },
  deleteBtnText: { fontSize: 13, color: Colors.danger, fontWeight: '700' },
});

// Empty state styles
const es = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 56 },
  screenTitle: { fontSize: 26, fontWeight: '800', color: Colors.text, letterSpacing: -0.5 },
  screenSubtitle: { fontSize: 13, color: Colors.textSecondary, marginTop: 4, marginBottom: 24 },

  manualCard: { backgroundColor: Colors.surface, borderRadius: 22, padding: 20, marginBottom: 28, borderWidth: 1, borderColor: Colors.surfaceBorder },
  manualHeader: { flexDirection: 'row', gap: 14, alignItems: 'center', marginBottom: 16 },
  manualEmoji: { fontSize: 32 },
  manualTitle: { fontSize: 16, fontWeight: '800', color: Colors.text },
  manualDesc: { fontSize: 12, color: Colors.textSecondary, marginTop: 2, lineHeight: 18 },
  manualBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: Colors.accent, borderRadius: 14, paddingVertical: 14 },
  manualBtnText: { color: Colors.background, fontSize: 14, fontWeight: '800' },

  routinesTitle: { fontSize: 16, fontWeight: '800', color: Colors.text, marginBottom: 16 },

  routineCard: { backgroundColor: Colors.surface, borderRadius: 22, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: Colors.surfaceBorder },
  routineHeader: { flexDirection: 'row', gap: 14, alignItems: 'center', marginBottom: 12 },
  routineIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.surfaceElevated, alignItems: 'center', justifyContent: 'center' },
  routineEmoji: { fontSize: 22 },
  routineName: { fontSize: 15, fontWeight: '800', color: Colors.text },
  routineDesc: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },

  exercisePreviewWrapper: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16, paddingHorizontal: 2 },
  previewChip: { backgroundColor: Colors.surfaceElevated, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5, borderWidth: 1, borderColor: Colors.surfaceBorder },
  previewChipText: { fontSize: 11, color: Colors.textSecondary, fontWeight: '600' },

  loadBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: Colors.accent, borderRadius: 12, paddingVertical: 11 },
  loadBtnText: { color: Colors.background, fontSize: 13, fontWeight: '800' },
});

// Picker modal styles
const ps = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: Colors.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, maxHeight: '90%' },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.surfaceBorder, alignSelf: 'center', marginBottom: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 18, fontWeight: '800', color: Colors.text },
  closeBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.surfaceElevated, alignItems: 'center', justifyContent: 'center' },
  tabs: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center', backgroundColor: Colors.surfaceElevated, borderWidth: 1.5, borderColor: Colors.surfaceBorder },
  tabBtnActive: { backgroundColor: Colors.accentMuted, borderColor: Colors.accent },
  tabText: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary },
  tabTextActive: { color: Colors.accent },
  searchInput: { backgroundColor: Colors.surfaceElevated, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: Colors.text, marginBottom: 10, borderWidth: 1, borderColor: Colors.surfaceBorder },
  muscleScroll: { maxHeight: 44, marginBottom: 12 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, backgroundColor: Colors.surfaceElevated, borderRadius: 20, marginRight: 8, borderWidth: 1.5, borderColor: Colors.surfaceBorder },
  chipActive: { backgroundColor: Colors.accentMuted, borderColor: Colors.accent },
  chipText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  chipTextActive: { color: Colors.accent },
  exRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.surfaceBorder },
  exEmoji: { fontSize: 24 },
  exName: { fontSize: 14, fontWeight: '700', color: Colors.text },
  exMeta: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  customWrap: { paddingTop: 8 },
  customLabel: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary, marginBottom: 10 },
  customInput: { backgroundColor: Colors.surfaceElevated, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14, fontSize: 15, color: Colors.text, borderWidth: 1, borderColor: Colors.surfaceBorder, marginBottom: 16 },
  addCustomBtn: { backgroundColor: Colors.accent, borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  addCustomBtnDisabled: { opacity: 0.4 },
  addCustomText: { fontSize: 15, fontWeight: '800', color: Colors.background },
});

// Summary modal styles
const sm = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: Colors.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 28, paddingBottom: 40, alignItems: 'center' },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.surfaceBorder, alignSelf: 'center', marginBottom: 24 },
  emoji: { fontSize: 52, marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '800', color: Colors.text, marginBottom: 6 },
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginBottom: 28 },
  statsRow: { flexDirection: 'row', gap: 0, width: '100%', backgroundColor: Colors.surfaceElevated, borderRadius: 18, paddingVertical: 20, marginBottom: 24, justifyContent: 'space-around' },
  stat: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 20, fontWeight: '800', color: Colors.accent },
  statLabel: { fontSize: 12, color: Colors.textSecondary, marginTop: 4, fontWeight: '600' },
  saveBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.accent, borderRadius: 18, paddingVertical: 17, paddingHorizontal: 32, width: '100%', justifyContent: 'center', marginBottom: 12 },
  saveBtnText: { fontSize: 16, fontWeight: '800', color: Colors.background },
  backBtn: { paddingVertical: 14 },
  backBtnText: { fontSize: 15, color: Colors.textSecondary, fontWeight: '600' },
});
