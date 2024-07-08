import { createContext, useContext, useState } from "react";
import { useCookies } from "react-cookie";

export interface AuthContextType {
  id: string,
  changeId: (newId: string) => void,
  email: string,
  changeEmail: (newEmail: string) => void,
  getToken: () => string | boolean | undefined,
  changeToken: (token: string) => void,
}

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [cookies, setCookie] = useCookies<"token", { token?: string }>(['token']);

  function changeId(newId: string) {
    setId(id);
  }

  function changeEmail(newEmail: string) {
    setEmail(newEmail);
  }

  function getToken() {
    return cookies.token;
  }

  function changeToken(token: string) {
    setCookie('token', token, { path: '/' });
  }

  const ctxValue = {
    id,
    changeId,
    email,
    changeEmail,
    getToken,
    changeToken,
  };

  return (
    <AuthContext.Provider value={ctxValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}