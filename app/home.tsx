import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Stack, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Animated, FlatList, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Bell, Camera, Heart, HeartOff, Mic, Scissors, Search, Star } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Category = {
  id: string;
  label: string;
};

type Card = {
  id: string;
  title: string;
  rating: number;
  image: string;
  liked?: boolean;
};

const CATEGORIES: Category[] = [
  { id: 'all', label: 'All Styles' },
  { id: 'short', label: 'Short Hair' },
  { id: 'long', label: 'Long Hair' },
  { id: 'curly', label: 'Curly' },
  { id: 'braids', label: 'Braids' },
  { id: 'updos', label: 'Updos' },
];

const TRENDING: Card[] = [
  { id: 'pixie', title: 'Pixie Perfection', rating: 4.8, image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/be64cd2931-947e9871d4c77c2507b6.png' },
  { id: 'beach', title: 'Beach Waves', rating: 4.6, image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/2beb6a10f5-a3d954e519944b9a2e0e.png' },
];

const GALLERY: Card[] = [
  { id: 'bob', title: 'Classic Bob', rating: 4.9, image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/caf64ff634-85b3d6d14184ab5b5420.png' },
  { id: 'messy', title: 'Messy Bun', rating: 4.7, image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/f19fbec6a2-a8286716688b1efc3e0d.png' },
  { id: 'braid', title: 'French Braid', rating: 4.8, image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/fdc4d1163d-f845c06cbf8e6d217cdc.png' },
  { id: 'layered', title: 'Layered Cut', rating: 4.5, image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/34dec0899e-0ae9c003e72f0c865ff8.png' },
  { id: 'afro', title: 'Natural Afro', rating: 4.9, image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/721e0d9859-38395ace31b83273673e.png', liked: true },
  { id: 'ponytail', title: 'High Ponytail', rating: 4.6, image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/7b3ed9f120-e8f99aadc54ffacd9a94.png' },
  { id: 'shag', title: 'Modern Shag', rating: 4.8, image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/95fc1f0ab0-83aa427db37050c868f3.png' },
  { id: 'topknot', title: 'Top Knot', rating: 4.4, image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/6a01180e69-6cf9671b72cb85de0a7b.png' },
];

export default function Home() {
  const insets = useSafeAreaInsets();
  const [active, setActive] = useState<string>('all');
  const [likedIds, setLikedIds] = useState<Set<string>>(() => new Set(GALLERY.filter(g => g.liked).map(g => g.id)));
  const searchRef = useRef<TextInput>(null);

  const handleToggleLike = useCallback((id: string) => {
    setLikedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      console.log('Like toggled', { id, liked: next.has(id) });
      return next;
    });
  }, []);

  const filteredGallery = useMemo<Card[]>(() => {
    return GALLERY; // Placeholder for future filtering logic by category
  }, [active]);

  const pulse = useRef(new Animated.Value(1)).current;
  const animatePulse = useCallback(() => {
    Animated.sequence([
      Animated.timing(pulse, { toValue: 0.95, duration: 500, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start(() => animatePulse());
  }, [pulse]);

  React.useEffect(() => {
    animatePulse();
  }, [animatePulse]);

  const renderTrending = useCallback(({ item }: { item: Card }) => (
    <TouchableOpacity
      key={item.id}
      activeOpacity={0.9}
      style={styles.trendingCard}
      onPress={() => router.push('/hairstyles')}
    >
      <Image source={{ uri: item.image }} style={styles.trendingImage} />
      <LinearGradient colors={["rgba(0,0,0,0.6)", 'transparent']} style={styles.trendingOverlay} />
      <View style={styles.trendingMeta}>
        <Text style={styles.trendingTitle}>{item.title}</Text>
        <View style={styles.trendingRow}>
          <View style={styles.ratingRow}>
            {[0,1,2,3,4].map((i) => (
              <Star key={i} size={12} color="#FACC15" fill="#FACC15" />
            ))}
            <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
          </View>
          <TouchableOpacity onPress={() => handleToggleLike(item.id)}>
            {likedIds.has(item.id) ? (
              <Heart size={18} color="#EF4444" fill="#EF4444" />
            ) : (
              <HeartOff size={18} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  ), [handleToggleLike, likedIds]);

  return (
    <View style={styles.root}>
      <Stack.Screen options={{ headerShown: false }} />

      <LinearGradient colors={['#0f0f23', '#1a1a2e', '#16213e']} locations={[0, 0.5, 1]} style={StyleSheet.absoluteFill} />

      <View style={[styles.safePad, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12 }]}>
        {/* Floating background accents */}
        <View style={[styles.circle, styles.circleA]} />
        <View style={[styles.circle, styles.circleB]} />
        <View style={[styles.circle, styles.circleC]} />
        <View style={[styles.circle, styles.circleD]} />

        <ScrollView contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.brandRow}>
              <View style={styles.brandIconWrap}>
                <LinearGradient colors={['#FF8C42', '#FFB366']} style={styles.brandIconGrad}>
                  <Scissors color="#FFFFFF" size={18} />
                </LinearGradient>
              </View>
              <Text style={styles.brandTitle}>
                <Text style={styles.brandTitleHair}>Hair</Text>
                <Text style={styles.brandTitleFluencer}>fluencer</Text>
              </Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.iconBtn} accessibilityLabel="Notifications">
                <Bell size={18} color="#E5E7EB" />
              </TouchableOpacity>
              <Image source={{ uri: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg' }} style={styles.avatar} />
            </View>
          </View>

          {/* Search */}
          <View style={styles.searchWrap}>
            <Search size={16} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              ref={searchRef}
              placeholder="Search hairstyles..."
              placeholderTextColor="#9CA3AF"
              style={styles.searchInput}
              returnKeyType="search"
              onSubmitEditing={() => console.log('Search submitted')}
            />
            <TouchableOpacity style={styles.micBtn}>
              <Mic size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Categories */}
          <FlatList
            data={CATEGORIES}
            keyExtractor={(c) => c.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.catList}
            renderItem={({ item }) => {
              const selected = item.id === active;
              return (
                <TouchableOpacity
                  testID={`category-${item.id}`}
                  onPress={() => setActive(item.id)}
                  style={[styles.catPill, selected ? styles.catPillActive : styles.catPillInactive]}
                >
                  <Text style={selected ? styles.catPillTextActive : styles.catPillText}>{item.label}</Text>
                </TouchableOpacity>
              );
            }}
          />

          {/* Trending */}
          <Text style={styles.sectionTitle}>Trending Now</Text>
          <FlatList
            data={TRENDING}
            keyExtractor={(i) => i.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trendingList}
            renderItem={renderTrending}
          />

          {/* Gallery */}
          <Text style={styles.sectionTitle}>Discover Your Style</Text>
          <View style={styles.grid}>
            {filteredGallery.map((g) => (
              <TouchableOpacity key={g.id} activeOpacity={0.9} style={styles.card} onPress={() => router.push('/hairstyles')}>
                <Image source={{ uri: g.image }} style={styles.cardImage} />
                <LinearGradient colors={["rgba(0,0,0,0.6)", 'transparent']} style={styles.cardOverlay} />
                <View style={styles.cardMeta}>
                  <Text style={styles.cardTitle}>{g.title}</Text>
                  <View style={styles.trendingRow}>
                    <View style={styles.ratingRow}>
                      {[0,1,2,3,4].map((i) => (
                        <Star key={i} size={12} color="#FACC15" fill="#FACC15" />
                      ))}
                      <Text style={styles.ratingText}>{g.rating.toFixed(1)}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleToggleLike(g.id)}>
                      {likedIds.has(g.id) ? (
                        <Heart size={18} color="#EF4444" fill="#EF4444" />
                      ) : (
                        <HeartOff size={18} color="#FFFFFF" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerPrimary}>✨ Discover your perfect style with Hairfluencer ✨</Text>
            <Text style={styles.footerSecondary}>Your beauty journey starts here</Text>
          </View>
        </ScrollView>

        {/* Camera FAB */}
        <Animated.View style={[styles.fabWrap, { transform: [{ scale: pulse }] }]}> 
          <TouchableOpacity testID="camera-btn" onPress={() => router.push('/photo')} activeOpacity={0.9}>
            <LinearGradient colors={['#FF8C42', '#FFB366']} style={styles.fab}>
              <Camera color="#FFFFFF" size={20} />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0f0f23' },
  safePad: { flex: 1, paddingHorizontal: 16 },
  scrollInner: { paddingBottom: 120 },

  // decorative floating circles (match welcome screen vibe)
  circle: { position: 'absolute', borderRadius: 9999, opacity: 0.12 },
  circleA: { top: 80, left: 24, width: 112, height: 112, backgroundColor: 'rgba(251,146,60,0.15)' },
  circleB: { top: 160, right: 24, width: 96, height: 96, backgroundColor: 'rgba(139,92,246,0.15)' },
  circleC: { bottom: 160, left: 12, width: 140, height: 140, backgroundColor: 'rgba(251,146,60,0.12)' },
  circleD: { bottom: 240, right: 36, width: 84, height: 84, backgroundColor: 'rgba(139,92,246,0.12)' },

  header: { marginTop: 8, marginBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  brandIconWrap: { marginRight: 10 },
  brandIconGrad: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  brandTitle: { fontSize: 22, fontWeight: '700' as const, color: '#E5E7EB' },
  brandTitleHair: { color: '#FB923C', fontWeight: '800' as const },
  brandTitleFluencer: { color: '#FFFFFF', fontWeight: '800' as const },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18 },

  searchWrap: { position: 'relative', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 24, paddingVertical: 10, paddingHorizontal: 16, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  searchIcon: { position: 'absolute', left: 14, top: 14 },
  searchInput: { paddingLeft: 28, paddingRight: 48, color: '#F3F4F6', fontSize: 14 },
  micBtn: { position: 'absolute', right: 8, top: 8, width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FB923C' },

  catList: { paddingVertical: 10 },
  catPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, marginRight: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 2 },
  catPillInactive: { backgroundColor: 'rgba(255,255,255,0.9)' },
  catPillActive: { backgroundColor: '#FB923C' },
  catPillText: { color: '#374151', fontWeight: '600' as const },
  catPillTextActive: { color: '#FFFFFF', fontWeight: '700' as const },

  sectionTitle: { fontSize: 18, fontWeight: '700' as const, color: '#E5E7EB', marginTop: 8, marginBottom: 10 },
  trendingList: { paddingBottom: 8 },
  trendingCard: { backgroundColor: '#111827', borderRadius: 16, overflow: 'hidden', marginRight: 14, minWidth: 280 },
  trendingImage: { width: 280, height: 128 },
  trendingOverlay: { ...StyleSheet.absoluteFillObject },
  trendingMeta: { position: 'absolute', left: 12, right: 12, bottom: 10 },
  trendingTitle: { color: '#FFFFFF', fontWeight: '700' as const },
  trendingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { color: '#FFFFFF', marginLeft: 6, fontSize: 12 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { backgroundColor: '#111827', borderRadius: 16, overflow: 'hidden', width: '48%', marginBottom: 12 },
  cardImage: { width: '100%', height: 180 },
  cardOverlay: { ...StyleSheet.absoluteFillObject },
  cardMeta: { position: 'absolute', left: 10, right: 10, bottom: 10 },
  cardTitle: { color: '#FFFFFF', fontWeight: '600' as const },

  footer: { marginTop: 8, marginBottom: 24, alignItems: 'center' },
  footerPrimary: { color: '#E5E7EB', fontWeight: '600' as const },
  footerSecondary: { color: '#9CA3AF', marginTop: 4 },

  fabWrap: { position: 'absolute', right: 20, bottom: 20, zIndex: 20 },
  fab: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', shadowColor: '#FB923C', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 8 },
});
