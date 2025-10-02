"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    // During SSR or before hydration, return default values
    if (typeof window === 'undefined') {
      return {
        isDark: false,
        toggleTheme: () => {}
      };
    }
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check localStorage and system preference
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (saved) {
      setIsDark(saved === "dark");
    } else {
      setIsDark(prefersDark);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      // Apply theme to document
      document.documentElement.classList.toggle("dark", isDark);
      localStorage.setItem("theme", isDark ? "dark" : "light");
    }
  }, [isDark, mounted]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  // Prevent hydration mismatch by not rendering theme-dependent content until mounted
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ isDark: false, toggleTheme: () => {} }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
