export interface UnauthorizedRequest {
  message: string;
}

export interface UserModel {
  id: string;
  fullName: string;
  email: string;
  emailVerifiedAt: string;
}

export interface RegistrationResponseData {
  message?: string;
  errors?: Record<string, string[]>;
  token?: string;
}

export interface AuthContextProps {
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  user: UserModel | null;
  setUser: React.Dispatch<React.SetStateAction<UserModel | null>>;
}
