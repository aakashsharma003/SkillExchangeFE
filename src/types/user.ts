export type User = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  skills: string[];
  githubLink: string | null;
  linkedinLink: string | null;
  youtubeLink: string | null;
  instagramLink: string | null;
  bio: string | null;
  location: string | null;
};

export type ISignUp = {
  fullName: string;
  email: string;
  phone: string;
  skills: string[];
  password: string;
};

export type ILogin = {
  email: string;
  password: string;
};

export type IUpdateUser = Omit<User, 'email' | 'password'>;
