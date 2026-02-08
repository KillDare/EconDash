import { useTheme } from '@/constants/ThemeContext';
import { Expense, Income, getExpenses, getIncomes } from '@/database/index';
import { useCallback, useEffect, useState } from 'react';

type CategoryData = {
  label: string;
  amount: number;
  color?: string;
};

type LineData = {
  labels: string[];
  datasets: { data: number[] }[];
};

export function useDashboard() {
  const { theme } = useTheme();

  const [lineData, setLineData] = useState<LineData>({
    labels: [],
    datasets: [{ data: [] }],
  });

  const [expensesByCategory, setExpensesByCategory] = useState<CategoryData[]>([]);
  const [incomesByCategory, setIncomesByCategory] = useState<CategoryData[]>([]);

  const CATEGORY_COLORS = [
    '#FF6384', '#36A2EB', '#FFCE56', '#81C784', '#E57373', '#BA68C8', '#4DD0E1'
  ];

  const generateDashboard = useCallback(async () => {
    try {
      const expenses: Expense[] = await getExpenses();
      const incomes: Income[] = await getIncomes();

      // -----------------------------
      // Linha: saldo ao longo do tempo
      // -----------------------------
      const allDates = Array.from(
        new Set([...expenses, ...incomes].map(e => e.date?.slice(0, 10) || ''))
      ).filter(date => date).sort();

      let cumulative = 0;
      const lineValues: number[] = [];

      allDates.forEach(date => {
        const incomeSum = incomes
          .filter(i => i?.date?.slice(0, 10) === date)
          .reduce((acc, i) => {
            const amount = parseFloat(String(i?.amount || 0));
            return acc + (isFinite(amount) ? amount : 0);
          }, 0);

        const expenseSum = expenses
          .filter(e => e?.date?.slice(0, 10) === date)
          .reduce((acc, e) => {
            const amount = parseFloat(String(e?.amount || 0));
            return acc + (isFinite(amount) ? amount : 0);
          }, 0);

        cumulative += incomeSum - expenseSum;
        cumulative = isFinite(cumulative) ? cumulative : 0;
        lineValues.push(cumulative);
      });

      if (lineValues.length === 0) {
        setLineData({
          labels: [''],
          datasets: [{ data: [0] }],
        });
      } else {
        setLineData({
          labels: allDates.map(d => {
            const label = d.slice(5); // MM-DD
            return label.length === 5 ? label : d.slice(0, 10);
          }),
          datasets: [{ data: lineValues }],
        });
      }

      // -----------------------------
      // Pizza: despesas por categoria
      // -----------------------------
      const expenseCategoriesMap = new Map<string, number>();
      expenses.forEach(e => {
        if (e && e.category) {
          const amount = parseFloat(String(e.amount || 0));
          if (isFinite(amount) && amount > 0) {
            const current = expenseCategoriesMap.get(e.category) || 0;
            expenseCategoriesMap.set(e.category, current + amount);
          }
        }
      });

      const expenseCategories = Array.from(expenseCategoriesMap.entries())
        .filter(([label]) => label && label.trim())
        .map(([label, amount], idx) => ({
          label: label || 'Sem categoria',
          amount,
          color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] || theme.tint,
        }));

      expenseCategories.sort((a, b) => b.amount - a.amount);
      setExpensesByCategory(expenseCategories);

      // -----------------------------
      // Pizza: receitas por categoria
      // -----------------------------
      const incomeCategoriesMap = new Map<string, number>();
      incomes.forEach(i => {
        if (i && i.category) {
          const amount = parseFloat(String(i.amount || 0));
          if (isFinite(amount) && amount > 0) {
            const current = incomeCategoriesMap.get(i.category) || 0;
            incomeCategoriesMap.set(i.category, current + amount);
          }
        }
      });

      const incomeCategories = Array.from(incomeCategoriesMap.entries())
        .filter(([label]) => label && label.trim())
        .map(([label, amount], idx) => ({
          label: label || 'Sem categoria',
          amount,
          color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] || theme.tint,
        }));

      incomeCategories.sort((a, b) => b.amount - a.amount);
      setIncomesByCategory(incomeCategories);
    } catch (err) {
      console.error('Erro ao gerar dashboard:', err);

      setLineData({
        labels: [''],
        datasets: [{ data: [0] }],
      });
      setExpensesByCategory([]);
      setIncomesByCategory([]);
    }
  }, [theme.tint]);

  useEffect(() => {
    generateDashboard();
  }, [generateDashboard]);

  return {
    lineData,
    expensesByCategory,
    incomesByCategory,
    reloadDash: generateDashboard,
  };
}