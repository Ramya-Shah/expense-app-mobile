import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from './src/context/AppContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { colors } from './src/theme/colors';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    surface: colors.surface,
  },
};

export default function App() {
  return (
    <AppProvider>
      <PaperProvider theme={theme}>
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <View style={{ flex: 1, width: '100%', maxWidth: 600, alignSelf: 'center', backgroundColor: colors.background, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 20, elevation: 5 }}>
            <RootNavigator />
          </View>
        </View>
        <StatusBar style="auto" />
      </PaperProvider>
    </AppProvider>
  );
}
