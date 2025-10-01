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
import { useTheme } from "@/contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";

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
  const { isDark, toggleTheme } = useTheme();
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

  const navigationItems = [
    { href: `/${currentLocale}`, label: 'Home', key: 'home' },
    { href: `/${currentLocale}/inshorts`, label: 'Quick Reads', key: 'quickReads' },
    { href: `/${currentLocale}/bytes`, label: 'Bytes', key: 'bytes' },
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
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href={`/${currentLocale}`} className="flex items-center">
            <Image
              src={isDark ? "/dark-logo.png" : "/light-logo.png"}
              alt="The Cliff News"
              width={180}
              height={50}
              className="h-10 md:h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <Link
              href={`/${currentLocale}`}
              className={cn(
                "font-medium transition-colors",
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
                  className="font-medium text-foreground hover:text-primary flex items-center space-x-1 px-2"
                >
                  <span>Categories</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-popover border-border shadow-lg" align="start">
                {mockCategories.map((category) => (
                  <DropdownMenuItem key={category.id} asChild>
                    <Link
                      href={`/${currentLocale}/category/${category.slug}`}
                      className="w-full cursor-pointer text-popover-foreground hover:text-primary hover:bg-muted"
                    >
                      {category.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href={`/${currentLocale}/inshorts`}
              className={cn(
                "font-medium transition-colors",
                pathname === `/${currentLocale}/inshorts`
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              )}
            >
              Quick Reads
            </Link>

            <Link
              href={`/${currentLocale}/bytes`}
              className={cn(
                "font-medium transition-colors",
                pathname === `/${currentLocale}/bytes`
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              )}
            >
              Bytes
            </Link>

            <Link
              href={`/${currentLocale}/highlights`}
              className={cn(
                "font-medium transition-colors",
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
                "font-medium transition-colors",
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
                "font-medium transition-colors",
                pathname === `/${currentLocale}/epaper`
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              )}
            >
              E-Paper
            </Link>
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 h-9 bg-background border-border focus:border-primary focus:ring-primary"
                />
              </div>
            </form>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="md:hidden p-2"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
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
          className="w-[300px] sm:w-[350px] p-0 bg-white dark:bg-gray-900 border-r border-border"
        >
          <SheetHeader className="p-6 pb-4 border-b border-border bg-white dark:bg-gray-900">
            <SheetTitle className="flex items-center justify-between">
              <Image
                src={isDark ? "/dark-logo.png" : "/light-logo.png"}
                alt="The Cliff News"
                width={150}
                height={40}
                className="h-8 w-auto"
              />
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col h-full">
            {/* Mobile Search */}
            <div className="p-4 border-b border-border">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search news..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full bg-background border-border focus:border-primary"
                  />
                </div>
              </form>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-1">
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
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted hover:text-primary"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* Categories Section */}
              <div className="p-4 border-t border-border">
                <h3 className="font-semibold text-foreground mb-3 px-4">
                  Categories
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {mockCategories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/${currentLocale}/category/${category.slug}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            {/* Mobile Footer */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Theme
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="p-2"
                >
                  {isDark ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
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