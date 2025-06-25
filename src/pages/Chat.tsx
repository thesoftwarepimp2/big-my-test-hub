
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Send, 
  Paperclip, 
  Phone, 
  Video,
  MoreVertical,
  Clock
} from 'lucide-react';

const Chat: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Big Game Logistics',
      content: 'Hello! Welcome to Big Game Logistics support. How can we help you today?',
      timestamp: '10:30 AM',
      isSupplier: true,
      status: 'delivered'
    },
    {
      id: 2,
      sender: user?.businessName || 'You',
      content: 'Hi, I wanted to check on my recent order status.',
      timestamp: '10:32 AM',
      isSupplier: false,
      status: 'delivered'
    },
    {
      id: 3,
      sender: 'Big Game Logistics',
      content: 'Sure! Let me check that for you. Can you provide your order number?',
      timestamp: '10:33 AM',
      isSupplier: true,
      status: 'delivered'
    },
    {
      id: 4,
      sender: user?.businessName || 'You',
      content: 'Order #BGL-001',
      timestamp: '10:34 AM',
      isSupplier: false,
      status: 'delivered'
    },
    {
      id: 5,
      sender: 'Big Game Logistics',
      content: 'Great! Your order BGL-001 is currently being processed and will be shipped tomorrow. You should receive it by Friday.',
      timestamp: '10:35 AM',
      isSupplier: true,
      status: 'delivered'
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: user?.businessName || 'You',
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSupplier: false,
        status: 'sent'
      };
      
      setMessages([...messages, message]);
      setNewMessage('');
      
      // Simulate supplier typing
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        // Simulate auto-response
        const autoResponse = {
          id: messages.length + 2,
          sender: 'Big Game Logistics',
          content: 'Thank you for your message. Our team will get back to you shortly.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSupplier: true,
          status: 'delivered'
        };
        setMessages(prev => [...prev, autoResponse]);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const quickReplies = [
    "What's my order status?",
    "I need to make a payment",
    "Update my delivery address",
    "Product availability inquiry",
    "Pricing information"
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Chat Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-bgl-blue-600 rounded-full flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Big Game Logistics Support</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-500">Online now</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Messages Area */}
      <Card className="flex-1 flex flex-col mt-4">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isSupplier ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`max-w-xs lg:max-w-md ${message.isSupplier ? 'order-2' : 'order-1'}`}>
                <div
                  className={`rounded-lg px-4 py-2 ${
                    message.isSupplier
                      ? 'bg-gray-100 text-gray-900'
                      : 'bg-bgl-blue-600 text-white'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                <div className={`flex items-center mt-1 space-x-1 ${
                  message.isSupplier ? 'justify-start' : 'justify-end'
                }`}>
                  <span className="text-xs text-gray-500">{message.timestamp}</span>
                  {!message.isSupplier && (
                    <div className="flex">
                      {message.status === 'sent' && <Clock className="h-3 w-3 text-gray-400" />}
                      {message.status === 'delivered' && (
                        <div className="flex">
                          <div className="w-3 h-3 text-blue-500">✓</div>
                          <div className="w-3 h-3 text-blue-500 -ml-1">✓</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {message.isSupplier && (
                <div className="w-8 h-8 bg-bgl-blue-600 rounded-full flex items-center justify-center order-1 mr-2">
                  <MessageCircle className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="w-8 h-8 bg-bgl-blue-600 rounded-full flex items-center justify-center mr-2">
                <MessageCircle className="h-4 w-4 text-white" />
              </div>
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Quick Replies */}
        <div className="px-4 py-2 border-t">
          <div className="flex flex-wrap gap-2">
            {quickReplies.map((reply, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setNewMessage(reply)}
                className="text-xs"
              >
                {reply}
              </Button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="border-t p-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFileAttach}
              className="text-gray-500"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-bgl-blue-600 hover:bg-bgl-blue-700"
            >
              <Send className="h-4 w-4" />
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => {
                // Handle file upload
                console.log('File selected:', e.target.files?.[0]);
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Chat;
