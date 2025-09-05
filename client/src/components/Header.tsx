import { Moon, Sun, Film } from 'lucide-react';
import { Link } from 'wouter';
import { SearchBar } from './SearchBar';
import { useThemeContext } from './ThemeProvider';
import logoPath from '@assets/CineVerseLogo_1757056535117.png';

export function Header() {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center space-x-2 cursor-pointer">
              <img 
                src={logoPath} 
                alt="CineVerse Logo" 
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-blue-500 rounded flex items-center justify-center hidden">
                <Film className="text-white text-sm" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                CineVerse
              </span>
            </div>
          </Link>

          <SearchBar />

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              data-testid="button-theme-toggle"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              ) : (
                <Moon className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
