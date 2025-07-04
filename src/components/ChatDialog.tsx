
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Send, Paperclip, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file';
}

interface ChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
  recipientEmail: string;
  recipientName: string;
}

const ChatDialog: React.FC<ChatDialogProps> = ({ isOpen, onClose, recipientEmail, recipientName }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load chat history from localStorage
  useEffect(() => {
    if (isOpen && user) {
      const chatKey = `chat_${user.id}_${recipientEmail}`;
      const storedMessages = localStorage.getItem(chatKey);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      } else {
        // Initialize with a welcome message
        const welcomeMessage: ChatMessage = {
          id: '1',
          senderId: 'system',
          senderName: 'System',
          content: `Chat started with ${recipientName}`,
          timestamp: new Date().toISOString(),
          type: 'text'
        };
        setMessages([welcomeMessage]);
      }
    }
  }, [isOpen, user, recipientEmail, recipientName]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const saveMessages = (updatedMessages: ChatMessage[]) => {
    if (user) {
      const chatKey = `chat_${user.id}_${recipientEmail}`;
      localStorage.setItem(chatKey, JSON.stringify(updatedMessages));
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.username,
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    saveMessages(updatedMessages);
    setNewMessage('');

    toast({
      title: "Message sent",
      description: `Message sent to ${recipientName}`,
    });

    // Simulate a reply after 2 seconds (for demo)
    setTimeout(() => {
      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: recipientEmail,
        senderName: recipientName,
        content: "Thank you for your message. I'll get back to you soon!",
        timestamp: new Date().toISOString(),
        type: 'text'
      };

      const finalMessages = [...updatedMessages, reply];
      setMessages(finalMessages);
      saveMessages(finalMessages);

      toast({
        title: "New reply",
        description: `${recipientName} has replied`,
      });
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.username,
      content: `📎 ${file.name}`,
      timestamp: new Date().toISOString(),
      type: 'file'
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    saveMessages(updatedMessages);

    toast({
      title: "File sent",
      description: `${file.name} has been sent`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Chat with {recipientName}</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
              <Card className={`max-w-xs p-3 ${message.senderId === user?.id ? 'bg-bgl-blue-600 text-white' : 'bg-gray-100'}`}>
                <div className="text-sm">
                  <p className="font-semibold">{message.senderName}</p>
                  <p>{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </Card>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatDialog;
