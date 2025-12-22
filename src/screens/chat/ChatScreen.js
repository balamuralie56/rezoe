// src/screens/ChatScreen.js
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import {
  ArrowLeft,
  Paperclip,
  Image as ImageIcon,
  FileText,
  Send,
} from 'lucide-react-native';

const MOCK_MESSAGES = [
  { id: '1', fromMe: false, text: 'Hi, is the iPhone still available?' },
  { id: '2', fromMe: true, text: 'Yes, it is available and in good condition.' },
  { id: '3', fromMe: false, text: 'Can you share final price?' },
];

export default function ChatScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);
  const navigation = useNavigation();
  const route = useRoute();
  const { name = 'Customer', tier = 'Normal' } = route.params || {};

  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: String(messages.length + 1),
      fromMe: true,
      text: input.trim(),
    };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.bubble,
        item.fromMe ? styles.bubbleMe : styles.bubbleThem,
      ]}
    >
      <Text
        style={[
          styles.bubbleText,
          item.fromMe && { color: '#fff' },
        ]}
      >
        {item.text}
      </Text>
    </View>
  );

  const openAttachDocs = () => {
    // later integrate document picker
    console.log('Attach document');
  };

  const openAttachPhotos = () => {
    // later integrate image picker
    console.log('Attach photo');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={18} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.subtitle}>{tier} customer</Text>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ padding: 16 }}
      />

      {/* Composer with attachments */}
      <View style={styles.composer}>
        <TouchableOpacity onPress={openAttachPhotos} style={styles.attachBtn}>
          <ImageIcon size={18} color={theme.colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={openAttachDocs} style={styles.attachBtn}>
          <FileText size={18} color={theme.colors.textSecondary} />
        </TouchableOpacity>
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={theme.colors.textSecondary}
            value={input}
            onChangeText={setInput}
          />
        </View>
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Send size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    backBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.inputBg,
      marginRight: 10,
    },
    title: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.colors.textPrimary,
    },
    subtitle: {
      fontSize: 11,
      color: theme.colors.textSecondary,
    },

    bubble: {
      maxWidth: '75%',
      borderRadius: 16,
      paddingHorizontal: 10,
      paddingVertical: 7,
      marginBottom: 6,
    },
    bubbleMe: {
      alignSelf: 'flex-end',
      backgroundColor: theme.colors.primary,
    },
    bubbleThem: {
      alignSelf: 'flex-start',
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    bubbleText: {
      fontSize: 13,
      color: theme.colors.textPrimary,
    },

    composer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    attachBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 4,
    },
    inputWrap: {
      flex: 1,
      backgroundColor: theme.colors.inputBg,
      borderRadius: 18,
      paddingHorizontal: 12,
      marginHorizontal: 4,
    },
    input: {
      height: 36,
      fontSize: 13,
      color: theme.colors.textPrimary,
    },
    sendBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 4,
    },
  });
