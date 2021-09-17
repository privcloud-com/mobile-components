import { DefaultTheme, configureFonts } from 'react-native-paper';
import customFonts from './fonts';

const theme = {
  ...DefaultTheme,
  fonts: configureFonts(customFonts),
  colors: {
    ...DefaultTheme.colors,
    primary: '#4782DA',
    accent: '#233044',
    error: '#F44336',
    text: 'rgba(0, 0, 0, 0.87)',
    onSurface: '#000000',
  },
};

export default theme;
