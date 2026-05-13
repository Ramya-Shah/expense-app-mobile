import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppContext } from '../context/AppContext';
import { colors } from '../theme/colors';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;
};

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 columns, 16px padding on sides + 16px between

export const SavingsScreen: React.FC<Props> = ({ navigation }) => {
  const { state } = useContext(AppContext);

  const renderItem = ({ item }: { item: typeof state.savingsGoals[0] }) => {
    const progress = item.target_amount > 0 ? item.current_amount / item.target_amount : 0;

    return (
      <TouchableOpacity onPress={() => navigation.navigate('GoalDetail', { goalId: item.id })}>
        <Card style={styles.card}>
          <Text style={styles.emoji}>{item.emoji || '🎯'}</Text>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.amount}>₹{item.current_amount.toFixed(0)}</Text>
          {item.target_amount > 0 && (
            <>
              <Text style={styles.target}>of ₹{item.target_amount.toFixed(0)}</Text>
              <View style={styles.progressContainer}>
                <ProgressBar progress={progress} />
              </View>
            </>
          )}
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={state.savingsGoals}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={
          <Text style={styles.headerTitle}>Savings Goals</Text>
        }
      />
      
      <TouchableOpacity 
        style={styles.fab}
        // Need to add create goal screen, but for now we'll just navigate to a placeholder or modal
        // Wait, I didn't define AddGoalScreen. Let's add it or repurpose GoalDetail.
        // Actually, just alert for now.
        onPress={() => navigation.navigate('AddGoal')}
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
  listContent: {
    paddingVertical: 16,
    paddingBottom: 80,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  card: {
    width: cardWidth,
    marginBottom: 16,
    alignItems: 'center',
    padding: 12,
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  target: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  progressContainer: {
    width: '100%',
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
