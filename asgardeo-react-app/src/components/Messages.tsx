import React, { ReactElement, FunctionComponent, useEffect, useRef } from "react";

interface MessagesProps {
  messages: any[];
}

export const Messages: FunctionComponent<MessagesProps> = (
  props: MessagesProps
): ReactElement => {
  const { messages } = props;
  const el = useRef(null);
  useEffect(() => {
    el.current.scrollIntoView({ block: "end", behavior: "smooth" });
  });
  return (
    <div className="messages">
      {messages}
      <div id={"el"} ref={el} />
    </div>
  );
}
