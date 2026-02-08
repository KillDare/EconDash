import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/constants/ThemeContext";
import { useDashboard } from "@/hooks/useDashboard";
import { useFinance } from "@/hooks/useFinance";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";

export default function DashboardScreen() {
  const { theme } = useTheme();
  const { lineData, expensesByCategory, incomesByCategory, reloadDash } =
    useDashboard();
  const { balance, reload } = useFinance();

  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const isDesktop = isWeb && width >= 1024;

  const [chartKey, setChartKey] = useState(0);

  // Largura dinâmica dos gráficos
  const chartWidth = isDesktop ? Math.min(width - 64, 1100) : width - 32;

  useFocusEffect(
    useCallback(() => {
      reload();
      reloadDash();
      setChartKey((prev) => prev + 1);
    }, [reload, reloadDash]),
  );

  const totalExpenses = expensesByCategory.reduce(
    (sum, item) => sum + item.amount,
    0,
  );
  const totalIncomes = incomesByCategory.reduce(
    (sum, item) => sum + item.amount,
    0,
  );

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    });

  const formatDateLabel = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const processPieData = (data: any[]) =>
    data
      .filter(
        (item) =>
          item &&
          typeof item === "object" &&
          item.label &&
          isFinite(item.amount) &&
          item.amount > 0,
      )
      .map((item) => ({
        name: `${item.label} • ${formatCurrency(item.amount)}`,
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

  const formattedLineData = {
    ...lineData,
    labels: lineData.labels.map(formatDateLabel),
  };

  return (
    <ThemedView
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
          maxWidth: isDesktop ? 1200 : "100%",
          marginHorizontal: "auto",
          minWidth: isDesktop ? 1024 : "100%",
        },
      ]}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Cards de resumo */}
        <ScrollView
          horizontal={!isDesktop}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsScroll}
        >
          <View
            style={[styles.cardsContainer, isDesktop && styles.cardsDesktop]}
          >
            <ThemedView style={[styles.card, { backgroundColor: theme.card }]}>
              <ThemedText type="subtitle">Saldo</ThemedText>
              <ThemedText type="title" style={{ color: theme.tint }}>
                {balance.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </ThemedText>
            </ThemedView>

            <ThemedView style={[styles.card, { backgroundColor: theme.card }]}>
              <ThemedText type="subtitle">Despesas</ThemedText>
              <ThemedText type="title" style={{ color: "#E57373" }}>
                {totalExpenses.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </ThemedText>
            </ThemedView>

            <ThemedView style={[styles.card, { backgroundColor: theme.card }]}>
              <ThemedText type="subtitle">Receitas</ThemedText>
              <ThemedText type="title" style={{ color: "#81C784" }}>
                {totalIncomes.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </ThemedText>
            </ThemedView>
          </View>
        </ScrollView>

        {/* Gráfico de Linha */}
        <ThemedText type="subtitle" style={{ marginTop: 24 }}>
          Saldo ao longo do tempo
        </ThemedText>

        {hasLineData ? (
          <LineChart
            key={`line-${chartKey}`}
            data={formattedLineData}
            width={chartWidth}
            height={260}
            formatYLabel={(value) => formatCurrency(Number(value))}
            chartConfig={{
              backgroundColor: theme.background,
              backgroundGradientFrom: theme.background,
              backgroundGradientTo: theme.background,
              decimalPlaces: 2,
              color: () => theme.tint,
              labelColor: () => theme.text,
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke: theme.tint,
              },
            }}
            bezier
            fromZero
            style={styles.chart}
          />
        ) : (
          <ThemedView style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              Adicione despesas e receitas para ver o gráfico
            </ThemedText>
          </ThemedView>
        )}

        {/* Gráficos de Pizza */}
        <View
          style={[
            styles.pieContainer,
            { flexDirection: isDesktop ? "row" : "column" },
          ]}
        >
          {/* Despesas */}
          <View style={styles.pieItem}>
            <ThemedText type="subtitle">Despesas por categoria</ThemedText>

            {hasExpensesData ? (
              <PieChart
                key={`expenses-${chartKey}`}
                data={safeExpensesData}
                width={isDesktop ? chartWidth / 2 - 16 : chartWidth}
                height={240}
                chartConfig={{
                  color: () => `rgba(255, 255, 255, 1)`,
                }}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="15"
              />
            ) : (
              <ThemedView style={styles.emptyContainer}>
                <ThemedText style={styles.emptyText}>
                  Nenhuma despesa registrada
                </ThemedText>
              </ThemedView>
            )}
          </View>

          {/* Receitas */}
          <View style={styles.pieItem}>
            <ThemedText type="subtitle">Receitas por categoria</ThemedText>

            {hasIncomesData ? (
              <PieChart
                key={`incomes-${chartKey}`}
                data={safeIncomesData}
                width={isDesktop ? chartWidth / 2 - 16 : chartWidth}
                height={240}
                chartConfig={{
                  color: () => `rgba(255, 255, 255, 1)`,
                }}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="15"
              />
            ) : (
              <ThemedView style={styles.emptyContainer}>
                <ThemedText style={styles.emptyText}>
                  Nenhuma receita registrada
                </ThemedText>
              </ThemedView>
            )}
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  cardsScroll: {
    paddingVertical: 16,
  },

  cardsContainer: {
    flexDirection: "row",
    gap: 12,
  },

  cardsDesktop: {
    width: "100%",
    justifyContent: "space-around",
  },

  card: {
    padding: 16,
    borderRadius: 14,
    minWidth: 150,
    alignItems: "center",
  },

  chart: {
    marginVertical: 12,
    borderRadius: 16,
  },

  pieContainer: {
    marginTop: 24,
    gap: 16,
  },

  pieItem: {
    flex: 1,
    alignItems: "center",
  },

  emptyContainer: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 16,
    marginVertical: 8,
  },

  emptyText: {
    textAlign: "center",
    fontStyle: "italic",
    opacity: 0.7,
  },
});
