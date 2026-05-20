import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { mockHistory } from '@/constants/MockData';

type WorkoutEntry = typeof mockHistory[0];

function WorkoutCard({ item, onPress }: { item: WorkoutEntry; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.workoutCard} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.workoutCardLeft}>
        <Text style={styles.workoutEmoji}>{item.emoji}</Text>
      </View>
      <View style={styles.workoutCardContent}>
        <Text style={styles.workoutName}>{item.name}</Text>
        <Text style={styles.workoutDate}>{item.date}</Text>
        <View style={styles.workoutStats}>
          <View style={styles.statPill}>
            <Ionicons name="time-outline" size={12} color={Colors.accent} />
            <Text style={styles.statPillText}>{item.duration}</Text>
          </View>
          <View style={styles.statPill}>
            <Ionicons name="barbell-outline" size={12} color={Colors.accent} />
            <Text style={styles.statPillText}>{item.exercises} ejerc.</Text>
          </View>
          <View style={styles.statPill}>
            <Ionicons name="trending-up-outline" size={12} color={Colors.accent} />
            <Text style={styles.statPillText}>{item.volume}</Text>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
    </TouchableOpacity>
  );
}

function WorkoutDetailModal({
  item,
  visible,
  onClose,
}: {
  item: WorkoutEntry | null;
  visible: boolean;
  onClose: () => void;
}) {
  if (!item) return null;

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          {/* Handle */}
          <View style={styles.modalHandle} />

          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalEmoji}>{item.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.modalTitle}>{item.name}</Text>
              <Text style={styles.modalDate}>{item.date}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Stats overview */}
          <View style={styles.modalStats}>
            {[
              { label: 'Duración', value: item.duration, icon: 'time-outline' as const },
              { label: 'Volumen', value: item.volume, icon: 'trending-up-outline' as const },
              { label: 'Ejercicios', value: String(item.exercises), icon: 'barbell-outline' as const },
              { label: 'Series', value: String(item.sets), icon: 'layers-outline' as const },
            ].map((s) => (
              <View key={s.label} style={styles.modalStatItem}>
                <Ionicons name={s.icon} size={18} color={Colors.accent} />
                <Text style={styles.modalStatValue}>{s.value}</Text>
                <Text style={styles.modalStatLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          {/* Ejercicios detalle */}
          <Text style={styles.modalSectionTitle}>Ejercicios</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {item.exercises_detail.map((ex, idx) => (
              <View key={idx} style={styles.modalExRow}>
                <View style={styles.modalExIndex}>
                  <Text style={styles.modalExIndexText}>{idx + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalExName}>{ex.name}</Text>
                  <Text style={styles.modalExMeta}>
                    {ex.sets} series · {ex.reps} reps · {ex.weight}
                  </Text>
                </View>
              </View>
            ))}
            <View style={{ height: 30 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default function HistoryScreen() {
  const [selected, setSelected] = useState<WorkoutEntry | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openDetail = (item: WorkoutEntry) => {
    setSelected(item);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.screenTitle}>Historial</Text>
        <Text style={styles.screenSubtitle}>{mockHistory.length} entrenamientos registrados</Text>

        {/* Resumen del mes */}
        <View style={styles.monthSummary}>
          <View style={styles.monthStat}>
            <Text style={styles.monthStatValue}>8</Text>
            <Text style={styles.monthStatLabel}>Este mes</Text>
          </View>
          <View style={styles.monthDivider} />
          <View style={styles.monthStat}>
            <Text style={styles.monthStatValue}>6.2 h</Text>
            <Text style={styles.monthStatLabel}>Tiempo total</Text>
          </View>
          <View style={styles.monthDivider} />
          <View style={styles.monthStat}>
            <Text style={styles.monthStatValue}>74.2k</Text>
            <Text style={styles.monthStatLabel}>Vol. (kg)</Text>
          </View>
        </View>

        {/* Lista entrenamientos */}
        <Text style={styles.listLabel}>Recientes</Text>
        {mockHistory.map((item) => (
          <WorkoutCard key={item.id} item={item} onPress={() => openDetail(item)} />
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>

      <WorkoutDetailModal
        item={selected}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 56 },

  screenTitle: { fontSize: 28, fontWeight: '800', color: Colors.text, letterSpacing: -0.5 },
  screenSubtitle: { fontSize: 14, color: Colors.textSecondary, marginTop: 4, marginBottom: 20 },

  // Resumen mes
  monthSummary: {
    flexDirection: 'row', backgroundColor: Colors.surface,
    borderRadius: 20, padding: 20, marginBottom: 24,
    borderWidth: 1, borderColor: Colors.surfaceBorder,
    justifyContent: 'space-around', alignItems: 'center',
  },
  monthStat: { alignItems: 'center', flex: 1 },
  monthStatValue: { fontSize: 22, fontWeight: '800', color: Colors.accent },
  monthStatLabel: { fontSize: 11, color: Colors.textSecondary, marginTop: 4, fontWeight: '600' },
  monthDivider: { width: 1, height: 40, backgroundColor: Colors.surfaceBorder },

  listLabel: { fontSize: 15, fontWeight: '700', color: Colors.textSecondary, marginBottom: 12 },

  // Workout cards
  workoutCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: Colors.surface, borderRadius: 18,
    padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  workoutCardLeft: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center', justifyContent: 'center',
  },
  workoutEmoji: { fontSize: 26 },
  workoutCardContent: { flex: 1 },
  workoutName: { fontSize: 15, fontWeight: '700', color: Colors.text },
  workoutDate: { fontSize: 12, color: Colors.textSecondary, marginTop: 2, marginBottom: 8 },
  workoutStats: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  statPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.accentMuted, borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  statPillText: { fontSize: 11, color: Colors.accent, fontWeight: '600' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: Colors.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 24, maxHeight: '85%',
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: Colors.surfaceBorder, alignSelf: 'center', marginBottom: 24,
  },
  modalHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 },
  modalEmoji: { fontSize: 42 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: Colors.text },
  modalDate: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  closeBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center', justifyContent: 'center',
  },
  modalStats: {
    flexDirection: 'row', justifyContent: 'space-around',
    backgroundColor: Colors.surfaceElevated, borderRadius: 18,
    paddingVertical: 16, marginBottom: 24,
  },
  modalStatItem: { alignItems: 'center', gap: 4 },
  modalStatValue: { fontSize: 16, fontWeight: '800', color: Colors.text },
  modalStatLabel: { fontSize: 11, color: Colors.textSecondary, fontWeight: '600' },
  modalSectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 12 },
  modalExRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.surfaceBorder,
  },
  modalExIndex: {
    width: 30, height: 30, borderRadius: 10,
    backgroundColor: Colors.accentMuted, alignItems: 'center', justifyContent: 'center',
  },
  modalExIndexText: { fontSize: 12, fontWeight: '800', color: Colors.accent },
  modalExName: { fontSize: 14, fontWeight: '700', color: Colors.text },
  modalExMeta: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
});
