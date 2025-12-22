// src/screens/ProfileScreen.js
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Camera, Cog, Film, CreditCard, ShieldAlert, BarChart3 } from 'lucide-react-native';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation();
  const styles = useMemo(() => getStyles(theme), [theme]);

  const displayName = user?.name || 'Guest User';
  const contact = user?.phone || user?.email || 'Not linked';

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.navigate('SettingsScreen')}
        >
          <Cog size={18} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* User card */}
      <View style={styles.card}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{displayName[0]}</Text>
            <TouchableOpacity style={styles.camBtn}>
              <Camera size={14} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.subText}>{contact}</Text>
      </View>

      {/* Navigation tiles */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Seller dashboard</Text>

        <TouchableOpacity
          style={styles.navRow}
          onPress={() => navigation.navigate('MyAdsScreen')}
        >
          <View style={styles.navLeft}>
            <Film size={18} color={theme.colors.primary} />
            <View>
              <Text style={styles.navTitle}>My Reels & Ads</Text>
              <Text style={styles.navSubtitle}>Manage active, expired and rejected ads</Text>
            </View>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navRow}
          onPress={() => navigation.navigate('EmiScreen')}
        >
          <View style={styles.navLeft}>
            <CreditCard size={18} color={theme.colors.primary} />
            <View>
              <Text style={styles.navTitle}>EMI options</Text>
              <Text style={styles.navSubtitle}>Bajaj, Snapmint (Phase 2)</Text>
            </View>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navRow}
          onPress={() => navigation.navigate('BlockedReelsScreen')}
        >
          <View style={styles.navLeft}>
            <ShieldAlert size={18} color={theme.colors.accent} />
            <View>
              <Text style={styles.navTitle}>Reported / blocked reels</Text>
              <Text style={styles.navSubtitle}>See AI reasons & appeal options</Text>
            </View>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navRow}
          onPress={() => navigation.navigate('MyAdsScreen', { tab: 'credits' })}
        >
          <View style={styles.navLeft}>
            <BarChart3 size={18} color={theme.colors.primary} />
            <View>
              <Text style={styles.navTitle}>Ad credits & plans</Text>
              <Text style={styles.navSubtitle}>Free ads, paid packs & rules</Text>
            </View>
          </View>
          <Text style={styles.chevron}>›</Text>
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
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    title: {
      fontSize: 22,
      fontWeight: '800',
      color: theme.colors.textPrimary,
    },
    iconBtn: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    avatarWrap: {
      alignItems: 'center',
      marginTop: 4,
      marginBottom: 8,
    },
    avatar: {
      width: 84,
      height: 84,
      borderRadius: 42,
      backgroundColor: theme.colors.inputBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      fontSize: 32,
      fontWeight: '800',
      color: theme.colors.textPrimary,
    },
    camBtn: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: theme.colors.surface,
    },
    name: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.textPrimary,
      textAlign: 'center',
    },
    subText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: 4,
    },

    sectionTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.colors.textPrimary,
      marginBottom: 8,
    },
    navRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 10,
    },
    navLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    navTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.textPrimary,
    },
    navSubtitle: {
      fontSize: 11,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    chevron: {
      fontSize: 20,
      color: theme.colors.textSecondary,
    },
  });
