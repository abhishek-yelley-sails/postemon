import axios from "axios";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export interface AuthContextType {
  id: string,
  changeId: (newId: string) => void,
  email: string,
  changeEmail: (newEmail: string) => void,
  getToken: () => string | boolean | undefined,
  changeToken: (token: string) => void,
  isLoggedIn: boolean,
  changeLoggedIn: (state: boolean) => void
}

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [cookies, setCookie] = useCookies(['token', 'isLoggedIn']);

  const changeLoggedIn = useCallback(function changeLoggedIn(state: boolean) {
    setCookie('isLoggedIn', state, { path: '/' });
  }, [setCookie]);

  const changeId = useCallback(function changeId(newId: string) {
    setId(newId);
  }, []);

  const changeEmail = useCallback(function changeEmail(newEmail: string) {
    setEmail(newEmail);
  }, []);

  const getToken = useCallback(function getToken() {
    return cookies.token;
  }, [cookies.token]);

  useEffect(() => {
    async function getCurrentUser() {
      try {
        const response = await axios({
          method: 'get',
          url: 'http://localhost:8080/users/',
          headers: {
            Authorization: 'Bearer ' + getToken(),
          },
        });
        const data = response.data;
        if (data.id) {
          changeId(data.id);
          changeEmail(data.email);
          changeLoggedIn(true);
        }
      } catch (err) {
        changeLoggedIn(false);
      }
    }
    if (cookies.isLoggedIn) {
      getCurrentUser();
    }
  }, [changeId, changeEmail, getToken, changeLoggedIn, cookies.isLoggedIn]);



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
    isLoggedIn: cookies.isLoggedIn as boolean,
    changeLoggedIn,
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