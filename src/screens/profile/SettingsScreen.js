// src/screens/SettingsScreen.js
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft,
  Globe,
  HelpCircle,
  Moon,
  Sun,
  FileText,
  Shield,
  Trash2,
} from 'lucide-react-native';

export default function SettingsScreen() {
  const { theme, mode, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigation = useNavigation();
  const styles = useMemo(() => getStyles(theme), [theme]);

  const [language, setLanguage] = useState('English');

  const toggleLanguage = () => setLanguage(prev => (prev === 'English' ? 'Hindi' : 'English'));

  const openLegal = (type) =>
    Alert.alert(type, `${type} page will open here (webview or static screen).`);

  const openHelp = () =>
    Alert.alert('Help & Contact', 'Support: support@rezoe.app\nWhatsApp: +91-XXXXXXXXXX');

  const confirmDeleteAccount = () =>
    Alert.alert(
      'Delete account?',
      'This will remove your profile, ads and payment history from REZOE. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => Alert.alert('Not wired yet') },
      ],
    );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={18} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Appearance */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <TouchableOpacity style={styles.row} onPress={toggleTheme}>
          <View style={styles.leftRow}>
            {mode === 'light' ? (
              <Sun size={18} color={theme.colors.primary} />
            ) : (
              <Moon size={18} color={theme.colors.primary} />
            )}
            <Text style={styles.label}>Theme</Text>
          </View>
          <Text style={styles.value}>{mode === 'light' ? 'Light' : 'Dark'}</Text>
        </TouchableOpacity>
      </View>

      {/* Language */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Language</Text>
        <TouchableOpacity style={styles.row} onPress={toggleLanguage}>
          <View style={styles.leftRow}>
            <Globe size={18} color={theme.colors.textSecondary} />
            <Text style={styles.label}>App language</Text>
          </View>
          <Text style={styles.value}>{language}</Text>
        </TouchableOpacity>
        <Text style={styles.helper}>
          Pan-India support planned. You can later load translations from Firebase or local JSON.
        </Text>
      </View>

      {/* Legal */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Legal</Text>
        <TouchableOpacity style={styles.row} onPress={() => openLegal('Privacy Policy')}>
          <View style={styles.leftRow}>
            <Shield size={18} color={theme.colors.textSecondary} />
            <Text style={styles.label}>Privacy Policy</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} onPress={() => openLegal('Terms & Conditions')}>
          <View style={styles.leftRow}>
            <FileText size={18} color={theme.colors.textSecondary} />
            <Text style={styles.label}>Terms & Conditions</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Help */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Support</Text>
        <TouchableOpacity style={styles.row} onPress={openHelp}>
          <View style={styles.leftRow}>
            <HelpCircle size={18} color={theme.colors.textSecondary} />
            <Text style={styles.label}>Help & Contact</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Danger zone */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.row} onPress={confirmDeleteAccount}>
          <View style={styles.leftRow}>
            <Trash2 size={18} color={theme.colors.accent} />
            <Text style={[styles.label, { color: theme.colors.accent }]}>Delete account</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
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
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 8,
    },
    leftRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    label: {
      fontSize: 13,
      color: theme.colors.textPrimary,
    },
    value: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    helper: {
      fontSize: 11,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
    logoutBtn: {
      marginTop: 8,
      marginHorizontal: 16,
      height: 46,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.accent,
    },
    logoutText: {
      color: '#fff',
      fontWeight: '700',
      fontSize: 15,
    },
  });
