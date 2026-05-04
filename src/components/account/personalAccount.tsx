import "./personalAccount.css";
import { ReactNode } from "react";

interface PersonalAccountProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

const PersonalAccount = ({ children, title, subtitle }: PersonalAccountProps) => {
  return (
    <section className="account-page">
      <div className="account-hero">
        <p className="account-kicker">MathTestReact</p>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="account-card">{children}</div>
    </section>
  );
};

export default PersonalAccount;
