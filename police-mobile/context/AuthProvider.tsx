import { ReactNode, createContext, useState } from 'react';

export interface AuthProps {
  id: string;
  email: string;
  pass: string;
  accessToken: string;
  type: string;
  module: boolean;
}

const AuthContext = createContext({
  auth: {} as Partial<AuthProps>,
  setAuth: (auth: any) => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState({});

  return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
