import * as DocumentPicker from "expo-document-picker";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

function formatDateForInput(date: Date) {
  return date.toISOString().split("T")[0];
}

/**
 * Exporta conteúdo CSV
 */
export async function downloadCSV(content: string) {
  if (Platform.OS === "web") {
    // Web: criar blob e "baixar" o arquivo
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "econ-dash-backup.csv";
    a.click();

    URL.revokeObjectURL(url);
    return;
  }

  try {
    // iOS / Android
    const file = new File(Paths.document, "econ-dash-backup.csv");

    await file.create({ overwrite: true });
    await file.write(content);

    await Sharing.shareAsync(file.uri);
  } catch (error) {
    console.error("Erro ao exportar CSV:", error);
  }
}

/**
 * Importa CSV do dispositivo
 */
export async function pickCSVFile(): Promise<string | null> {
  if (Platform.OS === "web") {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".csv";
      input.onchange = async (e: any) => {
        const file = e.target.files[0];
        if (!file) return resolve(null);
        const text = await file.text();
        resolve(text);
      };
      input.click();
    });
  }

  // Mobile: DocumentPicker + expo-file-system
  const result = await DocumentPicker.getDocumentAsync({
    type: "*/*",
    copyToCacheDirectory: true,
  });

  if (result.canceled) return null;

  const name = result.assets[0].name;

  if (!name.endsWith(".csv")) {
    alert("Selecione um arquivo CSV");
    return null;
  }

  const file = new File(result.assets[0].uri);

  return file.textSync();
}
