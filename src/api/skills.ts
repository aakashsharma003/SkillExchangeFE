import { api } from './auth';

// Get Skills Configuration
export const skillsConfig = async () => {
  const response = await api.get('/users/skills');

  return response.data;
};
