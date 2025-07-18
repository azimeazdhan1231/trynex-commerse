import { useState, useEffect } from 'react';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useCart } from '@/hooks/use-cart';
import { useLanguage } from '@/hooks/use-language';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { DELIVERY_FEES, PAYMENT_METHODS, WHATSAPP_NUMBER } from '@/lib/constants';

export default function CartModal() {
  const [step, setStep] = useState(1);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { items, isOpen, closeCart, updateQuantity, removeItem, getTotal, clearCart } = useCart();
  const { t } = useLanguage();
  const { toast } = useToast();

  const subtotal = getTotal();
  const total = subtotal + deliveryFee - discount;

  useEffect(() => {
    if (deliveryLocation) {
      switch (deliveryLocation) {
        case 'dhaka':
          setDeliveryFee(DELIVERY_FEES.DHAKA_METRO);
          break;
        case 'outside_dhaka':
          setDeliveryFee(DELIVERY_FEES.OUTSIDE_DHAKA);
          break;
        case 'other':
          setDeliveryFee(DELIVERY_FEES.OTHER_DISTRICTS);
          break;
        default:
          setDeliveryFee(0);
      }
    }
  }, [deliveryLocation]);

  const handlePromoCodeApply = async () => {
    if (!promoCode.trim()) return;

    try {
      const response = await apiRequest('GET', `/api/promos/${promoCode}`);
      const promo = await response.json();
      
      let discountAmount = 0;
      if (promo.discountType === 'percentage') {
        discountAmount = (subtotal * parseFloat(promo.discount)) / 100;
        if (promo.maxDiscount) {
          discountAmount = Math.min(discountAmount, parseFloat(promo.maxDiscount));
        }
      } else {
        discountAmount = parseFloat(promo.discount);
      }

      if (promo.minAmount && subtotal < parseFloat(promo.minAmount)) {
        toast({
          title: "Invalid Promo Code",
          description: `Minimum order amount is ৳${promo.minAmount}`,
          variant: "destructive",
        });
        return;
      }

      setDiscount(discountAmount);
      toast({
        title: "Promo Code Applied!",
        description: `You saved ৳${discountAmount.toFixed(2)}`,
      });
    } catch (error) {
      toast({
        title: "Invalid Promo Code",
        description: "Please check your promo code and try again.",
        variant: "destructive",
      });
    }
  };

  const handleWhatsAppOrder = async () => {
    if (!customerInfo.name || !customerInfo.phone || !paymentMethod || !deliveryLocation) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      customerAddress: customerInfo.address,
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        variants: item.variants
      })),
      subtotal,
      deliveryFee,
      discount,
      total,
      paymentMethod,
      deliveryLocation,
      specialInstructions,
      promoCode,
      orderMethod: 'whatsapp'
    };

    try {
      const response = await apiRequest('POST', '/api/whatsapp-order', { orderData });
      const data = await response.json();
      
      if (data.whatsappUrl) {
        window.open(data.whatsappUrl, '_blank');
        clearCart();
        closeCart();
        toast({
          title: "Order Sent!",
          description: "Your order has been sent via WhatsApp.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send WhatsApp order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDirectOrder = async () => {
    if (!customerInfo.name || !customerInfo.phone || !paymentMethod || !deliveryLocation) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      customerAddress: customerInfo.address,
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        variants: item.variants
      })),
      subtotal,
      deliveryFee,
      discount,
      total,
      paymentMethod,
      deliveryLocation,
      specialInstructions,
      promoCode,
      orderMethod: 'direct'
    };

    try {
      const response = await apiRequest('POST', '/api/orders', orderData);
      const order = await response.json();
      
      clearCart();
      closeCart();
      
      toast({
        title: "Order Placed Successfully!",
        description: `Order ID: ${order.orderId}. You will receive a confirmation email shortly.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailOrder = async () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !paymentMethod || !deliveryLocation) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields including email.",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      customerAddress: customerInfo.address,
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        variants: item.variants
      })),
      subtotal,
      deliveryFee,
      discount,
      total,
      paymentMethod,
      deliveryLocation,
      specialInstructions,
      promoCode,
      orderMethod: 'email'
    };

    try {
      await apiRequest('POST', '/api/send-order-email', {
        to: customerInfo.email,
        subject: 'Order Confirmation - TryneX',
        orderData
      });
      
      clearCart();
      closeCart();
      
      toast({
        title: "Order Sent!",
        description: "Your order has been sent via email.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send email order. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 cart-overlay z-50">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Cart Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold">Shopping Cart</h2>
              <span className="bg-gold text-white px-3 py-1 rounded-full text-sm">
                {items.length} items
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={closeCart}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= 1 ? 'bg-gold text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  1
                </div>
                <span className={`font-semibold ${step >= 1 ? 'text-gold' : 'text-gray-600'}`}>
                  Cart Review
                </span>
              </div>
              <div className="flex-1 h-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= 2 ? 'bg-gold text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  2
                </div>
                <span className={`font-semibold ${step >= 2 ? 'text-gold' : 'text-gray-600'}`}>
                  Checkout
                </span>
              </div>
              <div className="flex-1 h-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= 3 ? 'bg-gold text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  3
                </div>
                <span className={`font-semibold ${step >= 3 ? 'text-gold' : 'text-gray-600'}`}>
                  Confirmation
                </span>
              </div>
            </div>
          </div>

          <div className="p-6">
            {step === 1 && (
              <div className="space-y-6">
                {/* Cart Items */}
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        {item.variants && (
                          <p className="text-sm text-gray-600">
                            {item.variants.size && `Size: ${item.variants.size}`}
                            {item.variants.color && `, Color: ${item.variants.color}`}
                          </p>
                        )}
                        <p className="text-gold font-bold">৳{item.price}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Promo Code */}
                <div className="p-4 bg-soft-gray rounded-xl">
                  <h4 className="font-semibold mb-3">{t('promo_code')}</h4>
                  <div className="flex space-x-3">
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handlePromoCodeApply} className="bg-gold hover:bg-gold-dark">
                      {t('apply')}
                    </Button>
                  </div>
                  {discount > 0 && (
                    <div className="mt-2 text-sm text-green-600">
                      ✓ Promo code applied! You saved ৳{discount.toFixed(2)}
                    </div>
                  )}
                </div>

                {/* Order Summary */}
                <div className="bg-soft-gray rounded-xl p-6">
                  <h4 className="font-bold text-xl mb-4">{t('order_summary')}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>{t('subtotal')} ({items.length} items)</span>
                      <span>৳{subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Promo discount</span>
                        <span>-৳{discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>{t('delivery_fee')}</span>
                      <span>৳{deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-300 pt-2 mt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>{t('total')}</span>
                        <span className="text-gold">৳{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setStep(2)}
                  className="w-full bg-gold hover:bg-gold-dark text-white py-3 rounded-full font-semibold"
                >
                  Proceed to Checkout
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                {/* Customer Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Customer Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                        placeholder="Enter your address"
                      />
                    </div>
                  </div>
                </div>

                {/* Special Instructions */}
                <div>
                  <Label htmlFor="instructions">{t('special_instructions')}</Label>
                  <Textarea
                    id="instructions"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Add any special instructions for your order..."
                    rows={3}
                  />
                </div>

                {/* Delivery & Payment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>{t('delivery_location')} *</Label>
                    <Select value={deliveryLocation} onValueChange={setDeliveryLocation}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select delivery area" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dhaka">Dhaka Metro (৳80)</SelectItem>
                        <SelectItem value="outside_dhaka">Outside Dhaka (৳120)</SelectItem>
                        <SelectItem value="other">Other Districts (৳150)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>{t('payment_method')} *</Label>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      {PAYMENT_METHODS.map((method) => (
                        <div key={method.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={method.value} id={method.value} />
                          <Label htmlFor={method.value}>{method.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-soft-gray rounded-xl p-6">
                  <h4 className="font-bold text-xl mb-4">{t('order_summary')}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>{t('subtotal')} ({items.length} items)</span>
                      <span>৳{subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Promo discount</span>
                        <span>-৳{discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>{t('delivery_fee')}</span>
                      <span>৳{deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-300 pt-2 mt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>{t('total')}</span>
                        <span className="text-gold">৳{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Actions */}
                <div className="space-y-3">
                  <Button
                    onClick={handleWhatsAppOrder}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-full font-semibold transition-colors flex items-center justify-center space-x-2"
                  >
                    <i className="fab fa-whatsapp"></i>
                    <span>{t('whatsapp_order')}</span>
                  </Button>
                  <Button
                    onClick={handleEmailOrder}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-semibold transition-colors flex items-center justify-center space-x-2"
                  >
                    <i className="fas fa-envelope"></i>
                    <span>{t('email_order')}</span>
                  </Button>
                  <Button
                    onClick={handleDirectOrder}
                    disabled={isSubmitting}
                    className="w-full bg-gold hover:bg-gold-dark text-white py-3 rounded-full font-semibold transition-colors flex items-center justify-center space-x-2"
                  >
                    <i className="fas fa-shopping-cart"></i>
                    <span>{isSubmitting ? 'Processing...' : t('direct_order')}</span>
                  </Button>
                </div>

                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    Back to Cart
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
