import { useState } from "react";
import type { FormEvent } from "react";

type MessageInputProps = {
  username: string;
  onUsernameChange: (value: string) => void;
  onSendMessage: (message: string) => Promise<void>;
  disabled?: boolean;
};

export function MessageInput({
  username,
  onUsernameChange,
  onSendMessage,
  disabled = false,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const isSendDisabled = disabled || message.trim().length === 0;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSendDisabled) {
      return;
    }

    await onSendMessage(message.trim());
    setMessage("");
  };

  return (
    <form className="message-form" onSubmit={handleSubmit}>
      <label className="field-label" htmlFor="username-input">
        Username
      </label>
      <input
        id="username-input"
        className="text-input"
        type="text"
        placeholder="Your name"
        value={username}
        onChange={(event) => onUsernameChange(event.target.value)}
      />

      <label className="field-label" htmlFor="message-input">
        Message
      </label>
      <div className="message-row">
        <input
          id="message-input"
          className="text-input"
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <button className="send-button" type="submit" disabled={isSendDisabled}>
          Send
        </button>
      </div>
    </form>
  );
}
