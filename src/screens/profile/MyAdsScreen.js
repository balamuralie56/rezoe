// src/screens/MyAdsScreen.js
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { ArrowLeft, AlertTriangle } from 'lucide-react-native';

const MY_ADS = [
  {
    id: '1',
    title: 'iPhone 14 Pro Max - 256GB Deep Purple',
    status: 'Active',
    adType: 'Free',
    expiry: '13 Jan 2026',
  },
  {
    id: '2',
    title: 'Royal Enfield Classic 350 - 2022',
    status: 'Expired',
    adType: 'Paid',
    expiry: '25 Nov 2025',
  },
  {
    id: '3',
    title: 'MacBook Air M2 - 256GB SSD',
    status: 'Rejected',
    adType: 'Free',
    expiry: '—',
    reason: 'AI flagged: Possible nudity',
  },
];

export default function MyAdsScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);
  const navigation = useNavigation();
  const route = useRoute();
  const freeAdsLeft = 3;
  const paidAdsLeft = 10;

  const handleEditAd = ad => Alert.alert('Edit Ad', ad.title);
  const handleExtendAd = ad => Alert.alert('Extend Ad', ad.title);
  const handleDeleteAd = ad =>
    Alert.alert('Delete ad?', ad.title, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive' },
    ]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={18} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>My Reels & Ads</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Status summary */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Status overview</Text>
        <View style={styles.statusRow}>
          <View style={styles.statusItem}>
            <Text style={[styles.statusValue, { color: theme.colors.success }]}>
              {MY_ADS.filter(a => a.status === 'Active').length}
            </Text>
            <Text style={styles.statusLabel}>Active</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusValue}>
              {MY_ADS.filter(a => a.status === 'Expired').length}
            </Text>
            <Text style={styles.statusLabel}>Expired</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={[styles.statusValue, { color: theme.colors.accent }]}>
              {MY_ADS.filter(a => a.status === 'Rejected').length}
            </Text>
            <Text style={styles.statusLabel}>Rejected</Text>
          </View>
        </View>
      </View>

      {/* Ads list */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Your ads</Text>
        {MY_ADS.map(ad => (
          <View key={ad.id} style={styles.adItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.adTitle}>{ad.title}</Text>
              <View style={styles.metaRow}>
                <View style={[styles.tag, styles[`status_${ad.status}`]]}>
                  <Text style={styles.tagText}>{ad.status}</Text>
                </View>
                <View style={[styles.tag, styles.typeTag]}>
                  <Text style={styles.tagText}>{ad.adType}</Text>
                </View>
                <Text style={styles.expiry}>
                  {ad.expiry !== '—' ? `Expires: ${ad.expiry}` : 'No expiry'}
                </Text>
              </View>
              {ad.reason && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                  <AlertTriangle size={11} color={theme.colors.accent} style={{ marginRight: 4 }} />
                  <Text style={styles.reason}>{ad.reason}</Text>
                </View>
              )}
            </View>
            <View style={styles.actionCol}>
              <TouchableOpacity style={styles.smallBtn} onPress={() => handleEditAd(ad)}>
                <Text style={styles.smallText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.smallBtn} onPress={() => handleExtendAd(ad)}>
                <Text style={styles.smallText}>Extend</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.smallBtn, styles.dangerBtn]}
                onPress={() => handleDeleteAd(ad)}
              >
                <Text style={[styles.smallText, { color: '#fff' }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Credits & plans */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Ad credits & plans</Text>
        <View style={styles.creditsRow}>
          <View style={styles.creditBox}>
            <Text style={styles.creditLabel}>Free ads left</Text>
            <Text style={styles.creditValue}>{freeAdsLeft}</Text>
            <Text style={styles.creditNote}>3 free ads • valid 30 days</Text>
            <Text style={styles.creditNote}>Refresh every 60 days</Text>
          </View>
          <View style={styles.creditBox}>
            <Text style={styles.creditLabel}>Paid credits</Text>
            <Text style={styles.creditValue}>{paidAdsLeft}</Text>
            <Text style={styles.creditNote}>₹5 per reel • 30 days</Text>
            <Text style={styles.creditNote}>₹45 / 10 reels • 60 days</Text>
          </View>
        </View>
        <View style={styles.rulesBox}>
          <Text style={styles.rulesTitle}>Video rules</Text>
          <Text style={styles.rulesText}>• Max 60 seconds per reel</Text>
          <Text style={styles.rulesText}>• Only products & services allowed</Text>
          <Text style={styles.rulesText}>• Auto-expire after 30 / 60 days based on plan</Text>
        </View>

        <TouchableOpacity style={styles.buyBtn}>
          <Text style={styles.buyText}>Buy ad pack</Text>
        </TouchableOpacity>
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
    statusRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    statusItem: {
      flex: 1,
      alignItems: 'center',
    },
    statusValue: {
      fontSize: 16,
      fontWeight: '800',
      color: theme.colors.textPrimary,
    },
    statusLabel: {
      fontSize: 11,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    adItem: {
      flexDirection: 'row',
      paddingTop: 8,
      marginTop: 6,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    adTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.textPrimary,
      marginBottom: 2,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 2,
    },
    tag: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 10,
      marginRight: 6,
    },
    status_Active: {
      backgroundColor: 'rgba(0,200,83,0.12)',
    },
    status_Expired: {
      backgroundColor: theme.colors.inputBg,
    },
    status_Rejected: {
      backgroundColor: 'rgba(255,82,82,0.12)',
    },
    typeTag: {
      backgroundColor: theme.colors.inputBg,
    },
    tagText: {
      fontSize: 10,
      color: theme.colors.textPrimary,
      fontWeight: '600',
    },
    expiry: {
      fontSize: 11,
      color: theme.colors.textSecondary,
    },
    reason: {
      fontSize: 11,
      color: theme.colors.accent,
    },
    actionCol: {
      marginLeft: 10,
      alignItems: 'flex-end',
    },
    smallBtn: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: 4,
    },
    dangerBtn: {
      backgroundColor: theme.colors.accent,
      borderColor: theme.colors.accent,
    },
    smallText: {
      fontSize: 11,
      color: theme.colors.textPrimary,
      fontWeight: '600',
    },

    creditsRow: {
      flexDirection: 'row',
      marginTop: 4,
      marginBottom: 8,
    },
    creditBox: {
      flex: 1,
      padding: 10,
      borderRadius: 14,
      backgroundColor: theme.colors.inputBg,
      marginRight: 8,
    },
    creditLabel: {
      fontSize: 11,
      color: theme.colors.textSecondary,
    },
    creditValue: {
      fontSize: 18,
      fontWeight: '800',
      color: theme.colors.textPrimary,
      marginVertical: 2,
    },
    creditNote: {
      fontSize: 10,
      color: theme.colors.textSecondary,
    },
    rulesBox: {
      marginTop: 4,
      marginBottom: 6,
    },
    rulesTitle: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.colors.textPrimary,
      marginBottom: 2,
    },
    rulesText: {
      fontSize: 11,
      color: theme.colors.textSecondary,
    },
    buyBtn: {
      marginTop: 4,
      alignSelf: 'flex-start',
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 14,
      backgroundColor: theme.colors.primary,
    },
    buyText: {
      color: '#fff',
      fontWeight: '700',
      fontSize: 13,
    },
  });
