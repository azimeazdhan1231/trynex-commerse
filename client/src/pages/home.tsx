import { useQuery } from '@tanstack/react-query';
import Header from '@/components/header';
import Hero from '@/components/hero';
import ProductCard from '@/components/product-card';
import CartModal from '@/components/cart-modal';
import Newsletter from '@/components/newsletter';
import Footer from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { Truck, Shield, RotateCcw, Headphones } from 'lucide-react';
import type { Product, Category } from '@shared/schema';

export default function Home() {
  const { t } = useLanguage();

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: featuredProducts = [] } = useQuery<Product[]>({
    queryKey: ['/api/products', { featured: true, limit: 6 }],
  });

  const { data: flashSaleProducts = [] } = useQuery<Product[]>({
    queryKey: ['/api/products', { limit: 3, featured: true }],
  });

  const categoryEmojis = {
    'mugs': '☕',
    't-shirts': '👕',
    'keychains': '🔑',
    'water-bottles': '🍼',
    'gift-for-him': '🎁',
    'gift-for-her': '💝',
    'gift-for-parents': '❤️',
    'gifts-for-babies': '🍼',
    'for-couple': '💑',
    'premium-luxury-gift-hampers': '🎁',
    'chocolates-flowers': '🍫🌹'
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      
      {/* Features Bar */}
      <section className="bg-soft-gray py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Truck className="text-gold w-5 h-5" />
              <span className="text-sm font-medium">{t('free_shipping')}</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Shield className="text-gold w-5 h-5" />
              <span className="text-sm font-medium">{t('secure_payment')}</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <RotateCcw className="text-gold w-5 h-5" />
              <span className="text-sm font-medium">{t('easy_returns')}</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Headphones className="text-gold w-5 h-5" />
              <span className="text-sm font-medium">{t('24_7_support')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats */}
      <section className="bg-white py-4 border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>127 people viewing this site</span>
              </div>
              <div className="hidden md:block">
                <span className="text-gray-600">Last order: </span>
                <span className="text-gold font-medium">Premium Mug - 2 mins ago</span>
              </div>
            </div>
            <div className="text-gold font-medium">
              🔥 Flash Sale: 20% OFF - Ends in 2h 15m
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Shop by <span className="text-gold">Categories</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our curated collections designed to make every moment special
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div key={category.id} className="group cursor-pointer transform transition-all duration-300 hover:scale-105">
                <div className="bg-gradient-to-br from-gold/10 to-gold/5 rounded-2xl p-6 text-center border border-gold/20 hover:border-gold/40">
                  <div className="text-4xl mb-4 group-hover:animate-bounce">
                    {categoryEmojis[category.slug as keyof typeof categoryEmojis] || '🎁'}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{category.nameBn}</p>
                  <span className="text-gold font-medium">From ৳400</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flash Sale Section */}
      <section className="py-16 bg-gradient-to-r from-gold/10 to-gold/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              ⚡ {t('flash_sale')}
            </h2>
            <p className="text-gray-600 mb-6">Limited time offers - Grab them before they're gone!</p>
            
            {/* Countdown Timer */}
            <div className="flex justify-center space-x-4 mb-8">
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <div className="text-2xl font-bold text-gold">02</div>
                <div className="text-xs text-gray-600">Hours</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <div className="text-2xl font-bold text-gold">15</div>
                <div className="text-xs text-gray-600">Minutes</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <div className="text-2xl font-bold text-gold">32</div>
                <div className="text-xs text-gray-600">Seconds</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {flashSaleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              {t('featured_products')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our most popular items loved by customers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" className="bg-gold hover:bg-gold-dark text-white px-8 py-3 rounded-full">
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-soft-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              {t('what_customers_say')}
            </h2>
            <p className="text-gray-600">Discover why thousands trust TryneX for their gifting needs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gold/10">
              <div className="flex items-center space-x-1 mb-4">
                <div className="flex text-gold">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fas fa-star"></i>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4 italic">
                "Amazing quality and fast delivery! The mug I ordered was exactly as shown and my friend loved it. Will definitely order again."
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center text-white font-bold">
                  S
                </div>
                <div>
                  <div className="font-semibold">Sarah Ahmed</div>
                  <div className="text-sm text-gray-500">Verified Buyer</div>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gold/10">
              <div className="flex items-center space-x-1 mb-4">
                <div className="flex text-gold">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fas fa-star"></i>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4 italic">
                "The luxury hamper was beautifully packaged and arrived on time. Perfect for our anniversary celebration. Highly recommended!"
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center text-white font-bold">
                  R
                </div>
                <div>
                  <div className="font-semibold">Rahul Khan</div>
                  <div className="text-sm text-gray-500">Verified Buyer</div>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gold/10">
              <div className="flex items-center space-x-1 mb-4">
                <div className="flex text-gold">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fas fa-star"></i>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4 italic">
                "Great customer service and beautiful products. The personalized keychain was exactly what I wanted. Thank you TryneX!"
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center text-white font-bold">
                  M
                </div>
                <div>
                  <div className="font-semibold">Maya Patel</div>
                  <div className="text-sm text-gray-500">Verified Buyer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Newsletter />
      <Footer />
      <CartModal />
    </div>
  );
}
