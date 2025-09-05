import { useState } from 'react';
import { TypingAnimation } from '@/components/TypingAnimation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import heroImage from '@assets/CineVerseMain_1757064916734.png';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors: string[] = [];
    if (!formData.name.trim()) errors.push('Name is required');
    if (!formData.surname.trim()) errors.push('Surname is required');
    if (!formData.email.trim()) errors.push('Email is required');
    if (!formData.message.trim()) errors.push('Message is required');
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors.join(', '),
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });
      setFormData({ name: '', surname: '', email: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="CineVerse Cinema"
            className="w-full h-full object-cover object-center"
            style={{ filter: 'blur(1px)' }}
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-2xl leading-tight"
              aria-label="Welcome to CineVerse – Your Gateway to the World of Cinema!"
            >
              <TypingAnimation 
                text="Welcome to CineVerse – Your Gateway to the World of Cinema!"
                className="inline-block"
              />
            </h1>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">About CineVerse</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed space-y-6">
              <p>
                CineVerse is your ultimate destination for discovering the world of cinema. Our platform offers 
                a comprehensive movie discovery experience that spans across different film industries and cultures.
              </p>
              <p>
                Explore popular movies from Hollywood, Bollywood, and Tollywood with our curated collections. 
                Stay up-to-date with trending films through our daily and weekly trending lists. Watch official 
                trailers, read detailed storylines, and dive deep into cast and crew information.
              </p>
              <p>
                Our platform provides comprehensive movie details including ratings, genres, release dates, 
                runtime, budget and revenue information, giving you everything you need to make informed 
                viewing decisions.
              </p>
              <p className="text-sm text-muted-foreground mt-8">
                Powered by TMDB
              </p>
              <p className="text-sm text-muted-foreground">
                Developed by Ram Krishna Jha.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-foreground">Contact Us</h2>
            <Card>
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        data-testid="input-name"
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="surname">Surname *</Label>
                      <Input
                        id="surname"
                        name="surname"
                        type="text"
                        value={formData.surname}
                        onChange={handleInputChange}
                        required
                        data-testid="input-surname"
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      data-testid="input-email"
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      data-testid="textarea-message"
                      className="w-full min-h-32"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    data-testid="button-send-message"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-8 md:py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-between space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-muted-foreground text-sm md:text-base">
                © 2025 CineVerse. All rights reserved.
              </p>
            </div>
            <nav className="flex space-x-6">
              <a 
                href="#about" 
                className="text-muted-foreground hover:text-foreground transition-colors text-sm md:text-base"
                data-testid="link-about"
              >
                About
              </a>
              <a 
                href="#contact" 
                className="text-muted-foreground hover:text-foreground transition-colors text-sm md:text-base"
                data-testid="link-contact"
              >
                Contact
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </main>
  );
}