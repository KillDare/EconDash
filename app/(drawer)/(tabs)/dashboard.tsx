import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/constants/ThemeContext';
import { useDashboard } from '@/hooks/useDashboard';
import { useFinance } from '@/hooks/useFinance';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';

export default function DashboardScreen() {
  const { theme } = useTheme();
  const { lineData, expensesByCategory, incomesByCategory, reloadDash } = useDashboard();
  const { balance, reload } = useFinance();
  const [chartKey, setChartKey] = useState(0);

  const screenWidth = Dimensions.get('window').width - 32;

  // Atualizar automaticamente quando a aba for exibida
  useFocusEffect(
    useCallback(() => {
      reload();
      reloadDash();
      setChartKey(prev => prev + 1);
    }, [reload, reloadDash])
  );

  // Cards de resumo
  const totalExpenses = expensesByCategory.reduce((sum, item) => sum + item.amount, 0);
  const totalIncomes = incomesByCategory.reduce((sum, item) => sum + item.amount, 0);

  // Função para processar dados do gráfico de pizza
  const processPieData = (data: any[]) =>
    data
      .filter(item => item && typeof item === 'object' && item.label && isFinite(item.amount) && item.amount > 0)
      .map(item => ({
        name: String(item.label),
        amount: Number(item.amount),
        color: String(item.color || theme.tint),
        legendFontColor: theme.text,
        legendFontSize: 12,
      }));

  const safeExpensesData = processPieData(expensesByCategory);
  const safeIncomesData = processPieData(incomesByCategory);

  const hasLineData = lineData?.datasets?.[0]?.data?.length > 0;
  const hasExpensesData = safeExpensesData.length > 0;
  const hasIncomesData = safeIncomesData.length > 0;

  return (
    <ThemedView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <ThemedText type="title">Dashboard</ThemedText>

        {/* Cards de resumo */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
          <ThemedView style={styles.cardsContainer}>
            <ThemedView style={[styles.card, { backgroundColor: theme.card, minWidth: 140 }]}>
              <ThemedText type="subtitle" style={{ color: theme.text }}>Saldo</ThemedText>
              <ThemedText type="title" style={{ color: theme.tint }}>
                {balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </ThemedText>
            </ThemedView>

            <ThemedView style={[styles.card, { backgroundColor: theme.card, minWidth: 140 }]}>
              <ThemedText type="subtitle" style={{ color: theme.text }}>Despesas</ThemedText>
              <ThemedText type="title" style={{ color: '#E57373' }}>
                {totalExpenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </ThemedText>
            </ThemedView>

            <ThemedView style={[styles.card, { backgroundColor: theme.card, minWidth: 140 }]}>
              <ThemedText type="subtitle" style={{ color: theme.text }}>Receitas</ThemedText>
              <ThemedText type="title" style={{ color: '#81C784' }}>
                {totalIncomes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ScrollView>

        {/* Gráfico de Linha */}
        {hasLineData ? (
          <>
            <ThemedText type="subtitle" style={{ marginTop: 20 }}>Saldo ao longo do tempo</ThemedText>
            <LineChart
              key={`line-${chartKey}`}
              data={lineData}
              width={screenWidth}
              height={220}
              chartConfig={{
                backgroundColor: theme.background,
                backgroundGradientFrom: theme.background,
                backgroundGradientTo: theme.background,
                decimalPlaces: 2,
                color: () => theme.tint,
                labelColor: () => theme.text,
                propsForDots: { r: '4', strokeWidth: '2', stroke: theme.tint },
              }}
              bezier
              style={{ marginVertical: 8, borderRadius: 16 }}
              fromZero
            />
          </>
        ) : (
          <ThemedView style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              Adicione despesas e receitas para ver o gráfico de saldo
            </ThemedText>
          </ThemedView>
        )}

        {/* Gráfico de Pizza: Despesas */}
        <ThemedText type="subtitle" style={{ marginTop: 20 }}>Despesas por categoria</ThemedText>
        {hasExpensesData ? (
          <PieChart
            key={`expenses-${chartKey}`}
            data={safeExpensesData}
            width={screenWidth}
            height={220}
            chartConfig={{ color: () => `rgba(255, 255, 255, 1)` }}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        ) : (
          <ThemedView style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>Nenhuma despesa registrada</ThemedText>
          </ThemedView>
        )}

        {/* Gráfico de Pizza: Receitas */}
        <ThemedText type="subtitle" style={{ marginTop: 20 }}>Receitas por categoria</ThemedText>
        {hasIncomesData ? (
          <PieChart
            key={`incomes-${chartKey}`}
            data={safeIncomesData}
            width={screenWidth}
            height={220}
            chartConfig={{ color: () => `rgba(255, 255, 255, 1)` }}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        ) : (
          <ThemedView style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>Nenhuma receita registrada</ThemedText>
          </ThemedView>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  cardsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  card: { flex: 1, padding: 12, borderRadius: 12, marginHorizontal: 4, alignItems: 'center' },
  emptyContainer: { height: 220, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 16, marginVertical: 8 },
  emptyText: { textAlign: 'center', fontStyle: 'italic', opacity: 0.7 },
});
