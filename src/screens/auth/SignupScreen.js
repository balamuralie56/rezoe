// src/screens/SignupScreen.js
import React, { useState, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, TextInput,
  ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Mail, Lock, User, Phone } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function SignupScreen() {
  const { register } = useAuth();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const styles = useMemo(() => getStyles(theme), [theme]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if(!name || !email || !password) {
      return Alert.alert("Missing Fields", "Please enter Name, Email and Password.");
    }

    setLoading(true);
    try {
      await register(email, password, name, phone);
      // AuthContext will auto-update user state, causing App.js to switch to MainTabs
    } catch (error) {
      Alert.alert("Registration Failed", error.message);
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join REZOE to buy and sell reels.</Text>

        <View style={styles.form}>

          {/* Name */}
          <View style={styles.inputContainer}>
            <User size={20} color={theme.colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor={theme.colors.textSecondary}
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Mail size={20} color={theme.colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Phone (Optional) */}
          <View style={styles.inputContainer}>
            <Phone size={20} color={theme.colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Phone Number (Optional)"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
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

          <TouchableOpacity style={styles.mainButton} onPress={handleSignup} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : (
              <Text style={styles.mainButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>Login</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { padding: 24, justifyContent: 'center', minHeight: '100%' },
  backBtn: { marginBottom: 20 },
  title: { fontSize: 32, fontWeight: '800', color: theme.colors.textPrimary, marginBottom: 8 },
  subtitle: { fontSize: 16, color: theme.colors.textSecondary, marginBottom: 32 },
  form: { gap: 16 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.inputBg, borderRadius: 12, paddingHorizontal: 16, height: 56, borderWidth: 1, borderColor: theme.colors.border },
  input: { flex: 1, marginLeft: 12, fontSize: 16, color: theme.colors.textPrimary },
  mainButton: { backgroundColor: theme.colors.primary, borderRadius: 12, height: 56, justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  mainButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: theme.colors.textSecondary },
  link: { color: theme.colors.primary, fontWeight: 'bold' }
});