export interface CopilotMessageItem {
  sender: "user" | "assistant" | "system";
  text: string;
}

export interface CopilotChatPayload {
  message: string;
  history?: CopilotMessageItem[];
  campana_id?: string;
}

export interface ToolExecutionRecord {
  tool: string;
  arguments: Record<string, any>;
  result_summary: string;
}

export interface CopilotChatResponse {
  answer: string;
  tools_used?: ToolExecutionRecord[];
  suggested_actions?: string[];
}

export interface ChatMessage {
  id: string | number;
  sender: "user" | "bot" | "assistant";
  text: string;
  timestamp: string;
  tools_used?: ToolExecutionRecord[];
  suggested_actions?: string[];
  error?: boolean;
}
