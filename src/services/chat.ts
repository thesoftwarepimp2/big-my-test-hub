
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
  participantNames: { [key: string]: string };
  lastMessage?: ChatMessage;
  unreadCount: number;
  updatedAt: string;
}

// Real chat storage using localStorage
const getStoredConversations = (): ChatConversation[] => {
  const stored = localStorage.getItem('bgl_conversations');
  return stored ? JSON.parse(stored) : [];
};

const storeConversations = (conversations: ChatConversation[]): void => {
  localStorage.setItem('bgl_conversations', JSON.stringify(conversations));
};

const getStoredMessages = (conversationId: string): ChatMessage[] => {
  const stored = localStorage.getItem(`bgl_messages_${conversationId}`);
  return stored ? JSON.parse(stored) : [];
};

const storeMessages = (conversationId: string, messages: ChatMessage[]): void => {
  localStorage.setItem(`bgl_messages_${conversationId}`, JSON.stringify(messages));
};

export const chatService = {
  async getConversations(): Promise<ChatConversation[]> {
    try {
      const response = await bglApi.get('/conversations');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch conversations from backend, using localStorage:', error);
      return getStoredConversations();
    }
  },

  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    try {
      const response = await bglApi.get(`/conversations/${conversationId}/messages`);
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch messages from backend, using localStorage:', error);
      return getStoredMessages(conversationId);
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
      console.error('Failed to send message to backend, using localStorage:', error);
      
      // Create message locally
      const currentUser = JSON.parse(localStorage.getItem('bgl_user') || '{}');
      const message: ChatMessage = {
        id: Date.now().toString(),
        senderId: currentUser.id || 'guest',
        senderName: currentUser.username || 'Guest',
        recipientId: conversationId.includes('admin') ? 'admin' : conversationId,
        content,
        timestamp: new Date().toISOString(),
        type,
        status: 'sent'
      };
      
      // Store message
      const messages = getStoredMessages(conversationId);
      messages.push(message);
      storeMessages(conversationId, messages);
      
      // Update conversation
      const conversations = getStoredConversations();
      let conversation = conversations.find(c => c.id === conversationId);
      
      if (!conversation) {
        conversation = {
          id: conversationId,
          participants: [currentUser.id || 'guest', 'admin'],
          participantNames: {
            [currentUser.id || 'guest']: currentUser.username || 'Guest',
            'admin': 'Admin'
          },
          lastMessage: message,
          unreadCount: 0,
          updatedAt: new Date().toISOString()
        };
        conversations.push(conversation);
      } else {
        conversation.lastMessage = message;
        conversation.updatedAt = new Date().toISOString();
      }
      
      storeConversations(conversations);
      
      return message;
    }
  },

  async createConversation(participantId: string, participantName: string): Promise<ChatConversation> {
    const currentUser = JSON.parse(localStorage.getItem('bgl_user') || '{}');
    const conversationId = `${currentUser.id}_${participantId}`;
    
    try {
      const response = await bglApi.post('/conversations', {
        participants: [currentUser.id, participantId]
      });
      return response.data;
    } catch (error) {
      console.error('Failed to create conversation on backend, using localStorage:', error);
      
      // Create conversation locally
      const conversations = getStoredConversations();
      let conversation = conversations.find(c => c.id === conversationId);
      
      if (!conversation) {
        conversation = {
          id: conversationId,
          participants: [currentUser.id || 'guest', participantId],
          participantNames: {
            [currentUser.id || 'guest']: currentUser.username || 'Guest',
            [participantId]: participantName
          },
          unreadCount: 0,
          updatedAt: new Date().toISOString()
        };
        conversations.push(conversation);
        storeConversations(conversations);
      }
      
      return conversation;
    }
  },

  async markAsRead(conversationId: string, messageId: string): Promise<void> {
    try {
      await bglApi.put(`/conversations/${conversationId}/messages/${messageId}/read`);
    } catch (error) {
      console.error('Failed to mark message as read on backend:', error);
      // Update locally
      const messages = getStoredMessages(conversationId);
      const messageIndex = messages.findIndex(m => m.id === messageId);
      if (messageIndex !== -1) {
        messages[messageIndex].status = 'read';
        storeMessages(conversationId, messages);
      }
    }
  }
};
