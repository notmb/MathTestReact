import MainPage from "./components/mainPage";
import AllTest from "./components/mainContent/tests/allTests";
import SingIn from "./components/account/singIn";
import SingUp from "./components/account/signUp";
import MathTest from "./components/mainContent/tests/mathTests";
import AddNewVariant from "./components/mainContent/creatorVariant/addVariant2";
import SelectedVariant from "./components/mainContent/tests/selectedTest";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import OneTimeLinks from "./components/mainContent/tests/oneTimeTest/oneTimeLinks";
import OneTimeTest from "./components/mainContent/tests/oneTimeTest/oneTimeTest";

const routes = [
  {
    path: "/MathTestReact/main",
    component: MainPage,
  },
  {
    path: "/MathTestReact/tests",
    component: MainPage,
  },
  {
    path: "/MathTestReact/allTest",
    component: AllTest,
  },
  {
    path: "/MathTestReact/allTest/:variant",
    component: SelectedVariant,
  },
  {
    path: "/MathTestReact/allTest/:variant/test",
    component: MathTest,
  },
  {
    path: "/MathTestReact/allTest/:variant/one-time-links",
    component: OneTimeLinks,
    withoutLayout: true, // TODO RENAME
  },
  {
    path: "/MathTestReact/:variant/one-time-test",
    component: OneTimeTest,
    withoutLayout: true, // TODO RENAME
  },

  {
    path: "/MathTestReact/study",
    component: AddNewVariant,
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
    component: MathTest,
  },
];

const matchPath = (
  routePath: string,
  currentPath: string
): null | { [key: string]: string } => {
  const routeSegments = routePath.split("/");
  const currentSegments = currentPath.split("/");

  if (routeSegments.length !== currentSegments.length) return null;

  const params: { [key: string]: string } = {};

  for (let i = 0; i < routeSegments.length; i++) {
    const routeSegment = routeSegments[i];
    const currentSegment = currentSegments[i];

    if (routeSegment.startsWith(":")) {
      const paramName = routeSegment.slice(1);
      params[paramName] = currentSegment;
      // console.log(params[paramName]);
    } else if (routeSegment !== currentSegment) {
      return null; // не співпадає
    }
  }

  return params;
};

const Router = (props: {
  currentPath: string;
  navigate: (path: string) => void;
}) => {
  let matchedRoute = routes[0]; // fallback
  let routeParams: { [key: string]: string } = {};

  for (const route of routes) {
    const match = matchPath(route.path, props.currentPath);
    if (match) {
      matchedRoute = route;
      routeParams = match;
      break;
    }
  }

  const Component = matchedRoute.component;
  const selectedVariant =
    routeParams.variant ?? routeParams.variantName ?? "dsds";
  const withoutLayout = matchedRoute.withoutLayout;
  console.log(selectedVariant);
  return (
    <>
      {!withoutLayout && <Header navigate={props.navigate} />}
      <Component
        navigate={props.navigate}
        selectedVariant={selectedVariant}
        selectedLink={selectedVariant}
      ></Component>
      {!withoutLayout && <Footer />}
    </>
  );
};
export default Router;
