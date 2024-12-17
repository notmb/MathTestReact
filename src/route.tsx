import MainPage from "./components/mainPage";
import TestsOld from "./components/mainContent/testsold";
import Tests from "./components/mainContent/tests";
import SingIn from "./components/account/singIn";
import SingUp from "./components/account/signUp";
import SortingByClass from "./components/mainContent/sortingbyclass";

const routes = [
  {
    path: "/main",
    component: MainPage,
  },
  {
    path: "/testsold",
    component: TestsOld,
  },
  {
    path: "/conspectus",
    component: Tests,
  },
  {
    path: "/study",
    component: MainPage,
  },
  {
    path: "/account/login",
    component: SingIn,
  },
  {
    path: "/account/singup",
    component: SingUp,
  },

  {
    path: "/tests/sortingbyclass",
    component: SortingByClass,
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
