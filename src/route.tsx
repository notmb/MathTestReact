import MainPage from "./components/mainPage";
import Tests from "./components/mainContent/tests";

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
