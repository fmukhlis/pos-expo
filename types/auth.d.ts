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

export interface PasswordResetHelperProps {
  resetPasswordOption?: Partial<{
    onError:
      | ((message: string, errors: Record<string, string[]>) => void)
      | null
      | undefined;
    onFinish: (() => void) | null | undefined;
    onStart: (() => void) | null | undefined;
    onSuccess: ((message: string) => Promise<void>) | null | undefined;
  }>;
  sendResetPasswordOption?: Partial<{
    onError:
      | ((message: string, errors: Record<string, string[]>) => void)
      | null
      | undefined;
    onFinish: (() => void) | null | undefined;
    onStart: (() => void) | null | undefined;
    onSuccess: ((message: string) => Promise<void>) | null | undefined;
  }>;
}

export interface EmailVerificationHelperProps {
  verifyEmailOption?: Partial<{
    onError:
      | ((message: string, errors: Record<string, string[]>) => void)
      | null
      | undefined;
    onFinish: (() => void) | null | undefined;
    onStart: (() => void) | null | undefined;
    onSuccess:
      | ((message: string, token: string) => Promise<void>)
      | null
      | undefined;
  }>;
  sendVerificationEmailOption?: Partial<{
    onError:
      | ((message: string, errors: Record<string, string[]>) => void)
      | null
      | undefined;
    onFinish: (() => void) | null | undefined;
    onStart: (() => void) | null | undefined;
    onSuccess: ((message: string) => Promise<void>) | null | undefined;
  }>;
}

export interface SessionContextProps {
  resetPassword: (requestBody: {
    email: string;
    token: string;
    password: string;
    passwordConfirmation: string;
  }) => Promise<boolean>;
  resetPasswordLoading: boolean;

  sendResetPassword: (email: string) => Promise<boolean>;
  sendResetPasswordLoading: boolean;

  sendVerificationEmail: (token: string) => Promise<boolean>;
  sendVerificationEmailLoading: boolean;

  session: string | null;

  signIn: (requestBody: {
    email: string;
    password: string;
    rememberMe?: boolean | undefined;
  }) => Promise<boolean>;
  signInLoading: boolean;

  signOut: (token: string) => Promise<boolean>;
  signOutLoading: boolean;

  signUp: (requestBody: {
    fullName: string;
    email: string;
    password: string;
    passwordConfirmation: string;
  }) => Promise<boolean>;
  signUpLoading: boolean;

  syncUserLoading: boolean;

  user: UserModel | null;

  verifyEmail: (token: string, verificationCode: string) => Promise<boolean>;
  verifyEmailLoading: boolean;
}
