// src/screens/BlockedReelsScreen.js
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, AlertTriangle } from 'lucide-react-native';

const BLOCKED_REELS = [
  { id: 'b1', title: 'Test Reel 01', reason: 'Nudity (auto-detected)' },
  { id: 'b2', title: 'Party night vlog', reason: 'Violence / unsafe behaviour' },
];

export default function BlockedReelsScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={18} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Reported / blocked reels</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>AI blocking rules</Text>
        <Text style={styles.text}>• Nudity & sexual content</Text>
        <Text style={styles.text}>• Violence, self-harm, weapons</Text>
        <Text style={styles.text}>• Drugs & illegal products</Text>
        <Text style={styles.text}>• Abusive language / hate speech</Text>
        <Text style={styles.text}>• Explicit dance or adult content</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Your blocked reels</Text>
        {BLOCKED_REELS.length === 0 ? (
          <Text style={styles.text}>No reels blocked. Keep it clean ✨</Text>
        ) : (
          BLOCKED_REELS.map(item => (
            <View key={item.id} style={styles.row}>
              <View style={styles.iconWrap}>
                <AlertTriangle size={14} color={theme.colors.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.blockTitle}>{item.title}</Text>
                <Text style={styles.blockReason}>{item.reason}</Text>
              </View>
            </View>
          ))
        )}

        <Text style={[styles.text, { marginTop: 8 }]}>
          For serious mistakes, you can contact support and request a manual review.
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
      marginTop: 8,
    },
    iconWrap: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: theme.colors.inputBg,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
    },
    blockTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.textPrimary,
    },
    blockReason: {
      fontSize: 11,
      color: theme.colors.textSecondary,
    },
  });
