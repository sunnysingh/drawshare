import {
  useEffect,
  useState,
  useContext,
  createContext,
  FunctionComponent,
  ReactNode,
} from "react";

import { api } from "api";

type AuthResponse = {
  accessToken: string;
  authentication: {
    accessToken: string;
    strategy: string;
    payload: {
      aud: string;
      exp: number;
      iat: number;
      iss: string;
      jti: string;
      sub: string;
    };
  };
  user: {
    _id: string;
    email: string;
  };
};

type AuthContextProps = {
  isAuthenticated: boolean;
  email: string;
  id: string;
};

const AuthContext = createContext<Partial<AuthContextProps>>({});

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: FunctionComponent<AuthProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthContextProps | null>(null);

  useEffect(() => {
    api
      .reAuthenticate()
      .then((auth: AuthResponse) =>
        setUser({
          isAuthenticated: true,
          email: auth.user.email,
          id: auth.user._id,
        })
      )
      .catch(() => {
        setUser({
          isAuthenticated: false,
          email: "",
          id: "",
        });
      });
  }, [api, setUser]);

  if (!user) return null;

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
