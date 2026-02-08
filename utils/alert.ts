import { Platform, Alert as RNAlert } from 'react-native';

export function showAlert(title: string, message: string) {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
  } else {
    RNAlert.alert(title, message);
  }
}
