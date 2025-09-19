import { create } from 'zustand';

interface Hairstyle {
  id: string;
  name: string;
  image: string;
  description: string;
}

interface HairstyleStore {
  selectedHairstyle: Hairstyle | null;
  userPhoto: string | null;
  processedImage: string | null;
  setSelectedHairstyle: (hairstyle: Hairstyle) => void;
  setUserPhoto: (photo: string) => void;
  setProcessedImage: (image: string) => void;
  reset: () => void;
}

export const useHairstyleStore = create<HairstyleStore>((set) => ({
  selectedHairstyle: null,
  userPhoto: null,
  processedImage: null,
  setSelectedHairstyle: (hairstyle) => set({ selectedHairstyle: hairstyle }),
  setUserPhoto: (photo) => set({ userPhoto: photo }),
  setProcessedImage: (image) => set({ processedImage: image }),
  reset: () => set({ 
    selectedHairstyle: null, 
    userPhoto: null, 
    processedImage: null 
  }),
}));