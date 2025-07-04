
import { bglApi } from './api';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'image';
  fileUrl?: string;
  fileName?: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface ChatConversation {
  id: string;
  participants: string[];
  lastMessage?: ChatMessage;
  unreadCount: number;
}

export const chatService = {
  async getConversations(): Promise<ChatConversation[]> {
    try {
      const response = await bglApi.get('/conversations');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      return [];
    }
  },

  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    try {
      const response = await bglApi.get(`/conversations/${conversationId}/messages`);
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      return [];
    }
  },

  async sendMessage(conversationId: string, content: string, type: 'text' | 'file' | 'image' = 'text', fileData?: FormData): Promise<ChatMessage> {
    try {
      let response;
      
      if (type === 'text') {
        response = await bglApi.post(`/conversations/${conversationId}/messages`, {
          content,
          type
        });
      } else {
        // Handle file uploads
        const formData = fileData || new FormData();
        formData.append('content', content);
        formData.append('type', type);
        
        response = await bglApi.post(`/conversations/${conversationId}/messages`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      
      return response.data;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  },

  async markAsRead(conversationId: string, messageId: string): Promise<void> {
    try {
      await bglApi.put(`/conversations/${conversationId}/messages/${messageId}/read`);
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  },

  async uploadFile(file: File): Promise<{ url: string; fileName: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await bglApi.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Failed to upload file:', error);
      throw error;
    }
  }
};
