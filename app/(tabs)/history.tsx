import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  StatusBar, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useWorkout, HistoryEntry } from '@/context/WorkoutContext';

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyHistory() {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📋</Text>
      <Text style={styles.emptyTitle}>Sin entrenamientos</Text>
      <Text style={styles.emptyText}>
        Tus sesiones completadas aparecerán aquí.{'\n'}
        Completa tu primer entrenamiento en la sección Entrenar.
      </Text>
    </View>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function DetailModal({
  entry,
  visible,
  onClose,
}: {
  entry: HistoryEntry | null;
  visible: boolean;
  onClose: () => void;
}) {
  if (!entry) return null;

  const doneSets = entry.exercises.reduce(
    (a, e) => a + e.sets.filter((s) => s.done).length, 0
  );

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={dm.overlay}>
        <View style={dm.sheet}>
          <View style={dm.handle} />

          {/* Header */}
          <View style={dm.header}>
            <View style={{ flex: 1 }}>
              <Text style={dm.title}>{entry.workoutName || 'Entrenamiento'}</Text>
              <Text style={dm.date}>{entry.date}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={dm.closeBtn}>
              <Ionicons name="close" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={dm.statsRow}>
            {[
              { icon: 'time-outline' as const,       label: 'Duración',    value: entry.duration },
              { icon: 'barbell-outline' as const,    label: 'Ejercicios',  value: String(entry.exercises.length) },
              { icon: 'layers-outline' as const,     label: 'Series',      value: `${doneSets}/${entry.totalSets}` },
              { icon: 'trending-up-outline' as const,label: 'Volumen',     value: `${entry.totalVolume.toFixed(0)} kg` },
            ].map((s) => (
              <View key={s.label} style={dm.statItem}>
                <Ionicons name={s.icon} size={16} color={Colors.accent} />
                <Text style={dm.statValue}>{s.value}</Text>
                <Text style={dm.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          {/* Exercise detail */}
          <Text style={dm.sectionTitle}>Ejercicios</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {entry.exercises.map((ex, exIdx) => (
              <View key={ex.id} style={dm.exBlock}>
                <View style={dm.exHeader}>
                  <Text style={dm.exEmoji}>{ex.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={dm.exName}>{ex.name}</Text>
                    <Text style={dm.exMuscle}>{ex.muscle}</Text>
                  </View>
                  <Text style={dm.exSetCount}>{ex.sets.length} series</Text>
                </View>

                {/* Sets table */}
                <View style={dm.setHeader}>
                  <Text style={[dm.setCol, { flex: 0.5 }]}>#</Text>
                  <Text style={[dm.setCol, { flex: 1 }]}>Reps</Text>
                  <Text style={[dm.setCol, { flex: 1.3 }]}>Peso</Text>
                  <Text style={[dm.setCol, { flex: 0.6 }]}>✓</Text>
                </View>
                {ex.sets.map((s, sIdx) => (
                  <View key={s.id} style={[dm.setRow, s.done && dm.setRowDone]}>
                    <Text style={[dm.setCell, { flex: 0.5, color: Colors.textMuted }]}>{sIdx + 1}</Text>
                    <Text style={[dm.setCell, { flex: 1 }]}>{s.reps} reps</Text>
                    <Text style={[dm.setCell, { flex: 1.3 }]}>
                      {s.weight && s.weight !== '0' ? `${s.weight} kg` : 'Peso corp.'}
                    </Text>
                    <View style={{ flex: 0.6, alignItems: 'center' }}>
                      <Ionicons
                        name={s.done ? 'checkmark-circle' : 'ellipse-outline'}
                        size={18}
                        color={s.done ? Colors.accent : Colors.textMuted}
                      />
                    </View>
                  </View>
                ))}
              </View>
            ))}
            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ─── History Card ─────────────────────────────────────────────────────────────

function HistoryCard({ entry, onPress }: { entry: HistoryEntry; onPress: () => void }) {
  const doneSets = entry.exercises.reduce(
    (a, e) => a + e.sets.filter((s) => s.done).length, 0
  );

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.cardLeft}>
        <Text style={styles.cardEmoji}>
          {entry.exercises.length > 0 ? entry.exercises[0].emoji : '🏋️'}
        </Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardName} numberOfLines={1}>
          {entry.workoutName || (entry.exercises.length > 0 ? entry.exercises.map((e) => e.name).join(', ') : 'Entrenamiento')}
        </Text>
        <Text style={styles.cardDate}>{entry.date}</Text>
        <View style={styles.pills}>
          <View style={styles.pill}>
            <Ionicons name="time-outline" size={11} color={Colors.accent} />
            <Text style={styles.pillText}>{entry.duration}</Text>
          </View>
          <View style={styles.pill}>
            <Ionicons name="barbell-outline" size={11} color={Colors.accent} />
            <Text style={styles.pillText}>{entry.exercises.length} ejerc.</Text>
          </View>
          <View style={styles.pill}>
            <Ionicons name="layers-outline" size={11} color={Colors.accent} />
            <Text style={styles.pillText}>{doneSets}/{entry.totalSets} series</Text>
          </View>
          {entry.totalVolume > 0 && (
            <View style={styles.pill}>
              <Ionicons name="trending-up-outline" size={11} color={Colors.accent} />
              <Text style={styles.pillText}>{entry.totalVolume.toFixed(0)} kg</Text>
            </View>
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function HistoryScreen() {
  const { state } = useWorkout();
  const history = state.history;
  const [selected, setSelected] = useState<HistoryEntry | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Summary stats
  const totalDurationMs = history.reduce((a, e) => a + e.durationMs, 0);
  const totalMins = Math.round(totalDurationMs / 60000);
  const totalVolume = history.reduce((a, e) => a + e.totalVolume, 0);

  const openDetail = (entry: HistoryEntry) => {
    setSelected(entry);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.screenTitle}>Historial</Text>
        <Text style={styles.screenSubtitle}>
          {history.length} entrenamiento{history.length !== 1 ? 's' : ''} registrado{history.length !== 1 ? 's' : ''}
        </Text>

        {/* Summary bar — only when there's data */}
        {history.length > 0 && (
          <View style={styles.summaryBar}>
            <View style={styles.summaryStat}>
              <Text style={styles.summaryValue}>{history.length}</Text>
              <Text style={styles.summaryLabel}>Sesiones</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryStat}>
              <Text style={styles.summaryValue}>
                {totalMins >= 60 ? `${(totalMins / 60).toFixed(1)} h` : `${totalMins} min`}
              </Text>
              <Text style={styles.summaryLabel}>Tiempo total</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryStat}>
              <Text style={styles.summaryValue}>
                {totalVolume >= 1000 ? `${(totalVolume / 1000).toFixed(1)}k` : totalVolume.toFixed(0)}
              </Text>
              <Text style={styles.summaryLabel}>Vol. (kg)</Text>
            </View>
          </View>
        )}

        {history.length === 0 ? (
          <EmptyHistory />
        ) : (
          <>
            <Text style={styles.listLabel}>Recientes</Text>
            {history.map((entry) => (
              <HistoryCard key={entry.id} entry={entry} onPress={() => openDetail(entry)} />
            ))}
          </>
        )}
        <View style={{ height: 20 }} />
      </ScrollView>

      <DetailModal
        entry={selected}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: 20, paddingTop: 56 },
  screenTitle: { fontSize: 28, fontWeight: '800', color: Colors.text, letterSpacing: -0.5 },
  screenSubtitle: { fontSize: 14, color: Colors.textSecondary, marginTop: 4, marginBottom: 20 },

  summaryBar: {
    flexDirection: 'row', backgroundColor: Colors.surface,
    borderRadius: 20, padding: 20, marginBottom: 24,
    borderWidth: 1, borderColor: Colors.surfaceBorder,
    justifyContent: 'space-around', alignItems: 'center',
  },
  summaryStat: { alignItems: 'center', flex: 1 },
  summaryValue: { fontSize: 22, fontWeight: '800', color: Colors.accent },
  summaryLabel: { fontSize: 11, color: Colors.textSecondary, marginTop: 4, fontWeight: '600' },
  summaryDivider: { width: 1, height: 40, backgroundColor: Colors.surfaceBorder },

  listLabel: { fontSize: 15, fontWeight: '700', color: Colors.textSecondary, marginBottom: 12 },

  card: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: Colors.surface, borderRadius: 18,
    padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  cardLeft: { width: 52, height: 52, borderRadius: 16, backgroundColor: Colors.surfaceElevated, alignItems: 'center', justifyContent: 'center' },
  cardEmoji: { fontSize: 26 },
  cardContent: { flex: 1 },
  cardName: { fontSize: 14, fontWeight: '700', color: Colors.text },
  cardDate: { fontSize: 12, color: Colors.textSecondary, marginTop: 2, marginBottom: 8 },
  pills: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.accentMuted, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  pillText: { fontSize: 11, color: Colors.accent, fontWeight: '600' },

  emptyContainer: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 20 },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: Colors.text, marginBottom: 10 },
  emptyText: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
});

// Detail modal styles
const dm = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: Colors.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, maxHeight: '88%' },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.surfaceBorder, alignSelf: 'center', marginBottom: 20 },
  header: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: '800', color: Colors.text },
  date: { fontSize: 13, color: Colors.textSecondary, marginTop: 3 },
  closeBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.surfaceElevated, alignItems: 'center', justifyContent: 'center' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: Colors.surfaceElevated, borderRadius: 18, paddingVertical: 16, marginBottom: 24 },
  statItem: { alignItems: 'center', gap: 4, flex: 1 },
  statValue: { fontSize: 15, fontWeight: '800', color: Colors.text },
  statLabel: { fontSize: 11, color: Colors.textSecondary, fontWeight: '600' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 12 },
  exBlock: { marginBottom: 16, backgroundColor: Colors.surfaceElevated, borderRadius: 14, padding: 12 },
  exHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  exEmoji: { fontSize: 22 },
  exName: { fontSize: 14, fontWeight: '700', color: Colors.text },
  exMuscle: { fontSize: 12, color: Colors.accent, fontWeight: '600', marginTop: 1 },
  exSetCount: { fontSize: 12, color: Colors.textMuted, fontWeight: '600' },
  setHeader: { flexDirection: 'row', paddingHorizontal: 4, marginBottom: 6 },
  setCol: { fontSize: 10, fontWeight: '700', color: Colors.textMuted, textAlign: 'center' },
  setRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 4, borderRadius: 8, marginBottom: 2 },
  setRowDone: { backgroundColor: Colors.accentMuted },
  setCell: { fontSize: 13, fontWeight: '600', color: Colors.text, textAlign: 'center' },
});
