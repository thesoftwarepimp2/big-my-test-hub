
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMessages, useSendMessage, useFileUpload, useConversations } from '@/hooks/useChat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  MessageCircle, 
  Send, 
  Paperclip, 
  Phone, 
  Video,
  MoreVertical,
  Clock,
  Check,
  CheckCheck,
  Image as ImageIcon,
  FileText,
  Download,
  Users
} from 'lucide-react';

const Chat: React.FC = () => {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string>('admin-support');
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: conversations = [] } = useConversations();
  const { data: messages = [] } = useMessages(selectedConversation);
  const sendMessageMutation = useSendMessage();
  const fileUploadMutation = useFileUpload();

  // Mock messages for demo - this will be replaced with real data from backend
  const mockMessages = [
    {
      id: '1',
      senderId: 'admin',
      senderName: 'Admin',
      recipientId: user?.id || '',
      content: 'Hello! How can I help you today?',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      type: 'text' as const,
      status: 'read' as const
    },
    {
      id: '2',
      senderId: user?.id || '',
      senderName: user?.username || 'You',
      recipientId: 'admin',
      content: 'Hi, I need help with my recent order.',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      type: 'text' as const,
      status: 'read' as const
    },
    {
      id: '3',
      senderId: 'admin',
      senderName: 'Admin',
      recipientId: user?.id || '',
      content: 'Sure! Can you please provide your order number?',
      timestamp: new Date(Date.now() - 900000).toISOString(),
      type: 'text' as const,
      status: 'delivered' as const
    }
  ];

  const displayMessages = messages.length > 0 ? messages : mockMessages;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [displayMessages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      // Add message to display immediately (optimistic update)
      const tempMessage = {
        id: Date.now().toString(),
        senderId: user?.id || '',
        senderName: user?.username || 'You',
        recipientId: 'admin',
        content: newMessage,
        timestamp: new Date().toISOString(),
        type: 'text' as const,
        status: 'sent' as const
      };

      // Here you would normally send to backend
      console.log('Sending message:', tempMessage);
      
      // For demo, we'll just add to local state
      toast({
        title: "Message sent",
        description: "Your message has been sent to admin.",
      });

      setNewMessage('');
      
      // Simulate admin response after 2 seconds
      setTimeout(() => {
        toast({
          title: "New message",
          description: "Admin has replied to your message.",
        });
      }, 2000);

    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Failed to send message",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Uploading file:', file.name);
      toast({
        title: "File uploaded",
        description: `${file.name} has been sent.`,
      });
    } catch (error) {
      console.error('Failed to upload and send file:', error);
      toast({
        title: "Upload failed",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  const renderMessage = (message: any) => {
    const isOwn = message.senderId === user?.id;
    
    return (
      <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
          <div
            className={`rounded-lg px-4 py-2 ${
              isOwn
                ? 'bg-bgl-blue-600 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            {message.type === 'text' && (
              <p className="text-sm">{message.content}</p>
            )}
            
            {message.type === 'image' && (
              <div>
                <img 
                  src={message.fileUrl} 
                  alt={message.fileName}
                  className="max-w-full h-auto rounded mb-2"
                />
                <p className="text-xs">{message.fileName}</p>
              </div>
            )}
            
            {message.type === 'file' && (
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span className="text-sm">{message.fileName}</span>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
          
          <div className={`flex items-center mt-1 space-x-1 ${
            isOwn ? 'justify-end' : 'justify-start'
          }`}>
            <span className="text-xs text-gray-500">
              {new Date(message.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
            {isOwn && (
              <div className="flex">
                {message.status === 'sent' && <Clock className="h-3 w-3 text-gray-400" />}
                {message.status === 'delivered' && <Check className="h-3 w-3 text-blue-500" />}
                {message.status === 'read' && <CheckCheck className="h-3 w-3 text-blue-500" />}
              </div>
            )}
          </div>
        </div>
        
        {!isOwn && (
          <div className="w-8 h-8 bg-bgl-blue-600 rounded-full flex items-center justify-center order-1 mr-2">
            <MessageCircle className="h-4 w-4 text-white" />
          </div>
        )}
      </div>
    );
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
                <Users className="h-5 w-5 text-white" />
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
        <CardContent className="flex-1 overflow-y-auto p-4">
          {displayMessages.map(renderMessage)}
          
          {isTyping && (
            <div className="flex justify-start mb-4">
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
              onClick={() => fileInputRef.current?.click()}
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
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Chat;
