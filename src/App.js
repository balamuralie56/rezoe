import React, { useState, useEffect, useRef } from 'react';
import {StyleSheet, Text, View, FlatList, Dimensions,TouchableOpacity, TextInput, Modal, Alert,ActivityIndicator, StatusBar} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import {Home, Search, PlusSquare, User, MessageCircle,MapPin, Heart, Share2, Filter,LogOut, CheckCircle, Shield, ChevronLeft} from 'lucide-react-native';

// --- FIREBASE IMPORTS ---
import { initializeApp } from 'firebase/app';
import {getAuth, signInAnonymously, onAuthStateChanged, signOut} from 'firebase/auth';
import {getFirestore, collection, addDoc, query,orderBy, onSnapshot, serverTimestamp} from 'firebase/firestore';

// --- CONFIGURATION ---

// REPLACE WITH YOUR REAL FIREBASE KEYS
const firebaseConfig = {
  apiKey: "AIzaSyAoOCOBopRYx6rbe2Xl92U-tlpbtqT-04Q",
  authDomain: "rezoe-app-1.firebaseapp.com",
  projectId: "rezoe-app-1",
  storageBucket: "rezoe-app-1.firebasestorage.app",
  messagingSenderId: "416343004488",
  appId: "1:416343004488:web:60dedc5ccd713f06458f7d",
  measurementId: "G-KXCLN15YF1"
};

const appId = 'rezoe-live-v1';
const IS_DEMO = firebaseConfig.apiKey === 'demo';

// --- SAFE FIREBASE INITIALIZATION ---
let app, auth, db;

if (!IS_DEMO) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error("Firebase Init Failed:", error);
  }
}

// --- HELPER FUNCTIONS ---
const safeOnAuthStateChanged = (callback) => {
  if (IS_DEMO || !auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

const safeSignInAnonymously = async () => {
  if (IS_DEMO || !auth) {
    Alert.alert("Demo Mode", "Set real Firebase keys in App.js to login properly.");
    return;
  }
  return signInAnonymously(auth);
};

const safeSignOut = async () => {
  if (IS_DEMO || !auth) return;
  return signOut(auth);
};

const { width, height } = Dimensions.get('window');
const TAB_HEIGHT = 80;

// --- MOCK DATA ---
const DEMO_DATA = [
  {
    id: '1',
    title: 'OnePlus 9 Pro',
    price: '28,000',
    location: 'Mumbai',
    category: 'Mobiles',
    description: 'Mint condition. Box available.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-holding-a-smartphone-in-vertical-orientation-44941-large.mp4',
    likes: 120
  },
  {
    id: '2',
    title: 'Royal Enfield 350',
    price: '1.5 Lakh',
    location: 'Delhi',
    category: 'Vehicles',
    description: '2021 Model. Custom exhaust.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-motorcyclist-riding-on-the-road-top-view-44889-large.mp4',
    likes: 89
  }
];

const CATEGORIES = [
  { id: 'properties', name: 'Properties', icon: '🏠' },
  { id: 'vehicles', name: 'Vehicles', icon: '🚗' },
  { id: 'electronics', name: 'Electronics', icon: '📱' },
  { id: 'fashion', name: 'Fashion', icon: '👗' },
  { id: 'jobs', name: 'Jobs', icon: '💼' },
  { id: 'education', name: 'Education', icon: '📚' },
];

// --- COMPONENTS ---

const VideoItem = ({ item, isActive }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.playAsync();
      } else {
        videoRef.current.pauseAsync();
        videoRef.current.setPositionAsync(0);
      }
    }
  }, [isActive]);

  return (
    <View style={styles.reelContainer}>
      <Video
        ref={videoRef}
        style={styles.video}
        source={{ uri: item.videoUrl }}
        resizeMode={ResizeMode.COVER}
        isLooping
        shouldPlay={isActive}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.95)']}
        style={styles.overlay}
      >
        <View style={styles.reelContent}>
          <View style={styles.reelInfo}>
            <Text style={styles.priceTag}>₹ {item.price}</Text>
            <Text style={styles.reelTitle}>{item.title}</Text>
            <View style={styles.locationRow}>
              <MapPin size={14} color="#ccc" />
              <Text style={styles.locationText}>{item.location} • {item.category}</Text>
            </View>
            <Text numberOfLines={2} style={styles.reelDesc}>{item.description}</Text>
          </View>
          <View style={styles.reelActions}>
            <TouchableOpacity style={styles.actionBtn}>
              <Heart size={28} color="white" />
              <Text style={styles.actionText}>{item.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <MessageCircle size={28} color="white" />
              <Text style={styles.actionText}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Share2 size={28} color="white" />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const HomeScreen = () => {
  const [reels, setReels] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (IS_DEMO || !db) {
      setReels(DEMO_DATA);
      return;
    }
    const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'reels'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setReels(data.length ? data : DEMO_DATA);
    });
    return () => unsub();
  }, []);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { top: insets.top + 10 }]}>
        <Text style={styles.logoText}>REZOE</Text>
        <Filter color="white" size={24} />
      </View>

      <FlatList
        data={reels}
        renderItem={({ item, index }) => <VideoItem item={item} isActive={index === activeIndex} />}
        keyExtractor={item => item.id}
        pagingEnabled
        vertical
        showsVerticalScrollIndicator={false}
        snapToInterval={height - TAB_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        onViewableItemsChanged={onViewableItemsChanged}
      />
    </View>
  );
};

const SearchScreen = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.searchHeader}>
        <View style={styles.searchBar}>
          <Search size={20} color="#666" />
          <TextInput
            placeholder="Search mobiles, cars..."
            placeholderTextColor="#666"
            style={styles.searchInput}
          />
        </View>
      </View>
      <View style={styles.categoryScroll}>
        <FlatList
          horizontal
          data={CATEGORIES}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <TouchableOpacity style={styles.catChip}>
              <Text style={styles.catText}>{item.icon} {item.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
        />
      </View>
      <View style={styles.gridContainer}>
        {[1,2,3,4,5,6].map(i => (
          <View key={i} style={styles.gridItem}>
             <View style={styles.placeholderImg} />
          </View>
        ))}
      </View>
    </View>
  );
};

const UploadModal = ({ visible, onClose, user }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', price: '', category: '' });

  const handlePost = async () => {
    setLoading(true);
    setTimeout(async () => {
      try {
        if (!IS_DEMO && user && db) {
           await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'reels'), {
             ...form,
             userId: user.uid,
             videoUrl: DEMO_DATA[0].videoUrl,
             createdAt: serverTimestamp(),
             likes: 0
           });
        }
        Alert.alert("Success", "Your reel is live!");
        onClose();
      } catch (e) {
        Alert.alert("Error", "Upload failed");
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}><ChevronLeft size={28} color="white"/></TouchableOpacity>
          <Text style={styles.modalTitle}>Sell Item</Text>
          <View style={{width: 28}} />
        </View>

        {step === 1 ? (
          <View style={styles.formContainer}>
            <Text style={styles.label}>What are you selling?</Text>
            <TextInput
              style={styles.input}
              placeholder="Title (e.g. iPhone 13)"
              placeholderTextColor="#555"
              onChangeText={t => setForm({...form, title: t})}
            />
            <TextInput
              style={styles.input}
              placeholder="Price (₹)"
              keyboardType="numeric"
              placeholderTextColor="#555"
              onChangeText={t => setForm({...form, price: t})}
            />

            <TouchableOpacity style={styles.uploadBox} onPress={() => setStep(2)}>
               {loading ? <ActivityIndicator color="#ec4899" /> : (
                 <>
                   <Shield size={32} color="#ec4899" />
                   <Text style={styles.uploadText}>Verify & Next</Text>
                 </>
               )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.successContainer}>
            <CheckCircle size={64} color="#4ade80" />
            <Text style={styles.successText}>AI Approved!</Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={handlePost}>
              <Text style={styles.btnText}>{loading ? "Posting..." : "Post Now"}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

const ProfileScreen = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = safeOnAuthStateChanged(setUser);
    return () => unsub();
  }, []);

  const handleLogin = async () => {
    try {
      await safeSignInAnonymously();
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  if (!user && !IS_DEMO) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.logoText}>REZOE</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin}>
          <Text style={styles.btnText}>Login as Guest</Text>
        </TouchableOpacity>
      </View>
    );
  } else if (IS_DEMO) {
      return (
        <View style={styles.centerContainer}>
            <Text style={styles.logoText}>REZOE</Text>
            <Text style={{color: '#666', marginTop: 10, marginBottom: 20}}>Demo Mode (No Real Auth)</Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => Alert.alert("Demo", "Replace API Keys to login.")}>
                <Text style={styles.btnText}>Login as Guest</Text>
            </TouchableOpacity>
        </View>
      )
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
           <User size={40} color="#fff" />
        </View>
        <Text style={styles.profileName}>User {user?.uid?.slice(0,5) || 'Guest'}</Text>
        <Text style={styles.profileSub}>+91 98765 XXXXX</Text>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>3</Text>
          <Text style={styles.statLabel}>Active Ads</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>2</Text>
          <Text style={styles.statLabel}>Credits</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.menuItem} onPress={safeSignOut}>
        <LogOut size={20} color="#ef4444" />
        <Text style={[styles.menuText, { color: '#ef4444' }]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

// --- SPLASH SCREEN COMPONENT (INTERNAL) ---
const SplashScreen = () => (
    <View style={styles.splashContainer}>
      <View style={styles.centerContainer}>
        <Text style={styles.logoText}>REZOE</Text>
        <Text style={{color:'#ccc', marginTop:8}}>Reel it. Sale it. Buy it.</Text>
      </View>
      <ActivityIndicator size="large" color="#ec4899" style={{position:'absolute', bottom: 50}} />
    </View>
);

const Tab = createBottomTabNavigator();

export default function App() {
  const [uploadVisible, setUploadVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // STARTUP LOGIC: Shows splash for 3 seconds (3000ms)
    const initApp = async () => {
        // Wait 3 seconds regardless of auth speed
        const timer = new Promise(resolve => setTimeout(resolve, 3000));

        let authUnsub;
        const authPromise = new Promise(resolve => {
            authUnsub = safeOnAuthStateChanged((u) => {
                setUser(u);
                resolve();
            });
        });

        await Promise.all([timer, authPromise]);
        setLoading(false);
        return () => authUnsub && authUnsub();
    };
    initApp();
  }, []);

  if (loading) {
      return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="black" />
            <SplashScreen />
        </>
      );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: styles.tabBar,
            tabBarActiveTintColor: '#ec4899',
            tabBarInactiveTintColor: '#666',
            tabBarShowLabel: true,
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarIcon: ({color}) => <Home color={color} size={24} />
            }}
          />
          <Tab.Screen
            name="Search"
            component={SearchScreen}
            options={{
              tabBarIcon: ({color}) => <Search color={color} size={24} />
            }}
          />
          <Tab.Screen
            name="Sell"
            component={HomeScreen}
            options={{
              tabBarIcon: () => (
                <View style={styles.uploadBtn}>
                  <PlusSquare color="white" size={28} />
                </View>
              ),
              tabBarLabel: () => null,
            }}
            listeners={{
              tabPress: (e) => {
                e.preventDefault();
                setUploadVisible(true);
              },
            }}
          />
          <Tab.Screen
            name="Inbox"
            component={SearchScreen}
            options={{
              tabBarIcon: ({color}) => <MessageCircle color={color} size={24} />
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              tabBarIcon: ({color}) => <User color={color} size={24} />
            }}
          />
        </Tab.Navigator>

        <UploadModal
          visible={uploadVisible}
          onClose={() => setUploadVisible(false)}
          user={user}
        />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  centerContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  splashContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  header: { position: 'absolute', left: 20, right: 20, zIndex: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logoText: { fontSize: 24, fontWeight: '900', color: 'white', fontStyle: 'italic' },
  reelContainer: { width: width, height: height - TAB_HEIGHT, backgroundColor: 'black' },
  video: { width: '100%', height: '100%' },
  overlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 300, justifyContent: 'flex-end', padding: 20 },
  reelContent: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 20 },
  reelInfo: { flex: 1, marginRight: 20 },
  priceTag: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 4 },
  reelTitle: { fontSize: 18, fontWeight: '600', color: 'white', marginBottom: 6 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  locationText: { color: '#ccc', marginLeft: 6, fontSize: 14 },
  reelDesc: { color: '#aaa', fontSize: 14 },
  reelActions: { alignItems: 'center', gap: 20 },
  actionBtn: { alignItems: 'center' },
  actionText: { color: 'white', fontSize: 12, marginTop: 4 },
  searchHeader: { padding: 16, backgroundColor: '#000' },
  searchBar: { flexDirection: 'row', backgroundColor: '#1f2937', padding: 12, borderRadius: 12, alignItems: 'center' },
  searchInput: { color: 'white', marginLeft: 10, flex: 1, fontSize: 16 },
  categoryScroll: { maxHeight: 60, marginBottom: 10 },
  catChip: { backgroundColor: '#1f2937', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginHorizontal: 6, flexDirection: 'row', alignItems: 'center' },
  catText: { color: 'white', fontWeight: '500' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', padding: 2 },
  gridItem: { width: (width / 2) - 4, height: 240, backgroundColor: '#1f2937', margin: 2, borderRadius: 8 },
  placeholderImg: { width: '100%', height: '100%', borderRadius: 8, backgroundColor: '#333' },
  modalContainer: { flex: 1, backgroundColor: '#111', padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40, marginBottom: 40 },
  modalTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  label: { color: '#aaa', marginBottom: 10, marginTop: 20 },
  input: { backgroundColor: '#222', color: 'white', padding: 16, borderRadius: 12, fontSize: 16, marginBottom: 16 },
  uploadBox: { height: 150, backgroundColor: '#222', borderRadius: 16, borderStyle: 'dashed', borderWidth: 1, borderColor: '#444', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  uploadText: { color: '#ec4899', fontWeight: 'bold', marginTop: 10 },
  successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  successText: { color: 'white', fontSize: 24, fontWeight: 'bold', marginTop: 20, marginBottom: 40 },
  profileHeader: { alignItems: 'center', marginTop: 60, marginBottom: 30 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  profileName: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  profileSub: { color: '#888', marginTop: 4 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 40 },
  statBox: { backgroundColor: '#1f2937', width: 100, padding: 16, borderRadius: 12, alignItems: 'center' },
  statNum: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  statLabel: { color: '#888', fontSize: 12, marginTop: 4 },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1f2937', padding: 20, borderRadius: 12, marginTop: 10 },
  menuText: { fontSize: 16, marginLeft: 16, fontWeight: '600' },
  tabBar: { backgroundColor: '#000', borderTopColor: '#222', height: TAB_HEIGHT, paddingTop: 8, paddingBottom: 20 },
  uploadBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#ec4899', justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  primaryBtn: { backgroundColor: '#ec4899', paddingVertical: 16, paddingHorizontal: 40, borderRadius: 30 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});