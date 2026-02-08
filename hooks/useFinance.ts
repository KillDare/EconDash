import { Expense, Income, getExpenses, getIncomes, getTotals, initDatabase } from '@/database/index';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export function useFinance() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [balance, setBalance] = useState(0);

  const mounted = useRef(true);

  const load = useCallback(async () => {
    try {
      await initDatabase();

      const [expensesData, incomesData, totals] = await Promise.all([
        getExpenses(),
        getIncomes(),
        getTotals(),
      ]);

      if (!mounted.current) return;

      setExpenses(expensesData);
      setIncomes(incomesData);
      setBalance(totals.balance);
    } catch (err) {
      console.error('Erro ao carregar finanças:', err);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const currentMonth = today.slice(0, 7); // YYYY-MM

  const todayExpenses = useMemo(
    () =>
      expenses
        .filter(e => e.date?.startsWith(today))
        .reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  );

  const todayIncomes = useMemo(
    () =>
      incomes
        .filter(i => i.date?.startsWith(today))
        .reduce((sum, i) => sum + i.amount, 0),
    [incomes]
  );

  const monthExpenses = useMemo(
    () =>
      expenses
        .filter(e => e.date?.startsWith(currentMonth))
        .reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  );

  const monthIncomes = useMemo(
    () =>
      incomes
        .filter(i => i.date?.startsWith(currentMonth))
        .reduce((sum, i) => sum + i.amount, 0),
    [incomes]
  );

  const lastTransaction = useMemo(() => {
    const all = [
      ...expenses.map(e => ({ ...e, kind: 'expense' as const })),
      ...incomes.map(i => ({ ...i, kind: 'income' as const })),
    ];

    return all.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
  }, [expenses, incomes]);

  return {
    // dados brutos
    expenses,
    incomes,
    balance,

    // dados processados
    todayExpenses,
    todayIncomes,
    monthExpenses,
    monthIncomes,
    lastTransaction,

    reload: load,
  };
}
