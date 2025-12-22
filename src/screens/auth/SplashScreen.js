// src/screens/SplashScreen.js
import React, { useMemo } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function SplashScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>REZOE</Text>
      <Text style={styles.tagline}>Reel it. Sale it. Buy it.</Text>
      <ActivityIndicator style={{ marginTop: 24 }} color={theme.colors.primary} />
    </View>
  );
}

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      fontSize: 40,
      fontWeight: '900',
      color: theme.colors.primary,
      fontStyle: 'italic',
    },
    tagline: {
      marginTop: 8,
      fontSize: 13,
      letterSpacing: 1,
      color: theme.colors.textSecondary,
    },
  });
