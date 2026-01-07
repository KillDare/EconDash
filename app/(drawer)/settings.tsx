import { Ionicons } from '@expo/vector-icons';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { clearDatabase } from '@/app/database/sqlite';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/constants/ThemeContext';

export default function Settings() {
  const { mode } = useTheme();
  const colors = Colors[mode];

  function handleClearDatabase() {
    Alert.alert(
      'Limpar dados',
      'Tem certeza que deseja apagar todos os dados? Essa ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            await clearDatabase();
            Alert.alert('Pronto', 'Banco de dados limpo com sucesso.');
          },
        },
      ]
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Configurações
      </Text>

      <Pressable
        style={({ pressed }) => [
          styles.dangerButton,
          { opacity: pressed ? 0.7 : 1 },
        ]}
        onPress={handleClearDatabase}
      >
        <Ionicons name="trash-outline" size={22} color="#fff" />
        <Text style={styles.dangerText}>Limpar banco de dados</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#E53935',
  },
  dangerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
