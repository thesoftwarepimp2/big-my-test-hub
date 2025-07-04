
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService, ChatMessage, ChatConversation } from '@/services/chat';
import { toast } from '@/hooks/use-toast';

export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: chatService.getConversations,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useMessages = (conversationId: string) => {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => chatService.getMessages(conversationId),
    enabled: !!conversationId,
    staleTime: 10 * 1000, // 10 seconds
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ conversationId, content, type, fileData }: {
      conversationId: string;
      content: string;
      type?: 'text' | 'file' | 'image';
      fileData?: FormData;
    }) => chatService.sendMessage(conversationId, content, type, fileData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: () => {
      toast({
        title: "Failed to send message",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  });
};

export const useFileUpload = () => {
  return useMutation({
    mutationFn: chatService.uploadFile,
    onError: () => {
      toast({
        title: "Failed to upload file",
        description: "Please try again with a smaller file.",
        variant: "destructive"
      });
    }
  });
};
