import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AppContext } from '../context/AppContext';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'EditTransaction'>;
  route: RouteProp<RootStackParamList, 'EditTransaction'>;
};

export const EditTransactionScreen: React.FC<Props> = ({ navigation, route }) => {
  const { transactionId } = route.params;
  const { state, updateTransactionAsync, deleteTransactionAsync, addCategoryAsync } = useContext(AppContext);
  
  const transaction = state.transactions.find(t => t.id === transactionId);

  // If not found, show error
  if (!transaction) {
    return (
      <View style={styles.container}>
        <Text style={{color: colors.text}}>Transaction not found.</Text>
      </View>
    );
  }

  const [type, setType] = useState<'expense' | 'income'>(transaction.type);
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [description, setDescription] = useState(transaction.description);
  const [category, setCategory] = useState(transaction.category);
  const [date, setDate] = useState(transaction.date);
  const [newCategory, setNewCategory] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const handleSave = async () => {
    if (!amount || isNaN(Number(amount))) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    
    let finalCategory = category;
    if (isAddingCategory && newCategory.trim()) {
      await addCategoryAsync(newCategory.trim());
      finalCategory = newCategory.trim();
    }

    if (!finalCategory) {
      Alert.alert('Error', 'Please select or enter a category');
      return;
    }

    const dateRegex = /^\d{2} \d{2} \d{4}$/;
    if (!dateRegex.test(date)) {
      Alert.alert('Error', 'Date must be in dd mm yyyy format');
      return;
    }

    await updateTransactionAsync(transactionId, {
      type,
      amount: Number(amount),
      description,
      category: finalCategory,
      date,
    });

    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert('Delete Transaction', 'Are you sure you want to delete this transaction?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: async () => {
          await deleteTransactionAsync(transactionId);
          navigation.goBack();
        }
      }
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.toggleContainer}>
        <TouchableOpacity 
          style={[styles.toggleButton, type === 'expense' && styles.expenseActive]}
          onPress={() => setType('expense')}
        >
          <Text style={[styles.toggleText, type === 'expense' && { color: '#FFF' }]}>Expense</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.toggleButton, type === 'income' && styles.incomeActive]}
          onPress={() => setType('income')}
        >
          <Text style={[styles.toggleText, type === 'income' && { color: '#FFF' }]}>Income</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Amount (₹)</Text>
      <TextInput
        style={styles.amountInput}
        keyboardType="numeric"
        placeholder="0.00"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        placeholder="What was this for?"
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Category</Text>
      {!isAddingCategory ? (
        <View style={styles.categoryContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {/* Make sure the current category is shown even if it was deleted from globals or is custom */}
            {!state.categories.find(c => c.name === category) && (
               <TouchableOpacity
                style={[styles.categoryChip, styles.categoryChipActive]}
                onPress={() => setCategory(category)}
              >
                <Text style={[styles.categoryText, styles.categoryTextActive]}>
                  {category}
                </Text>
              </TouchableOpacity>
            )}
            
            {state.categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryChip, category === cat.name && styles.categoryChipActive]}
                onPress={() => setCategory(cat.name)}
              >
                <Text style={[styles.categoryText, category === cat.name && styles.categoryTextActive]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity 
            style={styles.addCategoryBtn}
            onPress={() => setIsAddingCategory(true)}
          >
            <Text style={styles.addCategoryText}>+ Custom</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.newCategoryContainer}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="New Category Name"
            value={newCategory}
            onChangeText={setNewCategory}
          />
          <TouchableOpacity 
            style={styles.cancelCategoryBtn}
            onPress={() => {
              setIsAddingCategory(false);
              setNewCategory('');
            }}
          >
            <Text style={styles.cancelCategoryText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.label}>Date (dd mm yyyy)</Text>
      <TextInput
        style={styles.input}
        value={date}
        onChangeText={setDate}
        placeholder="dd mm yyyy"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Update Transaction</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Delete Transaction</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  expenseActive: {
    backgroundColor: colors.expense,
  },
  incomeActive: {
    backgroundColor: colors.income,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  amountInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
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
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  categoryChip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    color: colors.text,
  },
  categoryTextActive: {
    color: '#FFF',
  },
  addCategoryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addCategoryText: {
    color: colors.tabIconSelected,
    fontWeight: 'bold',
  },
  newCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  cancelCategoryBtn: {
    marginLeft: 16,
  },
  cancelCategoryText: {
    color: colors.expense,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 1,
    borderColor: colors.expense,
  },
  deleteButtonText: {
    color: colors.expense,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
