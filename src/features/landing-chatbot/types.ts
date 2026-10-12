export interface ChatAction {
  label: string;
  href?: string;
  action?: string;
}

export interface ChatMessage {
  id: string | number;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  actions?: ChatAction[];
}

export interface LandingChatResponse {
  answer: string;
  actions?: ChatAction[];
}

export interface QuickAction {
  id: string;
  label: string;
  query: string;
}
