
import React, { useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { useWordPressProducts } from '@/hooks/useWordPress';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Search, Filter, Minus, Plus, Trash2, Package } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { toast } from '@/hooks/use-toast';

const Products: React.FC = () => {
  const { items, updateQuantity, removeItem, totalItems, totalAmount, submitOrder, isLoading: cartLoading } = useCart();
  const { data: products = [], isLoading, error } = useWordPressProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Products');

  // Get unique categories from WordPress products
  const categories = ['All Products', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Products' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="space-y-6 pb-20 md:pb-6">
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bgl-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products from WordPress...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 pb-20 md:pb-6">
        <div className="text-center py-12">
          <div className="text-red-400 mb-4">
            <Package className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load products</h3>
          <p className="text-gray-600">
            Could not connect to WordPress backend. Please check your connection.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products & Orders</h1>
          <p className="text-gray-600">Browse our extensive catalog and manage your orders</p>
        </div>
        
        {/* Cart Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button className="relative bg-bgl-yellow-400 hover:bg-bgl-yellow-500 text-gray-900">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-lg overflow-hidden flex flex-col">
            <SheetHeader className="flex-shrink-0">
              <SheetTitle>Shopping Cart ({totalItems} items)</SheetTitle>
            </SheetHeader>
            
            <div className="flex-1 overflow-y-auto">
              <div className="mt-6 space-y-4">
                {items.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Your cart is empty</p>
                  </div>
                ) : (
                  <>
                    {items.map((item) => (
                      <Card key={`${item.productId}-${item.size}`} className="p-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm">{item.productName}</h4>
                              <p className="text-xs text-gray-500">Size: {item.size}</p>
                              <p className="text-sm font-medium text-bgl-blue-600">
                                ${item.unitPrice.toFixed(2)} each
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.productId, item.size)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                                className="h-8 w-8 p-0"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="font-semibold">${item.totalPrice.toFixed(2)}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </>
                )}
              </div>
            </div>
            
            {items.length > 0 && (
              <div className="flex-shrink-0 border-t pt-4 space-y-4 mt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                
                <Button 
                  onClick={submitOrder}
                  disabled={cartLoading}
                  className="w-full bg-bgl-blue-600 hover:bg-bgl-blue-700 text-white py-3"
                >
                  {cartLoading ? 'Submitting...' : 'Submit Order'}
                </Button>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing {filteredProducts.length} of {products.length} products from WordPress
          {selectedCategory !== 'All Products' && ` in "${selectedCategory}"`}
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">
            Try adjusting your search terms or category filter
          </p>
        </div>
      )}
    </div>
  );
};

export default Products;
