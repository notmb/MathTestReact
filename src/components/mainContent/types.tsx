import { Timestamp } from "firebase/firestore";
export type TaskType = "choice" | "comparison" | "openAnswer";

export interface Task1 {
  //С‚РёРї РґР°РЅРёС… РґР»СЏ Р·Р°РІРґР°РЅРЅСЏ Р· Р· РІРёР±РѕСЂРѕРј 1 РІС–РґРїРѕРІС–РґС–
  task: Question;
  answers: Answers;
  correctAnswer: string;
  typeOfTask: "choice";
}
export interface Task2 {
  //С‚РёРї РґР°РЅРёС… РґР»СЏ Р·Р°РІРґР°РЅРЅСЏ СЃРїС–РІСЃС‚Р°РІР»РµРЅРЅСЏ
  task: Question;
  comparisonTable: ComparisonTable;
  correctComparison: CorrectComparison;
  typeOfTask: "comparison";
}
export interface Task3 {
  //С‚РёРї РґР°РЅРёС… РґР»СЏ Р·Р°РІРґР°РЅРЅСЏ Р· РІС–РґРєСЂРёС‚РѕСЋ РІС–РґРїРѕРІС–РґРґСЋ
  task: Question;
  correctAnswer: string;
  typeOfTask: "openAnswer";
}
export interface Question {
  text: string;
  table?: {
    value1: string[];
    value2: string[];
  };
  picture?: string;
  list?: string[];
}
export interface Answers {
  values: string[];
  pictures?: string[];
}
export interface ComparisonTable {
  list1: {
    texts?: string[];
    pictures?: string[];
  };
  list2: {
    texts?: string[];
    pictures?: string[];
  };
}
interface CorrectComparison {
  [key: string]: string;
}
export interface Tasks {
  // РљРѕР»РµРєС†С–СЏ Р· СЂС–Р·РЅРёРјРё Р·Р°РІРґР°РЅРЅСЏРјРё
  [key: string]: Task1 | Task2 | Task3;
}
export interface Comparison {
  list1: {
    texts?: string[];
    pictures?: string[];
  };
  list2: {
    texts?: string[];
    picture?: string[];
  };
}

export interface VaiantData {
  id?: string;
  typeTest?: string;
  variantName: string;
  createdAt: Timestamp;
  numberOfTasks: string;
  variantSerialNumber: string;
}

