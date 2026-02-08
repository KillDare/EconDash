import { useTheme } from '@/constants/ThemeContext';
import { addExpense, addIncome, clearDatabase, Expense, getExpenses, getIncomes, Income } from '@/database/index';
import { showAlert } from '@/utils/alert';
import { downloadCSV, pickCSVFile } from '@/utils/file';
import { Ionicons } from '@expo/vector-icons';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

export default function Settings() {
  const { mode } = useTheme();

  // Gera CSV com expenses e incomes
  async function generateCSV() {
    const dataExp: Expense[] = await getExpenses();
    const dataInc: Income[] = await getIncomes();

    const header = ['title', 'amount', 'category', 'date', 'type'];

    let rows: string[][] = dataExp.map((item: Expense) => [
      `"${item.title.replace(/"/g, '""')}"`,
      item.amount.toFixed(2),
      `"${item.category.replace(/"/g, '""')}"`,
      item.date,
      '"Expense"',
    ]);

    rows = rows.concat(
      dataInc.map((item: Income) => [
        `"${item.title.replace(/"/g, '""')}"`,
        item.amount.toFixed(2),
        `"${item.category.replace(/"/g, '""')}"`,
        item.date,
        '"Income"',
      ])
    );

    return [header, ...rows].map(r => r.join(',')).join('\n');
  }

  // Exporta CSV
  async function handleExportCSV() {
    const csvContent = await generateCSV();
    await downloadCSV('\uFEFF' + csvContent); // BOM para caracteres especiais
  }

  // Importa CSV
  async function handleImportCSV() {
    try {
      const content = await pickCSVFile();
      if (!content) return;

      const lines = content.split('\n').filter(line => line.trim() !== '');

      if (lines.length < 2) {
        showAlert('Erro', 'CSV vazio ou inválido.');
        return;
      }

      const header = lines[0].split(',').map(h => h.replace(/"/g, '').trim());

      const idxTitle = header.indexOf('title');
      const idxAmount = header.indexOf('amount');
      const idxCategory = header.indexOf('category');
      const idxDate = header.indexOf('date');
      const idxType = header.indexOf('type');

      if ([idxTitle, idxAmount, idxCategory, idxDate, idxType].some(i => i === -1)) {
        showAlert('Erro', 'CSV não possui todas as colunas necessárias.');
        return;
      }

      const records = lines.slice(1).map(line => {
        const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
        return {
          title: values[idxTitle]?.replace(/"/g, '') || '',
          amount: parseFloat(values[idxAmount] || '0'),
          category: values[idxCategory]?.replace(/"/g, '') || '',
          date: values[idxDate]?.replace(/"/g, '') || '',
          type: values[idxType]?.replace(/"/g, '') || '',
        };
      });

      for (const r of records) {
        const { type, ...auxR } = r;
        if (r.type === 'Income') await addIncome(auxR);
        else await addExpense(auxR);
      }

      showAlert('Importado!', `${records.length} registros importados com sucesso.`);
    } catch (error) {
      console.error('Erro ao importar CSV:', error);
      showAlert('Erro', 'Falha ao importar CSV.');
    }
  }

  // Limpa banco
  async function handleClearDatabase() {
    if (Platform.OS === 'web') {
      if (!window.confirm('Tem certeza que deseja apagar todos os dados?')) return;
      await clearDatabase();
      showAlert('Pronto', 'Banco de dados limpo com sucesso.');
      return;
    }

    // Mobile
    showAlert(
      'Limpar dados',
      'Tem certeza que deseja apagar todos os dados? Essa ação não pode ser desfeita.',
    );
    await clearDatabase();
    showAlert('Pronto', 'Banco de dados limpo com sucesso.');
  }

  return (
    <View style={[styles.container, { backgroundColor: mode === 'dark' ? '#000' : '#fff' }]}>
      <Text style={[styles.title, { color: mode === 'dark' ? '#fff' : '#000' }]}>
        Configurações
      </Text>

      <Pressable style={styles.button} onPress={handleExportCSV}>
        <Ionicons name="download-outline" size={22} color="#fff" />
        <Text style={styles.buttonText}>Exportar CSV</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={handleImportCSV}>
        <Ionicons name="cloud-upload-outline" size={22} color="#fff" />
        <Text style={styles.buttonText}>Importar CSV</Text>
      </Pressable>

      <Pressable style={styles.dangerButton} onPress={handleClearDatabase}>
        <Ionicons name="trash-outline" size={22} color="#fff" />
        <Text style={styles.dangerText}>Limpar banco de dados</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 24 },
  title: { fontSize: 22, fontWeight: '600' },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#1976D2',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#E53935',
  },
  dangerText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
