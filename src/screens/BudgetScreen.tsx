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
    // Only show categories that have transactions this month, or all custom categories
    return state.categories.map(cat => {
      const spent = state.transactions
        .filter(t => t.category === cat.name && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        category: cat.name,
        spent,
      };
    }).sort((a, b) => b.spent - a.spent);
  }, [state.categories, state.transactions]);

  const renderItem = ({ item }: { item: typeof budgetData[0] }) => {
    return (
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.categoryName}>{item.category}</Text>
          <Text style={styles.spendAmount}>₹{item.spent.toFixed(2)}</Text>
        </View>
      </Card>
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
    color: colors.expense,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: 24,
    fontSize: 16,
  },
});
