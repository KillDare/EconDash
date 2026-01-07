import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Text, View } from 'react-native';

export default function Profile() {
  const colorScheme = useColorScheme();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: Colors[colorScheme ?? 'light'].text, fontSize: 20 }}>
        Perfil do usuário
      </Text>
    </View>
  );
}
