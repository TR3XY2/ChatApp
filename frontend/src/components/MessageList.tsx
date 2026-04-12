import { useEffect, useRef } from "react";
import type { ChatMessage } from "../types/ChatMessage";

type MessageListProps = {
  messages: ChatMessage[];
};

function getSentimentClass(sentiment?: string): string {
  switch (sentiment?.toLowerCase()) {
    case "positive":
      return "message-sentiment positive";
    case "negative":
      return "message-sentiment negative";
    case "neutral":
      return "message-sentiment neutral";
    default:
      return "message-sentiment neutral";
  }
}

export function MessageList({ messages }: MessageListProps) {
  const endOfListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endOfListRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  return (
    <section
      className="message-list"
      aria-live="polite"
      aria-label="Chat messages"
    >
      {messages.length === 0 ? (
        <p className="empty-state">No messages yet.</p>
      ) : (
        messages.map((message, index) => (
          <article
            className="message-item"
            key={`${message.createdAt}-${message.user}-${index}`}
          >
            <header className="message-header">
              <strong className="message-user">{message.user}</strong>
              <time className="message-time" dateTime={message.createdAt}>
                {new Date(message.createdAt).toLocaleTimeString()}
              </time>
            </header>
            <p className="message-text">{message.text}</p>
            {message.sentiment ? (
              <span className={getSentimentClass(message.sentiment)}>
                {message.sentiment}
              </span>
            ) : null}
          </article>
        ))
      )}
      <div ref={endOfListRef} />
    </section>
  );
}
