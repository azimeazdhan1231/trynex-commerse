import { useState } from 'react';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import { useLanguage } from '@/hooks/use-language';
import type { Product } from '@shared/schema';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const { t } = useLanguage();

  const isInWishlistState = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.images[0] || '/placeholder.jpg'
    });
  };

  const handleWishlistToggle = () => {
    if (isInWishlistState) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        image: product.images[0] || '/placeholder.jpg'
      });
    }
  };

  const getStockBadge = () => {
    if (!product.inStock) {
      return <Badge variant="destructive">{t('out_of_stock')}</Badge>;
    }
    if (product.stockQuantity && product.stockQuantity < 10) {
      return <Badge variant="outline" className="border-orange-500 text-orange-500">{t('low_stock')}</Badge>;
    }
    return <Badge variant="outline" className="border-green-500 text-green-500">{t('in_stock')}</Badge>;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-gold fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div
      className="product-card bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative group">
        <img
          src={product.images[0] || 'https://via.placeholder.com/300x300?text=Product+Image'}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>

        {/* Wishlist Button */}
        <Button
          size="sm"
          variant="ghost"
          className={`absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg transition-all duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
          onClick={handleWishlistToggle}
        >
          <Heart
            className={`w-4 h-4 ${
              isInWishlistState ? 'text-red-500 fill-current' : 'text-gray-600'
            }`}
          />
        </Button>

        {/* Stock Badge */}
        <div className="absolute top-4 left-4">
          {getStockBadge()}
        </div>

        {/* Quick View Button */}
        {isHovered && onQuickView && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="ghost"
              className="bg-white text-black hover:bg-gold hover:text-white font-semibold px-4 py-2 rounded-full"
              onClick={() => onQuickView(product)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {t('quick_view')}
            </Button>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-3">
          <div className="flex">
            {renderStars(parseFloat(product.rating || "0"))}
          </div>
          <span className="text-sm text-gray-600">({product.reviewCount} reviews)</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gold">৳{product.price}</span>
            {product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price) && (
              <span className="text-gray-500 line-through">৳{product.originalPrice}</span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          className="w-full bg-gold hover:bg-gold-dark text-white py-3 rounded-full font-semibold transition-colors"
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {t('add_to_cart')}
        </Button>

        {/* Social Share */}
        <div className="flex justify-center space-x-3 mt-3">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-600">
            <i className="fab fa-facebook text-sm"></i>
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-400">
            <i className="fab fa-twitter text-sm"></i>
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-green-600">
            <i className="fab fa-whatsapp text-sm"></i>
          </Button>
        </div>
      </div>
    </div>
  );
}