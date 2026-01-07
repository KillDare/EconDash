import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/constants/ThemeContext';
import { useFinance } from '@/hooks/useFinance';

export default function HomeScreen() {
  const { theme } = useTheme();
  const {
    balance,
    todayExpenses,
    todayIncomes,
    monthExpenses,
    monthIncomes,
    lastTransaction,
    reload,
  } = useFinance();

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor: theme.background }]}>

      {/* SALDO */}
      <ThemedView style={[styles.card, { backgroundColor: theme.card }]}>
        <ThemedText type="subtitle">Saldo atual</ThemedText>
        <ThemedText type="title" style={{ color: theme.tint }}>
          {balance.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </ThemedText>
      </ThemedView>

      {/* AÇÕES RÁPIDAS */}
      <ThemedView style={styles.actionsRow}>
        <Pressable
          style={[styles.actionButton, { backgroundColor: '#E57373' }]}
          onPress={() =>
            router.push({
              pathname: '/cashflow',
              params: { type: 'expense' },
            })
          }
        >
          <Ionicons name="remove-circle-outline" size={22} color="#fff" />
          <ThemedText style={styles.actionText}>Despesa</ThemedText>
        </Pressable>

        <Pressable
          style={[styles.actionButton, { backgroundColor: '#81C784' }]}
          onPress={() =>
            router.push({
              pathname: '/cashflow',
              params: { type: 'income' },
            })
          }
        >
          <Ionicons name="add-circle-outline" size={22} color="#fff" />
          <ThemedText style={styles.actionText}>Receita</ThemedText>
        </Pressable>
      </ThemedView>

      {/* RESUMO */}
      <ThemedView style={[styles.card, { backgroundColor: theme.card }]}>
        <ThemedText type="subtitle">Resumo</ThemedText>

        <ThemedText type="subtitle" style={{ marginTop: 8, fontWeight: '600' }}>
          Hoje
        </ThemedText>
        <ThemedView style={{ gap: 2, marginLeft: 8, backgroundColor: theme.card }}>
          <ThemedText>
            Despesas: {todayExpenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </ThemedText>
          <ThemedText>
            Receitas: {todayIncomes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </ThemedText>
        </ThemedView>

        <ThemedView style={{ height: 1, backgroundColor: theme.icon, marginVertical: 10 }} />

        <ThemedText type="subtitle" style={{ fontWeight: '600' }}>
          Este mês
        </ThemedText>
        <ThemedView style={{ gap: 2, marginLeft: 8, backgroundColor: theme.card }}>
          <ThemedText>
            Despesas: {monthExpenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </ThemedText>
          <ThemedText>
            Receitas: {monthIncomes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      {/* ÚLTIMA MOVIMENTAÇÃO */}
      <ThemedView style={[styles.card, { backgroundColor: theme.card }]}>
        <ThemedText type="subtitle">Última movimentação</ThemedText>

        {lastTransaction ? (
          <ThemedText>
            <Ionicons
              name={
                lastTransaction.kind === 'expense'
                  ? 'arrow-down-circle-outline'
                  : 'arrow-up-circle-outline'
              }
              size={16}
              color={
                lastTransaction.kind === 'expense'
                  ? '#E57373'
                  : '#81C784'
              }
            />
            {' '} {lastTransaction.title} • {' '}
            <ThemedText
              style={{
                color:
                  lastTransaction.kind === 'expense'
                    ? '#E57373'
                    : '#81C784',
                fontWeight: '600',
              }}
            >
              {lastTransaction.kind === 'expense' ? '-' : '+'}
              {lastTransaction.amount.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </ThemedText>
          </ThemedText>
        ) : (
          <ThemedText style={{ fontStyle: 'italic', opacity: 0.7 }}>
            Nenhuma movimentação registrada
          </ThemedText>
        )}
      </ThemedView>

      {/* DASHBOARD */}
      <Pressable
        style={[styles.dashboardLink, { borderColor: theme.icon }]}
        onPress={() => router.push('/dashboard')}
      >
        <ThemedText style={{ color: theme.tint }}>
          Ver análise detalhada →
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },

  card: {
    padding: 16,
    borderRadius: 14,
    gap: 6,
  },

  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },

  actionButton: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    gap: 4,
  },

  actionText: {
    color: '#fff',
    fontWeight: '600',
  },

  dashboardLink: {
    padding: 14,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
  },
});
