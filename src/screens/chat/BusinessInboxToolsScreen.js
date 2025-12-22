// src/screens/BusinessInboxToolsScreen.js
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Tag, ClipboardList, Headphones, BarChart3 } from 'lucide-react-native';

export default function BusinessInboxToolsScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={18} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>REZOE Business Inbox</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Lead management tools</Text>

        <View style={styles.toolRow}>
          <Tag size={18} color={theme.colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.toolTitle}>Lead labels</Text>
            <Text style={styles.toolSubtitle}>
              New lead, Hot lead, Payment done, Supplier, etc.
            </Text>
          </View>
        </View>

        <View style={styles.toolRow}>
          <ClipboardList size={18} color={theme.colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.toolTitle}>Order notes</Text>
            <Text style={styles.toolSubtitle}>
              Add internal notes per conversation to track orders and follow-ups.
            </Text>
          </View>
        </View>

        <View style={styles.toolRow}>
          <Headphones size={18} color={theme.colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.toolTitle}>Support tags</Text>
            <Text style={styles.toolSubtitle}>
              Mark chats as Support, Complaint, Warranty, Returns, etc.
            </Text>
          </View>
        </View>

        <View style={styles.toolRow}>
          <BarChart3 size={18} color={theme.colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.toolTitle}>Conversation analytics</Text>
            <Text style={styles.toolSubtitle}>
              Track response time, conversion rate and high-value customers. (Phase 2)
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
    sectionTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.colors.textPrimary,
      marginBottom: 8,
    },
    toolRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
      marginBottom: 10,
    },
    toolTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.textPrimary,
    },
    toolSubtitle: {
      fontSize: 11,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
  });
