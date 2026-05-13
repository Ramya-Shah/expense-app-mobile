import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppContext } from '../context/AppContext';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddGoal'>;
};

export const AddGoalScreen: React.FC<Props> = ({ navigation }) => {
  const { addSavingsGoalAsync } = useContext(AppContext);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🎯');
  const [targetAmount, setTargetAmount] = useState('');

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a goal name');
      return;
    }
    if (targetAmount && (isNaN(Number(targetAmount)) || Number(targetAmount) < 0)) {
      Alert.alert('Error', 'Please enter a valid target amount or leave it blank');
      return;
    }

    await addSavingsGoalAsync({
      name: name.trim(),
      emoji: emoji.trim() || '🎯',
      target_amount: targetAmount ? Number(targetAmount) : 0,
      created_at: new Date().toISOString(),
    });

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Goal Emoji</Text>
      <TextInput
        style={styles.emojiInput}
        placeholder="🎯"
        value={emoji}
        onChangeText={setEmoji}
        maxLength={2}
      />

      <Text style={styles.label}>Goal Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. New Car"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Target Amount (₹) - Optional</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Leave blank for open-ended savings"
        value={targetAmount}
        onChangeText={setTargetAmount}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Create Goal</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  emojiInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    fontSize: 32,
    marginBottom: 24,
    textAlign: 'center',
    width: 80,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 24,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
