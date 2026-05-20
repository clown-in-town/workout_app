import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { mockDashboard, mockUser, mockWeeklyWorkouts } from '@/constants/MockData';

const { width } = Dimensions.get('window');

// ─── Componentes internos ──────────────────────────────────────────────────────

function Header() {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.greeting}>Hola, {mockUser.name} 👋</Text>
        <Text style={styles.subGreeting}>¿Listo para entrenar hoy?</Text>
      </View>
      <View style={styles.streakBadge}>
        <Text style={styles.streakIcon}>🔥</Text>
        <Text style={styles.streakText}>{mockUser.streak}</Text>
      </View>
    </View>
  );
}

function WeeklyProgress() {
  const done = mockDashboard.workoutsThisWeek;
  const goal = mockDashboard.weeklyGoal;
  const pct = (done / goal) * 100;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Semana Actual</Text>
        <Text style={styles.cardBadge}>{done}/{goal} entrenamientos</Text>
      </View>

      {/* Días de la semana */}
      <View style={styles.weekRow}>
        {mockWeeklyWorkouts.map((d, i) => (
          <View key={i} style={styles.dayCol}>
            <View style={[styles.dayDot, d.done && styles.dayDotDone]}>
              {d.done && <Ionicons name="checkmark" size={10} color={Colors.background} />}
            </View>
            <Text style={[styles.dayLabel, d.done && styles.dayLabelDone]}>{d.day}</Text>
          </View>
        ))}
      </View>

      {/* Barra de progreso */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressBar, { width: `${pct}%` }]} />
      </View>
      <Text style={styles.progressLabel}>{pct.toFixed(0)}% de tu objetivo semanal</Text>
    </View>
  );
}

function LastWorkoutCard() {
  const router = useRouter();
  const last = mockDashboard.lastWorkout;

  return (
    <TouchableOpacity
      style={[styles.card, styles.lastWorkoutCard]}
      onPress={() => router.push('/(tabs)/history')}
      activeOpacity={0.85}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Último Entrenamiento</Text>
        <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
      </View>
      <View style={styles.lastWorkoutRow}>
        <Text style={styles.lastWorkoutEmoji}>{last.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.lastWorkoutName}>{last.name}</Text>
          <Text style={styles.lastWorkoutMeta}>{last.date}</Text>
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statChip}>
          <Ionicons name="time-outline" size={14} color={Colors.accent} />
          <Text style={styles.statText}>{last.duration}</Text>
        </View>
        <View style={styles.statChip}>
          <Ionicons name="barbell-outline" size={14} color={Colors.accent} />
          <Text style={styles.statText}>{last.exercises} ejercicios</Text>
        </View>
        <View style={styles.statChip}>
          <Ionicons name="layers-outline" size={14} color={Colors.accent} />
          <Text style={styles.statText}>{last.sets} series</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function QuickActions() {
  const router = useRouter();
  const actions = [
    { label: 'Entrenar', icon: 'barbell-outline' as const, route: '/(tabs)/train', color: Colors.accent },
    { label: 'Descanso', icon: 'timer-outline' as const, route: '/(tabs)/rest', color: '#29B6F6' },
    { label: 'Historial', icon: 'time-outline' as const, route: '/(tabs)/history', color: '#FF9800' },
    { label: 'Ejercicios', icon: 'body-outline' as const, route: '/(tabs)/exercises', color: '#CE93D8' },
  ];

  return (
    <View>
      <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
      <View style={styles.actionsGrid}>
        {actions.map((a) => (
          <TouchableOpacity
            key={a.label}
            style={styles.actionCard}
            onPress={() => router.push(a.route as any)}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIcon, { backgroundColor: a.color + '22' }]}>
              <Ionicons name={a.icon} size={24} color={a.color} />
            </View>
            <Text style={styles.actionLabel}>{a.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function RecentExercises() {
  const router = useRouter();
  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Ejercicios Recientes</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/exercises')}>
          <Text style={styles.seeAll}>Ver todos</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.exercisesList}>
        {mockDashboard.recentExercises.map((ex) => (
          <View key={ex.id} style={styles.exerciseRow}>
            <Text style={styles.exerciseEmoji}>{ex.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.exerciseName}>{ex.name}</Text>
              <Text style={styles.exerciseMeta}>{ex.muscle} · {ex.equipment}</Text>
            </View>
            <View style={[styles.difficultyBadge, {
              backgroundColor:
                ex.difficulty === 'Avanzado' ? Colors.danger + '22' :
                ex.difficulty === 'Intermedio' ? Colors.warning + '22' :
                Colors.success + '22',
            }]}>
              <Text style={[styles.difficultyText, {
                color:
                  ex.difficulty === 'Avanzado' ? Colors.danger :
                  ex.difficulty === 'Intermedio' ? Colors.warning :
                  Colors.success,
              }]}>{ex.difficulty}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Pantalla Principal ────────────────────────────────────────────────────────

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Header />
        <WeeklyProgress />
        <LastWorkoutCard />
        <QuickActions />
        <RecentExercises />
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 56 },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greeting: { fontSize: 26, fontWeight: '800', color: Colors.text, letterSpacing: -0.5 },
  subGreeting: { fontSize: 14, color: Colors.textSecondary, marginTop: 2 },
  streakBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.surfaceElevated, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  streakIcon: { fontSize: 16 },
  streakText: { fontSize: 16, fontWeight: '700', color: Colors.text },

  // Cards
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: Colors.text },
  cardBadge: { fontSize: 12, color: Colors.accent, fontWeight: '600' },

  // Weekly
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  dayCol: { alignItems: 'center', gap: 5 },
  dayDot: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: Colors.surfaceBorder,
  },
  dayDotDone: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  dayLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '600' },
  dayLabelDone: { color: Colors.accent },
  progressTrack: { height: 6, backgroundColor: Colors.surfaceElevated, borderRadius: 3, marginBottom: 8 },
  progressBar: { height: 6, backgroundColor: Colors.accent, borderRadius: 3 },
  progressLabel: { fontSize: 12, color: Colors.textSecondary },

  // Last workout
  lastWorkoutCard: {},
  lastWorkoutRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  lastWorkoutEmoji: { fontSize: 36 },
  lastWorkoutName: { fontSize: 16, fontWeight: '700', color: Colors.text },
  lastWorkoutMeta: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  statChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.accentMuted, borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  statText: { fontSize: 12, color: Colors.accent, fontWeight: '600' },

  // Quick actions
  sectionTitle: { fontSize: 17, fontWeight: '800', color: Colors.text, marginBottom: 12 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  actionCard: {
    width: (width - 52) / 2,
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 18,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  actionIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  actionLabel: { fontSize: 15, fontWeight: '700', color: Colors.text },

  // Section header
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  seeAll: { fontSize: 13, color: Colors.accent, fontWeight: '600' },

  // Recent exercises
  exercisesList: { gap: 10, marginBottom: 16 },
  exerciseRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.surface, borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  exerciseEmoji: { fontSize: 26 },
  exerciseName: { fontSize: 14, fontWeight: '700', color: Colors.text },
  exerciseMeta: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  difficultyBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  difficultyText: { fontSize: 11, fontWeight: '700' },
});
