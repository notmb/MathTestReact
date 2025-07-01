import { auth } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import MainPage from "./components/mainPage";
import AllTest from "./components/mainContent/tests/allTests";
import SingIn from "./components/account/singIn";
import SingUp from "./components/account/signUp";
import ContainerForMathTest from "./components/mainContent/tests/containerForMathTests";
// import MathTest from "./components/mainContent/tests/mathTests";
import AddNewVariant from "./components/mainContent/creatorVariant/addVariant2";
import SelectedVariant from "./components/mainContent/tests/selectedTest";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import OneTimeLinks from "./components/mainContent/tests/oneTimeTest/oneTimeLinks";
import OneTimeTest from "./components/mainContent/tests/oneTimeTest/oneTimeTest";
import VariantContextWrapper from "./components/mainContent/tests/variantContextWrapper";
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
    path: "/MathTestReact/allTest/selectedVariant/:variant",
    component: SelectedVariant,
  },
  {
    path: "/MathTestReact/allTest/selectedVariant/:variant/test",
    component: ContainerForMathTest,
  },
  {
    path: "/MathTestReact/allTest/selectedVariant/:variant/one-time-links",
    component: OneTimeLinks,
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
    component: ContainerForMathTest,
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
  const [user, setUser] = useState(auth.currentUser);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  if (!authChecked) {
    // Показати спінер чи порожній div, поки не з'ясували auth стан
    return <div>Loading...</div>;
  }

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
    routeParams.variant ?? routeParams.variantName ?? "none";
  const withoutLayout = matchedRoute.withoutLayout;

  const content = (
    <VariantContextWrapper variant={selectedVariant}>
      <Component
        navigate={props.navigate}
        selectedVariant={selectedVariant}
        selectedLink={selectedVariant}
      />
    </VariantContextWrapper>
  );
  if (
    !user &&
    ![
      "/MathTestReact/account/login",
      "/MathTestReact/:variant/one-time-test",
    ].includes(matchedRoute.path)
  ) {
    // Якщо не залогінений, і це не сторінка логіну
    return (
      <>
        {!withoutLayout && <Header navigate={props.navigate} />}
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h2>Access denied</h2>
          <p>Please log in to view this page.</p>
          <button
            onClick={() => props.navigate("/MathTestReact/account/login")}
          >
            Go to Login
          </button>
        </div>
        {!withoutLayout && <Footer />}
      </>
    );
  } else
    return (
      <>
        {!withoutLayout && <Header navigate={props.navigate} />}
        {content}
        {!withoutLayout && <Footer />}
      </>
    );
};
export default Router;
