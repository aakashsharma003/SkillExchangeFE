export type User = {
  id: string;
  name: string;
  email: string;
  contact: string;
  skills: string[];
  githubLink: string | null;
  linkedinLink: string | null;
  youtubeLink: string | null;
  instagramLink: string | null;
  bio: string | null;
  location: string | null;
};

export type ISignUp = {
  name: string;
  email: string;
  contact: string;
  skills: string[];
  password: string;
};

export type ILogin = {
  email: string;
  password: string;
};

export type IUpdateUser = Omit<User, 'email' | 'password'>;
