import "./router.css";
import { auth } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import MainPage from "./components/mainPage";
import AllTest from "./components/mainContent/tests/allTests";
import SingIn from "./components/account/singIn";
import SingUp from "./components/account/signUp";
import MathTestLocallyPage from "./components/mainContent/tests/MathTestLocally/MathTestLocallyPage";
import AddNewVariantPage from "./components/mainContent/creatorNewVariant/AddNewVariantPage";
import SelectedVariant from "./components/mainContent/tests/selectedTest";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import OneTimeLinks from "./components/mainContent/tests/oneTimeTest/oneTimeLinks";
import OneTimeLink from "./components/mainContent/tests/oneTimeTest/oneTimeLink/oneTimeLink";
import OneTimeTest from "./components/mainContent/tests/oneTimeTest/test/oneTimeTestPage";
import TestResults from "./components/mainContent/tests/oneTimeTest/testResults";
import VariantContextWrapper from "./components/mainContent/tests/variantContextWrapper";
import StudentsProfil from "./components/mainContent/studentsProfiles/studentsProfil";
import TheoreticalPart from "./components/mainContent/theoreticalPart/TheoreticalPart";
import CreateTeoryPresentation from "./components/mainContent/theoreticalPart/createPresentation/CreateTheoryPresentation";
import TheoryEditorPage from "./components/mainContent/theoreticalPart/editPresentation/TheoryEditorPage";
import ViewerPresentationPage from "./components/mainContent/theoreticalPart/viewerPresentation/ViewerPresentationPage";
const routes = [
  {
    path: "/MathTestReact/main",
    component: MainPage,
  },
  {
    path: "/MathTestReact/student",
    component: StudentsProfil,
  },
  {
    path: "/MathTestReact/allTest",
    component: AllTest,
  },

  { path: "/MathTestReact/theory", component: TheoreticalPart },

  {
    path: "/MathTestReact/theory/createtheorypresentation",
    component: CreateTeoryPresentation,
  },

  {
    path: "/MathTestReact/theory/editortheorypresentation",
    component: TheoryEditorPage,
  },

  {
    path: "/MathTestReact/theory/viewerPresentationPage",
    component: ViewerPresentationPage,
  },

  {
    path: "/MathTestReact/allTest/selectedVariant/:type/:variant",
    component: SelectedVariant,
  },
  {
    path: "/MathTestReact/allTest/selectedVariant/:type/:variant/localtest",
    component: MathTestLocallyPage,
  },
  {
    path: "/MathTestReact/allTest/selectedVariant/:type/:variant/one-time-links",
    component: OneTimeLinks,
  },
  {
    path: "/MathTestReact/allTest/selectedVariant/:type/:variant/one-time-links/results",
    component: TestResults,
  },
  {
    path: "/MathTestReact/:variant/one-time-link",
    component: OneTimeLink,
    withoutLayout: true, // TODO RENAME
  },
  {
    path: "/MathTestReact/:variant/one-time-link/one-time-test",
    component: OneTimeTest,
    withoutLayout: true, // TODO RENAME
  },

  {
    path: "/MathTestReact/study",
    component: AddNewVariantPage,
  },
  {
    path: "/MathTestReact/account/login",
    component: SingIn,
  },
  {
    path: "/MathTestReact/account/singup",
    component: SingUp,
  },
];

const matchPath = (
  routePath: string,
  currentPath: string,
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
  const publicPaths = [
    "/MathTestReact/account/login",
    "/MathTestReact/account/singup",
    "/MathTestReact/:variant/one-time-link",
    "/MathTestReact/:variant/one-time-link/one-time-test",
  ];

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
  const typeTest = routeParams.type || "main";
  const withoutLayout = matchedRoute.withoutLayout;

  const content = (
    <VariantContextWrapper variant={selectedVariant} typeTest={typeTest}>
      <main className="main_content">
        <Component
          navigate={props.navigate}
          selectedVariant={selectedVariant}
        />
      </main>
    </VariantContextWrapper>
  );
  if (!user && !publicPaths.includes(matchedRoute.path)) {
    // Якщо не залогінений, і це не сторінка логіну
    return (
      <>
        <div className="logged_out_screen">
          {!withoutLayout && <Header navigate={props.navigate} />}
          <main className="main_without_log_in">
            <section className="login_prompt" aria-labelledby="login-prompt-title">
              <div className="login_prompt_icon" aria-hidden="true">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="10" width="14" height="11" rx="3" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  <path d="M12 14v3" />
                </svg>
              </div>
              <h2 id="login-prompt-title">Увійдіть, щоб продовжити</h2>
              <p>Ця сторінка доступна після входу в обліковий запис.</p>
              <button
                className="login_prompt_button"
                type="button"
                onClick={() => props.navigate("/MathTestReact/account/login")}
              >
                Увійти в обліковий запис
                <span aria-hidden="true">→</span>
              </button>
            </section>
          </main>
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
