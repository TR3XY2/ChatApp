import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import { getBackendBaseUrl } from "../config/backend";

const CHAT_HUB_URL = `${getBackendBaseUrl()}/chat`;
const SEND_MESSAGE_METHOD = "SendMessage";

export function createChatConnection(): HubConnection {
  return new HubConnectionBuilder()
    .withUrl(CHAT_HUB_URL)
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Warning)
    .build();
}

export async function startChatConnection(
  connection: HubConnection,
): Promise<void> {
  if (connection.state === HubConnectionState.Disconnected) {
    await connection.start();
  }
}

export async function stopChatConnection(
  connection: HubConnection,
): Promise<void> {
  if (connection.state !== HubConnectionState.Disconnected) {
    await connection.stop();
  }
}

export async function sendChatMessage(
  connection: HubConnection,
  user: string,
  message: string,
): Promise<void> {
  await connection.invoke(SEND_MESSAGE_METHOD, user, message);
}
