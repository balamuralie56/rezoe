// src/screens/HomeScreen.js
import React, { useMemo, useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, Image,
  FlatList, Modal, Dimensions, StatusBar, ScrollView, ActivityIndicator, Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { useTheme } from '../context/ThemeContext';
import { Shield, Bell, MapPin, Search, Grid, X } from 'lucide-react-native';
import { subscribeToFeed } from '../services/HomeService';

// ⚠️ ENSURE THIS FILE EXISTS IN YOUR ASSETS FOLDER
const REZOE_LOGO = require('../assets/rezoe_logo.png');

const { height: WINDOW_HEIGHT, width: WINDOW_WIDTH } = Dimensions.get('window');
const SIDE_SPACING = 16;
const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

// --- EXPANDED MOCK DATA ---
const MOCK_REELS = [
  {
    id: 'm1',
    title: 'OnePlus 11R - 1 Month Old',
    price: '32000',
    views: '1.2K',
    sellerHandle: 'TechStore',
    isFeatured: true,
    category: 'mobiles',
    imageUrl: 'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?auto=format&fit=crop&w=800&q=80',
    displayUrl: 'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'm2',
    title: 'Nike Jordans High Top',
    price: '8500',
    views: '450',
    sellerHandle: 'SneakerHead',
    isFeatured: false,
    category: 'fashion',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    displayUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'm3',
    title: 'Royal Enfield Classic 350',
    price: '1,50,000',
    views: '5.4K',
    sellerHandle: 'BikerBoy',
    isFeatured: true,
    category: 'vehicles',
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    displayUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'm4',
    title: '2BHK Flat in Andheri',
    price: '45,00,000',
    views: '8.9K',
    sellerHandle: 'MumbaiHomes',
    isFeatured: true,
    category: 'properties',
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    displayUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'm5',
    title: 'MacBook Air M1',
    price: '65000',
    views: '2.1K',
    sellerHandle: 'GadgetZone',
    isFeatured: false,
    category: 'electronics',
    imageUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80',
    displayUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'm6',
    title: 'Persian Cat (Kitten)',
    price: '12000',
    views: '3.3K',
    sellerHandle: 'PetLover',
    isFeatured: false,
    category: 'pets',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
    displayUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'm7',
    title: 'Graphic Designer Job',
    price: '25k/mo',
    views: '900',
    sellerHandle: 'CreativeAgency',
    isFeatured: false,
    category: 'jobs',
    imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b7993143d2d?auto=format&fit=crop&w=800&q=80',
    displayUrl: 'https://images.unsplash.com/photo-1626785774573-4b7993143d2d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'm8',
    title: 'Sofa Set (3+2)',
    price: '15000',
    views: '400',
    sellerHandle: 'HomeDecor',
    isFeatured: false,
    category: 'furniture',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    displayUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'm9',
    title: 'Gaming PC Setup',
    price: '85000',
    views: '10K',
    sellerHandle: 'GamerX',
    isFeatured: true,
    category: 'electronics',
    imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
    displayUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'm10',
    title: 'Honda City 2018',
    price: '6,50,000',
    views: '2.5K',
    sellerHandle: 'CarDealer',
    isFeatured: false,
    category: 'vehicles',
    imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
    displayUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'm11',
    title: 'Electric Guitar',
    price: '8000',
    views: '150',
    sellerHandle: 'MusicMan',
    isFeatured: false,
    category: 'others',
    imageUrl: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?auto=format&fit=crop&w=800&q=80',
    displayUrl: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'm12',
    title: 'Tutor: Maths & Science',
    price: '500/hr',
    views: '60',
    sellerHandle: 'TutorPro',
    isFeatured: false,
    category: 'services',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
    displayUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80'
  }
];

const GRID_CATEGORIES = [
  { key: 'mobiles', label: 'Mobiles', emoji: '📱' },
  { key: 'vehicles', label: 'Vehicles', emoji: '🚗' },
  { key: 'properties', label: 'Properties', emoji: '🏡' },
  { key: 'electronics', label: 'Electro', emoji: '💻' },
  { key: 'furniture', label: 'Furniture', emoji: '🛋️' },
  { key: 'fashion', label: 'Fashion', emoji: '👕' },
  { key: 'jobs', label: 'Jobs', emoji: '💼' },
  { key: 'bikes', label: 'Bikes', emoji: '🏍️' },
  { key: 'others', label: 'Others', emoji: 'Of' },
];

const ALL_CATEGORIES = [
  ...GRID_CATEGORIES.slice(0, 8),
  { key: 'pets', label: 'Pets', emoji: '🐾' },
  { key: 'books', label: 'Books', emoji: '📚' },
  { key: 'services', label: 'Services', emoji: '🛠️' },
  { key: 'toys', label: 'Toys', emoji: '🧸' },
  { key: 'gym', label: 'Sports', emoji: '⚽' },
];

export default function HomeScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);
  const navigation = useNavigation();

  // State
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [realReels, setRealReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [othersModalVisible, setOthersModalVisible] = useState(false);
  const [locationName, setLocationName] = useState("Locating...");

  // 1. GET REAL LOCATION
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationName("Permission Denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        let address = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });

        if (address.length > 0) {
          const city = address[0].city || address[0].subregion || address[0].district;
          const region = address[0].region || "India";
          setLocationName(`${city}, ${region}`);
        }
      } catch (e) {
        setLocationName("Mumbai, Maharashtra");
      }
    })();
  }, []);

  // 2. FETCH REELS (With Safety Check)
  useEffect(() => {
    let mounted = true;
    const unsubscribe = subscribeToFeed((data) => {
      if (mounted) {
        setRealReels(data || []);
        setLoading(false);
      }
    }, selectedCategory);

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [selectedCategory]);

  // 3. FILTERING
  const filteredData = useMemo(() => {
    // MERGE MOCK DATA WITH REAL DATA
    let data = [...realReels, ...MOCK_REELS];

    if (selectedCategory && selectedCategory !== 'others') {
      data = data.filter(item =>
        item.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();
      data = data.filter(item =>
        item.title?.toLowerCase().includes(lowerQ) ||
        item.category?.toLowerCase().includes(lowerQ)
      );
    }
    return data;
  }, [realReels, searchQuery, selectedCategory]);

  const featuredReels = filteredData.filter(r => r.isFeatured);
  const allReels = filteredData;

  // --- HANDLERS ---
  const isHiddenCategory = (key) => {
    if (!key) return false;
    return !GRID_CATEGORIES.slice(0, 8).some(c => c.key === key);
  };

  const handleCategoryPress = (key) => {
    if (key === 'others') setOthersModalVisible(true);
    else setSelectedCategory(prev => prev === key ? null : key);
  };

  const handleReelPress = (item) => {
    // FIX: Navigate directly to 'Reels' (the name defined in AppTabs.js)
    navigation.navigate('Reels', {
      startReelId: item.id
    });
  };

  const ReelCard = ({ item, compact }) => (
    <TouchableOpacity
      style={[
        styles.reelCard,
        compact ? { width: '100%', marginBottom: 12 } : { width: WINDOW_WIDTH * 0.7, marginRight: 12 },
      ]}
      activeOpacity={0.8}
      onPress={() => handleReelPress(item)}
    >
      {/* BACKGROUND IMAGE - Fixed Absolute Positioning */}
      <Image
         source={{ uri: item.imageUrl || item.displayUrl }}
         style={[StyleSheet.absoluteFill, { borderRadius: 20 }]}
         resizeMode="cover"
      />
      {/* Dark Overlay */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 20 }]} />

      <View style={styles.reelTagRow}>
        <View style={styles.reelChip}>
          <Text style={styles.reelChipText}>🎥 Reel</Text>
        </View>
        {item.isFeatured && (
          <View style={styles.featuredChip}>
            <Text style={styles.featuredChipText}>🔥 Featured</Text>
          </View>
        )}
      </View>

      <View style={styles.reelBody}>
        <Text style={styles.reelTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.reelPrice}>₹{item.price}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{item.views || '0'} views</Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.metaText}>{item.sellerHandle || 'User'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* HEADER */}
        <View style={styles.headerContainer}>
          <View style={styles.headerRow}>
            <View>
              <Image source={REZOE_LOGO} style={styles.logoImage} resizeMode="contain" />
              <Text style={styles.tagline}>Reel it. Sale it. Buy it.</Text>
            </View>
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Security')}>
                <Shield size={18} color={theme.colors.textSecondary}/>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.iconBtn, { marginLeft: 8 }]} onPress={() => navigation.navigate('Notifications')}>
                <Bell size={18} color={theme.colors.textSecondary}/>
              </TouchableOpacity>
            </View>
          </View>

          {/* LOCATION */}
          <View style={styles.locationRow}>
            <MapPin size={14} color={theme.colors.primary} />
            <Text style={styles.locationText}>{locationName}</Text>
          </View>

          {/* SEARCH */}
          <View style={styles.searchBox}>
            <Search size={16} color={theme.colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search reels..."
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={16} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          {/* CREATE BTN */}
          <View style={styles.createCard}>
            <View>
              <Text style={styles.createTitle}>Create a selling reel</Text>
              <Text style={styles.createSubtitle}>Shoot a 15–30s reel of your item.</Text>
            </View>
            <TouchableOpacity style={styles.startBtn} onPress={() => navigation.navigate('UploadScreen')}>
              <Text style={styles.startText}>Start</Text>
            </TouchableOpacity>
          </View>

          {/* CATEGORIES */}
          <View style={styles.catSectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            {selectedCategory && (
              <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                <Text style={styles.clearText}>Clear Filter</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.gridContainer}>
            {GRID_CATEGORIES.map((cat) => {
              const isOthers = cat.key === 'others';
              const isHiddenSelection = isOthers && isHiddenCategory(selectedCategory);
              const isActive = selectedCategory === cat.key || isHiddenSelection;
              let label = cat.label;
              if (isHiddenSelection) {
                 const hiddenCat = ALL_CATEGORIES.find(c => c.key === selectedCategory);
                 if (hiddenCat) label = hiddenCat.label;
              }

              return (
                <TouchableOpacity
                  key={cat.key}
                  style={[styles.gridItem, isActive && styles.gridItemActive]}
                  onPress={() => handleCategoryPress(cat.key)}
                >
                  {isOthers ? (
                    <Grid size={22} color={isActive ? theme.colors.primary : theme.colors.textPrimary} />
                  ) : (
                    <Text style={styles.gridEmoji}>{cat.emoji}</Text>
                  )}
                  <Text style={[styles.gridLabel, isActive && styles.gridLabelActive]}>{label}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {loading ? (
           <ActivityIndicator size="large" color={theme.colors.primary} style={{marginTop: 50}} />
        ) : (
          <>
            {/* FEATURED */}
            {featuredReels.length > 0 && (
              <View>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Featured Reels</Text>
                </View>
                <FlatList
                  horizontal
                  data={featuredReels}
                  keyExtractor={item => `feat_${item.id}`}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => <ReelCard item={item} compact={false} />}
                  contentContainerStyle={{ paddingHorizontal: SIDE_SPACING, paddingVertical: 8 }}
                />
              </View>
            )}

            {/* ALL REELS */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>All Reels ({allReels.length})</Text>
            </View>

            <View style={styles.allReelsGrid}>
              {allReels.map(item => (
                <View key={item.id} style={styles.allReelsItem}>
                  <ReelCard item={item} compact={true} />
                </View>
              ))}
              {allReels.length === 0 && (
                 <Text style={{color: theme.colors.textSecondary, marginLeft: 16}}>No reels found.</Text>
              )}
            </View>
          </>
        )}
      </ScrollView>

      {/* OTHERS MODAL */}
      <Modal visible={othersModalVisible} transparent animationType="slide" onRequestClose={() => setOthersModalVisible(false)}>
        <View style={styles.modalBackdrop}>
           <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                 <Text style={styles.modalTitle}>All Categories</Text>
                 <TouchableOpacity onPress={() => setOthersModalVisible(false)}>
                    <X size={24} color={theme.colors.textPrimary} />
                 </TouchableOpacity>
              </View>
              <ScrollView>
                 <View style={styles.modalGrid}>
                    {ALL_CATEGORIES.map(cat => (
                       <TouchableOpacity key={cat.key} style={styles.modalItem} onPress={() => {
                          setSelectedCategory(cat.key);
                          setOthersModalVisible(false);
                       }}>
                          <Text style={{fontSize: 24, marginBottom: 5}}>{cat.emoji}</Text>
                          <Text style={{color: theme.colors.textPrimary}}>{cat.label}</Text>
                       </TouchableOpacity>
                    ))}
                 </View>
              </ScrollView>
           </View>
        </View>
      </Modal>

    </View>
  );
}

const getStyles = (theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background, paddingTop: STATUS_BAR_HEIGHT },

    // Header
    headerContainer: { paddingHorizontal: 16, paddingTop: 10 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    logoImage: { width: 110, height: 35 },
    tagline: { fontSize: 11, color: theme.colors.textSecondary, marginLeft: 2 },

    headerIcons: { flexDirection: 'row' },
    iconBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: theme.colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.colors.border },

    locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 4 },
    locationText: { fontSize: 12, color: theme.colors.textPrimary, fontWeight: '600' },

    searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.inputBg, borderRadius: 12, paddingHorizontal: 12, height: 42, marginBottom: 16, borderWidth: 1, borderColor: theme.colors.border },
    searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: theme.colors.textPrimary },

    createCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.colors.surface, padding: 14, borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: theme.colors.border },
    createTitle: { fontSize: 14, fontWeight: '700', color: theme.colors.textPrimary },
    createSubtitle: { fontSize: 11, color: theme.colors.textSecondary, marginTop: 2 },
    startBtn: { backgroundColor: theme.colors.primary, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12 },
    startText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },

    // Categories
    catSectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    sectionTitle: { fontSize: 15, fontWeight: '700', color: theme.colors.textPrimary },
    clearText: { color: theme.colors.accent, fontSize: 12, fontWeight: '600' },
    gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 10 },
    gridItem: { width: '31%', aspectRatio: 1, backgroundColor: theme.colors.surface, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 10, borderWidth: 1, borderColor: theme.colors.border },
    gridItemActive: { borderColor: theme.colors.primary, backgroundColor: 'rgba(255,106,38,0.1)' },
    gridEmoji: { fontSize: 26, marginBottom: 5 },
    gridLabel: { fontSize: 11, color: theme.colors.textSecondary, fontWeight: '500' },
    gridLabelActive: { color: theme.colors.primary, fontWeight: '700' },

    sectionHeader: { marginTop: 16, marginBottom: 10, paddingHorizontal: 16 },

    // Reel Card
    reelCard: {
      backgroundColor: '#222', // Fallback color
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingTop: 10,
      paddingBottom: 12,
      overflow: 'hidden',
      minHeight: 250,
      justifyContent: 'flex-end',
      position: 'relative'
    },
    reelTagRow: { flexDirection: 'row', marginBottom: 'auto', columnGap: 6 },
    reelChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: '#c026d3' },
    reelChipText: { color: '#fff', fontSize: 11, fontWeight: '700' },
    featuredChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: '#ff7a1a' },
    featuredChipText: { color: '#fff', fontSize: 11, fontWeight: '700' },
    reelBody: { marginTop: 10 },
    reelTitle: { fontSize: 13, fontWeight: '700', color: '#ffffff', marginBottom: 4, textShadowColor: 'rgba(0,0,0,0.8)', textShadowRadius: 3 },
    reelPrice: { fontSize: 14, fontWeight: '800', color: '#00b341', marginBottom: 6, textShadowColor: 'rgba(0,0,0,0.8)', textShadowRadius: 3 },
    metaRow: { flexDirection: 'row', alignItems: 'center' },
    metaText: { fontSize: 11, color: '#d4d4d4', textShadowColor: 'rgba(0,0,0,0.8)', textShadowRadius: 3 },
    metaDot: { fontSize: 11, color: '#d4d4d4', marginHorizontal: 4 },

    allReelsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 16 },
    allReelsItem: { width: '48%', marginBottom: 12 },

    // Modals
    modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { height: '60%', backgroundColor: theme.colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 18, fontWeight: 'bold', color: theme.colors.textPrimary },
    modalGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    modalItem: { width: '31%', aspectRatio: 1, backgroundColor: theme.colors.inputBg, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
});
