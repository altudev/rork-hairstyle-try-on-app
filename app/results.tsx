import { router } from "expo-router";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import React, { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Image, 
  Alert,
  Platform,
  ScrollView 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Download, RotateCcw, Home, Share } from "lucide-react-native";
import { useHairstyleStore } from "@/stores/hairstyle-store";

export default function ResultsScreen() {
  const [showComparison, setShowComparison] = useState(false);
  const { selectedHairstyle, userPhoto, processedImage, reset } = useHairstyleStore();

  const saveImage = async () => {
    if (!processedImage) return;

    if (Platform.OS === 'web') {
      // For web, create a download link
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = `hairstyle-${selectedHairstyle?.name}-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      Alert.alert('Success', 'Image downloaded successfully!');
      return;
    }

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant media library permissions to save photos.');
        return;
      }

      // Convert base64 to file and save
      const response = await fetch(processedImage);
      const blob = await response.blob();
      const fileUri = `${FileSystem.documentDirectory}hairstyle-${Date.now()}.jpg`;
      
      // Save to device storage
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync('Hairstyle Try On', asset, false);
      
      Alert.alert('Success', 'Image saved to your gallery!');
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save image. Please try again.');
    }
  };

  const shareImage = async () => {
    if (Platform.OS === 'web') {
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'My New Hairstyle',
            text: `Check out my new ${selectedHairstyle?.name} hairstyle!`,
          });
        } catch (error) {
          console.log('Share cancelled');
        }
      } else {
        Alert.alert('Share', 'Sharing is not supported on this browser');
      }
    } else {
      Alert.alert('Share', 'Share functionality would be implemented here');
    }
  };

  const tryAgain = () => {
    reset();
    router.replace('/');
  };

  if (!processedImage || !userPhoto) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No results to display</Text>
          <TouchableOpacity style={styles.homeButton} onPress={() => router.replace('/')}>
            <Text style={styles.homeButtonText}>Go Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Your New Look!</Text>
          <Text style={styles.subtitle}>
            Here's how you look with {selectedHairstyle?.name}
          </Text>
        </View>

        <View style={styles.imageContainer}>
          {showComparison ? (
            <View style={styles.comparisonContainer}>
              <View style={styles.comparisonImage}>
                <Text style={styles.imageLabel}>Before</Text>
                <Image source={{ uri: userPhoto }} style={styles.beforeImage} />
              </View>
              <View style={styles.comparisonImage}>
                <Text style={styles.imageLabel}>After</Text>
                <Image source={{ uri: processedImage }} style={styles.afterImage} />
              </View>
            </View>
          ) : (
            <View style={styles.singleImageContainer}>
              <Image source={{ uri: processedImage }} style={styles.resultImage} />
            </View>
          )}
        </View>

        <TouchableOpacity 
          style={styles.comparisonToggle}
          onPress={() => setShowComparison(!showComparison)}
        >
          <Text style={styles.comparisonToggleText}>
            {showComparison ? 'Show Result Only' : 'Show Before & After'}
          </Text>
        </TouchableOpacity>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={saveImage}>
            <Download size={20} color="#FF6B9D" />
            <Text style={styles.actionButtonText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={shareImage}>
            <Share size={20} color="#FF6B9D" />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={tryAgain}>
            <RotateCcw size={20} color="#FF6B9D" />
            <Text style={styles.actionButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.homeButton} onPress={() => router.replace('/')}>
          <Home size={20} color="#FFFFFF" />
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  imageContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  singleImageContainer: {
    alignItems: 'center',
  },
  resultImage: {
    width: 280,
    height: 350,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  comparisonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  comparisonImage: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  imageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  beforeImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  afterImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  comparisonToggle: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F8BBD9',
    borderRadius: 20,
    marginBottom: 32,
  },
  comparisonToggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FF6B9D',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  actionButton: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8BBD9',
    borderRadius: 12,
    minWidth: 80,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FF6B9D',
    marginTop: 4,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B9D',
    marginHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 25,
    marginBottom: 24,
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 24,
  },
});