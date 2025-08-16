import { api } from './auth';

// Get Skills Configuration
export const skillsConfig = async () => {
  const response = await api.get('/user/all-skill');

  return response.data;
};
