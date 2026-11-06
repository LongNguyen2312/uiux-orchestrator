import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';

const steps = [
  { title: 'Track every call', body: 'See API usage across all your projects in one place.' },
  { title: 'Set spend caps', body: 'Get alerted before a runaway job costs you money.' },
  { title: 'Ship with confidence', body: 'Latency and error budgets, right on your phone.' },
];

// Fixture: step changes are instant, the button has no pressed feedback,
// and the progress dots jump. This is the "abrupt onboarding" the test asks to improve.
export function Onboarding() {
  const theme = useTheme();
  const [index, setIndex] = useState(0);
  const step = steps[index];
  const last = index === steps.length - 1;

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.illustration}>
          <View style={[styles.blob, { backgroundColor: theme.backgroundSelected }]} />
        </View>
        <View style={styles.copy}>
          <ThemedText type="subtitle">{step.title}</ThemedText>
          <ThemedText themeColor="textSecondary">{step.body}</ThemedText>
        </View>
        <View style={styles.dots}>
          {steps.map((s, i) => (
            <View
              key={s.title}
              style={[styles.dot, { backgroundColor: i === index ? theme.text : theme.backgroundSelected }]}
            />
          ))}
        </View>
        <Pressable
          onPress={() => setIndex(last ? 0 : index + 1)}
          style={[styles.button, { backgroundColor: theme.text }]}>
          <ThemedText style={{ color: theme.background }} type="smallBold">
            {last ? 'Get started' : 'Continue'}
          </ThemedText>
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: 24, paddingBottom: 24, gap: 24 },
  illustration: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  blob: { width: 220, height: 220, borderRadius: 110 },
  copy: { gap: 8 },
  dots: { flexDirection: 'row', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  button: { height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});
