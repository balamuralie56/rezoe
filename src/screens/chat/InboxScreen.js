// src/screens/InboxScreen.js
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import {
  MessageCircle,
  Filter,
  PhoneCall,
  Tag,
  Star,
  X,
} from 'lucide-react-native';

const CHATS = [
  {
    id: '1',
    name: 'Raj Kumar',
    lastMessage: 'Is the iPhone still available?',
    time: '2m',
    unread: 2,
    label: 'New lead',
    tier: 'Normal', // Normal | Premium | Elite
    dmType: 'Primary', // Primary | General | Request
    starred: true,
  },
  {
    id: '2',
    name: 'Priya Sharma',
    lastMessage: 'Thanks, payment sent 🙌',
    time: '1h',
    unread: 0,
    label: 'Payment done',
    tier: 'Premium',
    dmType: 'Primary',
    starred: true,
  },
  {
    id: '3',
    name: 'Vikram Singh',
    lastMessage: 'Can you hold the bike till evening?',
    time: 'Yesterday',
    unread: 1,
    label: 'Hot lead',
    tier: 'Elite',
    dmType: 'General',
    starred: false,
  },
  {
    id: '4',
    name: 'Anita Furnitures',
    lastMessage: 'We can deliver by Monday.',
    time: 'Mon',
    unread: 0,
    label: 'Supplier',
    tier: 'Normal',
    dmType: 'Request',
    starred: false,
  },
  {
    id: '5',
    name: 'Balamurali',
    lastMessage: 'Is the iPhone still available?',
    time: '2m',
    unread: 2,
    label: 'New lead',
    tier: 'Normal',
    dmType: 'Request',
    starred: false,
  },
  {
    id: '6',
    name: 'Mohan',
    lastMessage: 'Thanks, payment sent 🙌',
    time: '1h',
    unread: 0,
    label: 'Payment done',
    tier: 'Premium',
    dmType: 'Primary',
    starred: true,
  },
  {
    id: '7',
    name: 'Inbha',
    lastMessage: 'Can you hold the bike till evening?',
    time: 'Yesterday',
    unread: 1,
    label: 'Hot lead',
    tier: 'Elite',
    dmType: 'Request',
    starred: true,
  },
  {
    id: '8',
    name: 'Karthik',
    lastMessage: 'We can deliver by Monday.',
    time: 'Mon',
    unread: 0,
    label: 'Supplier',
    tier: 'Normal',
    dmType: 'Request',
    starred: false,
  },
];

const TIER_FILTERS = ['Normal', 'Premium', 'Elite'];
const TYPE_FILTERS = ['All', 'Unread', 'Starred'];
const DM_TABS = [
  { key: 'Primary', label: 'Primary' },
  { key: 'General', label: 'General' },
  { key: 'Request', label: 'Request' },
];

export default function InboxScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);
  const navigation = useNavigation();

  const [activeTier, setActiveTier] = useState(null);        // null = all tiers
  const [activeTypeFilter, setActiveTypeFilter] = useState('All');
  const [activeDmTab, setActiveDmTab] = useState('Primary');
  const [filterVisible, setFilterVisible] = useState(false);

  // Apply filters to chats
  const filteredChats = CHATS.filter(chat => {
    // DM tab filter (still visible on main screen)
    if (chat.dmType !== activeDmTab) return false;

    // Tier filter (inside modal)
    if (activeTier && chat.tier !== activeTier) return false;

    // Message type filter
    if (activeTypeFilter === 'Unread' && chat.unread === 0) return false;
    if (activeTypeFilter === 'Starred' && !chat.starred) return false;

    return true;
  });

  const openFilter = () => setFilterVisible(true);
  const closeFilter = () => setFilterVisible(false);

  const resetFilters = () => {
    setActiveTier(null);
    setActiveTypeFilter('All');
  };

  const renderTierFilter = tier => {
    const active = activeTier === tier;
    return (
      <TouchableOpacity
        key={tier}
        style={[styles.tierChip, active && styles.tierChipActive]}
        onPress={() => setActiveTier(active ? null : tier)}
      >
        <Text
          style={[
            styles.tierChipText,
            active && styles.tierChipTextActive,
          ]}
        >
          {tier}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderTypeFilter = item => {
    const active = activeTypeFilter === item;
    return (
      <TouchableOpacity
        key={item}
        style={[styles.filterChip, active && styles.filterChipActive]}
        onPress={() => setActiveTypeFilter(item)}
      >
        <Text
          style={[
            styles.filterChipText,
            active && styles.filterChipTextActive,
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatCard}
      onPress={() =>
        navigation.navigate('ChatScreen', {
          chatId: item.id,
          name: item.name,
          tier: item.tier,
        })
      }
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.name[0]}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <View style={styles.rowTop}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>

        <View style={styles.rowMiddle}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        </View>

        <View style={styles.rowBottom}>
          <View style={styles.labelPill}>
            <Tag size={11} color={theme.colors.primary} />
            <Text style={styles.labelText}>{item.label}</Text>
          </View>
          <View style={[styles.labelPill, styles.tierPill]}>
            <Text style={styles.labelText}>{item.tier}</Text>
          </View>
          {item.starred && (
            <Star size={12} color={theme.colors.accent} style={{ marginLeft: 4 }} />
          )}
        </View>
      </View>

      <View style={styles.rightSide}>
        {item.unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unread}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View className="header" style={styles.headerRow}>
        <View>
          <Text style={styles.headerTitle}>Messages</Text>
          <Text style={styles.headerSubtitle}>
            Manage leads, customers & support
          </Text>
        </View>
        <View style={styles.headerIcons}>
          {/* Filter icon opens modal */}
          <TouchableOpacity style={styles.iconBtn} onPress={openFilter}>
            <Filter size={18} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          {/* Call history */}
          <TouchableOpacity
            style={[styles.iconBtn, { marginLeft: 8 }]}
            onPress={() => navigation.navigate('CallHistoryScreen')}
          >
            <PhoneCall size={18} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* REZOE BUSINESS INBOX CARD */}
      <TouchableOpacity
        style={styles.businessCard}
        onPress={() => navigation.navigate('BusinessInboxToolsScreen')}
      >
        <View style={styles.businessIconWrap}>
          <MessageCircle size={20} color={theme.colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.businessTitle}>REZOE Business Inbox</Text>
          <Text style={styles.businessSubtitle}>
            Tools to manage leads, orders & support in one place.
          </Text>
        </View>
        <Text style={styles.businessToolsText}>Open</Text>
      </TouchableOpacity>

      {/* DM TABS (still on main screen) */}
      <View style={styles.dmTabsRow}>
        {DM_TABS.map(tab => {
          const active = activeDmTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveDmTab(tab.key)}
              style={styles.dmTabBtn}
            >
              <Text
                style={[
                  styles.dmTabText,
                  active && styles.dmTabTextActive,
                ]}
              >
                {tab.label}
              </Text>
              {active && <View style={styles.dmUnderline} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* CHAT LIST */}
      <FlatList
        data={filteredChats}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>💬</Text>
            <Text style={styles.emptyTitle}>No conversations yet</Text>
            <Text style={styles.emptySubtitle}>
              Change DM tab or adjust filters to see more chats.
            </Text>
          </View>
        }
      />

      {/* FILTER MODAL (bottom sheet) */}
      <Modal
        visible={filterVisible}
        animationType="slide"
        transparent
        onRequestClose={closeFilter}
      >
        <View style={styles.filterBackdrop}>
          <View style={styles.filterSheet}>
            {/* header */}
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Filters</Text>
              <TouchableOpacity onPress={closeFilter}>
                <X size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* tier section */}
            <Text style={styles.filterSectionTitle}>Customer tier</Text>
            <View style={styles.filterRow}>{TIER_FILTERS.map(renderTierFilter)}</View>

            {/* message type section */}
            <Text style={[styles.filterSectionTitle, { marginTop: 12 }]}>
              Messages
            </Text>
            <View style={styles.filterRow}>{TYPE_FILTERS.map(renderTypeFilter)}</View>

            {/* actions */}
            <View style={styles.filterActionsRow}>
              <TouchableOpacity onPress={resetFilters}>
                <Text style={styles.filterResetText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterApplyBtn} onPress={closeFilter}>
                <Text style={styles.filterApplyText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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

    /* HEADER */
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 14,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: '800',
      color: theme.colors.textPrimary,
    },
    headerSubtitle: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    headerIcons: {
      flexDirection: 'row',
      alignItems: 'center',
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

    /* BUSINESS CARD */
    businessCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: 18,
      padding: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    businessIconWrap: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.inputBg,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    businessTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.colors.textPrimary,
    },
    businessSubtitle: {
      fontSize: 11,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    businessToolsText: {
      fontSize: 12,
      color: theme.colors.primary,
      fontWeight: '700',
      marginLeft: 8,
    },

    /* DM TABS */
    dmTabsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 2,
      marginBottom: 6,
    },
    dmTabBtn: {
      marginRight: 16,
      alignItems: 'center',
    },
    dmTabText: {
      fontSize: 13,
      color: theme.colors.textSecondary,
    },
    dmTabTextActive: {
      color: theme.colors.textPrimary,
      fontWeight: '700',
    },
    dmUnderline: {
      marginTop: 2,
      height: 2,
      borderRadius: 1,
      width: '100%',
      backgroundColor: theme.colors.primary,
    },

    /* CHAT ITEM */
    chatCard: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surface,
      borderRadius: 18,
      paddingVertical: 10,
      paddingHorizontal: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.inputBg,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    avatarText: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.textPrimary,
    },
    rowTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 2,
    },
    name: {
      flex: 1,
      fontSize: 14,
      fontWeight: '700',
      color: theme.colors.textPrimary,
      marginRight: 8,
    },
    time: {
      fontSize: 11,
      color: theme.colors.textSecondary,
    },
    rowMiddle: {
      marginBottom: 4,
    },
    lastMessage: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    rowBottom: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 2,
    },
    labelPill: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 12,
      backgroundColor: theme.colors.inputBg,
      marginRight: 6,
    },
    tierPill: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    labelText: {
      marginLeft: 4,
      fontSize: 11,
      color: theme.colors.textPrimary,
      fontWeight: '500',
    },
    rightSide: {
      marginLeft: 8,
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    unreadBadge: {
      minWidth: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: theme.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 6,
    },
    unreadText: {
      color: '#fff',
      fontSize: 11,
      fontWeight: '700',
    },

    /* EMPTY STATE */
    emptyState: {
      marginTop: 40,
      alignItems: 'center',
      paddingHorizontal: 32,
    },
    emptyEmoji: {
      fontSize: 34,
      marginBottom: 8,
    },
    emptyTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.colors.textPrimary,
    },
    emptySubtitle: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: 4,
    },

    /* FILTER MODAL */
    filterBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.55)',
      justifyContent: 'flex-end',
    },
    filterSheet: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 18,
      paddingTop: 14,
      paddingBottom: 20,
    },
    filterHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    filterTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.textPrimary,
    },
    filterSectionTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.textSecondary,
      marginBottom: 4,
    },
    filterRow: {
      flexDirection: 'row',
      marginBottom: 4,
    },
    tierChip: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      marginRight: 8,
    },
    tierChipActive: {
      borderColor: theme.colors.primary,
      backgroundColor:
        theme.mode === 'light' ? '#fff4ec' : 'rgba(255,106,38,0.16)',
    },
    tierChipText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    tierChipTextActive: {
      color: theme.colors.primary,
      fontWeight: '600',
    },
    filterChip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      marginRight: 8,
    },
    filterChipActive: {
      borderColor: theme.colors.primary,
      backgroundColor:
        theme.mode === 'light' ? '#fff4ec' : 'rgba(255,106,38,0.16)',
    },
    filterChipText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    filterChipTextActive: {
      color: theme.colors.primary,
      fontWeight: '600',
    },
    filterActionsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 14,
    },
    filterResetText: {
      fontSize: 13,
      color: theme.colors.textSecondary,
    },
    filterApplyBtn: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 18,
      backgroundColor: theme.colors.primary,
    },
    filterApplyText: {
      color: '#fff',
      fontWeight: '700',
      fontSize: 14,
    },
  });
