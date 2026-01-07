import { useTheme } from '@/constants/ThemeContext';
import { Text, type TextProps } from 'react-native';

type Props = TextProps & {
  type?: 'default' | 'defaultSemiBold' | 'title' | 'subtitle';
};

export function ThemedText({
  style,
  type = 'default',
  ...props
}: Props) {
  const { theme } = useTheme();

  const fontSize =
    type === 'title'
      ? 24
      : type === 'subtitle'
      ? 18
      : 14;

  const fontWeight =
    type === 'title'
      ? '700'
      : type === 'subtitle'
      ? '600'
      : type === 'defaultSemiBold'
      ? '600'
      : '400';

  return (
    <Text
      style={[
        {
          color: theme.text,
          fontSize,
          fontWeight,
        },
        style,
      ]}
      {...props}
    />
  );
}
