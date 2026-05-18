import { ref, computed, watch, Ref } from 'vue';

export type Theme = 'light' | 'dark' | 'system';

interface UseThemeReturn {
  theme: Ref<Theme>;
  isDark: Readonly<Ref<boolean>>;
  setTheme: (newTheme: Theme) => void;
  toggleTheme: () => void;
}

const THEME_STORAGE_KEY = 'app-theme';

export function useTheme(): UseThemeReturn {
  const theme = ref<Theme>('system');

  // Detect system preference
  const getSystemPreference = (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  // Computed isDark based on theme and system preference
  const isDark = computed((): boolean => {
    if (theme.value === 'dark') return true;
    if (theme.value === 'light') return false;
    return getSystemPreference();
  });

  // Apply theme to DOM
  const applyTheme = (): void => {
    if (typeof window === 'undefined') return;

    const html = document.documentElement;
    if (isDark.value) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  };

  // Persist theme to localStorage
  const persistTheme = (): void => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme.value);
    } catch (error) {
      console.error('Failed to persist theme to localStorage:', error);
    }
  };

  // Watch isDark and apply changes
  watch(isDark, () => {
    applyTheme();
  });

  // Set theme
  const setTheme = (newTheme: Theme): void => {
    theme.value = newTheme;
    persistTheme();
  };

  // Toggle between light and dark (ignores system)
  const toggleTheme = (): void => {
    if (theme.value === 'system') {
      setTheme(isDark.value ? 'light' : 'dark');
    } else {
      setTheme(theme.value === 'dark' ? 'light' : 'dark');
    }
  };

  // Listen to system theme changes when in system mode
  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
      if (theme.value === 'system') {
        applyTheme();
      }
    });
  }

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme,
  };
}

// Export initialization function to call in app setup
export function initializeAppTheme(): void {
  const theme = useTheme();
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        theme.setTheme(stored);
      }
    } catch (error) {
      console.error('Failed to load theme from localStorage:', error);
    }
  }
}
