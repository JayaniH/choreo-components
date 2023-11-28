import React, { ReactElement, FunctionComponent } from "react";

interface UserMessageProps {
  text: string;
}

export const UserMessage: FunctionComponent<UserMessageProps> = (
  props: UserMessageProps
): ReactElement => {
  const { text } = props;
  return (
    <div className="message-container">
      <div className="user-message">{text}</div>
    </div>
  );
}
