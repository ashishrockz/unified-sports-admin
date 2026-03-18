import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  dark: boolean;
  toggle: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      dark: false,
      toggle: () => {
        const next = !get().dark;
        document.documentElement.classList.toggle('dark', next);
        set({ dark: next });
      },
    }),
    { name: 'theme-storage' }
  )
);

// Init on load
const stored = localStorage.getItem('theme-storage');
if (stored) {
  try {
    const { state } = JSON.parse(stored);
    if (state?.dark) document.documentElement.classList.add('dark');
  } catch {}
}
