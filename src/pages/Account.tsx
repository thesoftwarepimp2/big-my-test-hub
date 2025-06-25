
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, Building, MapPin, Calendar, Download, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Account: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    businessName: user?.businessName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '123 Business Street, Harare, Zimbabwe',
    city: 'Harare',
    country: 'Zimbabwe'
  });

  const recentOrders = [
    {
      id: 'BGL-001',
      date: '2024-01-15',
      items: 12,
      total: 456.78,
      status: 'delivered'
    },
    {
      id: 'BGL-002',
      date: '2024-01-10',
      items: 8,
      total: 234.56,
      status: 'shipped'
    },
    {
      id: 'BGL-003',
      date: '2024-01-05',
      items: 15,
      total: 789.12,
      status: 'pending'
    }
  ];

  const paymentHistory = [
    {
      id: 'PAY-001',
      date: '2024-01-15',
      amount: 456.78,
      method: 'Bank Transfer',
      status: 'completed'
    },
    {
      id: 'PAY-002',
      date: '2024-01-10',
      amount: 234.56,
      method: 'Mobile Money',
      status: 'completed'
    },
    {
      id: 'PAY-003',
      date: '2024-01-05',
      amount: 789.12,
      method: 'Bank Transfer',
      status: 'pending'
    }
  ];

  const handleSave = () => {
    // In a real app, this would make an API call
    toast({
      title: "Profile updated",
      description: "Your account information has been successfully updated."
    });
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-600">Manage your account information and view order history</p>
        </div>
        <Badge variant="secondary" className="capitalize">
          {user?.role} Account
        </Badge>
      </div>

      {/* Account Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2 text-bgl-blue-600" />
            Account Information
          </CardTitle>
          <Button
            variant={isEditing ? "default" : "outline"}
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Business Name
              </label>
              <div className="flex items-center">
                <Building className="h-4 w-4 text-gray-400 mr-2" />
                {isEditing ? (
                  <Input
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    className="flex-1"
                  />
                ) : (
                  <span className="text-gray-900">{formData.businessName}</span>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Email Address
              </label>
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-gray-400 mr-2" />
                {isEditing ? (
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="flex-1"
                  />
                ) : (
                  <span className="text-gray-900">{formData.email}</span>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Phone Number
              </label>
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-gray-400 mr-2" />
                {isEditing ? (
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="flex-1"
                  />
                ) : (
                  <span className="text-gray-900">{formData.phone}</span>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Address
              </label>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                {isEditing ? (
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="flex-1"
                  />
                ) : (
                  <span className="text-gray-900">{formData.address}</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="bg-bgl-blue-100 p-2 rounded-full">
                    <Calendar className="h-4 w-4 text-bgl-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Order #{order.id}</p>
                    <p className="text-sm text-gray-600">{order.date} • {order.items} items</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${order.total.toFixed(2)}</p>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Invoice
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentHistory.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Calendar className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Payment #{payment.id}</p>
                    <p className="text-sm text-gray-600">{payment.date} • {payment.method}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${payment.amount.toFixed(2)}</p>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Receipt
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Account;
