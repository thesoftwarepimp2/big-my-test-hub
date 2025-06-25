
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  CreditCard, 
  DollarSign, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Upload,
  Download,
  Eye
} from 'lucide-react';

const Payments: React.FC = () => {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [paymentNote, setPaymentNote] = useState('');

  const outstandingPayments = [
    {
      id: 'BGL-001',
      amount: 2450.50,
      dueDate: '2024-01-15',
      description: 'Order #BGL-001 - Mega Roller Flour & Rice',
      status: 'overdue'
    },
    {
      id: 'BGL-003',
      amount: 1875.00,
      dueDate: '2024-01-25',
      description: 'Order #BGL-003 - Cooking Oil & Sugar Beans',
      status: 'due'
    }
  ];

  const paymentHistory = [
    {
      id: 'PAY-001',
      amount: 3200.00,
      date: '2024-01-10',
      method: 'Bank Transfer',
      status: 'completed',
      reference: 'REF-001234',
      orderId: 'BGL-002'
    },
    {
      id: 'PAY-002',
      amount: 1500.75,
      date: '2024-01-05',
      method: 'EcoCash',
      status: 'completed',
      reference: 'ECO-987654',
      orderId: 'BGL-001'
    },
    {
      id: 'PAY-003',
      amount: 850.00,
      date: '2023-12-28',
      method: 'Bank Transfer',
      status: 'pending',
      reference: 'REF-556677',
      orderId: 'BGL-004'
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleNotifyPayment = () => {
    // Handle payment notification
    console.log('Payment notification sent', { file: selectedFile, note: paymentNote });
    setSelectedFile(null);
    setPaymentNote('');
  };

  const totalOutstanding = outstandingPayments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
        <div className="text-right">
          <p className="text-sm text-gray-600">Outstanding Balance</p>
          <p className="text-2xl font-bold text-red-600">${totalOutstanding.toFixed(2)}</p>
        </div>
      </div>

      {/* Outstanding Payments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertCircle className="h-5 w-5 mr-2" />
            Outstanding Payments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {outstandingPayments.map((payment) => (
              <div key={payment.id} className="border rounded-lg p-4 bg-red-50 border-red-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{payment.description}</h3>
                    <p className="text-sm text-gray-600">Order ID: {payment.id}</p>
                    <p className="text-sm text-gray-600">Due: {payment.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-red-600">${payment.amount.toFixed(2)}</p>
                    <Badge variant={payment.status === 'overdue' ? 'destructive' : 'secondary'}>
                      {payment.status === 'overdue' ? 'Overdue' : 'Due Soon'}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Notification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="h-5 w-5 mr-2 text-bgl-blue-600" />
            Notify Payment Made
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Upload Payment Proof</label>
            <Input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="cursor-pointer"
            />
            {selectedFile && (
              <p className="text-sm text-green-600 mt-2">
                File selected: {selectedFile.name}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Payment Note</label>
            <Textarea
              placeholder="Add any additional information about your payment..."
              value={paymentNote}
              onChange={(e) => setPaymentNote(e.target.value)}
              rows={3}
            />
          </div>
          <Button 
            onClick={handleNotifyPayment}
            className="bg-bgl-yellow-400 hover:bg-bgl-yellow-500 text-gray-900 font-semibold"
          >
            Notify Payment
          </Button>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-bgl-blue-600" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentHistory.map((payment) => (
              <div key={payment.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-gray-900">
                        Payment #{payment.id}
                      </h3>
                      <Badge
                        variant={
                          payment.status === 'completed' ? 'default' :
                          payment.status === 'pending' ? 'secondary' : 'destructive'
                        }
                      >
                        {payment.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {payment.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">Order: {payment.orderId}</p>
                    <p className="text-sm text-gray-600">Method: {payment.method}</p>
                    <p className="text-sm text-gray-600">Reference: {payment.reference}</p>
                    <p className="text-sm text-gray-600">Date: {payment.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">${payment.amount.toFixed(2)}</p>
                    <div className="flex space-x-2 mt-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Receipt
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Bank Transfer</h3>
              <p className="text-sm text-gray-600 mb-1">Bank: ABC Bank</p>
              <p className="text-sm text-gray-600 mb-1">Account: 123456789</p>
              <p className="text-sm text-gray-600">Branch: Main Branch</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Mobile Money</h3>
              <p className="text-sm text-gray-600 mb-1">EcoCash: +263 123 456 789</p>
              <p className="text-sm text-gray-600 mb-1">OneMoney: +263 987 654 321</p>
              <p className="text-sm text-gray-600">Telecash: +263 555 000 111</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payments;
