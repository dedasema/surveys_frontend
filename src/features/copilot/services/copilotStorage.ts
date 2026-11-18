import { CopilotSession, ChatMessage } from "../types";

export const resolveUserKey = (userKey?: string): string => {
  if (userKey) return userKey;
  try {
    const lastId = typeof localStorage !== "undefined" ? localStorage.getItem("last_user_id") : null;
    if (lastId) return lastId;
    const userStr = typeof localStorage !== "undefined" ? localStorage.getItem("user") : null;
    if (userStr) {
      const parsed = JSON.parse(userStr);
      if (parsed?.id) return String(parsed.id);
      if (parsed?.email) return parsed.email.replace(/[^a-zA-Z0-9]/g, "_");
    }
  } catch {
    // Ignore parse errors
  }
  return "default";
};

const getStorageKey = (userKey?: string) => `copilot_sessions_${resolveUserKey(userKey)}`;
const getActiveKey = (userKey?: string) => `copilot_active_session_${resolveUserKey(userKey)}`;

export const getStoredSessions = (userKey?: string): CopilotSession[] => {
  if (typeof localStorage === "undefined") return [];
  try {
    let raw = localStorage.getItem(getStorageKey(userKey));
    if (!raw && resolveUserKey(userKey) !== "default") {
      raw = localStorage.getItem("copilot_sessions_default");
    }
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Error reading copilot sessions from storage:", err);
    return [];
  }
};

export const saveStoredSessions = (sessions: CopilotSession[], userKey?: string): void => {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(getStorageKey(userKey), JSON.stringify(sessions));
  } catch (err) {
    console.error("Error saving copilot sessions to storage:", err);
  }
};

export const getActiveSessionId = (userKey?: string): string | null => {
  if (typeof localStorage === "undefined") return null;
  try {
    return localStorage.getItem(getActiveKey(userKey));
  } catch {
    return null;
  }
};

export const setActiveSessionId = (sessionId: string | null, userKey?: string): void => {
  if (typeof localStorage === "undefined") return;
  try {
    if (sessionId) {
      localStorage.setItem(getActiveKey(userKey), sessionId);
    } else {
      localStorage.removeItem(getActiveKey(userKey));
    }
  } catch {
    // Ignore error
  }
};

export const createNewSession = (title?: string, campanaId?: string | null, userKey?: string): CopilotSession => {
  const newSession: CopilotSession = {
    id: `session-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: title || "Nueva conversación",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    campanaId: campanaId || null,
    messages: [],
  };

  const sessions = getStoredSessions(userKey);
  const updated = [newSession, ...sessions];
  saveStoredSessions(updated, userKey);
  setActiveSessionId(newSession.id, userKey);
  return newSession;
};

export const updateSession = (
  sessionId: string,
  updates: Partial<Omit<CopilotSession, "id">>,
  userKey?: string
): CopilotSession | null => {
  const sessions = getStoredSessions(userKey);
  const index = sessions.findIndex((s) => s.id === sessionId);
  if (index === -1) return null;

  const current = sessions[index];
  const updated: CopilotSession = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  sessions[index] = updated;
  saveStoredSessions(sessions, userKey);
  return updated;
};

export const deleteStoredSession = (sessionId: string, userKey?: string): CopilotSession[] => {
  const sessions = getStoredSessions(userKey);
  const updated = sessions.filter((s) => s.id !== sessionId);
  saveStoredSessions(updated, userKey);

  const activeId = getActiveSessionId(userKey);
  if (activeId === sessionId) {
    const nextActive = updated.length > 0 ? updated[0].id : null;
    setActiveSessionId(nextActive, userKey);
  }

  return updated;
};
