import "./personalAccount.css";
import { ReactNode } from "react";

interface PersonalAccountProps {
  children: ReactNode; // Оголошення пропса для дочірнього вмісту
}

const PersonalAccount = ({ children }: PersonalAccountProps) => {
  return <div className="container_for_login_singup">{children}</div>;
};
export default PersonalAccount;
