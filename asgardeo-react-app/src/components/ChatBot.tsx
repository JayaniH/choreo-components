import React, {
  ReactElement,
  FunctionComponent,
  useState,
  useEffect,
} from "react";
import ReactDOM from "react-dom";

import { BotMessage } from "./BotMessage";
import { UserMessage } from "./UserMessage";
import { Messages } from "./Messages";
import { Input } from "./Input";
import { Header } from "./Header";
import API from "../api/ChatbotAPI";
import { useAuthContext } from "@asgardeo/auth-react";

export const ChatBot: FunctionComponent = (): ReactElement => {
  const [messages, setMessages] = useState([]);

  const { getAccessToken } = useAuthContext();

  useEffect(() => {
    async function loadWelcomeMessage() {
      setMessages([
        <BotMessage
          key="0"
          fetchMessage={async () => API.GetChatbotGreeting()}
        />,
      ]);
    }
    loadWelcomeMessage();
  }, []);

  const send = async (text: string) => {
    const accessToken = await getAccessToken();
    const newMessages = messages.concat(
      <UserMessage key={messages.length + 1} text={text} />,
      <BotMessage
        key={messages.length + 2}
        fetchMessage={async () => await API.GetAnswer(text, accessToken)}
      />
    );
    setMessages(newMessages);
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot">
        <Header />
        <Messages messages={messages} />
        <Input onSend={send} />
      </div>
    </div>
  );
};

// const rootElement = document.getElementById("root");
// ReactDOM.render(<Chatbot />, rootElement);
