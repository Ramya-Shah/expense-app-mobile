import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { HomeScreen } from '../screens/HomeScreen';
import { BudgetScreen } from '../screens/BudgetScreen';
import { SavingsScreen } from '../screens/SavingsScreen';
import { InsightsScreen } from '../screens/InsightsScreen';
import { AddTransactionScreen } from '../screens/AddTransactionScreen';
import { AddGoalScreen } from '../screens/AddGoalScreen';
import { GoalDetailScreen } from '../screens/GoalDetailScreen';
import { EditBudgetScreen } from '../screens/EditBudgetScreen';
import { EditTransactionScreen } from '../screens/EditTransactionScreen';

import { colors } from '../theme/colors';

export type RootStackParamList = {
  MainTabs: undefined;
  AddTransaction: undefined;
  EditTransaction: { transactionId: number };
  AddGoal: undefined;
  GoalDetail: { goalId: number };
  EditBudget: { category: string; limit: number; month: string };
};

export type MainTabParamList = {
  Home: undefined;
  Budget: undefined;
  Savings: undefined;
  Insights: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.background, // Navy
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarStyle: {
          backgroundColor: colors.background, // Navy
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: colors.primary, // Mint
          shadowOpacity: 0.1,
          shadowRadius: 10,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary, // Mint
        tabBarInactiveTintColor: colors.textSecondary, // Teal for inactive
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Budget"
        component={BudgetScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="wallet" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Savings"
        component={SavingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="piggy-bank" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Insights"
        component={InsightsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-donut" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const RootNavigator = () => {
  const linking = {
    prefixes: ['expensetracker://'],
    config: {
      screens: {
        AddTransaction: 'add',
        MainTabs: {
          screens: {
            Home: '',
          },
        },
      },
    },
  };

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="AddTransaction" 
          component={AddTransactionScreen} 
          options={{ title: 'New Transaction', presentation: 'modal' }}
        />
        <Stack.Screen 
          name="EditTransaction" 
          component={EditTransactionScreen} 
          options={{ title: 'Edit Transaction', presentation: 'modal' }}
        />
        <Stack.Screen
          name="GoalDetail"
          component={GoalDetailScreen}
          options={{ title: 'Goal Details' }}
        />
        <Stack.Screen
          name="EditBudget"
          component={EditBudgetScreen}
          options={{ title: 'Edit Budget', presentation: 'modal' }}
        />
        <Stack.Screen
          name="AddGoal"
          component={AddGoalScreen}
          options={{ title: 'Create Goal', presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
