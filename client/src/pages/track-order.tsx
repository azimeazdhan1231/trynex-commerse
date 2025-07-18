import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Package, Truck, CheckCircle, Clock, MapPin, Phone, Mail } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';
import { ORDER_STATUSES } from '@/lib/constants';
import type { Order } from '@shared/schema';

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [searchTriggered, setSearchTriggered] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();

  const { data: order, isLoading, error } = useQuery<Order>({
    queryKey: ['/api/orders/track', orderId],
    enabled: searchTriggered && orderId.length > 0,
    retry: false,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) {
      toast({
        title: "Order ID Required",
        description: "Please enter your order ID to track your order.",
        variant: "destructive",
      });
      return;
    }
    setSearchTriggered(true);
  };

  const getStatusColor = (status: string) => {
    const statusConfig = ORDER_STATUSES.find(s => s.value === status);
    return statusConfig?.color || 'gray';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'confirmed':
        return <CheckCircle className="w-5 h-5" />;
      case 'processing':
        return <Package className="w-5 h-5" />;
      case 'shipped':
        return <Truck className="w-5 h-5" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getProgressPercentage = (status: string) => {
    const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(status);
    return ((currentIndex + 1) / statusOrder.length) * 100;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gold/10 to-gold/5 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('track_your_order')}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Enter your order ID to track your order status and delivery information
            </p>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    placeholder="Enter your order ID (e.g., TXR-20250718-001)"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="pl-12 pr-4 py-4 text-lg border-2 border-gold/20 rounded-full focus:border-gold"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="bg-gold hover:bg-gold-dark text-white px-8 py-4 rounded-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Searching...' : 'Track Order'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {error && (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-red-500 text-6xl mb-4">
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">Order Not Found</h3>
                <p className="text-gray-600 mb-4">
                  We couldn't find an order with the ID "{orderId}". Please check your order ID and try again.
                </p>
                <Button onClick={() => {setOrderId(''); setSearchTriggered(false);}}>
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {order && (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Order Header */}
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle className="text-2xl font-bold">Order #{order.orderId}</CardTitle>
                    <p className="text-gray-600">
                      Placed on {formatDate(order.createdAt || '')}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`px-4 py-2 text-sm font-semibold ${
                      getStatusColor(order.status) === 'green' ? 'border-green-500 text-green-700 bg-green-50' :
                      getStatusColor(order.status) === 'blue' ? 'border-blue-500 text-blue-700 bg-blue-50' :
                      getStatusColor(order.status) === 'orange' ? 'border-orange-500 text-orange-700 bg-orange-50' :
                      getStatusColor(order.status) === 'purple' ? 'border-purple-500 text-purple-700 bg-purple-50' :
                      getStatusColor(order.status) === 'red' ? 'border-red-500 text-red-700 bg-red-50' :
                      'border-gray-500 text-gray-700 bg-gray-50'
                    }`}
                  >
                    {ORDER_STATUSES.find(s => s.value === order.status)?.label || order.status}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Order Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Order Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Progress Bar */}
                  <div className="absolute top-8 left-0 right-0 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-gold rounded-full transition-all duration-500"
                      style={{ width: `${getProgressPercentage(order.status)}%` }}
                    />
                  </div>
                  
                  {/* Status Steps */}
                  <div className="relative flex justify-between">
                    {ORDER_STATUSES.filter(s => s.value !== 'cancelled').map((status, index) => {
                      const isCompleted = ORDER_STATUSES.findIndex(s => s.value === order.status) >= index;
                      const isCurrent = order.status === status.value;
                      
                      return (
                        <div key={status.value} className="flex flex-col items-center">
                          <div
                            className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${
                              isCurrent 
                                ? 'bg-gold text-white animate-pulse' 
                                : isCompleted 
                                  ? 'bg-green-500 text-white' 
                                  : 'bg-gray-200 text-gray-500'
                            }`}
                          >
                            {getStatusIcon(status.value)}
                          </div>
                          <span className={`text-sm font-medium text-center ${
                            isCurrent ? 'text-gold' : isCompleted ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            {status.label}
                          </span>
                          {isCurrent && (
                            <span className="text-xs text-gray-500 mt-1">
                              {formatDate(order.updatedAt || order.createdAt || '')}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Order Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <span className="font-semibold">৳{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>৳{order.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span>৳{order.deliveryFee}</span>
                    </div>
                    {parseFloat(order.discount) > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount:</span>
                        <span>-৳{order.discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total:</span>
                      <span className="text-gold">৳{order.total}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer & Delivery Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer & Delivery Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
                        <i className="fas fa-user text-gold"></i>
                      </div>
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-sm text-gray-600">Customer</p>
                      </div>
                    </div>
                    
                    {order.customerPhone && (
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
                          <Phone className="w-4 h-4 text-gold" />
                        </div>
                        <div>
                          <p className="font-medium">{order.customerPhone}</p>
                          <p className="text-sm text-gray-600">Phone</p>
                        </div>
                      </div>
                    )}
                    
                    {order.customerEmail && (
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
                          <Mail className="w-4 h-4 text-gold" />
                        </div>
                        <div>
                          <p className="font-medium">{order.customerEmail}</p>
                          <p className="text-sm text-gray-600">Email</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-gold" />
                      </div>
                      <div>
                        <p className="font-medium">{order.deliveryLocation}</p>
                        <p className="text-sm text-gray-600">Delivery Location</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
                        <i className="fas fa-credit-card text-gold"></i>
                      </div>
                      <div>
                        <p className="font-medium">{order.paymentMethod}</p>
                        <p className="text-sm text-gray-600">Payment Method</p>
                      </div>
                    </div>
                  </div>
                  
                  {order.specialInstructions && (
                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="font-medium mb-2">Special Instructions</h4>
                      <p className="text-sm text-gray-600">{order.specialInstructions}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contact Support */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
                  <p className="text-gray-600 mb-4">
                    If you have any questions about your order, feel free to contact our support team.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="outline" asChild>
                      <a href="https://wa.me/01747292277" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-whatsapp mr-2"></i>
                        WhatsApp Support
                      </a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="mailto:support@trynex.com">
                        <Mail className="w-4 h-4 mr-2" />
                        Email Support
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!order && !error && searchTriggered && !isLoading && (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-gray-400 text-6xl mb-4">
                  <i className="fas fa-search"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">Enter Order ID</h3>
                <p className="text-gray-600">
                  Please enter your order ID above to track your order status
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}
