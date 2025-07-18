import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { Gift, Heart } from 'lucide-react';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080"
          alt="Luxury gift collection"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10"></div>

      {/* Content */}
      <div className="relative z-20 text-center text-white animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          {t('premium_gifts').split(' ')[0]} <span className="text-gold">{t('premium_gifts').split(' ')[1]}</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          {t('hero_subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-gold hover:bg-gold-dark text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 animate-pulse-gold">
            {t('shop_now')}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-full font-semibold transition-all duration-300"
          >
            {t('view_catalog')}
          </Button>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float">
        <Gift className="text-gold w-8 h-8 opacity-60" />
      </div>
      <div className="absolute bottom-20 right-10 animate-float" style={{ animationDelay: '1s' }}>
        <Heart className="text-gold w-6 h-6 opacity-60" />
      </div>
    </section>
  );
}
