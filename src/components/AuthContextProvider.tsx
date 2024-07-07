import { createContext, useContext, useState } from "react";

export const AuthContext = createContext({
  name: "",
  changeName: (newName: string) => { },
});

export default function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState("Abhi");

  function changeName(newName: string) {
    setName(newName);
  }

  const ctxValue = {
    name,
    changeName,
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