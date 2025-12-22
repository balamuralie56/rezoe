// src/screens/EmiScreen.js
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, CreditCard, Info } from 'lucide-react-native';

export default function EmiScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={18} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>EMI Options</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Partners</Text>
        <View style={styles.row}>
          <CreditCard size={18} color={theme.colors.primary} />
          <Text style={styles.text}>Bajaj Finserv (Planned)</Text>
        </View>
        <View style={styles.row}>
          <CreditCard size={18} color={theme.colors.primary} />
          <Text style={styles.text}>Snapmint (Planned)</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>For buyers</Text>
        <Text style={styles.text}>• Apply for EMI at checkout on eligible reels.</Text>
        <Text style={styles.text}>• Instant approval or KYC-based approval depending on partner.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>For sellers</Text>
        <Text style={styles.text}>• You can decide which listings allow EMI.</Text>
        <Text style={styles.text}>• Payouts come to you normally; EMI is between buyer & partner.</Text>
        <Text style={styles.text}>• More trust, higher ticket size sales.</Text>
      </View>

      <View style={styles.infoRow}>
        <Info size={16} color={theme.colors.textSecondary} />
        <Text style={styles.infoText}>
          EMI is a Phase 2 feature. UI is ready; Razorpay / partner APIs can be integrated later.
        </Text>
      </View>
    </ScrollView>
  );
}

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    backBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.textPrimary,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: 18,
      padding: 14,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.colors.textPrimary,
      marginBottom: 6,
    },
    text: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 4,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 6,
      paddingHorizontal: 2,
    },
    infoText: {
      flex: 1,
      fontSize: 11,
      color: theme.colors.textSecondary,
    },
  });
