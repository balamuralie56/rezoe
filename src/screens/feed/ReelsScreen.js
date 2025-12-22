// src/screens/ReelsScreen.js
import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity,
  StatusBar, SafeAreaView, Platform, Alert, Share, Linking,
  Modal, TextInput, KeyboardAvoidingView, Image
} from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal,
  Volume2, VolumeX, MapPin, Music, Phone,
  MessageSquare, Zap, BadgeCheck, X, Send
} from 'lucide-react-native';

import { useAuth } from '../context/AuthContext';
import { subscribeToFeed } from '../services/HomeService';

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');

// --- MATCHING MOCK DATA ---
const MOCK_REELS = [
  {
    id: 'm1',
    title: 'OnePlus 11R - 1 Month Old',
    price: '32000',
    seller: { name: 'TechStore', phone: '9999999999', isVerified: true, isBusiness: true },
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    description: 'Check out the amazing camera quality! Perfect for content creators 🎥',
    location: { city: 'Mumbai', area: 'Andheri' },
    views: '1.2K', likes: 120, shares: 10
  },
  {
    id: 'm2',
    title: 'Nike Jordans High Top',
    price: '8500',
    seller: { name: 'SneakerHead', phone: '8888888888', isVerified: false, isBusiness: false },
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    description: 'Barely used, original box included.',
    location: { city: 'Delhi', area: 'CP' },
    views: '450', likes: 80, shares: 5
  },
  {
    id: 'm3',
    title: 'Royal Enfield Classic 350',
    price: '1,50,000',
    seller: { name: 'BikerBoy', isVerified: true },
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    description: 'Mint condition, 2021 model.',
    location: { city: 'Pune', area: 'Viman Nagar' },
    views: '5.4K', likes: 300, shares: 45
  },
];

const MOCK_COMMENTS = [
  { id: 'c1', user: 'alice_w', text: 'Is this still available?', time: '2m' },
  { id: 'c2', user: 'bob_builder', text: 'Great price! 🔥', time: '1h' },
];

// --- SINGLE REEL COMPONENT ---
const SingleReel = ({ item, index, currentIndex, tabBarHeight }) => {
  const videoRef = useRef(null);
  const navigation = useNavigation();
  const { user } = useAuth();

  const sellerName = item.seller?.name || item.sellerHandle || 'Rezoe User';
  const sellerPhone = item.seller?.phone || null;
  const isVerified = item.seller?.isVerified || false;
  const isBusiness = item.seller?.isBusiness || false;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.likes || 0);
  const [isSaved, setIsSaved] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  const [commentsVisible, setCommentsVisible] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentList, setCommentList] = useState(MOCK_COMMENTS);

  useEffect(() => {
    if (index === currentIndex) {
      videoRef.current?.playAsync();
      setIsPlaying(true);
    } else {
      videoRef.current?.pauseAsync();
      setIsPlaying(false);
    }
  }, [currentIndex, index]);

  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current?.pauseAsync();
      setIsPlaying(false);
    } else {
      videoRef.current?.playAsync();
      setIsPlaying(true);
    }
  };

  const cycleSpeed = () => {
    const speeds = [1.0, 1.5, 2.0, 0.5];
    const nextIndex = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const newSpeed = speeds[nextIndex];
    setPlaybackSpeed(newSpeed);
    videoRef.current?.setRateAsync(newSpeed, true);
  };

  const handleCall = () => {
    if (sellerPhone) {
      Linking.openURL(`tel:${sellerPhone}`);
    } else {
      Alert.alert("No Phone", "This seller hasn't provided a public number.");
    }
  };

  const handleChat = () => {
    if (!user) return Alert.alert("Login Required", "Please login to chat.");
    navigation.navigate('ChatScreen', {
      chatId: `chat_${item.id}_${user.uid}`,
      recipientName: sellerName
    });
  };

  const postComment = () => {
    if (!newComment.trim()) return;
    const comment = {
      id: Date.now().toString(),
      user: user?.name || 'Guest',
      text: newComment,
      time: 'Just now'
    };
    setCommentList([comment, ...commentList]);
    setNewComment('');
  };

  return (
    <View style={[styles.reelContainer, { height: WINDOW_HEIGHT - tabBarHeight }]}>
      <TouchableOpacity activeOpacity={1} onPress={togglePlay} style={styles.videoWrapper}>
        {item.videoUrl ? (
          <Video
            ref={videoRef}
            source={{ uri: item.videoUrl }}
            style={styles.video}
            resizeMode={ResizeMode.COVER}
            isLooping
            isMuted={isMuted}
            shouldPlay={false}
          />
        ) : (
          <Image
            source={{ uri: item.imageUrl || item.displayUrl }}
            style={styles.video}
            resizeMode="cover"
          />
        )}
      </TouchableOpacity>

      <SafeAreaView style={styles.topOverlay}>
        <View style={styles.topBar}>
           <View style={styles.logoTag}>
             <Zap size={16} color="white" fill="white" />
             <Text style={styles.logoText}>REZOE</Text>
           </View>
           <View style={styles.topIcons}>
             <TouchableOpacity style={styles.iconButtonBlur} onPress={cycleSpeed}>
                <Text style={styles.speedText}>{playbackSpeed}x</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.iconButtonBlur} onPress={() => setIsMuted(!isMuted)}>
                {isMuted ? <VolumeX size={20} color="white" /> : <Volume2 size={20} color="white" />}
             </TouchableOpacity>
             <TouchableOpacity style={styles.iconButtonBlur}>
                <MoreHorizontal size={20} color="white" />
             </TouchableOpacity>
           </View>
        </View>
      </SafeAreaView>

      <View style={styles.rightSidebar}>
        <View style={styles.actionItem}>
          <TouchableOpacity onPress={() => { setIsLiked(!isLiked); setLikeCount(prev => isLiked ? prev-1 : prev+1); }}>
            <Heart size={32} color={isLiked ? '#ff2d55' : 'white'} fill={isLiked ? '#ff2d55' : 'transparent'} />
          </TouchableOpacity>
          <Text style={styles.actionText}>{likeCount}</Text>
        </View>

        <View style={styles.actionItem}>
          <TouchableOpacity onPress={() => setCommentsVisible(true)}>
            <MessageCircle size={30} color="white" />
          </TouchableOpacity>
          <Text style={styles.actionText}>{commentList.length}</Text>
        </View>

        <View style={styles.actionItem}>
          <TouchableOpacity onPress={() => Share.share({ message: `Check out: https://rezoe.com/reel/${item.id}` })}>
             <Share2 size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.actionText}>{item.shares || 0}</Text>
        </View>

        <View style={styles.actionItem}>
          <TouchableOpacity onPress={() => setIsSaved(!isSaved)}>
            <Bookmark size={28} color="white" fill={isSaved ? "white" : "transparent"} />
          </TouchableOpacity>
          <Text style={styles.actionText}>{isSaved ? "Saved" : "Save"}</Text>
        </View>
      </View>

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.95)']}
        style={styles.bottomGradient}
      >
        <View style={styles.infoContainer}>
          <View style={styles.audioTag}>
            <Music size={14} color="#e0e0e0" />
            <Text style={styles.audioText}>Tech Vibes - Digital Beats</Text>
          </View>

          <View style={styles.userRow}>
             <Text style={styles.username}>@{sellerName}</Text>
             {isVerified && <BadgeCheck size={16} color="#3b82f6" fill="#3b82f6" style={{marginHorizontal:4}} />}
             {isBusiness && (
               <View style={styles.businessBadge}>
                 <Text style={styles.businessText}>Business</Text>
               </View>
             )}
          </View>

          <View style={styles.metaRow}>
            <MapPin size={12} color="#ccc" />
            <Text style={styles.metaText}>
              {item.location?.city ? `${item.location.city}, ${item.location.area}` : (item.location || 'Unknown')}
            </Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>{item.views || 0} views</Text>
          </View>

          <Text style={styles.reelTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.description} numberOfLines={2}>{item.description}</Text>

          <View style={styles.priceRow}>
             <Text style={styles.priceText}>₹{item.price}</Text>
             {item.emi && (
               <View style={styles.emiBadge}>
                 <Zap size={12} color="white" fill="white" style={{marginRight:4}} />
                 <Text style={styles.emiText}>EMI ₹{item.emi}/mo</Text>
               </View>
             )}
             {item.isFeatured && (
               <View style={styles.featuredBadge}>
                 <Text style={styles.featuredText}>🔥 Featured</Text>
               </View>
             )}
          </View>

          {/* Buttons: BUY NOW REMOVED */}
          <View style={styles.bottomActions}>
             <TouchableOpacity style={[styles.actionBtn, styles.chatBtn]} onPress={handleChat}>
                <MessageSquare size={18} color="white" />
                <Text style={styles.btnTextWhite}>Chat Now</Text>
             </TouchableOpacity>

             <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
                <Phone size={20} color="white" />
             </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* COMMENTS MODAL */}
      <Modal visible={commentsVisible} animationType="slide" transparent onRequestClose={() => setCommentsVisible(false)}>
         <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
            <View style={styles.modalContent}>
               <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Comments ({commentList.length})</Text>
                  <TouchableOpacity onPress={() => setCommentsVisible(false)}>
                     <X size={24} color="#000" />
                  </TouchableOpacity>
               </View>
               <FlatList
                  data={commentList}
                  keyExtractor={c => c.id}
                  renderItem={({item}) => (
                     <View style={styles.commentItem}>
                        <View style={styles.commentAvatar}>
                           <Text style={{color:'#fff', fontWeight:'bold'}}>{item.user.charAt(0).toUpperCase()}</Text>
                        </View>
                        <View>
                           <Text style={styles.commentUser}>@{item.user} <Text style={styles.commentTime}>• {item.time}</Text></Text>
                           <Text style={styles.commentText}>{item.text}</Text>
                        </View>
                     </View>
                  )}
                  style={{flex: 1}}
               />
               <View style={styles.inputArea}>
                  <TextInput
                     style={styles.commentInput}
                     placeholder="Add a comment..."
                     placeholderTextColor="#999"
                     value={newComment}
                     onChangeText={setNewComment}
                  />
                  <TouchableOpacity onPress={postComment}>
                     <Send size={24} color="#ff6a26" />
                  </TouchableOpacity>
               </View>
            </View>
         </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default function ReelsScreen() {
  const route = useRoute();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reels, setReels] = useState(MOCK_REELS);

  let tabBarHeight = 0;
  try { tabBarHeight = useBottomTabBarHeight(); } catch (e) { tabBarHeight = 60; }

  useEffect(() => {
    const unsubscribe = subscribeToFeed((data) => {
      const validData = data.filter(item => item && item.videoUrl);
      if(validData.length > 0) setReels(prev => [...prev, ...validData]);
    }, null);
    return () => unsubscribe();
  }, []);

  // LINKING LOGIC
  useEffect(() => {
    if (route.params?.startReelId) {
      const index = reels.findIndex(r => r.id === route.params.startReelId);
      if (index !== -1) {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({ index, animated: false });
          setCurrentIndex(index);
        }, 100);
      }
    }
  }, [route.params, reels]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <FlatList
        ref={flatListRef}
        data={reels}
        keyExtractor={(item, index) => item.id || `reel_${index}`}
        renderItem={({ item, index }) => (
          <SingleReel
             item={item}
             index={index}
             currentIndex={currentIndex}
             tabBarHeight={tabBarHeight}
          />
        )}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        onViewableItemsChanged={onViewableItemsChanged}
        getItemLayout={(data, index) => (
            { length: WINDOW_HEIGHT - tabBarHeight, offset: (WINDOW_HEIGHT - tabBarHeight) * index, index }
        )}
        onScrollToIndexFailed={info => {
            const wait = new Promise(resolve => setTimeout(resolve, 500));
            wait.then(() => {
              flatListRef.current?.scrollToIndex({ index: info.index, animated: false });
            });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  reelContainer: { width: WINDOW_WIDTH, backgroundColor: 'black', justifyContent: 'center' },
  videoWrapper: { width: '100%', height: '100%' },
  video: { width: '100%', height: '100%' },

  topOverlay: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, paddingTop: Platform.OS === 'android' ? 40 : 0 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16 },
  logoTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  logoText: { color: 'white', fontWeight: '900', marginLeft: 6, fontSize: 14 },
  topIcons: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconButtonBlur: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  speedText: { color: 'white', fontWeight: '700', fontSize: 12 },

  rightSidebar: { position: 'absolute', right: 10, bottom: 180, zIndex: 10, alignItems: 'center' },
  actionItem: { alignItems: 'center', marginBottom: 20 },
  actionText: { color: 'white', fontSize: 13, fontWeight: '600', marginTop: 4 },

  bottomGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingBottom: 20, paddingTop: 60 },
  infoContainer: { justifyContent: 'flex-end' },

  audioTag: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, opacity: 0.8 },
  audioText: { color: 'white', fontSize: 12, marginLeft: 6 },
  userRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  username: { color: 'white', fontWeight: '700', fontSize: 16 },
  businessBadge: { backgroundColor: '#ff4757', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 6 },
  businessText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  metaText: { color: '#ddd', fontSize: 12, marginHorizontal: 4 },
  metaDot: { color: '#ddd', fontSize: 12 },

  reelTitle: { color: 'white', fontSize: 16, fontWeight: '700', marginBottom: 4 },
  description: { color: '#ccc', fontSize: 13, marginBottom: 12, lineHeight: 18 },

  priceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 },
  priceText: { color: '#a5b4fc', fontSize: 20, fontWeight: '900' },
  emiBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#059669', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  emiText: { color: 'white', fontSize: 11, fontWeight: '700' },
  featuredBadge: { backgroundColor: '#ff7a1a', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  featuredText: { color: 'white', fontSize: 11, fontWeight: '700' },

  bottomActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 44, borderRadius: 22 },
  chatBtn: { backgroundColor: '#4f46e5' },
  callBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center' },
  btnTextWhite: { color: 'white', fontWeight: 'bold', marginLeft: 6 },

  // Comments
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { height: '60%', backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10 },
  modalTitle: { fontSize: 16, fontWeight: 'bold' },
  commentItem: { flexDirection: 'row', marginBottom: 16 },
  commentAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#888', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  commentUser: { fontWeight: 'bold', fontSize: 13, marginBottom: 2 },
  commentTime: { fontWeight: '400', color: '#888', fontSize: 11 },
  commentText: { fontSize: 13, color: '#333' },
  inputArea: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10, marginTop: 5 },
  commentInput: { flex: 1, backgroundColor: '#f0f0f0', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, marginRight: 10 },
});