import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { ArrowLeft, Bell, MessageCircle, ShoppingBag, Volume2 } from 'lucide-react-native';

export default function NotificationsScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);
  const navigation = useNavigation();

  const [pushEnabled, setPushEnabled] = useState(true);
  const [chatEnabled, setChatEnabled] = useState(true);
  const [marketingEnabled, setMarketingEnabled] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={18} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Bell size={20} color={theme.colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Stay updated</Text>
            <Text style={styles.cardText}>
              Get alerts for new leads, offers, payments and app updates.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.switchRow}>
          <View style={styles.switchTextWrap}>
            <View style={styles.row}>
              <Volume2 size={18} color={theme.colors.textSecondary} />
              <Text style={styles.switchTitle}>System notifications</Text>
            </View>
            <Text style={styles.switchSubtitle}>General app alerts & security notifications.</Text>
          </View>
          <Switch value={pushEnabled} onValueChange={setPushEnabled} />
        </View>

        <View style={styles.switchRow}>
          <View style={styles.switchTextWrap}>
            <View style={styles.row}>
              <MessageCircle size={18} color={theme.colors.textSecondary} />
              <Text style={styles.switchTitle}>Chat & calls</Text>
            </View>
            <Text style={styles.switchSubtitle}>New messages, missed calls and reminders.</Text>
          </View>
          <Switch value={chatEnabled} onValueChange={setChatEnabled} />
        </View>

        <View style={styles.switchRow}>
          <View style={styles.switchTextWrap}>
            <View style={styles.row}>
              <ShoppingBag size={18} color={theme.colors.textSecondary} />
              <Text style={styles.switchTitle}>Offers & tips</Text>
            </View>
            <Text style={styles.switchSubtitle}>
              Product updates, discounts and selling tips from REZOE.
            </Text>
          </View>
          <Switch value={marketingEnabled} onValueChange={setMarketingEnabled} />
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
      alignItems: 'center',
      gap: 8,
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
      marginBottom: 8,
    },
    switchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 8,
    },
    switchTextWrap: {
      flex: 1,
      marginRight: 10,
    },
    switchTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.textPrimary,
      marginLeft: 6,
    },
    switchSubtitle: {
      fontSize: 11,
      color: theme.colors.textSecondary,
      marginTop: 2,
      marginLeft: 24,
    },
  });
