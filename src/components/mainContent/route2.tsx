import Tests from "./tests";

const routes = [
  {
    path: "/test/newtest",
    component: Tests,
  },
];

const Router2 = (prop: { currentPath: string }) => {
  const route =
    routes.find((route) => route.path === prop.currentPath) || routes[0];
  const Component = route.component;
  return <Component />;
};
export default Router2;
