import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AppContext } from '../context/AppContext';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../navigation/RootNavigator';
import { ProgressBar } from '../components/ProgressBar';
import { format } from 'date-fns';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'GoalDetail'>;
  route: RouteProp<RootStackParamList, 'GoalDetail'>;
};

export const GoalDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { goalId } = route.params;
  const { state, addMoneyToGoalAsync, addTransactionAsync } = useContext(AppContext);
  
  const goal = state.savingsGoals.find(g => g.id === goalId);
  const [amount, setAmount] = useState('');

  if (!goal) {
    return (
      <View style={styles.container}>
        <Text>Goal not found.</Text>
      </View>
    );
  }

  const progress = goal.target_amount > 0 ? goal.current_amount / goal.target_amount : 0;

  const handleAddFunds = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const value = Number(amount);

    // 1. Add to Goal
    await addMoneyToGoalAsync(goal.id, value);

    // 2. Add as an Expense transaction (Transfer to Savings)
    // We will use "Savings" as category. If it doesn't exist, it will just show as custom.
    const todayStr = format(new Date(), 'dd MM yyyy');
    await addTransactionAsync({
      type: 'expense',
      amount: value,
      description: `Deposit to ${goal.name}`,
      category: 'Savings',
      date: todayStr,
    });

    Alert.alert('Success', `Added ₹${value.toFixed(2)} to ${goal.name}!`);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.emoji}>{goal.emoji || '🎯'}</Text>
        <Text style={styles.title}>{goal.name}</Text>
        
        <View style={styles.amountsRow}>
          <Text style={styles.currentAmount}>₹{goal.current_amount.toFixed(2)}</Text>
          {goal.target_amount > 0 && (
            <Text style={styles.targetAmount}>of ₹{goal.target_amount.toFixed(2)}</Text>
          )}
        </View>
        {goal.target_amount > 0 && <ProgressBar progress={progress} />}
      </View>

      <Text style={styles.label}>Add Funds (₹)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="0.00"
        value={amount}
        onChangeText={setAmount}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleAddFunds}>
        <Text style={styles.saveButtonText}>Add to Goal</Text>
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
  headerCard: {
    backgroundColor: colors.surface,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 24,
  },
  amountsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
    width: '100%',
    justifyContent: 'space-between',
  },
  currentAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  targetAmount: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: colors.progress.good,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
