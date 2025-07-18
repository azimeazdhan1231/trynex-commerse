import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LanguageStore {
  language: 'en' | 'bn';
  setLanguage: (language: 'en' | 'bn') => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'home': 'Home',
    'shop': 'Shop',
    'categories': 'Categories',
    'blog': 'Blog',
    'contact': 'Contact',
    'track_order': 'Track Order',
    'search_placeholder': 'Search products...',
    'add_to_cart': 'Add to Cart',
    'buy_now': 'Buy Now',
    'view_cart': 'View Cart',
    'checkout': 'Checkout',
    'subtotal': 'Subtotal',
    'delivery_fee': 'Delivery Fee',
    'total': 'Total',
    'order_now': 'Order Now',
    'whatsapp_order': 'Order via WhatsApp',
    'email_order': 'Order via Email',
    'direct_order': 'Place Direct Order',
    'newsletter_title': 'Stay Updated with TryneX',
    'newsletter_subtitle': 'Subscribe to our newsletter for exclusive offers, new arrivals, and gifting tips',
    'subscribe': 'Subscribe',
    'premium_gifts': 'Premium Gifts',
    'hero_subtitle': 'Discover exquisite collections crafted with love and elegance',
    'shop_now': 'Shop Now',
    'view_catalog': 'View Catalog',
    'flash_sale': 'Flash Sale',
    'featured_products': 'Featured Products',
    'customer_reviews': 'Customer Reviews',
    'what_customers_say': 'What Our Customers Say',
    'track_your_order': 'Track Your Order',
    'my_wishlist': 'My Wishlist',
    'free_shipping': 'Free Shipping',
    'secure_payment': 'Secure Payment',
    'easy_returns': 'Easy Returns',
    '24_7_support': '24/7 Support',
    'in_stock': 'In Stock',
    'low_stock': 'Low Stock',
    'out_of_stock': 'Out of Stock',
    'quick_view': 'Quick View',
    'promo_code': 'Promo Code',
    'apply': 'Apply',
    'special_instructions': 'Special Instructions',
    'delivery_location': 'Delivery Location',
    'payment_method': 'Payment Method',
    'order_summary': 'Order Summary'
  },
  bn: {
    'home': 'হোম',
    'shop': 'শপ',
    'categories': 'ক্যাটাগরি',
    'blog': 'ব্লগ',
    'contact': 'যোগাযোগ',
    'track_order': 'অর্ডার ট্র্যাক',
    'search_placeholder': 'পণ্য খুঁজুন...',
    'add_to_cart': 'কার্টে যোগ করুন',
    'buy_now': 'এখনই কিনুন',
    'view_cart': 'কার্ট দেখুন',
    'checkout': 'চেকআউট',
    'subtotal': 'মোট',
    'delivery_fee': 'ডেলিভারি ফি',
    'total': 'সর্বমোট',
    'order_now': 'অর্ডার করুন',
    'whatsapp_order': 'হোয়াটসঅ্যাপে অর্ডার',
    'email_order': 'ইমেইলে অর্ডার',
    'direct_order': 'সরাসরি অর্ডার',
    'newsletter_title': 'TryneX এর সাথে আপডেট থাকুন',
    'newsletter_subtitle': 'এক্সক্লুসিভ অফার, নতুন পণ্য এবং গিফট টিপসের জন্য আমাদের নিউজলেটার সাবস্ক্রাইব করুন',
    'subscribe': 'সাবস্ক্রাইব',
    'premium_gifts': 'প্রিমিয়াম গিফট',
    'hero_subtitle': 'ভালোবাসা এবং কমনীয়তা দিয়ে তৈরি অসাধারণ সংগ্রহ আবিষ্কার করুন',
    'shop_now': 'এখনই কিনুন',
    'view_catalog': 'ক্যাটালগ দেখুন',
    'flash_sale': 'ফ্ল্যাশ সেল',
    'featured_products': 'ফিচার্ড পণ্য',
    'customer_reviews': 'কাস্টমার রিভিউ',
    'what_customers_say': 'আমাদের কাস্টমাররা কী বলেন',
    'track_your_order': 'আপনার অর্ডার ট্র্যাক করুন',
    'my_wishlist': 'আমার উইশলিস্ট',
    'free_shipping': 'ফ্রি শিপিং',
    'secure_payment': 'নিরাপদ পেমেন্ট',
    'easy_returns': 'সহজ রিটার্ন',
    '24_7_support': '২৪/৭ সাপোর্ট',
    'in_stock': 'স্টকে আছে',
    'low_stock': 'কম স্টক',
    'out_of_stock': 'স্টক নেই',
    'quick_view': 'দ্রুত দেখুন',
    'promo_code': 'প্রোমো কোড',
    'apply': 'প্রয়োগ',
    'special_instructions': 'বিশেষ নির্দেশনা',
    'delivery_location': 'ডেলিভারি লোকেশন',
    'payment_method': 'পেমেন্ট পদ্ধতি',
    'order_summary': 'অর্ডার সারসংক্ষেপ'
  }
};

export const useLanguage = create<LanguageStore>()(
  persist(
    (set, get) => ({
      language: 'en',
      
      setLanguage: (language) => {
        set({ language });
      },
      
      t: (key) => {
        const { language } = get();
        return translations[language][key as keyof typeof translations.en] || key;
      }
    }),
    {
      name: 'trynex-language',
    }
  )
);
