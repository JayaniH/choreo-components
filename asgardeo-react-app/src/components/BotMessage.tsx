import React, { ReactElement, FunctionComponent, useState, useEffect } from "react";

interface BotMessageProps {
  fetchMessage: () => any;
}


export const BotMessage: FunctionComponent<BotMessageProps> = (
  props: BotMessageProps
): ReactElement => {
  const {fetchMessage} = props;
  const [isLoading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadMessage() {
      const msg = await fetchMessage();
      setLoading(false);
      setMessage(msg);
    }
    loadMessage();
  }, [fetchMessage]);

  return (
    <div className="message-container">
      <div className="bot-message">{isLoading ? "..." : message}</div>
    </div>
  );
}
