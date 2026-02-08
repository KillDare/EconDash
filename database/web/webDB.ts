import { Expense, Income } from '@/database/index';
import localforage from 'localforage';

const store = localforage.createInstance({ name: 'finance', storeName: 'transactions' });

async function generateId(): Promise<number> {
  const lastId = (await store.getItem<number>('lastId')) || 0;
  const nextId = lastId + 1;
  await store.setItem('lastId', nextId);
  return nextId;
}

export async function initDatabase() {
  return;
}

export async function addExpense(expense: Omit<Expense, 'id'>) {
  const id = await generateId();
  const all = (await store.getItem<Expense[]>('expenses')) || [];
  all.unshift({ ...expense, id });
  await store.setItem('expenses', all);
}

export async function getExpenses(): Promise<Expense[]> {
  return (await store.getItem<Expense[]>('expenses')) || [];
}

export async function addIncome(income: Omit<Income, 'id'>) {
  const id = await generateId();
  const all = (await store.getItem<Income[]>('incomes')) || [];
  all.unshift({ ...income, id });
  await store.setItem('incomes', all);
}

export async function getIncomes(): Promise<Income[]> {
  return (await store.getItem<Income[]>('incomes')) || [];
}

export async function getTotals() {
  const expenses = await getExpenses();
  const incomes = await getIncomes();
  const totalExpenses = expenses.reduce((a, e) => a + e.amount, 0);
  const totalIncomes = incomes.reduce((a, i) => a + i.amount, 0);
  return { totalExpenses, totalIncomes, balance: totalIncomes - totalExpenses };
}

export async function clearDatabase() {
  await store.setItem('expenses', []);
  await store.setItem('incomes', []);
  await store.setItem('lastId', 0);
}
