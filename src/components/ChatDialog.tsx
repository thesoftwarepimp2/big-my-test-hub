
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { chatService, ChatMessage, ChatConversation } from '@/services/chat';
import { Send, Paperclip, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: string;
  recipientName: string;
}

const ChatDialog: React.FC<ChatDialogProps> = ({ isOpen, onClose, recipientId, recipientName }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const conversationId = user ? `${user.id}_${recipientId}` : '';

  useEffect(() => {
    if (isOpen && user && recipientId) {
      loadConversation();
    }
  }, [isOpen, user, recipientId]);

  const loadConversation = async () => {
    setLoading(true);
    try {
      // Create or get conversation
      const conv = await chatService.createConversation(recipientId, recipientName);
      setConversation(conv);
      
      // Load messages
      const msgs = await chatService.getMessages(conversationId);
      setMessages(msgs);
    } catch (error) {
      console.error('Failed to load conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !conversationId) return;

    setLoading(true);
    try {
      const message = await chatService.sendMessage(conversationId, newMessage);
      setMessages(prev => [...prev, message]);
      setNewMessage('');

      toast({
        title: "Message sent",
        description: `Message sent to ${recipientName}`,
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Failed to send message",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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
    if (!file || !user || !conversationId) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const message = await chatService.sendMessage(
        conversationId, 
        `📎 ${file.name}`, 
        'file', 
        formData
      );
      
      setMessages(prev => [...prev, message]);

      toast({
        title: "File sent",
        description: `${file.name} has been sent`,
      });
    } catch (error) {
      console.error('Failed to send file:', error);
      toast({
        title: "Failed to send file",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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
          {loading && messages.length === 0 ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bgl-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Loading conversation...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
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
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1"
              disabled={loading}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!newMessage.trim() || loading}
            >
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
