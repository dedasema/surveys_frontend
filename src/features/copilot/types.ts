export interface CopilotMessageItem {
  sender: "user" | "assistant" | "system";
  text: string;
}

export interface CopilotChatPayload {
  message: string;
  history?: CopilotMessageItem[];
  campana_id?: string;
  session_id?: string;
}

export interface ToolExecutionRecord {
  tool: string;
  arguments: Record<string, any>;
  result_summary: string;
}

export interface CitedSource {
  id?: string | number;
  tipo?: "respuesta" | "documento" | "transcripcion";
  canal?: "gmail" | "ocr" | "voz" | "audio" | "web";
  campana?: string;
  fragmento: string;
  similitud_score?: number;
  fecha?: string;
}

export interface CopilotChatResponse {
  answer: string;
  tools_used?: ToolExecutionRecord[];
  suggested_actions?: string[];
  fuentes_citadas?: CitedSource[];
  session_id?: string;
}

export interface ChatMessage {
  id: string | number;
  sender: "user" | "bot" | "assistant";
  text: string;
  timestamp: string;
  tools_used?: ToolExecutionRecord[];
  suggested_actions?: string[];
  fuentes_citadas?: CitedSource[];
  error?: boolean;
}

export interface CopilotSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  campanaId?: string | null;
  messages: ChatMessage[];
  message_count?: number;
}

export interface BackendCopilotSession {
  id: string;
  title: string;
  campana_id?: string | null;
  created_at: string;
  updated_at: string;
  message_count?: number;
}

export interface BackendCopilotMessage {
  id: string;
  sender: "user" | "assistant" | "system";
  text: string;
  tools_used?: ToolExecutionRecord[];
  fuentes_citadas?: CitedSource[];
  created_at: string;
}
