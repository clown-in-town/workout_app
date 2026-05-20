import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  FlatList,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import {
  mockExercises,
  muscleGroups,
  equipment,
} from '@/constants/MockData';

type Exercise = typeof mockExercises[0];

function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (t: string) => void;
}) {
  return (
    <View style={styles.searchBar}>
      <Ionicons name="search" size={18} color={Colors.textMuted} />
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar ejercicio..."
        placeholderTextColor={Colors.textMuted}
        value={value}
        onChangeText={onChange}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChange('')}>
          <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
}

function FilterChips<T extends string>({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: T[];
  selected: T;
  onSelect: (v: T) => void;
}) {
  return (
    <View style={styles.filterSection}>
      <Text style={styles.filterLabel}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.chip, selected === opt && styles.chipActive]}
            onPress={() => onSelect(opt)}
          >
            <Text style={[styles.chipText, selected === opt && styles.chipTextActive]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

function ExerciseListItem({ item, onPress }: { item: Exercise; onPress: () => void }) {
  const diffColor =
    item.difficulty === 'Avanzado'
      ? Colors.danger
      : item.difficulty === 'Intermedio'
      ? Colors.warning
      : Colors.success;

  return (
    <TouchableOpacity style={styles.exerciseItem} activeOpacity={0.8} onPress={onPress}>
      <View style={styles.exerciseIcon}>
        <Text style={styles.exerciseEmoji}>{item.emoji}</Text>
      </View>
      <View style={styles.exerciseInfo}>
        <Text style={styles.exerciseName}>{item.name}</Text>
        <View style={styles.exerciseTags}>
          <Text style={styles.muscleTag}>{item.muscle}</Text>
          <Text style={styles.equipTag}>{item.equipment}</Text>
        </View>
      </View>
      <View style={[styles.diffBadge, { backgroundColor: diffColor + '22' }]}>
        <Text style={[styles.diffText, { color: diffColor }]}>{item.difficulty}</Text>
      </View>
    </TouchableOpacity>
  );
}

function ExerciseDetailModal({
  exercise,
  visible,
  onClose,
}: {
  exercise: Exercise | null;
  visible: boolean;
  onClose: () => void;
}) {
  if (!exercise) return null;

  const diffColor =
    exercise.difficulty === 'Avanzado'
      ? Colors.danger
      : exercise.difficulty === 'Intermedio'
      ? Colors.warning
      : Colors.success;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={dm.overlay}>
        <View style={dm.sheet}>
          <View style={dm.handle} />
          
          <View style={dm.header}>
            <View style={dm.emojiContainer}>
              <Text style={dm.emoji}>{exercise.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={dm.name}>{exercise.name}</Text>
              <View style={dm.metaRow}>
                <Text style={dm.muscleText}>{exercise.muscle}</Text>
                <Text style={dm.bullet}>•</Text>
                <Text style={dm.equipText}>{exercise.equipment}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={dm.closeBtn}>
              <Ionicons name="close" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={dm.scroll} showsVerticalScrollIndicator={false}>
            {/* Dificultad */}
            <View style={dm.levelRow}>
              <Text style={dm.sectionTitle}>Dificultad</Text>
              <View style={[dm.diffBadge, { backgroundColor: diffColor + '15' }]}>
                <Text style={[dm.diffText, { color: diffColor }]}>{exercise.difficulty}</Text>
              </View>
            </View>

            {/* Músculos secundarios */}
            {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
              <View style={dm.section}>
                <Text style={dm.sectionTitle}>Músculos Secundarios</Text>
                <View style={dm.tagsRow}>
                  {exercise.secondaryMuscles.map((m, idx) => (
                    <View key={idx} style={dm.secondaryTag}>
                      <Text style={dm.secondaryTagText}>{m}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Ejecución */}
            <View style={dm.section}>
              <Text style={dm.sectionTitle}>Instrucciones de Ejecución</Text>
              <Text style={dm.description}>{exercise.description}</Text>
            </View>

            {/* Beneficios */}
            {exercise.benefits && exercise.benefits.length > 0 && (
              <View style={dm.section}>
                <Text style={dm.sectionTitle}>Beneficios Clave</Text>
                {exercise.benefits.map((b, idx) => (
                  <View key={idx} style={dm.benefitRow}>
                    <Ionicons name="checkmark-circle" size={16} color={Colors.accent} />
                    <Text style={dm.benefitText}>{b}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default function ExercisesScreen() {
  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<string>('Todos');
  const [selectedEquip, setSelectedEquip] = useState<string>('Todo');
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);

  const filtered = useMemo(() => {
    return mockExercises.filter((ex) => {
      const matchSearch = ex.name.toLowerCase().includes(search.toLowerCase());
      const matchMuscle = selectedMuscle === 'Todos' || ex.muscle === selectedMuscle;
      const matchEquip = selectedEquip === 'Todo' || ex.equipment === selectedEquip;
      return matchSearch && matchMuscle && matchEquip;
    });
  }, [search, selectedMuscle, selectedEquip]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Fixed header */}
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Ejercicios</Text>
        <Text style={styles.screenSubtitle}>{filtered.length} ejercicios</Text>
        <SearchBar value={search} onChange={setSearch} />

        <FilterChips
          label="Grupo Muscular"
          options={muscleGroups}
          selected={selectedMuscle}
          onSelect={setSelectedMuscle}
        />
        <FilterChips
          label="Material"
          options={equipment}
          selected={selectedEquip}
          onSelect={setSelectedEquip}
        />
      </View>

      {/* Lista */}
      {filtered.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text style={styles.emptyTitle}>Sin resultados</Text>
          <Text style={styles.emptyText}>Intenta con otro término o quita los filtros</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ExerciseListItem
              item={item}
              onPress={() => setActiveExercise(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Exercise Detail Modal */}
      <ExerciseDetailModal
        exercise={activeExercise}
        visible={activeExercise !== null}
        onClose={() => setActiveExercise(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  header: {
    paddingHorizontal: 20, paddingTop: 56, paddingBottom: 8,
    backgroundColor: Colors.background,
    borderBottomWidth: 1, borderBottomColor: Colors.surfaceBorder,
  },
  screenTitle: { fontSize: 28, fontWeight: '800', color: Colors.text, letterSpacing: -0.5 },
  screenSubtitle: { fontSize: 13, color: Colors.textSecondary, marginTop: 2, marginBottom: 16 },

  // Search bar
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.surface, borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 12,
    borderWidth: 1, borderColor: Colors.surfaceBorder,
    marginBottom: 16,
  },
  searchInput: { flex: 1, fontSize: 15, color: Colors.text },

  // Filter chips
  filterSection: { marginBottom: 12 },
  filterLabel: { fontSize: 12, fontWeight: '700', color: Colors.textMuted, marginBottom: 8 },
  chipsRow: { gap: 8, paddingRight: 4 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 7,
    backgroundColor: Colors.surfaceElevated, borderRadius: 20,
    borderWidth: 1.5, borderColor: Colors.surfaceBorder,
  },
  chipActive: { backgroundColor: Colors.accentMuted, borderColor: Colors.accent },
  chipText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  chipTextActive: { color: Colors.accent },

  // Lista
  listContent: { padding: 20, paddingBottom: 30, gap: 10 },
  exerciseItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.surface, borderRadius: 16,
    padding: 14, borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  exerciseIcon: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center', justifyContent: 'center',
  },
  exerciseEmoji: { fontSize: 24 },
  exerciseInfo: { flex: 1 },
  exerciseName: { fontSize: 14, fontWeight: '700', color: Colors.text },
  exerciseTags: { flexDirection: 'row', gap: 6, marginTop: 4 },
  muscleTag: {
    fontSize: 11, fontWeight: '600', color: Colors.accent,
    backgroundColor: Colors.accentMuted, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
  },
  equipTag: {
    fontSize: 11, fontWeight: '600', color: Colors.textSecondary,
    backgroundColor: Colors.surfaceElevated, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
  },
  diffBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  diffText: { fontSize: 11, fontWeight: '700' },

  // Empty state
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, paddingTop: 60 },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: Colors.text },
  emptyText: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center' },
});

// Detail Modal Styles
const dm = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: Colors.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, maxHeight: '88%' },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.surfaceBorder, alignSelf: 'center', marginBottom: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 },
  emojiContainer: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center', justifyContent: 'center',
  },
  emoji: { fontSize: 28 },
  name: { fontSize: 18, fontWeight: '850', color: Colors.text, letterSpacing: -0.5 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  muscleText: { fontSize: 13, fontWeight: '700', color: Colors.accent },
  bullet: { fontSize: 13, color: Colors.textMuted },
  equipText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
  closeBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.surfaceElevated, alignItems: 'center', justifyContent: 'center' },
  
  scroll: { flex: 1 },
  levelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, backgroundColor: Colors.surfaceElevated, padding: 12, borderRadius: 14 },
  diffBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  diffText: { fontSize: 12, fontWeight: '800' },

  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  secondaryTag: { backgroundColor: Colors.surfaceElevated, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: Colors.surfaceBorder },
  secondaryTagText: { fontSize: 13, fontWeight: '600', color: Colors.text },
  
  description: { fontSize: 14, color: Colors.text, lineHeight: 22, fontWeight: '500' },
  
  benefitRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  benefitText: { fontSize: 13.5, color: Colors.text, flex: 1, lineHeight: 18, fontWeight: '500' },
});
