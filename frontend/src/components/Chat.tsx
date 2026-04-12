import { useCallback, useEffect, useRef, useState } from "react";
import type { HubConnection } from "@microsoft/signalr";
import { fetchMessages } from "../api/messageApi";
import {
  createChatConnection,
  sendChatMessage,
  startChatConnection,
  stopChatConnection,
} from "../signalr/chatConnection";
import type { ChatMessage } from "../types/ChatMessage";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";

const RECEIVE_MESSAGE_EVENT = "ReceiveMessage";

function getMessageKey(message: ChatMessage): string {
  return `${message.user}|${message.text}|${message.createdAt}`;
}

function mergeUniqueMessages(
  existing: ChatMessage[],
  incoming: ChatMessage[],
): ChatMessage[] {
  const merged = [...existing];
  const keys = new Set(existing.map(getMessageKey));

  for (const message of incoming) {
    const key = getMessageKey(message);
    if (keys.has(key)) {
      continue;
    }

    keys.add(key);
    merged.push(message);
  }

  return merged.sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
}

export function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [username, setUsername] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const connectionRef = useRef<HubConnection | null>(null);

  const handleIncomingMessage = useCallback((message: ChatMessage) => {
    setMessages((previous) => mergeUniqueMessages(previous, [message]));
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        const history = await fetchMessages();
        if (isMounted) {
          setMessages((previous) => mergeUniqueMessages(previous, history));
        }
      } catch (historyError) {
        if (isMounted) {
          setError(
            historyError instanceof Error
              ? historyError.message
              : "Failed to load message history.",
          );
        }
      }

      const connection = createChatConnection();
      connectionRef.current = connection;

      connection.onclose((closeError) => {
        setIsConnected(false);

        if (closeError) {
          setError("Connection was closed unexpectedly.");
        }
      });

      connection.onreconnecting(() => {
        setIsConnected(false);
      });

      connection.onreconnected(() => {
        setIsConnected(true);
      });

      connection.on(RECEIVE_MESSAGE_EVENT, handleIncomingMessage);

      try {
        await startChatConnection(connection);
        if (isMounted) {
          setIsConnected(true);
        }
      } catch (connectionError) {
        if (isMounted) {
          setError(
            connectionError instanceof Error
              ? connectionError.message
              : "Failed to connect to chat hub.",
          );
        }
      }
    };

    void initialize();

    return () => {
      isMounted = false;
      const connection = connectionRef.current;
      if (!connection) {
        return;
      }

      connection.off(RECEIVE_MESSAGE_EVENT, handleIncomingMessage);
      void stopChatConnection(connection);
      connectionRef.current = null;
    };
  }, [handleIncomingMessage]);

  const handleSendMessage = useCallback(
    async (message: string) => {
      const connection = connectionRef.current;

      if (!connection || !isConnected) {
        setError("Not connected to chat server.");
        return;
      }

      try {
        setError(null);
        const sender = username.trim() || "Anonymous";
        await sendChatMessage(connection, sender, message);
      } catch (sendError) {
        setError(
          sendError instanceof Error
            ? sendError.message
            : "Failed to send message.",
        );
      }
    },
    [isConnected, username],
  );

  return (
    <main className="chat-shell">
      <section className="chat-card">
        <header className="chat-header">
          <h1>Realtime Chat</h1>
          <span
            className={`connection-state ${isConnected ? "connected" : "disconnected"}`}
          >
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </header>

        {error ? <p className="error-banner">{error}</p> : null}

        <MessageList messages={messages} />

        <MessageInput
          username={username}
          onUsernameChange={setUsername}
          onSendMessage={handleSendMessage}
          disabled={!isConnected}
        />
      </section>
    </main>
  );
}
