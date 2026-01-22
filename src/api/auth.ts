import { ILogin, ISignUp } from '@/types/user';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_APP_BASE_URL + "/api";

// WebSocket URL for SockJS - SockJS requires HTTP/HTTPS, not WS/WSS
// SockJS will handle the WebSocket protocol negotiation internally
const getWebSocketUrl = () => {
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  // SockJS needs the HTTP/HTTPS URL, not WS/WSS
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
