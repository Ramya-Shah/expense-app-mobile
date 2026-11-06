import React, { useContext, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppContext } from '../context/AppContext';
import { colors } from '../theme/colors';
import { MonthSelector } from '../components/MonthSelector';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;
};

export const BudgetScreen: React.FC<Props> = ({ navigation }) => {
  const { state } = useContext(AppContext);

  const budgetData = useMemo(() => {
    return state.categories.map(cat => {
      const spent = state.transactions
        .filter(t => t.category === cat.name && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const budget = state.budgets.find(b => b.category === cat.name);
      const limit_amount = budget ? budget.limit_amount : 0;

      return {
        category: cat.name,
        spent,
        limit_amount,
      };
    }).sort((a, b) => b.spent - a.spent);
  }, [state.categories, state.transactions, state.budgets]);

  const renderItem = ({ item }: { item: typeof budgetData[0] }) => {
    const progress = item.limit_amount > 0 ? Math.min(item.spent / item.limit_amount, 1) : 0;
    const overBudget = item.limit_amount > 0 && item.spent > item.limit_amount;

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('EditBudget', {
            category: item.category,
            limit_amount: item.limit_amount,
            month: state.currentMonth,
          })
        }
      >
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.categoryName}>{item.category}</Text>
            <Text style={[styles.spendAmount, overBudget && { color: colors.expense }]}>
              ₹{item.spent.toFixed(2)}
            </Text>
          </View>
          {item.limit_amount > 0 ? (
            <>
              <ProgressBar progress={progress} />
              <Text style={styles.limitText}>
                Budget: ₹{item.limit_amount.toFixed(2)}
              </Text>
            </>
          ) : (
            <Text style={styles.limitText}>Tap to set a budget</Text>
          )}
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <MonthSelector />
      <FlatList
        data={budgetData}
        keyExtractor={(item) => item.category}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    marginBottom: 12,
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  spendAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  limitText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 6,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: 24,
    fontSize: 16,
  },
});
