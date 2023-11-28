import { API_URL } from "../constants/errors";

const API = {
  GetChatbotGreeting: async () => {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve("Hi there! What is your question about Choreo?");
      }, 500);
    });
  },
  GetAnswer: async (message: string, accessToken: string) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          // 'Api-Key': apiKey,
        },
        body: JSON.stringify({ question: message }),
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
  },
};

export default API;
