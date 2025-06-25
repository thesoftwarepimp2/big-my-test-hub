
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Edit3, 
  Save, 
  X,
  ShoppingBag,
  Receipt,
  Download
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Account: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    businessName: user?.businessName || '',
    email: user?.email || '',
    phone: '+263 77 123 4567',
    address: '123 Commerce Street, Harare, Zimbabwe',
    taxNumber: 'TAX123456789'
  });

  // Mock data for recent orders (only for non-admin users)
  const recentOrders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      items: 5,
      total: 157.50,
      status: 'delivered'
    },
    {
      id: 'ORD-002',
      date: '2024-01-12',
      items: 3,
      total: 89.25,
      status: 'processing'
    },
    {
      id: 'ORD-003',
      date: '2024-01-10',
      items: 8,
      total: 234.75,
      status: 'delivered'
    }
  ];

  // Mock data for payment history (only for non-admin users)
  const paymentHistory = [
    {
      id: 'PAY-001',
      date: '2024-01-15',
      amount: 157.50,
      method: 'Bank Transfer',
      status: 'completed',
      reference: 'BT123456'
    },
    {
      id: 'PAY-002',
      date: '2024-01-10',
      amount: 234.75,
      method: 'Mobile Money',
      status: 'completed',
      reference: 'MM789012'
    }
  ];

  const handleSave = () => {
    // Implementation for saving profile changes
    toast({
      title: "Profile updated",
      description: "Your account information has been successfully updated."
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      businessName: user?.businessName || '',
      email: user?.email || '',
      phone: '+263 77 123 4567',
      address: '123 Commerce Street, Harare, Zimbabwe',
      taxNumber: 'TAX123456789'
    });
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Profile Information
          </CardTitle>
          {!isEditing ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCancel}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button 
                size="sm"
                onClick={handleSave}
                className="bg-bgl-blue-600 hover:bg-bgl-blue-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Building2 className="h-4 w-4 mr-1" />
                Business Name
              </label>
              {isEditing ? (
                <Input
                  value={formData.businessName}
                  onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                />
              ) : (
                <p className="text-gray-900">{formData.businessName}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                Email Address
              </label>
              {isEditing ? (
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              ) : (
                <p className="text-gray-900">{formData.email}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                Phone Number
              </label>
              {isEditing ? (
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              ) : (
                <p className="text-gray-900">{formData.phone}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Receipt className="h-4 w-4 mr-1" />
                Tax Number
              </label>
              {isEditing ? (
                <Input
                  value={formData.taxNumber}
                  onChange={(e) => setFormData({...formData, taxNumber: e.target.value})}
                />
              ) : (
                <p className="text-gray-900">{formData.taxNumber}</p>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              Business Address
            </label>
            {isEditing ? (
              <Input
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            ) : (
              <p className="text-gray-900">{formData.address}</p>
            )}
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Account Role</p>
                <Badge className="mt-1 bg-bgl-blue-100 text-bgl-blue-800">
                  {user?.role?.toUpperCase()}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">Account Status</p>
                <Badge className="mt-1 bg-green-100 text-green-800">
                  ACTIVE
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders - Only show for non-admin users */}
      {user?.role !== 'admin' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.date} • {order.items} items</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <p className="font-semibold">${order.total.toFixed(2)}</p>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.toUpperCase()}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      Reorder
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment History - Only show for non-admin users */}
      {user?.role !== 'admin' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Receipt className="h-5 w-5 mr-2" />
              Payment History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {paymentHistory.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{payment.id}</p>
                    <p className="text-sm text-gray-600">
                      {payment.date} • {payment.method} • Ref: {payment.reference}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <p className="font-semibold">${payment.amount.toFixed(2)}</p>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status.toUpperCase()}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Invoice
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Account;
