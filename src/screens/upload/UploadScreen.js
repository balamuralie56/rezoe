// src/screens/UploadScreen.js
import React, { useState, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, TextInput,
  ScrollView, ActivityIndicator, Alert, SafeAreaView, Image, Platform, KeyboardAvoidingView
} from 'react-native';
import {
  ChevronLeft, ArrowRight, Camera, Video as VideoIcon,
  Check, ChevronDown, MapPin, X
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';
import { Video, ResizeMode } from 'expo-av';

import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { storage } from '../config/firebase';
import { createReel } from '../services/HomeService';

// --- CONSTANTS & DATA ---
const STEPS = 6;

const CATEGORIES = [
  { id: 'vehicles', label: 'Vehicles', icon: '🚗' },
  { id: 'properties', label: 'Properties', icon: '🏡' },
  { id: 'mobiles', label: 'Mobiles', icon: '📱' },
  { id: 'electronics', label: 'Electronics', icon: '💻' },
  { id: 'furniture', label: 'Furniture', icon: '🛋️' },
  { id: 'fashion', label: 'Fashion', icon: '👕' },
  { id: 'toys', label: 'Kids & Toys', icon: '🧸' },
  { id: 'tools', label: 'Tools', icon: '🛠️' },
  { id: 'pets', label: 'Pets', icon: '🐶' },
  { id: 'services', label: 'Services', icon: '🛵' },
];

const SUBCATEGORIES = {
  vehicles: ['Cars', 'Motorcycles', 'Scooters', 'Commercial Vehicles', 'Spare Parts', 'Bicycles'],
  mobiles: ['Mobile Phones', 'Accessories', 'Tablets', 'Wearables'],
  properties: ['For Sale: Houses', 'For Rent: Houses', 'Lands & Plots', 'Shops & Offices'],
  // Add others as needed...
};

export default function UploadScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation();
  const styles = useMemo(() => getStyles(theme), [theme]);

  // --- STATE ---
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const uriToBlob = async (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
  };

  // Form Data State
  const [formData, setFormData] = useState({
    category: null,
    subcategory: null,
    imageUri: null,
    videoUri: null,
    title: '',
    description: '',
    price: '',
    isNegotiable: false,
    condition: '',
    location: 'Mumbai, Maharashtra',
    // Specifics (Cars example)
    brandModel: '',
    year: '',
    kmDriven: '',
    fuelType: '',
    transmission: '',
    ownership: ''
  });

  // --- HANDLERS ---
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const pickMedia = async (type) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'We need access to your gallery to upload items.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      // FIX: Use ImagePicker.MediaType instead of MediaTypeOptions
      mediaTypes: type === 'video' ? ImagePicker.MediaType.Videos : ImagePicker.MediaType.Images,
      allowsEditing: true,
      quality: 1,
      videoMaxDuration: 60,
    });

    if (!result.canceled) {
      if (type === 'video') updateField('videoUri', result.assets[0].uri);
      else updateField('imageUri', result.assets[0].uri);
    }
  };

  const handleNext = () => {
    // Validation Logic
    if (currentStep === 1 && !formData.category) return Alert.alert("Required", "Please select a category.");
    if (currentStep === 2 && !formData.subcategory) return Alert.alert("Required", "Please select a subcategory.");
    if (currentStep === 3 && !formData.imageUri) return Alert.alert("Required", "A main photo is required.");
    if (currentStep === 4 && (!formData.title || !formData.price)) return Alert.alert("Required", "Title and Price are required.");

    if (currentStep < STEPS) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
    else navigation.goBack();
  };

  const handleSubmit = async () => {
      if (!user) return Alert.alert("Login Required", "Please login to post.");

      // Validation
      if (!formData.imageUri) return Alert.alert("Photo Required", "You must provide at least one photo.");

      setLoading(true);

      try {
        // 1. Upload Image (Robust Method)
        const imageBlob = await uriToBlob(formData.imageUri);
        const imageRef = ref(storage, `images/${user.uid}_${Date.now()}.jpg`);
        await uploadBytes(imageRef, imageBlob);
        const imageUrl = await getDownloadURL(imageRef);
        imageBlob.close(); // Clean up memory

        // 2. Upload Video (If selected)
        let videoUrl = null;
        if (formData.videoUri) {
          const videoBlob = await uriToBlob(formData.videoUri);
          const videoRef = ref(storage, `reels/${user.uid}_${Date.now()}.mp4`);
          await uploadBytes(videoRef, videoBlob);
          videoUrl = await getDownloadURL(videoRef);
          videoBlob.close(); // Clean up memory
        }

        // 3. Create Payload
        const payload = {
          ...formData,
          imageUrl: imageUrl,       // Always present
          videoUrl: videoUrl,       // Might be null
          displayUrl: videoUrl || imageUrl, // Fallback for the feed
          sellerHandle: user.name || 'User',
          sellerId: user.uid,
          seller: {                 // Ensure nested object exists for ReelsScreen safety
              name: user.name || 'User',
              isVerified: false,
              isBusiness: false
          },
          likes: 0,
          views: 0,
          shares: 0,
          comments: 0,
          createdAt: new Date().toISOString(),
          isFeatured: false
        };

        // 4. Save to Firestore
        await createReel(payload, user.uid);

        Alert.alert("Success", "Your item is live!", [
          { text: "OK", onPress: () => navigation.navigate('HomeTab') }
        ]);

      } catch (error) {
        console.error("Upload Error:", error);
        Alert.alert("Upload Failed", error.message);
      } finally {
        setLoading(false);
      }
    };

  // --- RENDER HELPERS ---

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View>
        <Text style={styles.stepTitle}>Sell Your Item</Text>
        <Text style={styles.stepSubtitle}>Step {currentStep} of {STEPS}</Text>
      </View>
      <View style={styles.dotsRow}>
        {[...Array(STEPS)].map((_, i) => (
           <View key={i} style={[styles.dot, i < currentStep ? styles.activeDot : styles.inactiveDot]} />
        ))}
      </View>
    </View>
  );

  const renderStep1_Categories = () => (
    <View>
      <Text style={styles.headerText}>Select Category</Text>
      <Text style={styles.subHeaderText}>Choose the category that best describes your item</Text>
      <View style={styles.grid}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.catCard, formData.category === cat.id && styles.selectedCard]}
            onPress={() => updateField('category', cat.id)}
          >
             <Text style={styles.catIcon}>{cat.icon}</Text>
             <Text style={[styles.catLabel, formData.category === cat.id && styles.selectedLabel]}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep2_Subcategories = () => {
    const subs = SUBCATEGORIES[formData.category] || ['General', 'Other'];
    return (
      <View>
        <Text style={styles.headerText}>Select Subcategory</Text>
        <Text style={styles.subHeaderText}>Choose the specific type</Text>
        {subs.map((sub, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.listCard, formData.subcategory === sub && styles.selectedListCard]}
            onPress={() => updateField('subcategory', sub)}
          >
             <Text style={[styles.listLabel, formData.subcategory === sub && styles.selectedListLabel]}>{sub}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderStep3_Media = () => (
    <View>
      <Text style={styles.headerText}>Add Photos & Video</Text>
      <Text style={styles.subHeaderText}>Upload 1 photo (required) and 1 video (optional)</Text>

      <Text style={styles.sectionLabel}>Photo (Required)</Text>
      <TouchableOpacity style={styles.mediaBox} onPress={() => pickMedia('image')}>
        {formData.imageUri ? (
          <Image source={{ uri: formData.imageUri }} style={styles.mediaPreview} />
        ) : (
          <View style={styles.mediaPlaceholder}>
            <Camera size={32} color="#999" />
            <Text style={styles.mediaText}>Add Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.sectionLabel}>Video (Optional - For Reels)</Text>
      <TouchableOpacity style={styles.mediaBox} onPress={() => pickMedia('video')}>
        {formData.videoUri ? (
          <Video
             source={{ uri: formData.videoUri }}
             style={styles.mediaPreview}
             resizeMode={ResizeMode.COVER}
             shouldPlay={false}
          />
        ) : (
          <View style={styles.mediaPlaceholder}>
            <VideoIcon size={32} color="#999" />
            <Text style={styles.mediaText}>Add Video</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderStep4_Details = () => (
    <View>
      <Text style={styles.headerText}>Product Details</Text>
      <Text style={styles.subHeaderText}>Provide detailed information</Text>

      <Text style={styles.inputLabel}>Title *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. iPhone 14 Pro Max 256GB"
        value={formData.title}
        onChangeText={t => updateField('title', t)}
      />

      <Text style={styles.inputLabel}>Description (Max 500 words)</Text>
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        placeholder="Describe your item, condition, reason for selling..."
        multiline
        value={formData.description}
        onChangeText={t => updateField('description', t)}
      />
      <Text style={styles.helperText}>0/500 words</Text>

      <Text style={styles.inputLabel}>Price (₹) *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter price"
        keyboardType="numeric"
        value={formData.price}
        onChangeText={t => updateField('price', t)}
      />

      <TouchableOpacity
        style={styles.checkboxRow}
        onPress={() => updateField('isNegotiable', !formData.isNegotiable)}
      >
         <View style={[styles.checkbox, formData.isNegotiable && styles.checkboxChecked]}>
            {formData.isNegotiable && <Check size={14} color="white" />}
         </View>
         <Text style={styles.checkboxLabel}>Price is negotiable</Text>
      </TouchableOpacity>

      <Text style={styles.inputLabel}>Location</Text>
      <View style={styles.locationBox}>
         <MapPin size={20} color="#666" />
         <Text style={styles.locationText}>{formData.location}</Text>
         <Text style={styles.changeText}>Change</Text>
      </View>
    </View>
  );

  const renderStep5_Specifics = () => (
    <View>
      <Text style={styles.headerText}>Category Specific Details</Text>
      <Text style={styles.subHeaderText}>Provide info for {formData.subcategory || 'Item'}</Text>

      <Text style={styles.inputLabel}>Brand & Model</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Maruti Swift VDI"
        value={formData.brandModel}
        onChangeText={t => updateField('brandModel', t)}
      />

      <Text style={styles.inputLabel}>Year</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 2021"
        keyboardType="numeric"
        value={formData.year}
        onChangeText={t => updateField('year', t)}
      />

      <Text style={styles.inputLabel}>KM Driven</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 45000"
        keyboardType="numeric"
        value={formData.kmDriven}
        onChangeText={t => updateField('kmDriven', t)}
      />

      {/* For demo purposes, simplified text inputs instead of full dropdowns */}
      <Text style={styles.inputLabel}>Fuel Type</Text>
      <TextInput style={styles.input} placeholder="Select fuel type" value={formData.fuelType} onChangeText={t => updateField('fuelType', t)} />

      <Text style={styles.inputLabel}>Transmission</Text>
      <TextInput style={styles.input} placeholder="Select transmission" value={formData.transmission} onChangeText={t => updateField('transmission', t)} />
    </View>
  );

  const renderStep6_Review = () => (
    <View style={{ alignItems: 'center', paddingVertical: 20 }}>
       <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#e6fffa', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <Check size={40} color="#059669" />
       </View>
       <Text style={styles.headerText}>Almost Done!</Text>
       <Text style={styles.subHeaderText}>Click "Post Now" to publish your listing.</Text>

       <View style={styles.reviewCard}>
          <Text style={styles.reviewTitle}>{formData.title}</Text>
          <Text style={styles.reviewPrice}>₹{formData.price}</Text>
          <Text style={styles.reviewSub}>{formData.category} • {formData.subcategory}</Text>
       </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        {/* HEADER PROGRESS */}
        {renderProgressBar()}

        {/* SCROLLABLE CONTENT */}
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
           {currentStep === 1 && renderStep1_Categories()}
           {currentStep === 2 && renderStep2_Subcategories()}
           {currentStep === 3 && renderStep3_Media()}
           {currentStep === 4 && renderStep4_Details()}
           {currentStep === 5 && renderStep5_Specifics()}
           {currentStep === 6 && renderStep6_Review()}
        </ScrollView>

        {/* FOOTER NAVIGATION */}
        <View style={styles.footer}>
           <TouchableOpacity style={styles.prevBtn} onPress={handleBack}>
              <ChevronLeft size={20} color="#333" />
              <Text style={styles.prevText}>Previous</Text>
           </TouchableOpacity>

           <TouchableOpacity
             style={[styles.nextBtn, loading && { opacity: 0.7 }]}
             onPress={handleNext}
             disabled={loading}
           >
              {loading ? <ActivityIndicator color="#fff" /> : (
                <>
                  <Text style={styles.nextText}>{currentStep === STEPS ? "Post Now" : "Next"}</Text>
                  {currentStep !== STEPS && <ArrowRight size={20} color="#fff" />}
                </>
              )}
           </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getStyles = theme => StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  progressContainer: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  stepTitle: { fontSize: 20, fontWeight: 'bold', color: '#111' },
  stepSubtitle: { fontSize: 13, color: '#666', marginTop: 2 },
  dotsRow: { flexDirection: 'row', gap: 6, marginTop: 10 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  activeDot: { backgroundColor: '#ff6a26' },
  inactiveDot: { backgroundColor: '#e0e0e0' },

  scrollContent: { padding: 20, paddingBottom: 100 },
  headerText: { fontSize: 22, fontWeight: 'bold', color: '#111', marginBottom: 6, textAlign: 'center' },
  subHeaderText: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 24 },

  // Grid
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  catCard: { width: '48%', backgroundColor: '#fff', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#eee', elevation: 2 },
  selectedCard: { borderColor: '#ff6a26', backgroundColor: '#fff5eb' },
  catIcon: { fontSize: 28, marginBottom: 8 },
  catLabel: { fontSize: 14, fontWeight: '600', color: '#333' },
  selectedLabel: { color: '#ff6a26' },

  // List
  listCard: { backgroundColor: '#fff', padding: 18, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#eee' },
  selectedListCard: { borderColor: '#ff6a26', backgroundColor: '#fff5eb' },
  listLabel: { fontSize: 16, color: '#333', fontWeight: '500' },
  selectedListLabel: { color: '#ff6a26', fontWeight: 'bold' },

  // Media
  sectionLabel: { fontSize: 16, fontWeight: 'bold', color: '#111', marginTop: 16, marginBottom: 8 },
  mediaBox: { height: 160, backgroundColor: '#fff', borderRadius: 12, borderStyle: 'dashed', borderWidth: 1.5, borderColor: '#ccc', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  mediaPlaceholder: { alignItems: 'center' },
  mediaText: { marginTop: 8, color: '#666', fontWeight: '500' },
  mediaPreview: { width: '100%', height: '100%' },

  // Inputs
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#333', marginTop: 16, marginBottom: 6 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 14, fontSize: 15, color: '#111' },
  helperText: { fontSize: 12, color: '#999', textAlign: 'right', marginTop: 4 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: '#999', marginRight: 8, alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: '#ff6a26', borderColor: '#ff6a26' },
  checkboxLabel: { color: '#444' },

  locationBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#ddd' },
  locationText: { flex: 1, marginLeft: 10, color: '#333' },
  changeText: { color: '#ff6a26', fontWeight: 'bold' },

  reviewCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12, width: '100%', marginTop: 20, alignItems: 'center', borderWidth: 1, borderColor: '#eee' },
  reviewTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  reviewPrice: { fontSize: 20, color: '#00c853', fontWeight: 'bold', marginBottom: 4 },
  reviewSub: { color: '#666' },

  // Footer
  footer: { flexDirection: 'row', padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee', position: 'absolute', bottom: 0, left: 0, right: 0 },
  prevBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 12, marginRight: 10, height: 50 },
  prevText: { marginLeft: 6, fontWeight: '600', color: '#333' },
  nextBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ff6a26', borderRadius: 12, height: 50 },
  nextText: { marginRight: 6, fontWeight: 'bold', color: '#fff' },
});

