import { useTheme } from '@/constants/ThemeContext';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { ThemedText } from './themed-text';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline';

type Props = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  style?: ViewStyle;
};

export function ThemedButton({
  title,
  onPress,
  variant = 'primary',
  style,
}: Props) {
  const { theme } = useTheme();
  const button = theme.button[variant];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: button.background,
          borderWidth: variant === 'outline' ? 1 : 0,
          borderColor: variant === 'outline' ? button.border : undefined,
          opacity: pressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      <ThemedText style={{ color: button.text, fontWeight: '600' }}>
        {title}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
});
