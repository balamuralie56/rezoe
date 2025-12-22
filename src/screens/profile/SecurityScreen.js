import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { ArrowLeft, Shield, Smartphone, Lock, EyeOff, AlertTriangle } from 'lucide-react-native';

export default function SecurityScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={18} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Security & Safety</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Shield size={20} color={theme.colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Account protection</Text>
            <Text style={styles.cardText}>
              We secure your login, sessions and suspicious activity using device- and IP-based checks.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Login & devices</Text>

        <TouchableOpacity style={styles.itemRow}>
          <Smartphone size={18} color={theme.colors.textSecondary} />
          <View style={styles.itemTextWrap}>
            <Text style={styles.itemTitle}>Active devices</Text>
            <Text style={styles.itemSubtitle}>View and sign out of other devices (coming soon)</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemRow}>
          <Lock size={18} color={theme.colors.textSecondary} />
          <View style={styles.itemTextWrap}>
            <Text style={styles.itemTitle}>Two-step verification</Text>
            <Text style={styles.itemSubtitle}>Add an extra layer of security via OTP / authenticator.</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemRow}>
          <EyeOff size={18} color={theme.colors.textSecondary} />
          <View style={styles.itemTextWrap}>
            <Text style={styles.itemTitle}>Hidden personal details</Text>
            <Text style={styles.itemSubtitle}>Your phone/email are only shared with buyers you accept.</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Report & block</Text>
        <View style={styles.row}>
          <AlertTriangle size={18} color={theme.colors.accent} />
          <View style={{ flex: 1 }}>
            <Text style={styles.itemTitle}>Safety tools</Text>
            <Text style={styles.itemSubtitle}>
              Report suspicious users, scams or unsafe content directly from chats or reels.
            </Text>
          </View>
        </View>
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
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
    },
    cardTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.colors.textPrimary,
      marginBottom: 4,
    },
    cardText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.colors.textPrimary,
      marginBottom: 6,
    },
    itemRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingVertical: 6,
      gap: 10,
    },
    itemTextWrap: { flex: 1 },
    itemTitle: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.textPrimary,
    },
    itemSubtitle: {
      fontSize: 11,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
  });
