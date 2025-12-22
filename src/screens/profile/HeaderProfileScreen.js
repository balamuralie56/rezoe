import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, User, Film, Settings } from 'lucide-react-native';

export default function HeaderProfileScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const styles = useMemo(() => getStyles(theme), [theme]);
  const navigation = useNavigation();

  const name = user?.name || 'Guest User';
  const contact = user?.phone || user?.email || 'Not linked';

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={18} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Your profile</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{name[0]}</Text>
        </View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.sub}>{contact}</Text>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('ProfileTab')}
        >
          <Text style={styles.primaryBtnText}>Open full profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Quick actions</Text>

        <TouchableOpacity
          style={styles.rowItem}
          onPress={() => navigation.navigate('MyAdsScreen')}
        >
          <Film size={18} color={theme.colors.textSecondary} />
          <Text style={styles.rowText}>My ads & reels</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.rowItem}
          onPress={() => navigation.navigate('SettingsScreen')}
        >
          <Settings size={18} color={theme.colors.textSecondary} />
          <Text style={styles.rowText}>Profile settings</Text>
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
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
    },
    avatar: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: theme.colors.inputBg,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    avatarText: {
      fontSize: 30,
      fontWeight: '800',
      color: theme.colors.textPrimary,
    },
    name: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.textPrimary,
    },
    sub: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 2,
      marginBottom: 10,
    },
    primaryBtn: {
      marginTop: 4,
      borderRadius: 18,
      paddingHorizontal: 18,
      paddingVertical: 8,
      backgroundColor: theme.colors.primary,
    },
    primaryBtnText: {
      color: '#fff',
      fontWeight: '700',
      fontSize: 13,
    },
    sectionTitle: {
      alignSelf: 'flex-start',
      fontSize: 13,
      fontWeight: '700',
      color: theme.colors.textPrimary,
      marginBottom: 8,
    },
    rowItem: {
      alignSelf: 'stretch',
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      gap: 8,
    },
    rowText: {
      fontSize: 13,
      color: theme.colors.textPrimary,
    },
  });
