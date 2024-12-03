import MainPage from "./components/mainPage";
import Tests from "./components/mainContent/tests";
import LogIn from "./components/account/logIn";
import SingUp from "./components/account/signUp";

const routes = [
  {
    path: "/main",
    component: MainPage,
  },
  {
    path: "/tests",
    component: Tests,
  },
  {
    path: "/conspectus",
    component: MainPage,
  },
  {
    path: "/study",
    component: MainPage,
  },
  {
    path: "/account/login",
    component: LogIn,
  },
  {
    path: "/account/singup",
    component: SingUp,
  },
];

const Router = (prop: {
  currentPath: string;
  navigate: (path: string) => void;
}) => {
  const route =
    routes.find((route) => route.path === prop.currentPath) || routes[0];
  const Component = route.component;
  return <Component navigate={prop.navigate} />;
};
export default Router;
