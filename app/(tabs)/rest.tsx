import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

const PRESETS = [30, 60, 90, 120, 180];
const TOTAL_DEFAULT = 90;

function CircleTimer({
  seconds,
  total,
}: {
  seconds: number;
  total: number;
}) {
  const pct = total > 0 ? Math.max(0, seconds / total) : 0;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const label = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  // SVG-style ring using border trick
  const SIZE = 220;
  const STROKE = 12;
  const circumference = Math.PI * (SIZE - STROKE);

  return (
    <View style={[styles.ringWrapper, { width: SIZE, height: SIZE }]}>
      {/* Fondo del anillo */}
      <View
        style={[
          styles.ringBase,
          {
            width: SIZE,
            height: SIZE,
            borderRadius: SIZE / 2,
            borderWidth: STROKE,
            borderColor: Colors.surfaceElevated,
          },
        ]}
      />
      {/* Anillo de progreso (simulado con opacidad del acento) */}
      <View
        style={[
          styles.ringProgress,
          {
            width: SIZE,
            height: SIZE,
            borderRadius: SIZE / 2,
            borderWidth: STROKE,
            borderColor: Colors.accent,
            opacity: pct,
          },
        ]}
      />
      {/* Tiempo */}
      <View style={styles.timerInner}>
        <Text style={styles.timerLabel}>{label}</Text>
        <Text style={styles.timerSub}>restante</Text>
      </View>
    </View>
  );
}

export default function RestScreen() {
  const [totalTime, setTotalTime] = useState(TOTAL_DEFAULT);
  const [timeLeft, setTimeLeft] = useState(TOTAL_DEFAULT);

  const adjustTime = (delta: number) => {
    const next = Math.max(10, timeLeft + delta);
    setTimeLeft(next);
    setTotalTime(next);
  };

  const selectPreset = (secs: number) => {
    setTotalTime(secs);
    setTimeLeft(secs);
  };

  const skipRest = () => {
    setTimeLeft(0);
  };

  const resetTimer = () => {
    setTimeLeft(totalTime);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Título */}
      <Text style={styles.screenTitle}>Descanso</Text>
      <Text style={styles.screenSubtitle}>Recupera energía antes de la siguiente serie</Text>

      {/* Anillo temporizador */}
      <View style={styles.timerSection}>
        <CircleTimer seconds={timeLeft} total={totalTime} />
      </View>

      {/* Controles +/- tiempo */}
      <View style={styles.adjustRow}>
        <TouchableOpacity style={styles.adjustBtn} onPress={() => adjustTime(-15)}>
          <Text style={styles.adjustBtnText}>-15s</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.adjustBtn} onPress={() => adjustTime(-30)}>
          <Text style={styles.adjustBtnText}>-30s</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.adjustBtn} onPress={() => adjustTime(+30)}>
          <Text style={styles.adjustBtnText}>+30s</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.adjustBtn} onPress={() => adjustTime(+60)}>
          <Text style={styles.adjustBtnText}>+60s</Text>
        </TouchableOpacity>
      </View>

      {/* Presets */}
      <Text style={styles.presetsLabel}>Presets rápidos</Text>
      <View style={styles.presetsRow}>
        {PRESETS.map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.presetChip, totalTime === p && styles.presetChipActive]}
            onPress={() => selectPreset(p)}
          >
            <Text style={[styles.presetChipText, totalTime === p && styles.presetChipTextActive]}>
              {p >= 60 ? `${p / 60}min` : `${p}s`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Botones principales */}
      <View style={styles.mainActions}>
        <TouchableOpacity style={styles.resetBtn} onPress={resetTimer}>
          <Ionicons name="refresh" size={20} color={Colors.text} />
          <Text style={styles.resetBtnText}>Reiniciar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.skipBtn} onPress={skipRest}>
          <Ionicons name="play-skip-forward" size={20} color={Colors.background} />
          <Text style={styles.skipBtnText}>Saltar</Text>
        </TouchableOpacity>
      </View>

      {/* Indicador de última serie */}
      <View style={styles.lastSetInfo}>
        <Ionicons name="information-circle-outline" size={16} color={Colors.textMuted} />
        <Text style={styles.lastSetText}>
          Última serie completada: Press Banca · 80 kg × 8 reps
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: Colors.background,
    paddingHorizontal: 24, paddingTop: 56, alignItems: 'center',
  },

  screenTitle: {
    fontSize: 28, fontWeight: '800', color: Colors.text,
    letterSpacing: -0.5, alignSelf: 'flex-start',
  },
  screenSubtitle: {
    fontSize: 14, color: Colors.textSecondary,
    marginTop: 4, marginBottom: 32, alignSelf: 'flex-start',
  },

  // Anillo
  timerSection: { alignItems: 'center', marginBottom: 36 },
  ringWrapper: { alignItems: 'center', justifyContent: 'center', position: 'relative' },
  ringBase: { position: 'absolute' },
  ringProgress: { position: 'absolute' },
  timerInner: { alignItems: 'center' },
  timerLabel: { fontSize: 56, fontWeight: '800', color: Colors.text, letterSpacing: -2 },
  timerSub: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600', marginTop: -4 },

  // Ajustes
  adjustRow: { flexDirection: 'row', gap: 10, marginBottom: 28 },
  adjustBtn: {
    paddingHorizontal: 18, paddingVertical: 10,
    backgroundColor: Colors.surfaceElevated, borderRadius: 12,
    borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  adjustBtnText: { fontSize: 14, fontWeight: '700', color: Colors.text },

  // Presets
  presetsLabel: {
    fontSize: 13, fontWeight: '700', color: Colors.textSecondary,
    alignSelf: 'flex-start', marginBottom: 10,
  },
  presetsRow: { flexDirection: 'row', gap: 10, marginBottom: 32 },
  presetChip: {
    paddingHorizontal: 18, paddingVertical: 10,
    backgroundColor: Colors.surface, borderRadius: 12,
    borderWidth: 1.5, borderColor: Colors.surfaceBorder,
  },
  presetChipActive: { backgroundColor: Colors.accentMuted, borderColor: Colors.accent },
  presetChipText: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary },
  presetChipTextActive: { color: Colors.accent },

  // Acciones principales
  mainActions: { flexDirection: 'row', gap: 12, width: '100%', marginBottom: 24 },
  resetBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 16, borderRadius: 18,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  resetBtnText: { fontSize: 15, fontWeight: '700', color: Colors.text },
  skipBtn: {
    flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 16, borderRadius: 18,
    backgroundColor: Colors.accent,
  },
  skipBtnText: { fontSize: 15, fontWeight: '800', color: Colors.background },

  // Info última serie
  lastSetInfo: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.surface, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 12,
    width: '100%', borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  lastSetText: { fontSize: 12, color: Colors.textMuted, flex: 1, lineHeight: 18 },
});
