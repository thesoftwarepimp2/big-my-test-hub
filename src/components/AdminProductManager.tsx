
import React, { useState } from 'react';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useProducts';
import { Product } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Package, Save, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AdminProductManager: React.FC = () => {
  const { data: products = [], isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: '',
    description: '',
    image: '',
    sizes: [{ size: '', usdPrice: 0, zigPrice: 0 }],
    inStock: true
  });

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      description: '',
      image: '',
      sizes: [{ size: '', usdPrice: 0, zigPrice: 0 }],
      inStock: true
    });
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({ id: editingProduct.id, product: formData });
      } else {
        await createProduct.mutateAsync(formData as Omit<Product, 'id'>);
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const addSize = () => {
    setFormData(prev => ({
      ...prev,
      sizes: [...(prev.sizes || []), { size: '', usdPrice: 0, zigPrice: 0 }]
    }));
  };

  const removeSize = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes?.filter((_, i) => i !== index) || []
    }));
  };

  const updateSize = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes?.map((size, i) => 
        i === index ? { ...size, [field]: value } : size
      ) || []
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bgl-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="Enter category"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={formData.image || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="Enter image URL"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="inStock"
                  checked={formData.inStock || false}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, inStock: checked }))}
                />
                <Label htmlFor="inStock">In Stock</Label>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Sizes & Pricing</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addSize}>
                    <Plus className="h-3 w-3 mr-1" />
                    Add Size
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {formData.sizes?.map((size, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 border rounded">
                      <Input
                        placeholder="Size (e.g., 1KG)"
                        value={size.size}
                        onChange={(e) => updateSize(index, 'size', e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        placeholder="USD Price"
                        value={size.usdPrice}
                        onChange={(e) => updateSize(index, 'usdPrice', parseFloat(e.target.value) || 0)}
                        className="w-24"
                      />
                      <Input
                        type="number"
                        placeholder="ZIG Price"
                        value={size.zigPrice}
                        onChange={(e) => updateSize(index, 'zigPrice', parseFloat(e.target.value) || 0)}
                        className="w-24"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSize(index)}
                        className="text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={createProduct.isPending || updateProduct.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  {editingProduct ? 'Update' : 'Create'} Product
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="relative">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
              <Badge className={product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </Badge>
            </CardHeader>
            
            <CardContent>
              <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <Package className="h-12 w-12 text-gray-400" />
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-2 capitalize">{product.category}</p>
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.description}</p>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">Sizes & Prices:</p>
                {product.sizes.map((size, index) => (
                  <div key={index} className="text-xs text-gray-600 flex justify-between">
                    <span>{size.size}</span>
                    <span>${size.usdPrice.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminProductManager;
