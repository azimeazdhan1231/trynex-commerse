import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Percent, Bell, Gift } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubscribing(true);

    try {
      await apiRequest('POST', '/api/newsletter/subscribe', { email });
      
      toast({
        title: "Successfully Subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      });
      
      setEmail('');
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-gold/20 to-gold/10">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">
            {t('newsletter_title')}
          </h2>
          <p className="text-gray-600 mb-8">
            {t('newsletter_subtitle')}
          </p>
          
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-gold"
              required
            />
            <Button
              type="submit"
              disabled={isSubscribing}
              className="bg-gold hover:bg-gold-dark text-white px-8 py-3 rounded-full font-semibold transition-colors whitespace-nowrap"
            >
              {isSubscribing ? 'Subscribing...' : t('subscribe')}
            </Button>
          </form>
          
          <p className="text-sm text-gray-500 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
          
          {/* Newsletter Benefits */}
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm">
            <div className="flex items-center space-x-2">
              <Percent className="w-4 h-4 text-gold" />
              <span>Exclusive Discounts</span>
            </div>
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-gold" />
              <span>New Arrival Alerts</span>
            </div>
            <div className="flex items-center space-x-2">
              <Gift className="w-4 h-4 text-gold" />
              <span>Gifting Tips</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
