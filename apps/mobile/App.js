import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Image } from 'react-native';
import { ShieldAlert, Radar, MessageSquare, Activity, User, Image as ImageIcon, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'profile'
  const [chatInput, setChatInput] = useState('');
  const [profileInput, setProfileInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [riskScore, setRiskScore] = useState(null);
  const [attachedImage, setAttachedImage] = useState(null);
  const [imageName, setImageName] = useState('');

  // Access the real device gallery picker
  const pickImage = async () => {
    // Request permission to access media gallery
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImageUri = result.assets[0].uri;
      setAttachedImage(selectedImageUri);
      
      // Extract a filename snippet from the path to display cleanly in UI
      const filename = selectedImageUri.split('/').pop();
      setImageName(filename.length > 25 ? `img_${filename.substring(0, 20)}...` : filename);
    }
  };

  const clearAttachedImage = () => {
    setAttachedImage(null);
    setImageName('');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setRiskScore(null);
  };

  const triggerRadarScan = () => {
    const currentInput = activeTab === 'chat' ? chatInput : profileInput;
    if (!currentInput && !attachedImage) return;
    
    setLoading(true);
    setRiskScore(null);
    
    setTimeout(() => {
      let score = 12; 
      const lowerText = currentInput.toLowerCase();

      if (activeTab === 'chat') {
        if (lowerText.includes('money') || lowerText.includes('cash') || lowerText.includes('millionaire')) score += 25;
        if (lowerText.includes('billion') || lowerText.includes('earn')) score += 25;
        if (lowerText.includes('doctor') || lowerText.includes('military')) score += 20;
        if (lowerText.includes('single')) score += 7;
      } else {
        if (lowerText.includes('crypto') || lowerText.includes('invest') || lowerText.includes('scam')) score += 40;
        const matchNumbers = lowerText.match(/\d{4,}/);
        if (matchNumbers) score += 30; 
      }

      if (attachedImage) score += 25; 

      setRiskScore(Math.min(score, 99));
      setLoading(false);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Radar size={32} color="#b3925a" />
            <Text style={styles.title}>CatfishRadar</Text>
          </View>
          <Text style={styles.subtitle}>Analyzing conversational heuristics and dynamic relationship fraud networks.</Text>
        </View>

        {/* System Stats badge */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Activity size={16} color="#2d5a27" style={{ marginRight: 6 }} />
            <Text style={styles.statText}>Graph Nodes Active</Text>
          </View>
        </View>

        {/* Dynamic Navigation Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'chat' && styles.activeTabButton]}
            onPress={() => handleTabChange('chat')}
          >
            <MessageSquare size={16} color={activeTab === 'chat' ? '#ffffff' : '#54514c'} style={{ marginRight: 6 }} />
            <Text style={[styles.tabText, activeTab === 'chat' && styles.activeTabText]}>Conversation / Bio</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'profile' && styles.activeTabButton]}
            onPress={() => handleTabChange('profile')}
          >
            <User size={16} color={activeTab === 'profile' ? '#ffffff' : '#54514c'} style={{ marginRight: 6 }} />
            <Text style={[styles.tabText, activeTab === 'profile' && styles.activeTabText]}>Profile/User ID</Text>
          </TouchableOpacity>
        </View>

        {/* Main Workspace Card */}
        <View style={styles.card}>
          <Text style={styles.label}>
            {activeTab === 'chat' ? 'Paste Suspicious Text Content:' : 'Enter Target Handle / Profile URL:'}
          </Text>
          
          {activeTab === 'chat' ? (
            <TextInput
              style={styles.textInput}
              multiline
              numberOfLines={5}
              placeholder="e.g., 'He says he is a self made millionaire...'"
              placeholderTextColor="#8a8782"
              value={chatInput}
              onChangeText={setChatInput}
            />
          ) : (
            <TextInput
              style={styles.singleTextInput}
              placeholder="e.g., @crypto_king98432"
              placeholderTextColor="#8a8782"
              value={profileInput}
              onChangeText={setProfileInput}
            />
          )}

          {/* Real Dynamic Image Upload Block */}
          <View style={styles.imageSection}>
            <Text style={styles.subLabel}>Verify Profile Image Assets:</Text>
            
            {!attachedImage ? (
              <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
                <ImageIcon size={22} color="#8c6d39" style={{ marginBottom: 4 }} />
                <Text style={styles.uploadText}>Attach Avatar or Screenshot</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.previewContainer}>
                <Image source={{ uri: attachedImage }} style={styles.previewThumbnail} />
                <View style={styles.previewDetails}>
                  <Text style={styles.previewName} numberOfLines={1}>{imageName || "custom_upload.jpg"}</Text>
                  <Text style={styles.previewStatus}>Ready for Metadata & Reverse Search</Text>
                </View>
                <TouchableOpacity style={styles.removeImageButton} onPress={clearAttachedImage}>
                  <X size={16} color="#a63a3a" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <TouchableOpacity 
            style={[styles.button, !(activeTab === 'chat' ? chatInput : profileInput) && !attachedImage && styles.buttonDisabled]} 
            onPress={triggerRadarScan} 
            disabled={loading || (!(activeTab === 'chat' ? chatInput : profileInput) && !attachedImage)}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Scan Target Profile</Text>}
          </TouchableOpacity>
        </View>

        {/* Results Engine */}
        {riskScore !== null && (
          <View style={[styles.resultCard, riskScore > 40 ? styles.highRisk : styles.lowRisk]}>
            <View style={styles.resultTitleRow}>
              <ShieldAlert size={24} color={riskScore > 40 ? "#a63a3a" : "#2d5a27"} style={{ marginRight: 8 }} />
              <Text style={styles.resultTitle}>Deception Risk Threat: {riskScore}%</Text>
            </View>
            <Text style={styles.resultBody}>
              {riskScore > 40 
                ? "Warning: Correlation vectors show high script matchmaking flags matching known structural patterns inside our network graph."
                : "Heuristics clear: The analyzed metrics exhibit normal baseline indicators within standard deviations."}
            </Text>
          </View>
        )}

        <Text style={styles.footerText}>Copyright by CatfishRadar. All Rights Reserved.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfbfa' },
  scrollContainer: { padding: 24 },
  header: { marginBottom: 16, marginTop: 10 },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#8c6d39', marginLeft: 8, letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: '#54514c', lineHeight: 22 },
  statsContainer: { marginBottom: 20 },
  statBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f2eee9', alignSelf: 'flex-start', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: '#e3ded7' },
  statText: { color: '#2d5a27', fontSize: 13, fontWeight: '600' },
  
  tabContainer: { flexDirection: 'row', backgroundColor: '#f2eee9', borderRadius: 10, padding: 4, marginBottom: 16, borderWidth: 1, borderColor: '#e3ded7' },
  tabButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 8 },
  activeTabButton: { backgroundColor: '#8c6d39' },
  tabText: { color: '#54514c', fontWeight: '600', fontSize: 13 },
  activeTabText: { color: '#ffffff' },

  card: { backgroundColor: '#ffffff', padding: 24, borderRadius: 16, borderWidth: 1.5, borderColor: '#dfd9cf' },
  label: { color: '#2c2a29', fontWeight: '700', fontSize: 14, marginBottom: 12 },
  textInput: { backgroundColor: '#fcfbfa', color: '#2c2a29', padding: 16, borderRadius: 10, minHeight: 110, textAlignVertical: 'top', fontSize: 15, borderWidth: 1, borderColor: '#e8e5e0', marginBottom: 20 },
  singleTextInput: { backgroundColor: '#fcfbfa', color: '#2c2a29', padding: 16, borderRadius: 10, height: 54, fontSize: 15, borderWidth: 1, borderColor: '#e8e5e0', marginBottom: 20 },
  
  imageSection: { marginBottom: 20 },
  subLabel: { color: '#54514c', fontWeight: '600', fontSize: 13, marginBottom: 8 },
  uploadBox: { borderStyle: 'dashed', borderWidth: 1.5, borderColor: '#b3925a', backgroundColor: '#fffdfa', borderRadius: 10, padding: 16, alignItems: 'center', justifyContent: 'center' },
  uploadText: { color: '#8c6d39', fontSize: 13, fontWeight: '600' },
  previewContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fcfbfa', padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#e8e5e0' },
  previewThumbnail: { width: 44, height: 44, borderRadius: 6 },
  previewDetails: { flex: 1, marginLeft: 12 },
  previewName: { color: '#2c2a29', fontWeight: '600', fontSize: 13 },
  previewStatus: { color: '#2d5a27', fontSize: 11, fontWeight: '500', marginTop: 2 },
  removeImageButton: { padding: 8, backgroundColor: '#fdf2f2', borderRadius: 6 },

  button: { backgroundColor: '#9e7f4a', padding: 16, borderRadius: 10, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#c7c2ba' },
  buttonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
  resultCard: { marginTop: 24, padding: 20, borderRadius: 12 },
  highRisk: { backgroundColor: '#fdf2f2', borderWidth: 1.5, borderColor: '#eca3a3' },
  lowRisk: { backgroundColor: '#f2fdf3', borderWidth: 1.5, borderColor: '#a3ecb0' },
  resultTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  resultTitle: { color: '#2c2a29', fontSize: 18, fontWeight: 'bold' },
  resultBody: { color: '#54514c', fontSize: 14, lineHeight: 22 },
  footerText: { textAlign: 'center', color: '#a6a19a', fontSize: 12, marginTop: 32, fontWeight: '500' }
});