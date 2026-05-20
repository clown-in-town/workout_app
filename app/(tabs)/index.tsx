import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Modal,
  TextInput,
  Image,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { mockUser, mockExercises } from '@/constants/MockData';
import { useWorkout } from '@/context/WorkoutContext';

const { width } = Dimensions.get('window');

const PRESET_PHOTOS = [
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&auto=format&fit=crop&q=60'
];

function formatTime(s: number): string {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

// ─── Componentes del Dashboard ──────────────────────────────────────────────────

function Header() {
  const { state } = useWorkout();
  const streak = state.history.length > 0 ? Math.min(mockUser.streak + state.history.length, 30) : mockUser.streak;

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.greeting}>Hola, {mockUser.name} 👋</Text>
        <Text style={styles.subGreeting}>¿Listo para entrenar hoy?</Text>
      </View>
      <View style={styles.streakBadge}>
        <Text style={styles.streakIcon}>🔥</Text>
        <Text style={styles.streakText}>{streak}</Text>
      </View>
    </View>
  );
}

function WeeklyProgress() {
  const { state } = useWorkout();
  const goal = mockUser.weeklyGoal;

  const weekData = useMemo(() => {
    const now = new Date();
    const currentDay = now.getDay();
    const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;
    
    const monday = new Date(now);
    monday.setDate(now.getDate() - distanceToMonday);
    monday.setHours(0, 0, 0, 0);
    const mondayMs = monday.getTime();

    const days = [
      { day: 'L', done: false, offset: 0 },
      { day: 'M', done: false, offset: 1 },
      { day: 'X', done: false, offset: 2 },
      { day: 'J', done: false, offset: 3 },
      { day: 'V', done: false, offset: 4 },
      { day: 'S', done: false, offset: 5 },
      { day: 'D', done: false, offset: 6 },
    ];

    days.forEach((d) => {
      const targetDay = new Date(mondayMs);
      targetDay.setDate(targetDay.getDate() + d.offset);
      const startMs = targetDay.getTime();
      
      const endDay = new Date(targetDay);
      endDay.setHours(23, 59, 59, 999);
      const endMs = endDay.getTime();

      const hasWorkout = state.history.some(
        (h) => h.dateMs >= startMs && h.dateMs <= endMs
      );
      d.done = hasWorkout;
    });

    const doneCount = days.filter((d) => d.done).length;
    return { days, doneCount };
  }, [state.history]);

  const pct = Math.min((weekData.doneCount / goal) * 100, 100);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Semana Actual</Text>
        <Text style={styles.cardBadge}>{weekData.doneCount}/{goal} entrenamientos</Text>
      </View>

      <View style={styles.weekRow}>
        {weekData.days.map((d, i) => (
          <View key={i} style={styles.dayCol}>
            <View style={[styles.dayDot, d.done && styles.dayDotDone]}>
              {d.done && <Ionicons name="checkmark" size={10} color={Colors.background} />}
            </View>
            <Text style={[styles.dayLabel, d.done && styles.dayLabelDone]}>{d.day}</Text>
          </View>
        ))}
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressBar, { width: `${pct}%` }]} />
      </View>
      <Text style={styles.progressLabel}>{pct.toFixed(0)}% de tu objetivo semanal</Text>
    </View>
  );
}

function LastWorkoutCard() {
  const router = useRouter();
  const { state } = useWorkout();
  const last = state.history[0];

  if (!last) {
    return (
      <TouchableOpacity
        style={[styles.card, styles.emptyLastWorkoutCard]}
        onPress={() => router.push('/(tabs)/train')}
        activeOpacity={0.85}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Último Entrenamiento</Text>
          <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
        </View>
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyEmoji}>🏋️</Text>
          <View>
            <Text style={styles.emptyTextTitle}>Sin entrenamientos registrados</Text>
            <Text style={styles.emptyTextDesc}>¡Toca aquí para iniciar tu primera sesión!</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

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
        <Text style={styles.lastWorkoutEmoji}>💪</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.lastWorkoutName}>
            {last.exercises.length > 0
              ? `${last.exercises[0].name}${last.exercises.length > 1 ? ` +${last.exercises.length - 1} ej.` : ''}`
              : 'Sesión Completada'}
          </Text>
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
          <Text style={styles.statText}>{last.exercises.length} ejercicios</Text>
        </View>
        <View style={styles.statChip}>
          <Ionicons name="layers-outline" size={14} color={Colors.accent} />
          <Text style={styles.statText}>{last.totalSets} series</Text>
        </View>
        <View style={styles.statChip}>
          <Ionicons name="trophy-outline" size={14} color={Colors.accent} />
          <Text style={styles.statText}>{Math.round(last.totalVolume).toLocaleString()} kg</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Tarjeta de Progreso ────────────────────────────────────────────────────────

function ProgressCard({ onOpen }: { onOpen: () => void }) {
  const { state } = useWorkout();
  const lastLog = state.progress[0]; // sorted by desc timestamp

  const changeStr = useMemo(() => {
    if (state.progress.length < 2) return null;
    const oldest = state.progress[state.progress.length - 1];
    const newest = state.progress[0];
    const diff = parseFloat(newest.weight) - parseFloat(oldest.weight);
    if (diff === 0) return 'Sin cambios';
    return diff > 0 ? `+${diff.toFixed(1)} kg` : `${diff.toFixed(1)} kg`;
  }, [state.progress]);

  const isLoss = changeStr && changeStr.startsWith('-');

  if (!lastLog) {
    return (
      <TouchableOpacity
        style={[styles.card, styles.emptyProgressCard]}
        onPress={onOpen}
        activeOpacity={0.85}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Progreso Físico</Text>
          <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
        </View>
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyEmoji}>📈</Text>
          <View>
            <Text style={styles.emptyTextTitle}>Controla tu evolución</Text>
            <Text style={styles.emptyTextDesc}>Registra peso, medidas y fotos corporales.</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.card, styles.progressCard]}
      onPress={onOpen}
      activeOpacity={0.85}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Progreso Físico</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          {changeStr && (
            <View style={[styles.trendBadge, { backgroundColor: isLoss ? Colors.success + '22' : Colors.warning + '22' }]}>
              <Ionicons name={isLoss ? 'trending-down' : 'trending-up'} size={12} color={isLoss ? Colors.success : Colors.warning} />
              <Text style={[styles.trendBadgeText, { color: isLoss ? Colors.success : Colors.warning }]}>
                {changeStr}
              </Text>
            </View>
          )}
          <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
        </View>
      </View>
      <View style={styles.lastWorkoutRow}>
        <Text style={styles.lastWorkoutEmoji}>📏</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.lastWorkoutName}>Último Registro: {lastLog.date}</Text>
          <Text style={styles.lastWorkoutMeta}>Pecho, cintura, cadera e imágenes</Text>
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statChipProgress}>
          <Text style={styles.statLabelProgress}>Peso</Text>
          <Text style={styles.statValProgress}>{lastLog.weight} kg</Text>
        </View>
        <View style={styles.statChipProgress}>
          <Text style={styles.statLabelProgress}>Cintura</Text>
          <Text style={styles.statValProgress}>{lastLog.waist} cm</Text>
        </View>
        <View style={styles.statChipProgress}>
          <Text style={styles.statLabelProgress}>Pecho</Text>
          <Text style={styles.statValProgress}>{lastLog.chest} cm</Text>
        </View>
        <View style={styles.statChipProgress}>
          <Text style={styles.statLabelProgress}>Cadera</Text>
          <Text style={styles.statValProgress}>{lastLog.hip} cm</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Gráfica de Progreso Customizada ─────────────────────────────────────────────

function ProgressChart({ logs, metric }: { logs: any[]; metric: 'weight' | 'waist' | 'chest' | 'hip' }) {
  const sorted = useMemo(() => {
    return [...logs].sort((a, b) => a.dateMs - b.dateMs);
  }, [logs]);

  const dataPoints = useMemo(() => {
    return sorted.map((log) => ({
      date: log.date.split(' ').slice(0, 2).join(' '), 
      val: parseFloat(log[metric]) || 0,
    }));
  }, [sorted, metric]);

  const vals = dataPoints.map((d) => d.val);
  const maxVal = vals.length > 0 ? Math.max(...vals) : 1;
  const minVal = vals.length > 0 ? Math.min(...vals) : 0;
  const range = maxVal - minVal === 0 ? 10 : maxVal - minVal;

  return (
    <View style={ch.container}>
      {dataPoints.length === 0 ? (
        <View style={ch.empty}>
          <Text style={ch.emptyText}>Registra datos para visualizar la gráfica.</Text>
        </View>
      ) : (
        <View style={ch.chartArea}>
          <View style={ch.gridWrapper}>
            {dataPoints.map((dp, idx) => {
              const heightPct = range > 0 
                ? ((dp.val - minVal) / range) * 65 + 15 
                : 50;

              return (
                <View key={idx} style={ch.barWrapper}>
                  <Text style={ch.barVal}>{dp.val}</Text>
                  <View style={ch.barTrack}>
                    <View style={[ch.barPoint, { bottom: `${heightPct}%` }]} />
                    <View style={[ch.barLine, { height: `${heightPct}%` }]} />
                  </View>
                  <Text style={ch.barDate}>{dp.date}</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {dataPoints.length > 0 && (
        <View style={ch.summaryRow}>
          <View style={ch.summaryBox}>
            <Text style={ch.summaryLabel}>Mínimo</Text>
            <Text style={ch.summaryVal}>{minVal} {metric === 'weight' ? 'kg' : 'cm'}</Text>
          </View>
          <View style={ch.summaryBox}>
            <Text style={ch.summaryLabel}>Máximo</Text>
            <Text style={ch.summaryVal}>{maxVal} {metric === 'weight' ? 'kg' : 'cm'}</Text>
          </View>
          <View style={ch.summaryBox}>
            <Text style={ch.summaryLabel}>Variación</Text>
            <Text style={[ch.summaryVal, { color: Colors.accent }]}>
              {(maxVal - minVal).toFixed(1)} {metric === 'weight' ? 'kg' : 'cm'}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const ch = StyleSheet.create({
  container: { marginTop: 10 },
  empty: { height: 160, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.surfaceElevated, borderRadius: 16 },
  emptyText: { color: Colors.textSecondary, fontSize: 13 },
  chartArea: { height: 210, backgroundColor: Colors.surfaceElevated, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: Colors.surfaceBorder },
  gridWrapper: { flexDirection: 'row', justifyContent: 'space-around', height: '100%', alignItems: 'flex-end' },
  barWrapper: { alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end' },
  barVal: { fontSize: 11, fontWeight: '700', color: Colors.text, marginBottom: 8 },
  barTrack: { width: 4, height: 120, backgroundColor: Colors.surfaceBorder, borderRadius: 2, position: 'relative', marginBottom: 8, alignItems: 'center' },
  barPoint: { position: 'absolute', width: 14, height: 14, borderRadius: 7, backgroundColor: Colors.accent, borderWidth: 3, borderColor: Colors.surface, transform: [{ translateX: 0 }] },
  barLine: { position: 'absolute', bottom: 0, width: 4, backgroundColor: Colors.accent + '33', borderRadius: 2 },
  barDate: { fontSize: 10, fontWeight: '600', color: Colors.textSecondary },
  summaryRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  summaryBox: { flex: 1, backgroundColor: Colors.surfaceElevated, borderRadius: 14, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.surfaceBorder },
  summaryLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '600', marginBottom: 4 },
  summaryVal: { fontSize: 14, fontWeight: '800', color: Colors.text },
});

// ─── Modal de Progreso ─────────────────────────────────────────────────────────

function ProgressModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { state, addProgressLog } = useWorkout();
  const [activeTab, setActiveTab] = useState<'register' | 'charts' | 'photos'>('register');
  const [activeMetric, setActiveMetric] = useState<'weight' | 'waist' | 'chest' | 'hip'>('weight');

  // Form State
  const [weight, setWeight] = useState('');
  const [waist, setWaist] = useState('');
  const [chest, setChest] = useState('');
  const [hip, setHip] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [photo, setPhoto] = useState<string>('');

  const fileInputRef = useRef<any>(null);

  const handlePickImage = () => {
    if (Platform.OS === 'web' && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhoto(reader.onload && reader.result ? (reader.result as string) : '');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!weight || !waist || !chest || !hip) return;

    // Formatear fecha
    let finalDate = dateStr.trim();
    if (!finalDate) {
      const now = new Date();
      const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      finalDate = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
    }

    addProgressLog({
      weight,
      waist,
      chest,
      hip,
      date: finalDate,
      photo: photo || PRESET_PHOTOS[Math.floor(Math.random() * PRESET_PHOTOS.length)],
    });

    // Resetear form
    setWeight('');
    setWaist('');
    setChest('');
    setHip('');
    setPhoto('');
    setDateStr('');

    // Cambiar a pestaña de gráficas para ver el nuevo punto de datos
    setActiveTab('charts');
  };

  const photosOnly = useMemo(() => {
    return state.progress.filter((p) => !!p.photo);
  }, [state.progress]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={pm.overlay}>
        <View style={pm.sheet}>
          <View style={pm.sheetHeader}>
            <Text style={pm.sheetTitle}>Progreso Corporal</Text>
            <TouchableOpacity onPress={onClose} style={pm.closeBtn}>
              <Ionicons name="close" size={22} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Subheader tabs */}
          <View style={pm.tabBar}>
            {[
              { id: 'register', label: 'Registrar', icon: 'create-outline' },
              { id: 'charts', label: 'Gráficas', icon: 'analytics-outline' },
              { id: 'photos', label: 'Fotos', icon: 'images-outline' },
            ].map((t) => (
              <TouchableOpacity
                key={t.id}
                style={[pm.tabBtn, activeTab === t.id && pm.tabBtnActive]}
                onPress={() => setActiveTab(t.id as any)}
              >
                <Ionicons name={t.icon as any} size={16} color={activeTab === t.id ? Colors.accent : Colors.textSecondary} />
                <Text style={[pm.tabText, activeTab === t.id && pm.tabTextActive]}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          <ScrollView style={pm.scroll} contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
            {activeTab === 'register' && (
              <View style={pm.form}>
                <Text style={pm.sectionHeading}>Ingresa tus mediciones</Text>

                {/* Fecha */}
                <View style={pm.inputRow}>
                  <Text style={pm.inputLabel}>Fecha (opcional):</Text>
                  <TextInput
                    style={pm.textInput}
                    value={dateStr}
                    onChangeText={setDateStr}
                    placeholder="Ej. 20 May 2026"
                    placeholderTextColor={Colors.textMuted}
                  />
                </View>

                {/* Grid Inputs */}
                <View style={pm.inputsGrid}>
                  <View style={pm.inputCol}>
                    <Text style={pm.inputLabel}>Peso Corporal (kg)</Text>
                    <TextInput
                      style={pm.textInput}
                      value={weight}
                      onChangeText={setWeight}
                      placeholder="0.0"
                      placeholderTextColor={Colors.textMuted}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={pm.inputCol}>
                    <Text style={pm.inputLabel}>Cintura (cm)</Text>
                    <TextInput
                      style={pm.textInput}
                      value={waist}
                      onChangeText={setWaist}
                      placeholder="0"
                      placeholderTextColor={Colors.textMuted}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={pm.inputCol}>
                    <Text style={pm.inputLabel}>Pecho (cm)</Text>
                    <TextInput
                      style={pm.textInput}
                      value={chest}
                      onChangeText={setChest}
                      placeholder="0"
                      placeholderTextColor={Colors.textMuted}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={pm.inputCol}>
                    <Text style={pm.inputLabel}>Cadera (cm)</Text>
                    <TextInput
                      style={pm.textInput}
                      value={hip}
                      onChangeText={setHip}
                      placeholder="0"
                      placeholderTextColor={Colors.textMuted}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                {/* Fotos Section */}
                <Text style={[pm.sectionHeading, { marginTop: 24 }]}>Foto de Progreso</Text>
                
                <View style={pm.photoUploadBox}>
                  {photo ? (
                    <Image source={{ uri: photo }} style={pm.uploadedImage} />
                  ) : (
                    <Ionicons name="camera-outline" size={40} color={Colors.textMuted} />
                  )}
                  
                  <TouchableOpacity style={pm.uploadBtn} onPress={handlePickImage}>
                    <Text style={pm.uploadBtnText}>
                      {photo ? 'Cambiar Foto' : 'Subir Imagen'}
                    </Text>
                  </TouchableOpacity>

                  {Platform.OS === 'web' && (
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  )}
                </View>

                {/* Preset Silhouettes */}
                <Text style={pm.presetTitle}>O selecciona una silueta por defecto:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={pm.presetScroll}>
                  {PRESET_PHOTOS.map((ph, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={[pm.presetCard, photo === ph && pm.presetCardActive]}
                      onPress={() => setPhoto(ph)}
                    >
                      <Image source={{ uri: ph }} style={pm.presetImage} />
                      <Text style={pm.presetLabelText}>Opción {idx + 1}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Guardar Button */}
                <TouchableOpacity
                  style={[pm.saveBtn, (!weight || !waist || !chest || !hip) && pm.saveBtnDisabled]}
                  onPress={handleSave}
                  disabled={!weight || !waist || !chest || !hip}
                >
                  <Text style={pm.saveBtnText}>Guardar Registro</Text>
                </TouchableOpacity>
              </View>
            )}

            {activeTab === 'charts' && (
              <View>
                {/* Metric Selectors */}
                <View style={pm.metricTabBar}>
                  {[
                    { id: 'weight', label: 'Peso' },
                    { id: 'waist', label: 'Cintura' },
                    { id: 'chest', label: 'Pecho' },
                    { id: 'hip', label: 'Cadera' },
                  ].map((m) => (
                    <TouchableOpacity
                      key={m.id}
                      style={[pm.metricTabBtn, activeMetric === m.id && pm.metricTabBtnActive]}
                      onPress={() => setActiveMetric(m.id as any)}
                    >
                      <Text style={[pm.metricTabText, activeMetric === m.id && pm.metricTabTextActive]}>
                        {m.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Evolution Chart */}
                <ProgressChart logs={state.progress} metric={activeMetric} />
              </View>
            )}

            {activeTab === 'photos' && (
              <View style={pm.gallery}>
                {photosOnly.length === 0 ? (
                  <View style={pm.emptyGallery}>
                    <Ionicons name="images-outline" size={44} color={Colors.textMuted} />
                    <Text style={pm.emptyGalleryText}>No hay fotos de progreso registradas.</Text>
                  </View>
                ) : (
                  <View style={pm.galleryGrid}>
                    {photosOnly.map((item) => (
                      <View key={item.id} style={pm.galleryCard}>
                        <Image source={{ uri: item.photo }} style={pm.galleryImage} />
                        <View style={pm.galleryBadge}>
                          <Text style={pm.galleryBadgeDate}>{item.date}</Text>
                          <Text style={pm.galleryBadgeVal}>{item.weight} kg</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const pm = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: Colors.background, borderTopLeftRadius: 28, borderTopRightRadius: 28, height: '90%', paddingHorizontal: 24, paddingTop: 20 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sheetTitle: { fontSize: 20, fontWeight: '800', color: Colors.text, letterSpacing: -0.5 },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },

  // Tabs
  tabBar: { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: 16, padding: 4, marginBottom: 24, borderWidth: 1, borderColor: Colors.surfaceBorder },
  tabBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 12 },
  tabBtnActive: { backgroundColor: Colors.surfaceElevated },
  tabText: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary },
  tabTextActive: { color: Colors.text },

  scroll: { flex: 1 },

  // Form
  form: { gap: 16 },
  sectionHeading: { fontSize: 14, fontWeight: '800', color: Colors.textSecondary, textTransform: 'uppercase', marginBottom: 4 },
  inputRow: { gap: 8 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: Colors.textMuted },
  textInput: { backgroundColor: Colors.surface, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, fontSize: 15, color: Colors.text, borderWidth: 1.5, borderColor: Colors.surfaceBorder },
  inputsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  inputCol: { width: '48%', gap: 6 },

  // Photo
  photoUploadBox: { height: 160, backgroundColor: Colors.surface, borderRadius: 18, alignItems: 'center', justifyContent: 'center', gap: 12, borderWidth: 1.5, borderStyle: 'dashed', borderColor: Colors.surfaceBorder, overflow: 'hidden', position: 'relative' },
  uploadedImage: { width: '100%', height: '100%', position: 'absolute' },
  uploadBtn: { backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderHorizontal: 1, borderColor: 'rgba(255,255,255,0.2)' },
  uploadBtnText: { color: Colors.text, fontSize: 12, fontWeight: '700' },
  presetTitle: { fontSize: 12, fontWeight: '700', color: Colors.textMuted, marginTop: 10 },
  presetScroll: { gap: 10, paddingVertical: 6 },
  presetCard: { width: 80, backgroundColor: Colors.surface, borderRadius: 12, overflow: 'hidden', borderWidth: 2, borderColor: Colors.surfaceBorder, alignItems: 'center' },
  presetCardActive: { borderColor: Colors.accent },
  presetImage: { width: '100%', height: 80 },
  presetLabelText: { fontSize: 10, fontWeight: '600', color: Colors.textSecondary, paddingVertical: 4 },

  saveBtn: { backgroundColor: Colors.accent, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 14, shadowColor: Colors.accent, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: { color: Colors.background, fontSize: 15, fontWeight: '800' },

  // Metric selectors
  metricTabBar: { flexDirection: 'row', gap: 6, marginBottom: 16 },
  metricTabBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 10, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.surfaceBorder },
  metricTabBtnActive: { backgroundColor: Colors.accentMuted, borderColor: Colors.accent },
  metricTabText: { fontSize: 12, fontWeight: '700', color: Colors.textSecondary },
  metricTabTextActive: { color: Colors.accent },

  // Gallery
  gallery: {},
  emptyGallery: { height: 200, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyGalleryText: { color: Colors.textSecondary, fontSize: 13 },
  galleryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  galleryCard: { width: (width - 64) / 2, height: 180, borderRadius: 18, overflow: 'hidden', backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.surfaceBorder },
  galleryImage: { width: '100%', height: '100%' },
  galleryBadge: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.7)', padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  galleryBadgeDate: { fontSize: 10, color: Colors.text, fontWeight: '700' },
  galleryBadgeVal: { fontSize: 11, color: Colors.accent, fontWeight: '800' },
});

// ─── Acciones Rápidas del Dashboard ──────────────────────────────────────────────

function QuickActions() {
  const router = useRouter();
  const { state, restRemaining, restStatus, restPreset } = useWorkout();

  const trainSummary = state.session 
    ? `${state.session.exercises.length} ejercicio(s) en curso`
    : 'Comenzar nueva sesión';

  const restSummary = useMemo(() => {
    if (restStatus === 'running') return `Descanso: ${formatTime(restRemaining)}`;
    if (restStatus === 'paused') return `Pausado: ${formatTime(restRemaining)}`;
    if (restStatus === 'finished') return '¡Listo! Serie siguiente';
    return `Ajuste: ${formatTime(restPreset)}`;
  }, [restRemaining, restStatus, restPreset]);

  const historySummary = `${state.history.length} entrenamiento(s) grabado(s)`;
  const exercisesSummary = `${mockExercises.length} ejercicios en biblioteca`;

  const actions = [
    { label: 'Entrenar', summary: trainSummary, icon: 'barbell-outline' as const, route: '/(tabs)/train', color: Colors.accent, isHighlighted: !!state.session },
    { label: 'Descanso', summary: restSummary, icon: 'timer-outline' as const, route: '/(tabs)/rest', color: '#29B6F6', isHighlighted: restStatus === 'running' || restStatus === 'finished' },
    { label: 'Historial', summary: historySummary, icon: 'time-outline' as const, route: '/(tabs)/history', color: '#FF9800', isHighlighted: false },
    { label: 'Ejercicios', summary: exercisesSummary, icon: 'body-outline' as const, route: '/(tabs)/exercises', color: '#CE93D8', isHighlighted: false },
  ];

  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.sectionTitle}>Mi Dashboard</Text>
      <View style={styles.actionsGrid}>
        {actions.map((a) => (
          <TouchableOpacity
            key={a.label}
            style={[
              styles.actionCard,
              a.isHighlighted && { borderColor: a.color }
            ]}
            onPress={() => router.push(a.route as any)}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconRow]}>
              <View style={[styles.actionIcon, { backgroundColor: a.color + '22' }]}>
                <Ionicons name={a.icon} size={20} color={a.color} />
              </View>
              {a.isHighlighted && (
                <View style={[styles.pulseDot, { backgroundColor: a.label === 'Descanso' && restStatus === 'finished' ? Colors.success : a.color }]} />
              )}
            </View>
            <Text style={styles.actionLabel}>{a.label}</Text>
            <Text style={[styles.actionSubtext, a.isHighlighted && { color: Colors.text }]} numberOfLines={1}>
              {a.summary}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function RecentExercises() {
  const router = useRouter();
  const recents = useMemo(() => mockExercises.slice(0, 4), []);

  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Ejercicios Destacados</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/exercises')}>
          <Text style={styles.seeAll}>Ver todos</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.exercisesList}>
        {recents.map((ex) => (
          <TouchableOpacity
            key={ex.id}
            style={styles.exerciseRow}
            onPress={() => router.push('/(tabs)/exercises')}
            activeOpacity={0.8}
          >
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
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ─── Pantalla Principal ────────────────────────────────────────────────────────

export default function HomeScreen() {
  const [progressVisible, setProgressVisible] = useState(false);

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
        <ProgressCard onOpen={() => setProgressVisible(true)} />
        <QuickActions />
        <RecentExercises />
        <View style={{ height: 20 }} />
      </ScrollView>

      <ProgressModal
        visible={progressVisible}
        onClose={() => setProgressVisible(false)}
      />
    </View>
  );
}

// ─── Estilos Generales ─────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 56 },

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

  emptyLastWorkoutCard: {},
  emptyStateContainer: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 6 },
  emptyEmoji: { fontSize: 40, opacity: 0.8 },
  emptyTextTitle: { fontSize: 14, fontWeight: '700', color: Colors.text },
  emptyTextDesc: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },

  // Tarjeta de Progreso Físico
  progressCard: {},
  emptyProgressCard: {},
  trendBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  trendBadgeText: { fontSize: 11, fontWeight: '700' },
  statChipProgress: { flex: 1, minWidth: 60, backgroundColor: Colors.surfaceElevated, borderRadius: 12, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: Colors.surfaceBorder },
  statLabelProgress: { fontSize: 10, fontWeight: '600', color: Colors.textMuted, marginBottom: 4 },
  statValProgress: { fontSize: 13, fontWeight: '800', color: Colors.text },

  // Quick actions
  sectionTitle: { fontSize: 17, fontWeight: '800', color: Colors.text, marginBottom: 12 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionCard: {
    width: (width - 52) / 2,
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 16,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  actionIconRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 12 },
  actionIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  pulseDot: { width: 8, height: 8, borderRadius: 4 },
  actionLabel: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  actionSubtext: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500', width: '100%' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  seeAll: { fontSize: 13, color: Colors.accent, fontWeight: '600' },

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
