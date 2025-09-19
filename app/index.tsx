import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Animated, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Scissors, Upload, Wand2, Heart, ArrowRight } from "lucide-react-native";

const FloatingCircle = ({ size, delay, style }: { size: number; delay: number; style: any }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const reverseAnimatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 6000,
        useNativeDriver: true,
      }).start(() => {
        animatedValue.setValue(0);
        animate();
      });
    };

    const animateReverse = () => {
      Animated.timing(reverseAnimatedValue, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      }).start(() => {
        reverseAnimatedValue.setValue(0);
        animateReverse();
      });
    };

    const timeout = setTimeout(() => {
      if (delay % 2 === 0) {
        animate();
      } else {
        animateReverse();
      }
    }, delay);
    
    return () => clearTimeout(timeout);
  }, [animatedValue, reverseAnimatedValue, delay]);

  const translateY = delay % 2 === 0 
    ? animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -10],
      })
    : reverseAnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 10],
      });

  return (
    <Animated.View
      style={[
        styles.floatingCircle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          transform: [{ translateY }],
        },
        style,
      ]}
    />
  );
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const glowOpacity = useRef(new Animated.Value(0.5)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse glow animation
    const pulseGlow = () => {
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 0.8,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]).start(() => pulseGlow());
    };
    pulseGlow();
  }, [fadeAnim, slideAnim, glowOpacity]);

  const handleGetStarted = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.push('/hairstyles');
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0f0f23', '#1a1a2e', '#16213e']}
        locations={[0, 0.5, 1]}
        style={styles.gradientBackground}
      />
      
      {/* Floating Background Elements */}
      <FloatingCircle size={128} delay={0} style={styles.floatingCircle1} />
      <FloatingCircle size={96} delay={500} style={styles.floatingCircle2} />
      <FloatingCircle size={160} delay={1000} style={styles.floatingCircle3} />
      <FloatingCircle size={80} delay={1500} style={styles.floatingCircle4} />
      <FloatingCircle size={64} delay={2000} style={styles.floatingCircle5} />
      
      <View style={[styles.content, { paddingTop: Math.max(insets.top + 20, 60), paddingBottom: Math.max(insets.bottom + 20, 80) }]}>
        <Animated.View 
          style={[
            styles.mainContent,
            styles.animatedContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
            {/* Brand Section */}
            <View style={styles.brandSection}>
              <View style={styles.logoContainer}>
                <Animated.View style={[styles.logoBackground, { shadowOpacity: glowOpacity }]}>
                  <Scissors size={32} color="#FFFFFF" />
                </Animated.View>
              </View>
              
              <Text style={styles.brandName}>
                Hair<Text style={styles.brandNameAccent}>fluencer</Text>
              </Text>
              
              <View style={styles.taglineContainer}>
                <Text style={styles.taglineMain}>Transform your look instantly with</Text>
                <Text style={styles.taglineAccent}>AI-powered hairstyle magic</Text>
              </View>
            </View>

            {/* Features Preview */}
            <View style={styles.featuresPreview}>
              <View style={styles.featureStep}>
                <View style={styles.featureStepIcon}>
                  <Upload size={18} color="#FB923C" />
                </View>
                <Text style={styles.featureStepText}>Upload</Text>
              </View>
              
              <View style={styles.featureConnector} />
              
              <View style={styles.featureStep}>
                <View style={styles.featureStepIcon}>
                  <Wand2 size={18} color="#FB923C" />
                </View>
                <Text style={styles.featureStepText}>Transform</Text>
              </View>
              
              <View style={styles.featureConnector} />
              
              <View style={styles.featureStep}>
                <View style={styles.featureStepIcon}>
                  <Heart size={18} color="#FB923C" />
                </View>
                <Text style={styles.featureStepText}>Love It</Text>
              </View>
            </View>

            {/* CTA Section */}
            <Animated.View style={[styles.buttonContainer, { transform: [{ scale: buttonScale }] }]}>
              <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
                <LinearGradient
                  colors={['#F97316', '#EA580C']}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>Get Started</Text>
                  <ArrowRight size={16} color="#FFFFFF" style={styles.buttonIcon} />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Social Proof */}
            <View style={styles.socialProof}>
              <View style={styles.avatarGroup}>
                <Image
                  source={{ uri: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg' }}
                  style={styles.avatar}
                />
                <Image
                  source={{ uri: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg' }}
                  style={[styles.avatar, styles.avatarOverlap]}
                />
                <Image
                  source={{ uri: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg' }}
                  style={[styles.avatar, styles.avatarOverlap]}
                />
                <Image
                  source={{ uri: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg' }}
                  style={[styles.avatar, styles.avatarOverlap]}
                />
                <Image
                  source={{ uri: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-6.jpg' }}
                  style={[styles.avatar, styles.avatarOverlap]}
                />
                <View style={[styles.avatar, styles.avatarOverlap, styles.avatarCount]}>
                  <Text style={styles.avatarCountText}>+5k</Text>
                </View>
              </View>
              <Text style={styles.socialProofText}>Join thousands discovering their perfect look</Text>
            </View>
          </Animated.View>
      </View>
      
      {/* Bottom Indicator */}
      <View style={styles.bottomIndicator}>
        <LinearGradient
          colors={['#FB923C', 'transparent']}
          style={styles.bottomIndicatorGradient}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedContent: {
    // Placeholder for animated content styles
  },
  buttonContainer: {
    width: '100%',
  },
  mainContent: {
    alignItems: 'center',
    maxWidth: 320,
    width: '100%',
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 64,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoBackground: {
    width: 64,
    height: 64,
    backgroundColor: '#FB923C',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FB923C',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
    elevation: 8,
  },
  brandName: {
    fontSize: 48,
    fontWeight: '900' as const,
    color: '#FFFFFF',
    marginBottom: 16,
    letterSpacing: -1,
  },
  brandNameAccent: {
    color: '#FB923C',
  },
  taglineContainer: {
    alignItems: 'center',
  },
  taglineMain: {
    fontSize: 18,
    color: '#D1D5DB',
    fontWeight: '300' as const,
    lineHeight: 26,
    textAlign: 'center',
  },
  taglineAccent: {
    fontSize: 18,
    color: '#FB923C',
    fontWeight: '500' as const,
    lineHeight: 26,
    textAlign: 'center',
  },
  featuresPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 64,
    maxWidth: 280,
    width: '100%',
  },
  featureStep: {
    alignItems: 'center',
  },
  featureStepIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(55, 65, 81, 0.5)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.3)',
  },
  featureStepText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500' as const,
  },
  featureConnector: {
    flex: 1,
    height: 1,
    backgroundColor: '#4B5563',
    marginHorizontal: 16,
    marginBottom: 24,
  },
  getStartedButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#FB923C',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 8,
    marginBottom: 32,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
  socialProof: {
    alignItems: 'center',
  },
  avatarGroup: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#374151',
  },
  avatarOverlap: {
    marginLeft: -8,
  },
  avatarCount: {
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#4B5563',
  },
  avatarCountText: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: '#D1D5DB',
  },
  socialProofText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  bottomIndicator: {
    position: 'absolute',
    bottom: 32,
    left: '50%',
    marginLeft: -2,
    width: 4,
    height: 32,
    borderRadius: 2,
    overflow: 'hidden',
  },
  bottomIndicatorGradient: {
    flex: 1,
    opacity: 0.5,
  },
  floatingCircle: {
    position: 'absolute',
    opacity: 0.1,
  },
  floatingCircle1: {
    top: 80,
    left: 40,
    backgroundColor: 'rgba(251, 146, 60, 0.1)',
  },
  floatingCircle2: {
    top: 160,
    right: 32,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  floatingCircle3: {
    bottom: 128,
    left: 24,
    backgroundColor: 'rgba(251, 146, 60, 0.1)',
  },
  floatingCircle4: {
    bottom: 240,
    right: 48,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  floatingCircle5: {
    top: 200,
    right: 100,
    backgroundColor: 'rgba(251, 146, 60, 0.1)',
  },
});