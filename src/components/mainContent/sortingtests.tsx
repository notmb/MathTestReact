import "./sortingtests.css";
import { ReactNode } from "react";

interface PersonalAccountProps {
  children: ReactNode; // Оголошення пропса для дочірнього вмісту
}

const SortingTests = ({ children }: PersonalAccountProps) => {
  return <div className="sorting_test">{children}</div>;
};
export default SortingTests;
