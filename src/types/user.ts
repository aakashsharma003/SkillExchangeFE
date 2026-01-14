export type User = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  skillsOffered: string[]; // What they can teach
  interests: string[]; // What they want to learn
  learningProgress?: Record<string, number>; // Skill -> Proficiency (0-100)
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
  skillsOffered: string[];
  interests: string[];
  password: string;
};

export type ILogin = {
  email: string;
  password: string;
};

export type IUpdateUser = Omit<User, 'email' | 'password'>;
