export interface GeneratedResult {
  explanation: string;
  code: string;
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string; // The raw content
  parsed?: GeneratedResult; // If it's code
  timestamp: number;
}
