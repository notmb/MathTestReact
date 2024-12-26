import MainPage from "./components/mainPage";
import TestsOld from "./components/mainContent/testsold";
import Tests from "./components/mainContent/tests";
import SingIn from "./components/account/singIn";
import SingUp from "./components/account/signUp";
import SortingByClass from "./components/mainContent/sortingbyclass";

const routes = [
  {
    path: "/MathTestReact/main",
    component: MainPage,
  },
  {
    path: "/MathTestReact/testsold",
    component: TestsOld,
  },
  {
    path: "/MathTestReact/conspectus",
    component: Tests,
  },
  {
    path: "/MathTestReact/study",
    component: MainPage,
  },
  {
    path: "/MathTestReact/account/login",
    component: SingIn,
  },
  {
    path: "/MathTestReact/account/singup",
    component: SingUp,
  },

  {
    path: "/MathTestReact/tests/sortingbyclass",
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
