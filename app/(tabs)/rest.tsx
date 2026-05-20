import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Animated,
  Easing,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useWorkout } from '@/context/WorkoutContext';

const PRESETS = [
  { label: '30s',   seconds: 30 },
  { label: '1 min', seconds: 60 },
  { label: '90s',   seconds: 90 },
  { label: '2 min', seconds: 120 },
  { label: '3 min', seconds: 180 },
  { label: '5 min', seconds: 300 },
];

function formatTime(s: number): string {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

// ─── Circular Ring ────────────────────────────────────────────────────────────

const RING_SIZE = 230;
const RING_STROKE = 14;
const HALF = RING_SIZE / 2;

function CircularRing({ progress }: { progress: number }) {
  const pct = Math.max(0, Math.min(1, progress));
  const leftDeg = pct > 0.5 ? (pct - 0.5) * 2 * 180 : 0;
  const rightDeg = Math.min(pct, 0.5) * 2 * 180;

  return (
    <View style={[rg.wrapper, { width: RING_SIZE, height: RING_SIZE }]}>
      <View style={rg.track} />
      <View style={[rg.halfContainer, rg.rightContainer]}>
        <View
          style={[
            rg.halfDisc,
            rg.rightDisc,
            { transform: [{ rotate: `${rightDeg}deg` }] },
          ]}
        />
      </View>
      <View style={[rg.halfContainer, rg.leftContainer]}>
        <View
          style={[
            rg.halfDisc,
            rg.leftDisc,
            {
              transform: [{ rotate: `${pct > 0.5 ? leftDeg : 0}deg` }],
              opacity: pct > 0.5 ? 1 : 0,
            },
          ]}
        />
      </View>
      <View style={rg.inner} />
    </View>
  );
}

const rg = StyleSheet.create({
  wrapper: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  track: {
    position: 'absolute',
    width: RING_SIZE, height: RING_SIZE,
    borderRadius: HALF,
    borderWidth: RING_STROKE,
    borderColor: Colors.surfaceElevated,
  },
  halfContainer: {
    position: 'absolute',
    width: HALF, height: RING_SIZE,
    overflow: 'hidden',
  },
  rightContainer: { right: 0 },
  leftContainer: { left: 0 },
  halfDisc: {
    position: 'absolute',
    width: RING_SIZE, height: RING_SIZE,
    borderRadius: HALF,
    borderWidth: RING_STROKE,
    borderColor: Colors.accent,
  },
  rightDisc: { left: -HALF, transformOrigin: `${HALF}px ${HALF}px` },
  leftDisc: { right: -HALF, transformOrigin: `${HALF}px ${HALF}px` },
  inner: {
    position: 'absolute',
    width: RING_SIZE - RING_STROKE * 2,
    height: RING_SIZE - RING_STROKE * 2,
    borderRadius: (RING_SIZE - RING_STROKE * 2) / 2,
    backgroundColor: Colors.background,
  },
});

// ─── Custom Time Modal ────────────────────────────────────────────────────────

function CustomTimeModal({
  visible,
  onClose,
  onSet,
}: {
  visible: boolean;
  onClose: () => void;
  onSet: (seconds: number) => void;
}) {
  const [mins, setMins] = useState('');
  const [secs, setSecs] = useState('');

  const handleConfirm = () => {
    const m = parseInt(mins || '0', 10);
    const s = parseInt(secs || '0', 10);
    const total = m * 60 + s;
    if (total > 0) {
      onSet(Math.min(total, 5999));
      setMins(''); setSecs('');
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={ct.overlay}>
        <View style={ct.card}>
          <Text style={ct.title}>Tiempo personalizado</Text>
          <View style={ct.inputs}>
            <View style={ct.inputGroup}>
              <TextInput
                style={ct.input}
                value={mins}
                onChangeText={setMins}
                keyboardType="numeric"
                placeholder="00"
                placeholderTextColor={Colors.textMuted}
                maxLength={2}
              />
              <Text style={ct.unit}>min</Text>
            </View>
            <Text style={ct.colon}>:</Text>
            <View style={ct.inputGroup}>
              <TextInput
                style={ct.input}
                value={secs}
                onChangeText={setSecs}
                keyboardType="numeric"
                placeholder="00"
                placeholderTextColor={Colors.textMuted}
                maxLength={2}
              />
              <Text style={ct.unit}>seg</Text>
            </View>
          </View>
          <View style={ct.actions}>
            <TouchableOpacity style={ct.cancelBtn} onPress={onClose}>
              <Text style={ct.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[ct.confirmBtn, (!mins && !secs) && ct.confirmBtnDisabled]}
              onPress={handleConfirm}
            >
              <Text style={ct.confirmText}>Establecer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const ct = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { backgroundColor: Colors.surface, borderRadius: 24, padding: 28, width: '100%', maxWidth: 360, borderWidth: 1, borderColor: Colors.surfaceBorder },
  title: { fontSize: 18, fontWeight: '800', color: Colors.text, marginBottom: 24, textAlign: 'center' },
  inputs: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 28 },
  inputGroup: { alignItems: 'center', gap: 6 },
  input: { width: 80, backgroundColor: Colors.surfaceElevated, borderRadius: 14, paddingVertical: 14, textAlign: 'center', fontSize: 32, fontWeight: '800', color: Colors.text, borderWidth: 1.5, borderColor: Colors.surfaceBorder },
  unit: { fontSize: 12, fontWeight: '700', color: Colors.textMuted },
  colon: { fontSize: 32, fontWeight: '800', color: Colors.textSecondary, marginBottom: 20 },
  actions: { flexDirection: 'row', gap: 10 },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: 'center', backgroundColor: Colors.surfaceElevated, borderWidth: 1, borderColor: Colors.surfaceBorder },
  cancelText: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary },
  confirmBtn: { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: 'center', backgroundColor: Colors.accent },
  confirmBtnDisabled: { opacity: 0.4 },
  confirmText: { fontSize: 14, fontWeight: '800', color: Colors.background },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function RestScreen() {
  const {
    restPreset,
    restRemaining,
    restStatus,
    setRestPreset,
    startRest,
    pauseRest,
    resetRest,
    addRestTime,
    skipRest,
  } = useWorkout();

  const [customVisible, setCustomVisible] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const startPulse = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.06, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, [pulseAnim]);

  const stopPulse = useCallback(() => {
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  }, [pulseAnim]);

  // Synchronize pulse loop with global restStatus
  useEffect(() => {
    if (restStatus === 'finished') {
      startPulse();
    } else {
      stopPulse();
    }
  }, [restStatus, startPulse, stopPulse]);

  const progress = restPreset > 0 ? restRemaining / restPreset : 0;
  const isFinished = restStatus === 'finished';
  const isRunning = restStatus === 'running';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.screenTitle}>Descanso</Text>
        <Text style={styles.screenSubtitle}>
          {isFinished
            ? '¡Tiempo! Listo para la siguiente serie'
            : isRunning
            ? 'Descansando...'
            : restStatus === 'paused'
            ? 'Pausado'
            : 'Elige un tiempo y empieza'}
        </Text>

        <View style={styles.ringSection}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }], alignItems: 'center', justifyContent: 'center' }}>
            <CircularRing progress={isFinished ? 0 : progress} />
            <View style={styles.ringCenter}>
              <Text style={[styles.timeText, isFinished && styles.timeTextFinished]}>
                {isFinished ? '¡Listo!' : formatTime(restRemaining)}
              </Text>
              {!isFinished && (
                <Text style={styles.totalLabel}>de {formatTime(restPreset)}</Text>
              )}
            </View>
          </Animated.View>
        </View>

        <View style={styles.addTimeRow}>
          {[30, 60].map((s) => (
            <TouchableOpacity
              key={s}
              style={styles.addTimeBtn}
              onPress={() => addRestTime(s)}
            >
              <Ionicons name="add" size={14} color={Colors.text} />
              <Text style={styles.addTimeText}>{s < 60 ? `${s}s` : `${s / 60}min`}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.controlsRow}>
          <TouchableOpacity style={styles.resetBtn} onPress={resetRest}>
            <Ionicons name="refresh" size={22} color={Colors.text} />
          </TouchableOpacity>

          {isRunning ? (
            <TouchableOpacity style={styles.playPauseBtn} onPress={pauseRest}>
              <Ionicons name="pause" size={32} color={Colors.background} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.playPauseBtn, isFinished && styles.playPauseBtnFinished]} onPress={startRest}>
              <Ionicons name="play" size={32} color={Colors.background} />
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.skipBtn} onPress={skipRest}>
            <Ionicons name="play-skip-forward" size={22} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.presetsLabel}>Preajustes</Text>
        <View style={styles.presetsGrid}>
          {PRESETS.map((p) => (
            <TouchableOpacity
              key={p.seconds}
              style={[styles.presetBtn, restPreset === p.seconds && restStatus === 'idle' && styles.presetBtnActive]}
              onPress={() => setRestPreset(p.seconds)}
            >
              <Text style={[styles.presetText, restPreset === p.seconds && restStatus === 'idle' && styles.presetTextActive]}>
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.presetBtn}
            onPress={() => setCustomVisible(true)}
          >
            <Ionicons name="create-outline" size={14} color={Colors.textSecondary} style={{ marginBottom: 2 }} />
            <Text style={styles.presetText}>Custom</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statusBar}>
          <View style={styles.statusItem}>
            <Ionicons name="time-outline" size={16} color={Colors.accent} />
            <Text style={styles.statusLabel}>Tiempo restante</Text>
            <Text style={styles.statusValue}>{formatTime(restRemaining)}</Text>
          </View>
          <View style={styles.statusDivider} />
          <View style={styles.statusItem}>
            <Ionicons name="hourglass-outline" size={16} color={Colors.accent} />
            <Text style={styles.statusLabel}>Tiempo total</Text>
            <Text style={styles.statusValue}>{formatTime(restPreset)}</Text>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      <CustomTimeModal
        visible={customVisible}
        onClose={() => setCustomVisible(false)}
        onSet={setRestPreset}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 56, alignItems: 'center' },

  screenTitle: { fontSize: 28, fontWeight: '800', color: Colors.text, letterSpacing: -0.5, alignSelf: 'flex-start' },
  screenSubtitle: { fontSize: 14, color: Colors.textSecondary, marginTop: 4, marginBottom: 32, alignSelf: 'flex-start' },

  ringSection: { alignItems: 'center', justifyContent: 'center', marginBottom: 28 },
  ringCenter: { position: 'absolute', alignItems: 'center' },
  timeText: { fontSize: 52, fontWeight: '900', color: Colors.text, letterSpacing: -2 },
  timeTextFinished: { color: Colors.accent, fontSize: 40 },
  totalLabel: { fontSize: 13, color: Colors.textMuted, fontWeight: '600', marginTop: -4 },

  addTimeRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  addTimeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.surface, borderRadius: 14,
    paddingHorizontal: 20, paddingVertical: 11,
    borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  addTimeText: { fontSize: 14, fontWeight: '700', color: Colors.text },

  controlsRow: { flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 36 },
  resetBtn: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  playPauseBtn: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.accent, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45, shadowRadius: 16, elevation: 12,
  },
  playPauseBtnFinished: { backgroundColor: Colors.success },
  skipBtn: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.surfaceBorder,
  },

  presetsLabel: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary, alignSelf: 'flex-start', marginBottom: 10 },
  presetsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, alignSelf: 'stretch', marginBottom: 24 },
  presetBtn: {
    flex: 1, minWidth: 70, alignItems: 'center', justifyContent: 'center',
    paddingVertical: 12, borderRadius: 14,
    backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.surfaceBorder,
  },
  presetBtnActive: { backgroundColor: Colors.accentMuted, borderColor: Colors.accent },
  presetText: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary },
  presetTextActive: { color: Colors.accent },

  statusBar: {
    flexDirection: 'row', alignSelf: 'stretch',
    backgroundColor: Colors.surface, borderRadius: 18,
    padding: 18, justifyContent: 'space-around', alignItems: 'center',
    borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  statusItem: { alignItems: 'center', gap: 6, flex: 1 },
  statusLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '600' },
  statusValue: { fontSize: 16, fontWeight: '800', color: Colors.text },
  statusDivider: { width: 1, height: 40, backgroundColor: Colors.surfaceBorder },
});
