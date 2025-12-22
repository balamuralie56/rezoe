// src/screens/CallHistoryScreen.js
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { ArrowLeft, PhoneCall, PhoneIncoming, PhoneOutgoing, MessageCircle } from 'lucide-react-native';

const CALLS = [
  { id: '1', name: 'Raj Kumar', type: 'outgoing', time: 'Today · 11:20 AM' },
  { id: '2', name: 'Priya Sharma', type: 'incoming', time: 'Today · 9:02 AM' },
  { id: '3', name: 'Vikram Singh', type: 'missed', time: 'Yesterday · 7:15 PM' },
];

export default function CallHistoryScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);
  const navigation = useNavigation();

  const renderIcon = (type) => {
    const color =
      type === 'missed' ? theme.colors.accent : theme.colors.primary;
    if (type === 'incoming') return <PhoneIncoming size={18} color={color} />;
    if (type === 'outgoing') return <PhoneOutgoing size={18} color={color} />;
    return <PhoneCall size={18} color={color} />;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={18} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Call history</Text>
        <View style={{ width: 32 }} />
      </View>

      <FlatList
        data={CALLS}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => (
          <View style={styles.callCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.name[0]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <View style={styles.row}>
                {renderIcon(item.type)}
                <Text style={styles.time}>{item.time}</Text>
              </View>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.callBtn}>
                <PhoneCall size={18} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.msgBtn}
                onPress={() =>
                  navigation.navigate('ChatScreen', {
                    chatId: item.id,
                    name: item.name,
                  })
                }
              >
                <MessageCircle size={18} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
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
    callCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 10,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.inputBg,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    avatarText: {
      fontSize: 17,
      fontWeight: '700',
      color: theme.colors.textPrimary,
    },
    name: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.textPrimary,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 2,
      gap: 6,
    },
    time: {
      fontSize: 11,
      color: theme.colors.textSecondary,
    },
    actions: {
      flexDirection: 'row',
      marginLeft: 8,
      alignItems: 'center',
      gap: 6,
    },
    callBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    msgBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.inputBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
