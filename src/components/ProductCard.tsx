
import React, { useState } from 'react';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Package } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  const selectedSizeData = product.sizes.find(s => s.size === selectedSize);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedSizeData) {
      toast({
        title: "Please select a size",
        variant: "destructive"
      });
      return;
    }

    addItem({
      productId: product.id,
      productName: product.name,
      size: selectedSize,
      quantity: quantity,
      unitPrice: selectedSizeData.usdPrice
    });

    toast({
      title: "Added to cart",
      description: `${product.name} (${selectedSize}) x${quantity}`
    });

    // Reset form
    setSelectedSize('');
    setQuantity(1);
  };

  return (
    <Card className="h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="aspect-square bg-white rounded-lg flex items-center justify-center mb-4 overflow-hidden">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-contain rounded-lg"
            />
          ) : (
            <Package className="h-16 w-16 text-bgl-blue-600" />
          )}
        </div>
        <CardTitle className="text-lg font-semibold text-gray-900 leading-tight">
          {product.name}
        </CardTitle>
        <p className="text-sm text-gray-500 capitalize">{product.category}</p>
      </CardHeader>
      
      <CardContent className="flex-1">
        {!product.inStock && (
          <div className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full mb-3 inline-block">
            Out of Stock
          </div>
        )}
        
        {product.inStock && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Select Size:
              </label>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose size..." />
                </SelectTrigger>
                <SelectContent>
                  {product.sizes.map((size) => (
                    <SelectItem key={size.size} value={size.size}>
                      {size.size} - ${size.usdPrice.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedSizeData && (
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Price (USD):</span>
                  <span className="font-semibold text-bgl-blue-700">
                    ${selectedSizeData.usdPrice.toFixed(2)}
                  </span>
                </div>
                {selectedSizeData.zigPrice > 0 && (
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-gray-600">Price (ZIG):</span>
                    <span className="text-sm text-gray-500">
                      ZIG {selectedSizeData.zigPrice.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Quantity:
              </label>
              <select 
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                {[...Array(20)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button 
          onClick={handleAddToCart}
          disabled={!product.inStock || !selectedSize}
          className="w-full bg-bgl-yellow-400 hover:bg-bgl-yellow-500 text-gray-900 font-semibold"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
