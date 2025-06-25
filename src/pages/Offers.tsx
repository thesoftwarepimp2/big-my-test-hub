
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Clock, Tag, TrendingUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Offers: React.FC = () => {
  const { addItem } = useCart();

  const specialOffers = [
    {
      id: 'offer-1',
      productId: '1',
      productName: 'MEGA ROLLER 10KG',
      originalPrice: 18.50,
      discountPrice: 15.99,
      discountPercent: 14,
      expiryDate: '2024-02-15',
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop',
      description: 'Premium quality flour perfect for baking',
      stockLevel: 'Limited Stock',
      category: 'Flour'
    },
    {
      id: 'offer-2',
      productId: '3',
      productName: 'DELTA COOKING OIL 2L',
      originalPrice: 12.50,
      discountPrice: 9.99,
      discountPercent: 20,
      expiryDate: '2024-02-10',
      image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=300&fit=crop',
      description: 'Pure cooking oil for all your cooking needs',
      stockLevel: 'In Stock',
      category: 'Cooking Oil'
    },
    {
      id: 'offer-3',
      productId: '5',
      productName: 'MEGA SUGAR BEANS 2KG',
      originalPrice: 8.75,
      discountPrice: 6.99,
      discountPercent: 20,
      expiryDate: '2024-02-20',
      image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=300&fit=crop',
      description: 'High quality sugar beans rich in protein',
      stockLevel: 'In Stock',
      category: 'Beans'
    },
    {
      id: 'offer-4',
      productId: '7',
      productName: 'LUCKY STAR MACKEREL',
      originalPrice: 3.25,
      discountPrice: 2.49,
      discountPercent: 23,
      expiryDate: '2024-02-12',
      image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=300&fit=crop',
      description: 'Fresh canned mackerel in tomato sauce',
      stockLevel: 'In Stock',
      category: 'Canned Fish'
    },
    {
      id: 'offer-5',
      productId: '9',
      productName: 'CAPRI RICE 10KG',
      originalPrice: 22.00,
      discountPrice: 18.99,
      discountPercent: 14,
      expiryDate: '2024-02-25',
      image: 'https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=400&h=300&fit=crop',
      description: 'Premium long grain rice',
      stockLevel: 'Limited Stock',
      category: 'Rice'
    },
    {
      id: 'offer-6',
      productId: '11',
      productName: 'MEGA NOODLES 500G',
      originalPrice: 4.50,
      discountPrice: 3.25,
      discountPercent: 28,
      expiryDate: '2024-02-08',
      image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=300&fit=crop',
      description: 'Instant noodles - chicken flavor',
      stockLevel: 'In Stock',
      category: 'Noodles'
    }
  ];

  const featuredDeals = [
    {
      title: 'Flash Sale',
      description: 'Up to 30% off selected items',
      endTime: '2024-01-20 23:59',
      bgColor: 'bg-red-500'
    },
    {
      title: 'Bulk Order Discount',
      description: '15% off orders over $500',
      endTime: '2024-01-31 23:59',
      bgColor: 'bg-green-500'
    },
    {
      title: 'New Customer Special',
      description: '20% off your first order',
      endTime: '2024-02-29 23:59',
      bgColor: 'bg-blue-500'
    }
  ];

  const handleAddToCart = (offer: typeof specialOffers[0]) => {
    addItem({
      productId: offer.productId,
      productName: offer.productName,
      size: '1 Unit',
      quantity: 1,
      unitPrice: offer.discountPrice
    });

    toast({
      title: "Added to cart",
      description: `${offer.productName} added with special offer price!`
    });
  };

  const calculateTimeLeft = (expiryDate: string) => {
    const difference = +new Date(expiryDate) - +new Date();
    let timeLeft: { [key: string]: number } = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60)
      };
    }

    return timeLeft;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Special Offers</h1>
        <p className="text-gray-600">Don't miss out on these amazing deals!</p>
      </div>

      {/* Featured Deals Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {featuredDeals.map((deal, index) => (
          <Card key={index} className={`${deal.bgColor} text-white`}>
            <CardContent className="p-4 text-center">
              <h3 className="font-bold text-lg mb-1">{deal.title}</h3>
              <p className="text-sm opacity-90">{deal.description}</p>
              <div className="flex items-center justify-center mt-2 text-xs">
                <Clock className="h-3 w-3 mr-1" />
                Ends: {new Date(deal.endTime).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Special Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {specialOffers.map((offer) => {
          const timeLeft = calculateTimeLeft(offer.expiryDate);
          const hasTimeLeft = Object.keys(timeLeft).length > 0;

          return (
            <Card key={offer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={offer.image}
                  alt={offer.productName}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2">
                  <Badge className="bg-red-500 text-white">
                    -{offer.discountPercent}%
                  </Badge>
                </div>
                <div className="absolute top-2 right-2">
                  <Badge variant={offer.stockLevel === 'Limited Stock' ? 'destructive' : 'default'}>
                    {offer.stockLevel}
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold leading-tight">
                      {offer.productName}
                    </CardTitle>
                    <p className="text-sm text-gray-500">{offer.category}</p>
                  </div>
                  <Tag className="h-5 w-5 text-orange-500" />
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{offer.description}</p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-green-600">
                      ${offer.discountPrice.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500 line-through ml-2">
                      ${offer.originalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-sm text-green-600 font-semibold">
                    Save ${(offer.originalPrice - offer.discountPrice).toFixed(2)}
                  </div>
                </div>

                {hasTimeLeft && (
                  <div className="bg-orange-50 rounded-lg p-3">
                    <div className="flex items-center text-orange-600 mb-1">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">Offer ends in:</span>
                    </div>
                    <div className="text-sm font-bold text-orange-700">
                      {timeLeft.days > 0 && `${timeLeft.days}d `}
                      {timeLeft.hours > 0 && `${timeLeft.hours}h `}
                      {timeLeft.minutes > 0 && `${timeLeft.minutes}m`}
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => handleAddToCart(offer)}
                  className="w-full bg-bgl-yellow-400 hover:bg-bgl-yellow-500 text-gray-900 font-semibold"
                  disabled={offer.stockLevel === 'Out of Stock'}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart - Special Price
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Newsletter Signup */}
      <Card className="bg-gradient-to-r from-bgl-blue-600 to-bgl-blue-700 text-white">
        <CardContent className="p-6 text-center">
          <TrendingUp className="h-12 w-12 mx-auto mb-4 text-bgl-yellow-400" />
          <h3 className="text-xl font-bold mb-2">Never Miss a Deal!</h3>
          <p className="mb-4 text-blue-100">
            Subscribe to get notified about our latest special offers and discounts.
          </p>
          <div className="flex max-w-md mx-auto space-x-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg text-gray-900"
            />
            <Button className="bg-bgl-yellow-400 hover:bg-bgl-yellow-500 text-gray-900 font-semibold">
              Subscribe
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Offers;
