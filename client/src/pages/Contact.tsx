import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Contact() {
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
    <main className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center text-foreground">
            Contact Us
          </h1>
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Have questions, suggestions, or feedback? We'd love to hear from you. 
            Get in touch with the CineVerse team.
          </p>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6 text-foreground">Send us a Message</h2>
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
                          placeholder="Your first name"
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
                          placeholder="Your last name"
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
                        placeholder="your.email@example.com"
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
                        placeholder="Tell us how we can help you, share feedback, or ask questions about CineVerse..."
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

            {/* Contact Information */}
            <div className="space-y-8">
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6 text-foreground">Get in Touch</h2>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <Mail className="w-6 h-6 text-primary mt-1" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Email</h3>
                        <p className="text-muted-foreground">contact@cineverse.com</p>
                        <p className="text-sm text-muted-foreground">
                          We typically respond within 24 hours
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <Phone className="w-6 h-6 text-primary mt-1" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Support</h3>
                        <p className="text-muted-foreground">Available 24/7</p>
                        <p className="text-sm text-muted-foreground">
                          For technical issues and general inquiries
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <MapPin className="w-6 h-6 text-primary mt-1" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Community</h3>
                        <p className="text-muted-foreground">Join our community</p>
                        <p className="text-sm text-muted-foreground">
                          Connect with fellow movie enthusiasts
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4 text-foreground">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">How do I search for content?</h3>
                      <p className="text-sm text-muted-foreground">
                        Use the search bar in the header to find movies, TV shows, and web series. 
                        Our search supports multiple content types with instant results.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Where does the data come from?</h3>
                      <p className="text-sm text-muted-foreground">
                        All our movie and TV show data is powered by The Movie Database (TMDB), 
                        ensuring accurate and up-to-date information.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Is CineVerse free to use?</h3>
                      <p className="text-sm text-muted-foreground">
                        Yes, CineVerse is completely free to use. Discover, explore, and enjoy 
                        unlimited access to movie and TV show information.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}