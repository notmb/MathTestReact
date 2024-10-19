import AddTask from "./components/mainContent/addTask";
import MainContent from "./components/mainContent/mainContent";

const routes = [
  {
    path: "/test",
    component: MainContent,
  },
  {
    path: "/createtask",
    component: AddTask,
  },
];

const Router = (prop: { currentPath: string }) => {
  const route =
    routes.find((route) => route.path === prop.currentPath) || routes[0];
  const Component = route.component;
  return <Component />;
};
export default Router;
