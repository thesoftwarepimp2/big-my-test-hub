import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Users, MessageCircle, FileText, CheckCircle, Clock, DollarSign, Search, Eye, Send } from 'lucide-react';
const AdminPanel: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for orders
  const orders = [{
    id: 'ORD-001',
    clientName: 'ABC Retailers',
    clientEmail: 'orders@abcretailers.com',
    items: [{
      name: 'MEGA ROLLER FLOUR 10KG',
      quantity: 5,
      price: 18.50
    }, {
      name: 'BUTTERCUP MARGARINE',
      quantity: 10,
      price: 6.50
    }],
    total: 157.50,
    status: 'pending',
    date: '2024-01-15',
    paymentStatus: 'unpaid'
  }, {
    id: 'ORD-002',
    clientName: 'XYZ Wholesale',
    clientEmail: 'admin@xyzwholesale.com',
    items: [{
      name: 'POTATOES 10KG',
      quantity: 20,
      price: 6.75
    }, {
      name: 'KOO BAKED BEANS 410G',
      quantity: 50,
      price: 2.85
    }],
    total: 277.50,
    status: 'processing',
    date: '2024-01-14',
    paymentStatus: 'paid'
  }, {
    id: 'ORD-003',
    clientName: 'Quick Mart Ltd',
    clientEmail: 'procurement@quickmart.com',
    items: [{
      name: 'CHIMOMBE FULL CREAM MILK 1L',
      quantity: 100,
      price: 4.25
    }],
    total: 425.00,
    status: 'delivered',
    date: '2024-01-13',
    paymentStatus: 'paid'
  }];

  // Mock data for registered users
  const registeredUsers = [{
    id: '1',
    businessName: 'ABC Retailers',
    email: 'orders@abcretailers.com',
    role: 'retailer',
    status: 'active',
    joinDate: '2024-01-10',
    totalOrders: 15,
    totalSpent: 2500.75
  }, {
    id: '2',
    businessName: 'XYZ Wholesale',
    email: 'admin@xyzwholesale.com',
    role: 'wholesaler',
    status: 'active',
    joinDate: '2024-01-05',
    totalOrders: 28,
    totalSpent: 8750.25
  }, {
    id: '3',
    businessName: 'Quick Mart Ltd',
    email: 'procurement@quickmart.com',
    role: 'retailer',
    status: 'pending',
    joinDate: '2024-01-12',
    totalOrders: 3,
    totalSpent: 675.50
  }];
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'unpaid':
        return 'bg-red-100 text-red-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const handleProcessOrder = (orderId: string) => {
    console.log('Processing order:', orderId);
    // Implementation for processing order
  };
  const handleSendBill = (orderId: string) => {
    console.log('Sending bill for order:', orderId);
    // Implementation for sending bill
  };
  const handleStartChat = (userEmail: string) => {
    console.log('Starting chat with:', userEmail);
    // Implementation for starting chat
  };
  return <div className="space-y-6 pb-20 md:pb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">Manage orders, users, and communications</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-bgl-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {registeredUsers.filter(u => u.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-bgl-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg h-auto">
          <TabsTrigger value="orders" className="bg-blue-500 text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white py-3 px-4 text-sm font-medium transition-all rounded-sm">
            Orders
          </TabsTrigger>
          <TabsTrigger value="users" className="bg-green-500 text-white data-[state=active]:bg-green-600 data-[state=active]:text-white py-3 px-4 text-sm font-medium transition-all rounded-sm">
            Users
          </TabsTrigger>
          <TabsTrigger value="communications" className="bg-purple-500 text-white data-[state=active]:bg-purple-600 data-[state=active]:text-white py-3 px-4 text-sm font-medium transition-all rounded-sm">Chat</TabsTrigger>
        </TabsList>

        {/* Orders Management Tab */}
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Orders Management</CardTitle>
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input placeholder="Search orders..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="max-w-sm" />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {orders.map(order => <Card key={order.id} className="border-l-4 border-l-bgl-blue-600">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 space-y-2 sm:space-y-0">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{order.id}</h3>
                          <p className="text-sm text-gray-600">{order.clientName}</p>
                          <p className="text-xs text-gray-500 break-all">{order.clientEmail}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-lg font-bold text-bgl-blue-700">${order.total.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">{order.date}</p>
                        </div>
                      </div>

                      <div className="mb-3">
                        <h4 className="text-sm font-medium mb-2">Items:</h4>
                        <div className="space-y-1">
                          {order.items.map((item, index) => <div key={index} className="text-sm text-gray-600 flex flex-col sm:flex-row sm:justify-between">
                              <span className="break-words">{item.name} x{item.quantity}</span>
                              <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>)}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
                        <div className="flex flex-wrap gap-2">
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.toUpperCase()}
                          </Badge>
                          <Badge className={getStatusColor(order.paymentStatus)}>
                            {order.paymentStatus.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleProcessOrder(order.id)}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Process
                          </Button>
                          <Button size="sm" className="bg-bgl-yellow-400 hover:bg-bgl-yellow-500 text-gray-900" onClick={() => handleSendBill(order.id)}>
                            <FileText className="h-4 w-4 mr-1" />
                            Send Bill
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>)}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Management Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Registered Users</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {registeredUsers.map(user => <Card key={user.id} className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-3 sm:space-y-0">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg break-words">{user.businessName}</h3>
                          <p className="text-sm text-gray-600 break-all">{user.email}</p>
                          <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-500">
                            <span>Role: {user.role}</span>
                            <span>•</span>
                            <span>Joined: {user.joinDate}</span>
                            <span>•</span>
                            <span>Orders: {user.totalOrders}</span>
                            <span>•</span>
                            <span>Spent: ${user.totalSpent.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                          <Badge className={getStatusColor(user.status)}>
                            {user.status.toUpperCase()}
                          </Badge>
                          <Button size="sm" variant="outline" onClick={() => handleStartChat(user.email)}>
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Chat
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>)}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Communications Tab */}
        <TabsContent value="communications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Start New Conversation</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {registeredUsers.filter(u => u.status === 'active').map(user => <Card key={user.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
                          <div className="flex-1">
                            <h4 className="font-medium break-words">{user.businessName}</h4>
                            <p className="text-sm text-gray-500 break-all">{user.email}</p>
                            <Badge className="mt-1" variant="outline">
                              {user.role}
                            </Badge>
                          </div>
                          <Button size="sm" onClick={() => handleStartChat(user.email)} className="bg-bgl-blue-600 hover:bg-bgl-blue-700 text-white w-full sm:w-auto">
                            <Send className="h-4 w-4 mr-1" />
                            Start Chat
                          </Button>
                        </div>
                      </CardContent>
                    </Card>)}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>;
};
export default AdminPanel;