import { Moon, Sun, Film } from 'lucide-react';
import { Link } from 'wouter';
import { SearchBar } from './SearchBar';
import { useThemeContext } from './ThemeProvider';
import logoPath from '@assets/CineVerseLogo_1757056535117.png';

export function Header() {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="absolute inset-0 backdrop-blur-md bg-background/80"></div>
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center cursor-pointer">
              <img 
                src={logoPath} 
                alt="CineVerse Logo" 
                className="w-12 h-12 md:w-16 md:h-16 object-contain transition-transform hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-red-500 to-blue-500 rounded flex items-center justify-center hidden">
                <Film className="text-white text-lg md:text-xl" />
              </div>
            </div>
          </Link>

          <SearchBar />

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-3 rounded-lg hover:bg-muted transition-all duration-300 ease-in-out transform hover:scale-105"
              data-testid="button-theme-toggle"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              <div className="relative w-6 h-6">
                <Sun className={`absolute inset-0 h-6 w-6 text-muted-foreground hover:text-foreground transition-all duration-300 transform ${
                  theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
                }`} />
                <Moon className={`absolute inset-0 h-6 w-6 text-muted-foreground hover:text-foreground transition-all duration-300 transform ${
                  theme === 'light' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
                }`} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
