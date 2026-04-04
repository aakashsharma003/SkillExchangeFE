export type User = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  skills: string[];           // Matches backend "skills"
  interests: string[];        // Frontend-only for UI grouping
  learningProgress?: Record<string, number>;
  githubProfile: string | null;
  linkedinProfile: string | null;
  youtubeProfile: string | null;
  instagramProfile: string | null;
  bio: string | null;
  location: string | null;
  profilePictureUrl?: string | null;
};

export type ISignUp = {
  fullName: string;
  email: string;
  phone: string;
  skills: string[];
  interests: string[];
  password: string;
};

export type ILogin = {
  email: string;
  password: string;
};

export type IUpdateUser = Omit<User, 'email' | 'password'>;

