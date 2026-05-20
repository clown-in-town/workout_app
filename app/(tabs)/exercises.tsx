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

function ExerciseListItem({ item }: { item: Exercise }) {
  const diffColor =
    item.difficulty === 'Avanzado'
      ? Colors.danger
      : item.difficulty === 'Intermedio'
      ? Colors.warning
      : Colors.success;

  return (
    <TouchableOpacity style={styles.exerciseItem} activeOpacity={0.8}>
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

export default function ExercisesScreen() {
  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<string>('Todos');
  const [selectedEquip, setSelectedEquip] = useState<string>('Todo');

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
          renderItem={({ item }) => <ExerciseListItem item={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: Colors.text },
  emptyText: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center' },
});
