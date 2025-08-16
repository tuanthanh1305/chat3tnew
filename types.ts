export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  attachmentPreview?: {
    url?: string; // For images
    name: string;
    isImage: boolean;
  };
}

export type ChatStatus = 'idle' | 'loading' | 'error';