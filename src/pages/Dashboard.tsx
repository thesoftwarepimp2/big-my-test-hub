
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, DollarSign, Package, AlertTriangle, TrendingUp } from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { totalItems, totalAmount } = useCart();

  const dashboardStats = [
    {
      title: "Cart Items",
      value: totalItems,
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Cart Total",
      value: `$${totalAmount.toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Available Products",
      value: "150+",
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Special Offers",
      value: "12",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  const recentActivity = [
    { action: "Added MEGA ROLLER 5KG to cart", time: "2 minutes ago", type: "cart" },
    { action: "Viewed Special Offers", time: "15 minutes ago", type: "view" },
    { action: "Updated account information", time: "1 hour ago", type: "account" },
    { action: "Completed payment for Order #BGL-001", time: "Yesterday", type: "payment" }
  ];

  const stockAlerts = [
    { product: "MEGA ROLLER 10KG", status: "Low Stock", severity: "warning" },
    { product: "MEGA SUGAR BEANS", status: "Out of Stock", severity: "error" },
    { product: "DELTA COOKING OIL", status: "New Arrival", severity: "info" }
  ];

  const quickActions = [
    {
      title: "Browse Products",
      icon: Package,
      page: "products",
      color: "bgl-blue-400",
      hoverColor: "blue-50"
    },
    {
      title: "Make Payment",
      icon: DollarSign,
      page: "payments",
      color: "green-400",
      hoverColor: "green-50"
    },
    {
      title: "View Offers",
      icon: TrendingUp,
      page: "offers",
      color: "purple-400",
      hoverColor: "purple-50"
    },
    {
      title: "Order Now",
      icon: ShoppingCart,
      page: "products",
      color: "orange-400",
      hoverColor: "orange-50"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-bgl-blue-600 to-bgl-blue-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.businessName}!
        </h1>
        <p className="text-blue-100">
          Manage your orders and track your business performance
        </p>
        <Badge variant="secondary" className="mt-2 capitalize">
          {user?.role} Account
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-full`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity & Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-bgl-blue-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'cart' ? 'bg-blue-500' :
                    activity.type === 'payment' ? 'bg-green-500' :
                    activity.type === 'account' ? 'bg-purple-500' : 'bg-gray-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stock Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
              Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stockAlerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium text-gray-900">{alert.product}</p>
                    <p className="text-sm text-gray-600">{alert.status}</p>
                  </div>
                  <Badge 
                    variant={
                      alert.severity === 'error' ? 'destructive' :
                      alert.severity === 'warning' ? 'secondary' : 'default'
                    }
                  >
                    {alert.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button 
                key={index}
                onClick={() => onNavigate(action.page)}
                className={`p-4 text-center rounded-lg border-2 border-dashed border-gray-300 hover:border-${action.color} hover:bg-${action.hoverColor} transition-colors group`}
              >
                <action.icon className="h-8 w-8 mx-auto mb-2 text-gray-400 group-hover:text-gray-600" />
                <p className="text-sm font-medium">{action.title}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
