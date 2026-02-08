import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView, Platform,
  Pressable,
  ScrollView,
  StyleSheet, TextInput,
  useWindowDimensions
} from 'react-native';

import MaskInput, { Masks } from 'react-native-mask-input';

import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { useTheme } from '@/constants/ThemeContext';
import { addExpense, addIncome } from '@/database/index';

type TransactionKind = 'expense' | 'income';

export default function CashflowScreen() {
  const { theme } = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { type } = useLocalSearchParams<{ type?: TransactionKind }>();

  const [kind, setKind] = useState<TransactionKind>(
    type === 'income' ? 'income' : 'expense'
  );
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [amountNumber, setAmountNumber] = useState(0);
  const [category, setCategory] = useState('');
  
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isDesktop = isWeb && width >= 1024;

  const EXPENSE_CATEGORIES = [
    { label: 'Alimentação', icon: 'restaurant' },
    { label: 'Transporte', icon: 'car' },
    { label: 'Moradia', icon: 'home' },
    { label: 'Lazer', icon: 'game-controller' },
    { label: 'Saúde', icon: 'medkit' },
    { label: 'Educação', icon: 'school' },
    { label: 'Outros', icon: 'ellipsis-horizontal' },
  ];

  const INCOME_CATEGORIES = [
    { label: 'Salário', icon: 'cash' },
    { label: 'Freelance', icon: 'briefcase' },
    { label: 'Investimentos', icon: 'trending-up' },
    { label: 'Aluguel', icon: 'business' },
    { label: 'Reembolso', icon: 'refresh' },
    { label: 'Outros', icon: 'ellipsis-horizontal' },
  ];

  const categories =
    kind === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const resetForm = (nextKind?: TransactionKind) => {
    setTitle('');
    setAmount('');
    setAmountNumber(0);
    setCategory('');
    setDate(new Date());

    if (nextKind) {
      setKind(nextKind);
    }
  };

  useFocusEffect(
    useCallback(() => {
      resetForm(type === 'income' || type === 'expense' ? type : 'expense');
    }, [type])
  );


  async function handleSave() {
    if (!title || !amountNumber || !category) return;

    const data = {
      title,
      amount: amountNumber,
      category,
      type: 'variable' as const,
      date: date.toISOString(),
    };

    if (kind === 'expense') {
      await addExpense(data);
    } else {
      await addIncome(data);
    }

    router.back();
  }

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0]; // yyyy-mm-dd
  };


  return (
    <KeyboardAvoidingView
      style={{ flex: 1,}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: tabBarHeight + 80, }}
        keyboardShouldPersistTaps="handled"
        style={{maxWidth: isDesktop ? 1200 : '100%', marginHorizontal: 'auto', minWidth: isDesktop ? 1200 : '100%', }}

      >
        <ThemedView
          style={[
            styles.container,
            { backgroundColor: theme.background },
          ]}
        >
          <ThemedText type="title">Nova Transação</ThemedText>

          {/* Tipo */}
          <ThemedView style={styles.row}>
            <Pressable
              style={[
                styles.selector,
                { borderColor: theme.icon },
                kind === 'expense' && styles.activeExpense,
              ]}
              onPress={() => resetForm('expense')}
            >
              <ThemedText
                style={kind === 'expense' ? styles.activeText : undefined}
              >
                Despesa
              </ThemedText>
            </Pressable>

            <Pressable
              style={[
                styles.selector,
                { borderColor: theme.icon },
                kind === 'income' && styles.activeIncome,
              ]}
              onPress={() => resetForm('income')}
            >
              <ThemedText
                style={kind === 'income' ? styles.activeText : undefined}
              >
                Receita
              </ThemedText>
            </Pressable>
          </ThemedView>

          {/* Descrição */}
          <TextInput
            placeholder="Descrição"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor={theme.icon}
            style={[
              styles.input,
              {
                color: theme.text,
                borderColor: theme.icon,
              },
            ]}
          />

          {/* Valor */}
          <MaskInput
            value={amount}
            onChangeText={(masked, unmasked) => {
              setAmount(masked);
              setAmountNumber(Number(unmasked) / 100);
            }}
            mask={Masks.BRL_CURRENCY}
            keyboardType="numeric"
            placeholder="Valor"
            placeholderTextColor={theme.icon}
            style={[
              styles.input,
              {
                color: theme.text,
                borderColor: theme.icon,
              },
            ]}
          />


          {/* Data */}

          {/* MOBILE */}
          {(Platform.OS !== 'web' && !showDatePicker) && (
            <Pressable
              onPress={() => setShowDatePicker(true)}
              style={[
                styles.input,
                {
                  borderColor: theme.icon,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                },
              ]}
            >
              <ThemedText>
                {date.toLocaleDateString('pt-BR')}
              </ThemedText>

              <Ionicons name="calendar" size={20} color={theme.icon} />
            </Pressable>
          )}
          {showDatePicker && Platform.OS !== 'web' && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              maximumDate={new Date()}
              onChange={(_, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setDate(selectedDate);
                }
              }}
            />
          )}

          {/* WEB */}
          {Platform.OS === 'web' && (
            <input
              type="date"
              value={formatDateForInput(date)}
              max={formatDateForInput(new Date())}
              onChange={(e) => {
                setDate(new Date(e.target.value + 'T00:00:00'));
                setShowDatePicker(false);
              }}
              style={{
                padding: 12,
                borderRadius: 8,
                border: `1px solid ${theme.icon}`,
                backgroundColor: theme.background,
                color: theme.text,
                fontSize: 16,
              }}
            />
          )}
          
          {/* ATALHOS */}
          <ThemedView style={{ flexDirection: 'row', gap: 8 }}>
            <ThemedButton
              title="Hoje"
              variant="outline"
              onPress={() => setDate(new Date())}
            />

            <ThemedButton
              title="Ontem"
              variant="outline"
              onPress={() => {
                const d = new Date();
                d.setDate(d.getDate() - 1);
                setDate(d);
              }}
            />
          </ThemedView>

          {/* Categoria */}
          <ThemedView style={styles.categoriesContainer}>
            {categories.map((cat) => {
              const selected = category === cat.label;

              return (
                <Pressable
                  key={cat.label}
                  onPress={() => setCategory(cat.label)}
                  style={[
                    styles.categoryButton,
                    {
                      borderColor: theme.icon,
                      backgroundColor: selected 
                        ? theme.button.primary.background 
                        : 'transparent',
                    },
                  ]}
                >
                  <Ionicons
                    name={cat.icon as any}
                    size={22}
                    color={selected 
                      ? theme.button.primary.text
                      : theme.text}
                  />
                  <ThemedText
                    style={{
                      fontSize: 12,
                      color: selected 
                        ? theme.button.primary.text 
                        : theme.text,
                    }}
                  >
                    {cat.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </ThemedView>

          {/* Salvar */}
          <ThemedButton
            title="Salvar"
            onPress={handleSave}
          />
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  selector: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  activeExpense: {
    backgroundColor: '#E57373',
  },
  activeIncome: {
    backgroundColor: '#81C784',
  },
  activeText: {
    color: '#fff',
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    borderRadius: 12,
    padding: 12,
  },
  option: {
    padding: 14,
    borderBottomWidth: 1,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  categoryButton: {
    width: '30%',
    paddingVertical: 14,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    gap: 6,
  },

  saveButton: {
    marginTop: 20,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
});
