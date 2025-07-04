
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Users, MessageCircle, FileText, CheckCircle, Clock, DollarSign, Search, Eye, Send, Package } from 'lucide-react';
import AdminProductManager from '@/components/AdminProductManager';
import ChatDialog from '@/components/ChatDialog';
import { ordersService } from '@/services/orders';
import { useQuery } from '@tanstack/react-query';

const AdminPanel: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedChatUser, setSelectedChatUser] = useState<{ email: string; name: string } | null>(null);

  // Fetch real orders
  const { data: orders = [], refetch: refetchOrders } = useQuery({
    queryKey: ['orders'],
    queryFn: ordersService.getOrders,
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Get registered users from localStorage (demo users who have logged in)
  const getRegisteredUsers = () => {
    const users = [];
    const storedUsers = localStorage.getItem('bgl_registered_users');
    if (storedUsers) {
      return JSON.parse(storedUsers);
    }
    
    // Demo registered users
    return [
      {
        id: '1',
        businessName: 'Metro Wholesale Distributors',
        email: 'demo@metrowholesale.com',
        role: 'wholesaler',
        status: 'active',
        joinDate: '2024-01-10',
        totalOrders: orders.filter(o => o.clientEmail === 'demo@metrowholesale.com').length,
        totalSpent: orders.filter(o => o.clientEmail === 'demo@metrowholesale.com').reduce((sum, o) => sum + o.total, 0)
      },
      {
        id: '2',
        businessName: 'Corner Store Plus',
        email: 'demo@cornerstoreplus.com',
        role: 'retailer',
        status: 'active',
        joinDate: '2024-01-05',
        totalOrders: orders.filter(o => o.clientEmail === 'demo@cornerstoreplus.com').length,
        totalSpent: orders.filter(o => o.clientEmail === 'demo@cornerstoreplus.com').reduce((sum, o) => sum + o.total, 0)
      }
    ];
  };

  const registeredUsers = getRegisteredUsers();

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

  const handleProcessOrder = async (orderId: string) => {
    try {
      await ordersService.updateOrderStatus(orderId, 'processing');
      refetchOrders();
    } catch (error) {
      console.error('Error processing order:', error);
    }
  };

  const handleSendBill = (orderId: string) => {
    console.log('Sending bill for order:', orderId);
    // Implementation for sending bill
  };

  const handleStartChat = (userEmail: string, userName: string) => {
    setSelectedChatUser({ email: userEmail, name: userName });
    setChatOpen(true);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">Manage orders, users, products, and communications</p>
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
        <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-lg h-auto">
          <TabsTrigger value="orders" className="bg-blue-500 text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white py-3 px-4 text-sm font-medium transition-all rounded-sm">
            Orders
          </TabsTrigger>
          <TabsTrigger value="products" className="bg-orange-500 text-white data-[state=active]:bg-orange-600 data-[state=active]:text-white py-3 px-4 text-sm font-medium transition-all rounded-sm">
            Products
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
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No orders yet. Orders will appear here when customers submit them.</p>
                  </div>
                ) : (
                  orders.map(order => (
                    <Card key={order.id} className="border-l-4 border-l-bgl-blue-600">
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
                            {order.items.map((item, index) => (
                              <div key={index} className="text-sm text-gray-600 flex flex-col sm:flex-row sm:justify-between">
                                <span className="break-words">{item.name} x{item.quantity}</span>
                                <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
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
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Product Management Tab */}
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <AdminProductManager />
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
                {registeredUsers.map(user => (
                  <Card key={user.id} className="border-l-4 border-l-green-500">
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
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleStartChat(user.email, user.businessName)}
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Chat
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
                  {registeredUsers.filter(u => u.status === 'active').map(user => (
                    <Card key={user.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
                          <div className="flex-1">
                            <h4 className="font-medium break-words">{user.businessName}</h4>
                            <p className="text-sm text-gray-500 break-all">{user.email}</p>
                            <Badge className="mt-1" variant="outline">
                              {user.role}
                            </Badge>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => handleStartChat(user.email, user.businessName)} 
                            className="bg-bgl-blue-600 hover:bg-bgl-blue-700 text-white w-full sm:w-auto"
                          >
                            <Send className="h-4 w-4 mr-1" />
                            Start Chat
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Chat Dialog */}
      <ChatDialog
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        recipientEmail={selectedChatUser?.email || ''}
        recipientName={selectedChatUser?.name || ''}
      />
    </div>
  );
};

export default AdminPanel;
