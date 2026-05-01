import React, { createContext } from "react";
import type { User } from "firebase/auth";

type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isDemo: true | false | undefined;
};

export const AuthContext = createContext<AuthContextType | null>(null);
