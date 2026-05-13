import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

// --- Web Fallback Mocks ---
let webCategories: Category[] = [];
let webTransactions: Transaction[] = [];
let webBudgets: Budget[] = [];
let webSavingsGoals: SavingsGoal[] = [];

// Open the database synchronously
export const db = Platform.OS !== 'web' ? SQLite.openDatabaseSync('expense_tracker.db') : null;

export const initDB = () => {
  if (Platform.OS === 'web') return; // Mock is already initialized
  // We use PRAGMA journal_mode = WAL for better performance
  db!.execSync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
      amount REAL NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      date TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS budgets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      limit_amount REAL NOT NULL,
      month TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS savings_goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      emoji TEXT,
      target_amount REAL NOT NULL,
      current_amount REAL DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `);
};

// --- Models ---
export interface Category {
  id: number;
  name: string;
}

export interface Transaction {
  id: number;
  type: 'expense' | 'income';
  amount: number;
  description: string;
  category: string;
  date: string; // dd mm yyyy
}

export interface Budget {
  id: number;
  category: string;
  limit_amount: number;
  month: string; // YYYY-MM
}

export interface SavingsGoal {
  id: number;
  name: string;
  emoji: string;
  target_amount: number;
  current_amount: number;
  created_at: string;
}

// --- Helper Functions ---
export const getCategories = (): Category[] => {
  if (Platform.OS === 'web') return webCategories;
  return db!.getAllSync<Category>('SELECT * FROM categories ORDER BY name');
};

export const addCategory = (name: string): void => {
  if (Platform.OS === 'web') {
    webCategories.push({ id: Date.now(), name });
    return;
  }
  db!.runSync('INSERT INTO categories (name) VALUES (?)', [name]);
};

export const getTransactions = (month: string): Transaction[] => {
  const [year, monthNum] = month.split('-');
  const searchPattern = ` ${monthNum} ${year}`;
  
  if (Platform.OS === 'web') {
    return webTransactions
      .filter(t => t.date.endsWith(searchPattern))
      .sort((a, b) => b.id - a.id);
  }

  return db!.getAllSync<Transaction>('SELECT * FROM transactions WHERE date LIKE ? ORDER BY date DESC', [`%${searchPattern}`]);
};

export const addTransaction = (transaction: Omit<Transaction, 'id'>): number => {
  if (Platform.OS === 'web') {
    const id = Date.now();
    webTransactions.push({ ...transaction, id });
    return id;
  }
  const result = db!.runSync(
    'INSERT INTO transactions (type, amount, description, category, date) VALUES (?, ?, ?, ?, ?)',
    [transaction.type, transaction.amount, transaction.description, transaction.category, transaction.date]
  );
  return result.lastInsertRowId;
};

export const updateTransaction = (id: number, transaction: Omit<Transaction, 'id'>): void => {
  if (Platform.OS === 'web') {
    const idx = webTransactions.findIndex(t => t.id === id);
    if (idx >= 0) {
      webTransactions[idx] = { ...transaction, id };
    }
    return;
  }
  db!.runSync(
    'UPDATE transactions SET type = ?, amount = ?, description = ?, category = ?, date = ? WHERE id = ?',
    [transaction.type, transaction.amount, transaction.description, transaction.category, transaction.date, id]
  );
};

export const deleteTransaction = (id: number): void => {
  if (Platform.OS === 'web') {
    webTransactions = webTransactions.filter(t => t.id !== id);
    return;
  }
  db!.runSync('DELETE FROM transactions WHERE id = ?', [id]);
};

export const getBudgets = (month: string): Budget[] => {
  if (Platform.OS === 'web') {
    return webBudgets.filter(b => b.month === month);
  }
  return db!.getAllSync<Budget>('SELECT * FROM budgets WHERE month = ?', [month]);
};

export const setBudget = (budget: Omit<Budget, 'id'>): void => {
  if (Platform.OS === 'web') {
    const existingIdx = webBudgets.findIndex(b => b.category === budget.category && b.month === budget.month);
    if (existingIdx >= 0) {
      webBudgets[existingIdx].limit_amount = budget.limit_amount;
    } else {
      webBudgets.push({ ...budget, id: Date.now() });
    }
    return;
  }
  const existing = db!.getFirstSync<Budget>('SELECT * FROM budgets WHERE category = ? AND month = ?', [budget.category, budget.month]);
  if (existing) {
    db!.runSync('UPDATE budgets SET limit_amount = ? WHERE id = ?', [budget.limit_amount, existing.id]);
  } else {
    db!.runSync('INSERT INTO budgets (category, limit_amount, month) VALUES (?, ?, ?)', [budget.category, budget.limit_amount, budget.month]);
  }
};

export const getSavingsGoals = (): SavingsGoal[] => {
  if (Platform.OS === 'web') return webSavingsGoals;
  return db!.getAllSync<SavingsGoal>('SELECT * FROM savings_goals');
};

export const addSavingsGoal = (goal: Omit<SavingsGoal, 'id' | 'current_amount'>): void => {
  if (Platform.OS === 'web') {
    webSavingsGoals.push({ ...goal, id: Date.now(), current_amount: 0 });
    return;
  }
  db!.runSync(
    'INSERT INTO savings_goals (name, emoji, target_amount, current_amount, created_at) VALUES (?, ?, ?, 0, ?)',
    [goal.name, goal.emoji, goal.target_amount, goal.created_at]
  );
};

export const updateSavingsGoalAmount = (id: number, amountToAdd: number): void => {
  if (Platform.OS === 'web') {
    const goal = webSavingsGoals.find(g => g.id === id);
    if (goal) goal.current_amount += amountToAdd;
    return;
  }
  db!.runSync('UPDATE savings_goals SET current_amount = current_amount + ? WHERE id = ?', [amountToAdd, id]);
};
