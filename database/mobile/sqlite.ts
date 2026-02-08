import { Expense, Income } from '@/database/index';
import * as SQLite from 'expo-sqlite';



/* =========================
   SINGLETON DO BANCO
========================= */

let db: SQLite.SQLiteDatabase | null = null;
let initializing: Promise<void> | null = null;

/* =========================
   INIT DATABASE
========================= */

export async function initDatabase() {
  if (db) return;

  if (!initializing) {
    initializing = (async () => {
      const database = await SQLite.openDatabaseAsync('finance.db');

      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS expenses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          amount REAL NOT NULL,
          category TEXT,
          type TEXT,
          date TEXT NOT NULL
        );
      `);

      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS incomes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          amount REAL NOT NULL,
          category TEXT,
          type TEXT,
          date TEXT NOT NULL
        );
      `);

      db = database;
    })();
  }

  await initializing;
}

/* =========================
   FUNÇÃO INTERNA UTILITÁRIA
========================= */

async function getDB() {
  if (!db) {
    await initDatabase();
  }
  return db!;
}

/* =========================
   EXPENSES
========================= */

export async function addExpense(expense: Omit<Expense, 'id'>) {
  const database = await getDB();

  return database.runAsync(
    `INSERT INTO expenses (title, amount, category, type, date)
     VALUES (?, ?, ?, ?, ?)`,
    [
      expense.title,
      expense.amount,
      expense.category,
      expense.type,
      expense.date,
    ]
  );
}

export async function getExpenses(): Promise<Expense[]> {
  const database = await getDB();
  return database.getAllAsync<Expense>(
    'SELECT * FROM expenses ORDER BY date DESC'
  );
}

export async function updateExpense(
  id: number,
  data: Partial<Omit<Expense, 'id'>>
) {
  if (Object.keys(data).length === 0) return;

  const database = await getDB();

  const fields = Object.keys(data).map(k => `${k} = ?`).join(', ');
  const values = Object.values(data);

  return database.runAsync(
    `UPDATE expenses SET ${fields} WHERE id = ?`,
    [...values, id]
  );
}

export async function deleteExpense(id: number) {
  const database = await getDB();
  return database.runAsync(
    'DELETE FROM expenses WHERE id = ?',
    [id]
  );
}

/* =========================
   INCOMES
========================= */

export async function addIncome(income: Omit<Income, 'id'>) {
  const database = await getDB();

  return database.runAsync(
    `INSERT INTO incomes (title, amount, category, type, date)
     VALUES (?, ?, ?, ?, ?)`,
    [
      income.title,
      income.amount,
      income.category,
      income.type,
      income.date,
    ]
  );
}

export async function getIncomes(): Promise<Income[]> {
  const database = await getDB();
  return database.getAllAsync<Income>(
    'SELECT * FROM incomes ORDER BY date DESC'
  );
}

export async function updateIncome(
  id: number,
  data: Partial<Omit<Income, 'id'>>
) {
  if (Object.keys(data).length === 0) return;

  const database = await getDB();

  const fields = Object.keys(data).map(k => `${k} = ?`).join(', ');
  const values = Object.values(data);

  return database.runAsync(
    `UPDATE incomes SET ${fields} WHERE id = ?`,
    [...values, id]
  );
}

export async function deleteIncome(id: number) {
  const database = await getDB();
  return database.runAsync(
    'DELETE FROM incomes WHERE id = ?',
    [id]
  );
}

/* =========================
   TOTAIS (SQL OTIMIZADO)
========================= */

export async function getTotals() {
  const database = await getDB();

  const expenses = await database.getFirstAsync<{ total: number }>(
    'SELECT COALESCE(SUM(amount), 0) as total FROM expenses'
  );

  const incomes = await database.getFirstAsync<{ total: number }>(
    'SELECT COALESCE(SUM(amount), 0) as total FROM incomes'
  );

  const totalExpenses = expenses?.total ?? 0;
  const totalIncomes = incomes?.total ?? 0;

  return {
    totalExpenses,
    totalIncomes,
    balance: totalIncomes - totalExpenses,
  };
}

/* =========================
   LIMPAR BANCO (RESET DADOS)
========================= */

export async function clearDatabase() {
  const database = await getDB();

  await database.execAsync(`
    DELETE FROM expenses;
    DELETE FROM incomes;
  `);
}

