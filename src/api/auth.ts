import { ILogin, ISignUp } from '@/types/user';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_APP_BASE_URL + "/api";

// WebSocket URL - convert HTTP/HTTPS to WS/WSS
const getWebSocketUrl = () => {
  let baseUrl = import.meta.env.VITE_APP_BASE_URL;
  if (baseUrl.startsWith('https://')) {
    baseUrl = baseUrl.replace('https://', 'wss://');
  } else if (baseUrl.startsWith('http://')) {
    baseUrl = baseUrl.replace('http://', 'ws://');
  }
  return baseUrl + "/api/ws-chat";
};

export const BASE_URL_FOR_API = BASE_URL;
export const WS_URL = getWebSocketUrl();

// Reusable Axios instance
export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Signup to OTP
export const signUp = async (data: ISignUp) => {
  const response = await api.post('/auth/signup/initiate', data);

  return response.data;
};

// Verify OTP
export const verifyOtp = async (data: {
  userDetails: ISignUp;
  otp: number;
}) => {
  // Map frontend field names to backend field names
  const payload = {
    signupData: data.userDetails,
    otp: data.otp,
    email: data.userDetails.email,
  };
  const response = await api.post('/auth/signup/verify', payload);

  return response.data;
};

// Login
export const login = async (data: ILogin) => {
  const response = await api.post('/auth/login', data);

  return response.data;
};
