import React, { useContext, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppContext } from '../context/AppContext';
import { colors } from '../theme/colors';
import { MonthSelector } from '../components/MonthSelector';
import { TransactionItem } from '../components/TransactionItem';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;
};

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { state } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');

  const { totalIncome, totalExpense } = useMemo(() => {
    let income = 0;
    let expense = 0;
    state.transactions.forEach((t) => {
      if (t.type === 'income') income += t.amount;
      else expense += t.amount;
    });
    return { totalIncome: income, totalExpense: expense };
  }, [state.transactions]);

  const balance = totalIncome - totalExpense;
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredTransactions = useMemo(() => {
    if (!normalizedQuery) {
      return state.transactions.slice(0, 10);
    }

    return state.transactions.filter((transaction) => {
      const searchableValues = [
        transaction.category,
        transaction.description,
        transaction.date,
        transaction.type,
        transaction.amount.toFixed(2),
      ];

      return searchableValues.some((value) => value.toLowerCase().includes(normalizedQuery));
    });
  }, [normalizedQuery, state.transactions]);

  return (
    <View style={styles.container}>
      <MonthSelector />

      <LinearGradient 
        colors={['#3B7597', '#6FD1D7']} 
        start={{ x: 0, y: 0 }} 
        end={{ x: 1, y: 1 }}
        style={styles.summaryCard}
      >
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceAmount}>
          ₹{balance.toFixed(2)}
        </Text>
        
        <View style={styles.row}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Income</Text>
            <Text style={styles.summaryValue}>+₹{totalIncome.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Expense</Text>
            <Text style={styles.summaryValue}>-₹{totalExpense.toFixed(2)}</Text>
          </View>
        </View>
      </LinearGradient>

      <Text style={styles.sectionTitle}>Recent Transactions</Text>

      <View style={styles.searchContainer}>
        <MaterialCommunityIcons
          name="magnify"
          size={20}
          color={colors.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by category, note, date, amount..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="never"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            style={styles.clearSearchButton}
          >
            <MaterialCommunityIcons name="close-circle" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TransactionItem 
            transaction={item} 
            onPress={() => navigation.navigate('EditTransaction', { transactionId: item.id })}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {normalizedQuery ? 'No transactions match this search.' : 'No transactions this month.'}
          </Text>
        }
      />

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('AddTransaction')}
      >
        <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
  },
  summaryCard: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 24,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#5DF8D8',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  balanceLabel: {
    fontSize: 16,
    color: '#E0E0E0',
    marginBottom: 8,
    opacity: 0.9,
  },
  balanceAmount: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: 16,
  },
  summaryBox: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#E0E0E0',
    marginBottom: 4,
    opacity: 0.9,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    paddingVertical: 14,
    fontSize: 15,
  },
  clearSearchButton: {
    paddingLeft: 8,
    paddingVertical: 8,
  },
  listContent: {
    paddingBottom: 80, // for FAB
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});
