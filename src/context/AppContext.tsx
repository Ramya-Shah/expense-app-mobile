import React, { createContext, useReducer, ReactNode, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import {
  initDB,
  getTransactions,
  getBudgets,
  getSavingsGoals,
  getCategories,
  Transaction,
  Budget,
  SavingsGoal,
  Category,
  addTransaction as dbAddTransaction,
  addCategory as dbAddCategory,
  setBudget as dbSetBudget,
  addSavingsGoal as dbAddSavingsGoal,
  updateSavingsGoalAmount as dbUpdateSavingsGoalAmount,
  updateTransaction as dbUpdateTransaction,
  deleteTransaction as dbDeleteTransaction,
} from '../database/db';

export interface AppState {
  currentMonth: string; // YYYY-MM
  transactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  categories: Category[];
  isDBReady: boolean;
}

type Action =
  | { type: 'SET_DB_READY' }
  | { type: 'SET_MONTH'; payload: string }
  | { type: 'LOAD_DATA'; payload: { transactions: Transaction[]; budgets: Budget[]; savingsGoals: SavingsGoal[]; categories: Category[] } }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'SET_BUDGET'; payload: Budget }
  | { type: 'ADD_SAVINGS_GOAL'; payload: SavingsGoal }
  | { type: 'UPDATE_SAVINGS_GOAL'; payload: { id: number; amountToAdd: number } };

const initialState: AppState = {
  currentMonth: format(new Date(), 'yyyy-MM'),
  transactions: [],
  budgets: [],
  savingsGoals: [],
  categories: [],
  isDBReady: false,
};

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_DB_READY':
      return { ...state, isDBReady: true };
    case 'SET_MONTH':
      return { ...state, currentMonth: action.payload };
    case 'LOAD_DATA':
      return {
        ...state,
        transactions: action.payload.transactions,
        budgets: action.payload.budgets,
        savingsGoals: action.payload.savingsGoals,
        categories: action.payload.categories,
      };
    case 'ADD_TRANSACTION':
      // Only add to state if it belongs to current month, or just reload data
      return {
        ...state,
        transactions: [action.payload, ...state.transactions].sort((a, b) => {
          // Sort descending by id since date might be same day
          return b.id - a.id; 
        }),
      };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'SET_BUDGET': {
      const existingIdx = state.budgets.findIndex((b) => b.category === action.payload.category && b.month === action.payload.month);
      if (existingIdx >= 0) {
        const newBudgets = [...state.budgets];
        newBudgets[existingIdx] = action.payload;
        return { ...state, budgets: newBudgets };
      }
      return { ...state, budgets: [...state.budgets, action.payload] };
    }
    case 'ADD_SAVINGS_GOAL':
      return { ...state, savingsGoals: [...state.savingsGoals, action.payload] };
    case 'UPDATE_SAVINGS_GOAL':
      return {
        ...state,
        savingsGoals: state.savingsGoals.map((g) =>
          g.id === action.payload.id ? { ...g, current_amount: g.current_amount + action.payload.amountToAdd } : g
        ),
      };
    default:
      return state;
  }
};

export const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
  refreshData: () => void;
  addTransactionAsync: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransactionAsync: (id: number, transaction: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransactionAsync: (id: number) => Promise<void>;
  addCategoryAsync: (name: string) => Promise<void>;
  setBudgetAsync: (budget: Omit<Budget, 'id'>) => Promise<void>;
  addSavingsGoalAsync: (goal: Omit<SavingsGoal, 'id' | 'current_amount'>) => Promise<void>;
  addMoneyToGoalAsync: (id: number, amountToAdd: number) => Promise<void>;
}>({
  state: initialState,
  dispatch: () => null,
  refreshData: () => null,
  addTransactionAsync: async () => {},
  updateTransactionAsync: async () => {},
  deleteTransactionAsync: async () => {},
  addCategoryAsync: async () => {},
  setBudgetAsync: async () => {},
  addSavingsGoalAsync: async () => {},
  addMoneyToGoalAsync: async () => {},
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const refreshData = useCallback(() => {
    if (!state.isDBReady) return;
    const transactions = getTransactions(state.currentMonth);
    const budgets = getBudgets(state.currentMonth);
    const savingsGoals = getSavingsGoals();
    const categories = getCategories();
    dispatch({ type: 'LOAD_DATA', payload: { transactions, budgets, savingsGoals, categories } });
  }, [state.currentMonth, state.isDBReady]);

  // Init DB on mount
  useEffect(() => {
    try {
      initDB();
      dispatch({ type: 'SET_DB_READY' });
    } catch (error) {
      console.error('Failed to init DB:', error);
    }
  }, []);

  // Reload data when month or dbReady changes
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const addTransactionAsync = async (transaction: Omit<Transaction, 'id'>) => {
    const id = dbAddTransaction(transaction);
    refreshData();
  };

  const updateTransactionAsync = async (id: number, transaction: Omit<Transaction, 'id'>) => {
    dbUpdateTransaction(id, transaction);
    refreshData();
  };

  const deleteTransactionAsync = async (id: number) => {
    dbDeleteTransaction(id);
    refreshData();
  };

  const addCategoryAsync = async (name: string) => {
    dbAddCategory(name);
    refreshData();
  };

  const setBudgetAsync = async (budget: Omit<Budget, 'id'>) => {
    dbSetBudget(budget);
    refreshData();
  };

  const addSavingsGoalAsync = async (goal: Omit<SavingsGoal, 'id' | 'current_amount'>) => {
    dbAddSavingsGoal(goal);
    refreshData();
  };

  const addMoneyToGoalAsync = async (id: number, amountToAdd: number) => {
    dbUpdateSavingsGoalAmount(id, amountToAdd);
    refreshData();
  };

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        refreshData,
        addTransactionAsync,
        updateTransactionAsync,
        deleteTransactionAsync,
        addCategoryAsync,
        setBudgetAsync,
        addSavingsGoalAsync,
        addMoneyToGoalAsync,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
