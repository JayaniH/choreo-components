import axios from "axios";

export const getChatBotInstance = () => {
  return axios.create({ baseURL: window.config.choreoApiUrl });
};
