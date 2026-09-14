import { ChatMessage, ChatToolCall, GroundingMetadata } from '../types';

export interface ChatResponse {
  reply: string;
  toolCalls: ChatToolCall[];
  groundingMetadata?: GroundingMetadata;
  model: string;
}

export async function sendChatMessage(params: {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  scanId?: string;
  productContext?: any;
  model?: string;
}): Promise<ChatResponse> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Chat request failed' }));
    throw new Error(errorData.error || `Server responded with ${res.status}`);
  }

  return res.json();
}
