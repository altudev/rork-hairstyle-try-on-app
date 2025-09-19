import { router } from "expo-router";
import React, { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Dimensions 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Check } from "lucide-react-native";
import { useHairstyleStore } from "@/stores/hairstyle-store";

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

const hairstyles = [
  {
    id: '1',
    name: 'Long Wavy',
    image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop&crop=face',
    description: 'Elegant long wavy hair'
  },
  {
    id: '2',
    name: 'Bob Cut',
    image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&h=400&fit=crop&crop=face',
    description: 'Classic bob hairstyle'
  },
  {
    id: '3',
    name: 'Pixie Cut',
    image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=400&h=400&fit=crop&crop=face',
    description: 'Short and chic pixie'
  },
  {
    id: '4',
    name: 'Beach Waves',
    image: 'https://images.unsplash.com/photo-1595475038665-8de2a4b72bbf?w=400&h=400&fit=crop&crop=face',
    description: 'Natural beach waves'
  },
  {
    id: '5',
    name: 'Straight Long',
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop&crop=face',
    description: 'Sleek straight hair'
  },
  {
    id: '6',
    name: 'Curly Afro',
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop&crop=face',
    description: 'Beautiful curly afro'
  },
  {
    id: '7',
    name: 'Side Bangs',
    image: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop&crop=face',
    description: 'Stylish side bangs'
  },
  {
    id: '8',
    name: 'Updo Bun',
    image: 'https://images.unsplash.com/photo-1605462863863-10d9e47e15ee?w=400&h=400&fit=crop&crop=face',
    description: 'Elegant updo bun'
  },
];

export default function HairstylesScreen() {
  const { selectedHairstyle, setSelectedHairstyle } = useHairstyleStore();

  const handleSelectHairstyle = (hairstyle: typeof hairstyles[0]) => {
    setSelectedHairstyle(hairstyle);
  };

  const handleContinue = () => {
    if (selectedHairstyle) {
      router.push('/photo');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Style</Text>
          <Text style={styles.subtitle}>Select a hairstyle you'd like to try with Hairfluencer</Text>
        </View>

        <View style={styles.grid}>
          {hairstyles.map((hairstyle) => (
            <TouchableOpacity
              key={hairstyle.id}
              style={[
                styles.card,
                selectedHairstyle?.id === hairstyle.id && styles.selectedCard
              ]}
              onPress={() => handleSelectHairstyle(hairstyle)}
            >
              <Image source={{ uri: hairstyle.image }} style={styles.image} />
              <View style={styles.cardContent}>
                <Text style={styles.hairstyleName}>{hairstyle.name}</Text>
                <Text style={styles.hairstyleDescription}>{hairstyle.description}</Text>
              </View>
              {selectedHairstyle?.id === hairstyle.id && (
                <View style={styles.checkmark}>
                  <Check size={16} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {selectedHairstyle && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>Continue with {selectedHairstyle.name}</Text>
          </TouchableOpacity>
        </View>
      )}
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  card: {
    width: cardWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  selectedCard: {
    borderWidth: 3,
    borderColor: '#FF6B9D',
  },
  image: {
    width: '100%',
    height: cardWidth * 1.2,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 12,
  },
  hairstyleName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  hairstyleDescription: {
    fontSize: 12,
    color: '#666',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF6B9D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  continueButton: {
    backgroundColor: '#FF6B9D',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});