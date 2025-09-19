import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ActivityIndicator,
  Animated,
  Alert 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Sparkles } from "lucide-react-native";
import { useHairstyleStore } from "@/stores/hairstyle-store";

export default function ProcessingScreen() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Preparing your photo...');
  const { selectedHairstyle, userPhoto, setProcessedImage } = useHairstyleStore();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    processHairstyle();
  }, []);

  const processHairstyle = async () => {
    if (!selectedHairstyle || !userPhoto) {
      Alert.alert('Error', 'Missing hairstyle or photo data');
      router.back();
      return;
    }

    try {
      // Simulate progress updates
      const progressSteps = [
        { progress: 20, status: 'Analyzing your face...' },
        { progress: 40, status: 'Loading hairstyle...' },
        { progress: 60, status: 'Applying AI magic...' },
        { progress: 80, status: 'Finalizing your new look...' },
      ];

      for (const step of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setProgress(step.progress);
        setStatus(step.status);
      }

      // Convert image to base64
      const response = await fetch(userPhoto);
      const blob = await response.blob();
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]); // Remove data:image/jpeg;base64, prefix
        };
        reader.readAsDataURL(blob);
      });

      setProgress(90);
      setStatus('Processing with AI...');

      // Call the AI API
      const aiResponse = await fetch('https://toolkit.rork.com/images/edit/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Change the hairstyle to ${selectedHairstyle.name.toLowerCase()}. Apply the ${selectedHairstyle.description.toLowerCase()} hairstyle to this person while keeping their face and features exactly the same. Make it look natural and realistic.`,
          images: [{ type: 'image', image: base64 }]
        }),
      });

      if (!aiResponse.ok) {
        throw new Error('Failed to process image');
      }

      const result = await aiResponse.json();
      const processedImageUri = `data:${result.image.mimeType};base64,${result.image.base64Data}`;
      
      setProcessedImage(processedImageUri);
      setProgress(100);
      setStatus('Complete!');

      // Wait a moment before navigating
      setTimeout(() => {
        router.replace('/results');
      }, 1000);

    } catch (error) {
      console.error('Processing error:', error);
      Alert.alert(
        'Processing Failed', 
        'We couldn\'t process your image. Please try again.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <View style={styles.iconContainer}>
          <Sparkles size={80} color="#FF6B9D" />
        </View>

        <Text style={styles.title}>Creating Your New Look</Text>
        <Text style={styles.subtitle}>
          Hairfluencer AI is working its magic to give you the perfect {selectedHairstyle?.name} hairstyle
        </Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{progress}%</Text>
        </View>

        <Text style={styles.status}>{status}</Text>

        <ActivityIndicator size="large" color="#FF6B9D" style={styles.spinner} />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  progressBar: {
    width: '80%',
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B9D',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B9D',
  },
  status: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  spinner: {
    marginTop: 20,
  },
});