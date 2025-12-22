// src/screens/LoginScreen.js
import React, { useState, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ActivityIndicator,
  Alert, TextInput, ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Mail, Lock } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function LoginScreen() {
  const { login, loginAsGuest } = useAuth();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const styles = useMemo(() => getStyles(theme), [theme]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert("Error", "Please enter email and password.");
    setLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      Alert.alert("Login Failed", error.message);
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    setLoading(true);
    await loginAsGuest();
    // No need to set loading false, component will unmount
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        <View style={styles.header}>
          <Text style={styles.logo}>REZOE</Text>
          <Text style={styles.tagline}>Reel it. Sale it. Buy it.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome Back</Text>

          <View style={styles.inputWrap}>
            <Mail size={20} color={theme.colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={theme.colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputWrap}>
            <Lock size={20} color={theme.colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={theme.colors.textSecondary}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Login</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.guestBtn} onPress={handleGuest}>
            <Text style={styles.guestText}>Continue as Guest</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>New here? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.link}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const getStyles = theme => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 40 },
  logo: { fontSize: 40, fontWeight: '900', color: theme.colors.primary, fontStyle: 'italic' },
  tagline: { color: theme.colors.textSecondary, letterSpacing: 1, marginTop: 5 },
  card: { backgroundColor: theme.colors.surface, borderRadius: 20, padding: 24, borderWidth: 1, borderColor: theme.colors.border },
  cardTitle: { fontSize: 22, fontWeight: 'bold', color: theme.colors.textPrimary, marginBottom: 20 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.inputBg, borderRadius: 12, paddingHorizontal: 12, height: 50, marginBottom: 12, borderWidth: 1, borderColor: theme.colors.border },
  input: { flex: 1, marginLeft: 10, color: theme.colors.textPrimary, fontSize: 16 },
  btn: { backgroundColor: theme.colors.primary, borderRadius: 12, height: 50, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  guestBtn: { marginTop: 12, alignItems: 'center', padding: 10 },
  guestText: { color: theme.colors.textSecondary, textDecorationLine: 'underline' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: theme.colors.textSecondary },
  link: { color: theme.colors.primary, fontWeight: 'bold' }
});