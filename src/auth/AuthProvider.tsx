import { useState, useEffect } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { AuthContext } from "./AuthContext";
import { auth } from "../firebaseConfig";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const isDemo = user?.email === "demouser@gmail.com";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isDemo }}>
      {children}
    </AuthContext.Provider>
  );
};
