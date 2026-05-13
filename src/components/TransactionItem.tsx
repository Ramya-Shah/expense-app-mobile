import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Transaction } from '../database/db';
import { colors } from '../theme/colors';
import { Card } from './Card';

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onPress }) => {
  const isExpense = transaction.type === 'expense';

  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <Card style={styles.container}>
        <View style={styles.left}>
          <Text style={styles.category}>{transaction.category}</Text>
          <Text style={styles.description} numberOfLines={1}>
            {transaction.description || (isExpense ? 'Expense' : 'Income')}
          </Text>
          <Text style={styles.date}>{transaction.date}</Text>
        </View>
        <View style={styles.right}>
          <Text style={[styles.amount, { color: isExpense ? colors.expense : colors.income }]}>
            {isExpense ? '-' : '+'}₹{transaction.amount.toFixed(2)}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  left: {
    flex: 1,
    paddingRight: 12,
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  right: {
    justifyContent: 'center',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
