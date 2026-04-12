import type { ChatMessage } from "../types/ChatMessage";
import { getBackendBaseUrl } from "../config/backend";

const MESSAGES_API_URL = `${getBackendBaseUrl()}/api/messages`;

export async function fetchMessages(): Promise<ChatMessage[]> {
  const response = await fetch(MESSAGES_API_URL);

  if (!response.ok) {
    throw new Error(`Failed to load messages (${response.status})`);
  }

  const data = (await response.json()) as ChatMessage[];

  return data.slice().sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
}
