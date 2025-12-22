// src/screens/SearchScreen.js
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Search, Clock } from 'lucide-react-native';

const RECENT = ['iPhone 14 Pro Max', 'Royal Enfield Classic', 'Gaming laptop', 'Sofa set'];
const SUGGESTED = ['Mobiles', 'Bikes', 'Laptops', 'Furniture', 'Jobs', 'Electronics'];

export default function SearchScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);
  const [query, setQuery] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search</Text>

      <View style={styles.searchBox}>
        <Search size={18} color={theme.colors.textSecondary} />
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder="Search reels, items, categories..."
          placeholderTextColor={theme.colors.textSecondary}
        />
      </View>

      <Text style={styles.sectionTitle}>Recent searches</Text>
      <FlatList
        data={RECENT}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <View style={styles.recentRow}>
            <Clock size={16} color={theme.colors.textSecondary} />
            <Text style={styles.recentText}>{item}</Text>
          </View>
        )}
      />

      <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Browse categories</Text>
      <View style={styles.chipWrap}>
        {SUGGESTED.map(item => (
          <TouchableOpacity key={item} style={styles.chip}>
            <Text style={styles.chipText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
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
    title: {
      fontSize: 22,
      fontWeight: '800',
      color: theme.colors.textPrimary,
      marginBottom: 12,
    },
    searchBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: 14,
      height: 46,
      marginBottom: 16,
    },
    input: {
      flex: 1,
      marginLeft: 8,
      fontSize: 14,
      color: theme.colors.textPrimary,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.colors.textPrimary,
      marginBottom: 8,
    },
    recentRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 6,
    },
    recentText: {
      marginLeft: 8,
      fontSize: 13,
      color: theme.colors.textSecondary,
    },
    chipWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    chip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginRight: 8,
      marginBottom: 8,
    },
    chipText: {
      fontSize: 13,
      color: theme.colors.textPrimary,
    },
  });
