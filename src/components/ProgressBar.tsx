import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface ProgressBarProps {
  progress: number; // 0 to 1
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const percentage = Math.min(Math.max(progress, 0), 1);
  
  let color = colors.progress.good;
  if (percentage >= 0.9) {
    color = colors.progress.danger;
  } else if (percentage >= 0.6) {
    color = colors.progress.warning;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.fill, { width: `${percentage * 100}%`, backgroundColor: color }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 12,
    backgroundColor: colors.border,
    borderRadius: 6,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
    borderRadius: 6,
  },
});
