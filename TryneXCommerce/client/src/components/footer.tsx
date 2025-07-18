import { Link } from 'wouter';
import { useLanguage } from '@/hooks/use-language';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  const quickLinks = [
    { name: t('home'), href: '/' },
    { name: t('shop'), href: '/products' },
    { name: t('categories'), href: '/categories' },
    { name: t('track_order'), href: '/track-order' },
    { name: t('blog'), href: '/blog' },
    { name: t('contact'), href: '/contact' },
  ];

  const customerService = [
    { name: 'FAQ', href: '/faq' },
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'Returns', href: '/returns' },
    { name: 'Size Guide', href: '/size-guide' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ];

  return (
    <footer className="bg-deep-black text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h3 className="text-3xl font-bold text-gold mb-4">TryneX</h3>
            <p className="text-gray-300 mb-6">
              Premium gifts crafted with love and elegance. Making every moment special with our curated collections.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gold transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-300 hover:text-gold transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-xl font-semibold mb-6">Customer Service</h4>
            <ul className="space-y-3">
              {customerService.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-300 hover:text-gold transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-semibold mb-6">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gold" />
                <span className="text-gray-300">+88{WHATSAPP_NUMBER}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gold" />
                <span className="text-gray-300">support@trynex.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-gold mt-1" />
                <span className="text-gray-300">Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-gold" />
                <span className="text-gray-300">24/7 Support</span>
              </div>
            </div>
            
            {/* WhatsApp Button */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold transition-colors mt-4"
            >
              <i className="fab fa-whatsapp"></i>
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 TryneX. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <i className="fas fa-shield-alt text-gold"></i>
                <span className="text-gray-400">Secure Payment</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fas fa-truck text-gold"></i>
                <span className="text-gray-400">Fast Delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fas fa-headset text-gold"></i>
                <span className="text-gray-400">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
