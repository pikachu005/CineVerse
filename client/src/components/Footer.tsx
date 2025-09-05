import { Link } from 'wouter';

export function Footer() {
  return (
    <footer className="bg-background border-t border-border py-8 md:py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-muted-foreground text-sm md:text-base">
              © 2025 CineVerse. All rights reserved.
            </p>
          </div>
          <nav className="flex flex-wrap justify-center space-x-6">
            <Link 
              href="/" 
              className="text-muted-foreground hover:text-foreground transition-colors text-sm md:text-base"
              data-testid="link-home"
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className="text-muted-foreground hover:text-foreground transition-colors text-sm md:text-base"
              data-testid="link-about"
            >
              About Us
            </Link>
            <Link 
              href="/contact" 
              className="text-muted-foreground hover:text-foreground transition-colors text-sm md:text-base"
              data-testid="link-contact"
            >
              Contact Us
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}