import { ILogin, ISignUp } from '@/types/user';
import axios from 'axios';
export const BASE_URL = 'http://localhost:8080/api';

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
  const response = await api.post('/auth/verifyOtp', data);

  return response.data;
};

// Login
export const login = async (data: ILogin) => {
  const response = await api.post('/auth/login', data);

  return response.data;
};
