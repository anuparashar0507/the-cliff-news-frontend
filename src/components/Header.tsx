"use client";

import { useState, useEffect } from "react";
import { Search, Menu, X, Moon, Sun, ChevronDown, Home, FileText, ImageIcon, Newspaper, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Navigation item interface
interface NavigationItem {
  href: string;
  label: string;
  key: string;
  onClick?: () => void;
}

// Mock categories - in real app, fetch from API
const mockCategories = [
  { id: '1', name: 'National', slug: 'national' },
  { id: '2', name: 'Politics', slug: 'politics' },
  { id: '3', name: 'Business', slug: 'business' },
  { id: '4', name: 'Sports', slug: 'sports' },
  { id: '5', name: 'Entertainment', slug: 'entertainment' },
  { id: '6', name: 'Technology', slug: 'technology' },
  { id: '7', name: 'Science', slug: 'science' },
  { id: '8', name: 'Health', slug: 'health' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting for component to mount
  useEffect(() => {
    setMounted(true);
  }, []);
  const pathname = usePathname();
  const currentLocale = pathname?.split('/')[1] || 'en';

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchQuery);
    }
  };

  const navigationItems: NavigationItem[] = [
    { href: `/${currentLocale}`, label: 'Home', key: 'home' },
    { href: `/${currentLocale}/quick-reads`, label: 'Quick Reads', key: 'quickReads' },
    { href: `/${currentLocale}/videos`, label: 'Bytes', key: 'bytes' },
    { href: `/${currentLocale}/highlights`, label: 'Highlights', key: 'highlights' },
    { href: `/${currentLocale}/nit`, label: 'NIT', key: 'nit' },
    { href: `/${currentLocale}/epaper`, label: 'E-Paper', key: 'epaper' },
  ];

  return (
    <header className={cn(
      "sticky top-0 z-50 bg-background border-b transition-all duration-300",
      isScrolled ? "shadow-md border-border" : "border-border"
    )}>
      {/* Breaking News Ticker - Brand Orange background only */}
      <div className="bg-primary text-white overflow-hidden" style={{ backgroundColor: 'hsl(39 100% 50%)' }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center py-2">
            <span className="font-bold text-sm mr-3 flex items-center">
              <span className="inline-block w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
              BREAKING
            </span>
            <div className="flex-1 overflow-hidden">
              <div className="custom-ticker whitespace-nowrap text-sm">
                Revolutionary climate technology breakthrough announced •
                Championship finals draw record 150M+ viewers •
                Global markets surge following policy changes •
                New discovery in quantum computing promises faster processors
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href={`/${currentLocale}`} className="flex items-center flex-shrink-0">
            <div className="relative h-8 md:h-10 lg:h-12">
              <Image
                src={mounted && theme === 'dark' ? "/dark-logo.png" : "/light-logo.png"}
                alt="The Cliff News"
                width={180}
                height={50}
                className="h-full w-auto object-contain"
                style={{ maxHeight: '100%' }}
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-3 xl:space-x-6 flex-1 justify-center max-w-4xl mx-6">
            <Link
              href={`/${currentLocale}`}
              className={cn(
                "font-medium transition-colors text-sm lg:text-base whitespace-nowrap",
                pathname === `/${currentLocale}` || pathname === `/${currentLocale}/`
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              )}
            >
              Home
            </Link>

            {/* Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="font-medium text-foreground hover:text-primary flex items-center space-x-1 px-2 py-1 h-auto"
                >
                  <span className="text-sm">Categories</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-popover border-border shadow-lg rounded-lg" align="start">
                <div className="grid grid-cols-2 gap-1 p-2">
                  {mockCategories.map((category) => (
                    <DropdownMenuItem key={category.id} asChild>
                      <Link
                        href={`/${currentLocale}/category/${category.slug}`}
                        className="flex items-center px-3 py-2 text-sm cursor-pointer text-popover-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
                      >
                        {category.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href={`/${currentLocale}/quick-reads`}
              className={cn(
                "font-medium transition-colors text-sm lg:text-base whitespace-nowrap",
                pathname === `/${currentLocale}/quick-reads`
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              )}
            >
              Quick Reads
            </Link>

            <Link
              href={`/${currentLocale}/videos`}
              className={cn(
                "font-medium transition-colors text-sm lg:text-base whitespace-nowrap",
                pathname === `/${currentLocale}/videos`
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              )}
            >
              Bytes
            </Link>

            <Link
              href={`/${currentLocale}/highlights`}
              className={cn(
                "font-medium transition-colors text-sm lg:text-base whitespace-nowrap",
                pathname === `/${currentLocale}/highlights`
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              )}
            >
              Highlights
            </Link>

            <Link
              href={`/${currentLocale}/nit`}
              className={cn(
                "font-medium transition-colors text-sm lg:text-base whitespace-nowrap",
                pathname === `/${currentLocale}/nit`
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              )}
            >
              NIT
            </Link>

            <Link
              href={`/${currentLocale}/epaper`}
              className={cn(
                "font-medium transition-colors text-sm lg:text-base whitespace-nowrap",
                pathname === `/${currentLocale}/epaper`
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              )}
            >
              E-Paper
            </Link>
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-2 lg:space-x-4 flex-shrink-0">
            {/* Theme Toggle - visible on all screen sizes */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2"
              aria-label="Toggle theme"
            >
              {mounted && theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="hidden lg:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-48 xl:w-64 h-9 bg-background border-border focus:border-primary focus:ring-primary"
                />
              </div>
            </form>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="lg:hidden p-2"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>

            {/* Language Switcher - Commented as requested */}
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1 px-2"
                >
                  <Globe className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase">{currentLocale}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/en" className="cursor-pointer">
                    🇺🇸 English
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/hi" className="cursor-pointer">
                    🇮🇳 हिंदी
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
          </div>
        </div>
      </div>

      {/* Mobile Menu - Side Drawer */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent
          side="left"
          className="w-[320px] sm:w-[380px] p-0 bg-background border-r border-border"
        >
          <SheetHeader className="p-6 pb-4 border-b border-border bg-background">
            <SheetTitle className="flex items-center justify-between text-foreground">
              <div className="relative h-10">
                <Image
                  src={mounted && theme === 'dark' ? "/dark-logo.png" : "/light-logo.png"}
                  alt="The Cliff News"
                  width={150}
                  height={40}
                  className="h-full w-auto object-contain"
                  style={{ maxHeight: '100%' }}
                />
              </div>
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col h-full bg-background">
            {/* Mobile Search */}
            <div className="p-4 border-b border-border bg-background">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search news..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full bg-background border-border focus:border-primary focus:ring-primary"
                  />
                </div>
              </form>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 overflow-y-auto bg-background">
              <div className="p-4 space-y-2">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "block px-4 py-3 rounded-lg font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "text-foreground hover:bg-muted hover:text-primary"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* Categories Section */}
              <div className="p-4 border-t border-border bg-background">
                <h3 className="font-semibold text-foreground mb-3 px-4 text-sm uppercase tracking-wide">
                  Categories
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {mockCategories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/${currentLocale}/category/${category.slug}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors border border-transparent hover:border-primary/20"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            {/* Mobile Footer */}
            <div className="p-4 border-t border-border bg-background">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-foreground font-semibold">
                    Appearance
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({mounted && theme === 'dark' ? 'Dark' : 'Light'})
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 border-border hover:bg-muted"
                  aria-label="Toggle theme"
                >
                  {mounted && theme === 'dark' ? (
                    <Sun className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <Moon className="h-4 w-4 text-gray-600" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <style jsx>{`
        @keyframes ticker {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .custom-ticker {
          animation: ticker 30s linear infinite;
        }
      `}</style>
    </header>
  );
};

export default Header;