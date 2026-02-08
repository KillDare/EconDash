import { Platform } from 'react-native';

/* =========================
   TIPOS
========================= */

export type TransactionType = 'fixed' | 'variable' | 'extra';
export type Expense = {
  id: number;
  title: string;
  amount: number;
  category: string;
  type: TransactionType;
  date: string;
};
export type Income = Expense;


/* =========================
   DEFINE BANCO
========================= */

const isWeb = Platform.OS === 'web';

const db = isWeb ? require('./web/webDB') : require('./mobile/sqlite');

export const addExpense = db.addExpense;
export const getExpenses = db.getExpenses;
export const addIncome = db.addIncome;
export const getIncomes = db.getIncomes;
export const getTotals = db.getTotals;
export const clearDatabase = db.clearDatabase;
export const initDatabase = db.initDatabase;
