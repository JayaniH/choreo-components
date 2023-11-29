import { AxiosResponse } from "axios";
import { getChatBotInstance } from "./instance";

interface Answer {
  answer: string;
}

export async function getAnswer(accessToken: string, question: string) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };
  const response = await getChatBotInstance().post(
    "/generate_answer",
    {
      question: question,
    },
    {
      headers: headers,
    }
  );
  return response as AxiosResponse<Answer>;
}

export async function getAnswer1(accessToken: string, question: string) {
  try {
    const response = await fetch(window.config.choreoApiUrl + "generate_answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        // 'Api-Key': apiKey,
      },
      body: JSON.stringify({ question: question }),
    });

    if (response.ok) {
      const result = await response.json();
      return result.answer;
    } else if (response.status === 401) {
      return "Your session has expired. Please log in again.";
    } else {
      return "There was an error processing your request.";
    }
  } catch (error) {
    console.error("POST Error:", error, error.status);
    return "There was an error processing your request.";
  }
}

export async function getChatbotGreeting () {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve("Hi there! What is your question about Choreo?");
    }, 500);
  });
}
