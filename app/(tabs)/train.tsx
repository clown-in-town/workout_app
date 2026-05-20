import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { mockActiveSession } from '@/constants/MockData';

type SetItem = {
  setNum: number;
  reps: number;
  weight: number;
  done: boolean;
};

type Exercise = {
  id: string;
  name: string;
  muscle: string;
  sets: SetItem[];
};

function SessionHeader({ elapsed }: { elapsed: string }) {
  return (
    <View style={styles.sessionHeader}>
      <View>
        <Text style={styles.sessionTitle}>{mockActiveSession.name}</Text>
        <Text style={styles.sessionTemplate}>{mockActiveSession.template}</Text>
      </View>
      <View style={styles.elapsedBadge}>
        <Ionicons name="time-outline" size={14} color={Colors.accent} />
        <Text style={styles.elapsedText}>{elapsed}</Text>
      </View>
    </View>
  );
}

function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const [sets, setSets] = useState<SetItem[]>(exercise.sets);

  const toggleSet = (idx: number) => {
    setSets((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, done: !s.done } : s))
    );
  };

  const completedSets = sets.filter((s) => s.done).length;

  return (
    <View style={styles.exerciseCard}>
      {/* Cabecera ejercicio */}
      <View style={styles.exerciseHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <Text style={styles.exerciseMuscle}>{exercise.muscle}</Text>
        </View>
        <View style={styles.setsProgress}>
          <Text style={styles.setsProgressText}>{completedSets}/{sets.length}</Text>
        </View>
      </View>

      {/* Cabecera de columnas */}
      <View style={styles.setColumnsHeader}>
        <Text style={[styles.colHeader, { flex: 0.5 }]}>Serie</Text>
        <Text style={[styles.colHeader, { flex: 1 }]}>Repeticiones</Text>
        <Text style={[styles.colHeader, { flex: 1 }]}>Peso (kg)</Text>
        <Text style={[styles.colHeader, { flex: 0.6 }]}>✓</Text>
      </View>

      {/* Filas de series */}
      {sets.map((s, idx) => (
        <View key={idx} style={[styles.setRow, s.done && styles.setRowDone]}>
          <Text style={[styles.setNum, { flex: 0.5 }]}>{s.setNum}</Text>

          <View style={[styles.setInput, { flex: 1 }]}>
            <TextInput
              style={styles.setInputText}
              value={String(s.reps)}
              keyboardType="numeric"
              editable={!s.done}
              selectTextOnFocus
              placeholderTextColor={Colors.textMuted}
            />
          </View>

          <View style={[styles.setInput, { flex: 1 }]}>
            <TextInput
              style={styles.setInputText}
              value={s.weight === 0 ? 'Peso corp.' : String(s.weight)}
              keyboardType={s.weight === 0 ? 'default' : 'numeric'}
              editable={!s.done}
              selectTextOnFocus
              placeholderTextColor={Colors.textMuted}
            />
          </View>

          <TouchableOpacity
            style={[styles.doneButton, s.done && styles.doneButtonActive]}
            onPress={() => toggleSet(idx)}
          >
            <Ionicons
              name={s.done ? 'checkmark-circle' : 'ellipse-outline'}
              size={26}
              color={s.done ? Colors.background : Colors.textMuted}
            />
          </TouchableOpacity>
        </View>
      ))}

      {/* Botón añadir serie */}
      <TouchableOpacity style={styles.addSetBtn}>
        <Ionicons name="add" size={16} color={Colors.accent} />
        <Text style={styles.addSetText}>Añadir serie</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function TrainScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SessionHeader elapsed="00:00" />

        {mockActiveSession.exercises.map((ex) => (
          <ExerciseCard key={ex.id} exercise={ex} />
        ))}

        {/* Acciones de sesión */}
        <TouchableOpacity style={styles.addExerciseBtn}>
          <Ionicons name="add-circle-outline" size={20} color={Colors.accent} />
          <Text style={styles.addExerciseText}>Agregar ejercicio</Text>
        </TouchableOpacity>

        <View style={styles.sessionActions}>
          <TouchableOpacity style={styles.cancelBtn}>
            <Text style={styles.cancelBtnText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.finishBtn}>
            <Ionicons name="checkmark-done" size={18} color={Colors.background} />
            <Text style={styles.finishBtnText}>Terminar</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 56 },

  // Header sesión
  sessionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 24,
  },
  sessionTitle: { fontSize: 22, fontWeight: '800', color: Colors.text, letterSpacing: -0.5 },
  sessionTemplate: { fontSize: 13, color: Colors.textSecondary, marginTop: 3 },
  elapsedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.accentMuted, borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 7,
  },
  elapsedText: { fontSize: 14, fontWeight: '700', color: Colors.accent },

  // Tarjeta ejercicio
  exerciseCard: {
    backgroundColor: Colors.surface, borderRadius: 20,
    padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  exerciseHeader: {
    flexDirection: 'row', alignItems: 'center',
    marginBottom: 14,
  },
  exerciseName: { fontSize: 16, fontWeight: '700', color: Colors.text },
  exerciseMuscle: { fontSize: 12, color: Colors.accent, marginTop: 2, fontWeight: '600' },
  setsProgress: {
    backgroundColor: Colors.surfaceElevated, borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  setsProgressText: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary },

  // Columnas
  setColumnsHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 4, marginBottom: 8,
  },
  colHeader: { fontSize: 11, fontWeight: '700', color: Colors.textMuted, textAlign: 'center' },

  // Fila serie
  setRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 6, paddingHorizontal: 4,
    borderRadius: 10, marginBottom: 4,
  },
  setRowDone: { backgroundColor: Colors.accentMuted },
  setNum: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary, textAlign: 'center' },
  setInput: {
    backgroundColor: Colors.surfaceElevated, borderRadius: 10,
    paddingVertical: 8, paddingHorizontal: 10,
    marginHorizontal: 2,
  },
  setInputText: { fontSize: 14, fontWeight: '600', color: Colors.text, textAlign: 'center' },
  doneButton: { flex: 0.6, alignItems: 'center' },
  doneButtonActive: {},

  // Añadir serie
  addSetBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 10, marginTop: 6,
    borderRadius: 12, borderWidth: 1.5, borderStyle: 'dashed',
    borderColor: Colors.accent + '55',
  },
  addSetText: { fontSize: 13, color: Colors.accent, fontWeight: '600' },

  // Botones añadir ejercicio
  addExerciseBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.surface, borderRadius: 16,
    paddingVertical: 14, marginBottom: 20,
    borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  addExerciseText: { fontSize: 15, color: Colors.accent, fontWeight: '700' },

  // Acciones sesión
  sessionActions: { flexDirection: 'row', gap: 12 },
  cancelBtn: {
    flex: 1, paddingVertical: 16,
    borderRadius: 16, alignItems: 'center',
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  cancelBtnText: { fontSize: 15, fontWeight: '700', color: Colors.textSecondary },
  finishBtn: {
    flex: 2, paddingVertical: 16,
    borderRadius: 16, alignItems: 'center',
    backgroundColor: Colors.accent,
    flexDirection: 'row', justifyContent: 'center', gap: 8,
  },
  finishBtnText: { fontSize: 15, fontWeight: '800', color: Colors.background },
});
