import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import VariantContextWrapperFromParams from "./context/variantContextWrapperFromParams";
import MainPage from "./components/mainPage";
import AllTest from "./components/mainContent/tests/allTests";
import AddNewVariant from "./components/mainContent/creatorVariant/addVariant2";
import StudentsProfil from "./components/mainContent/studentsProfiles/studentsProfil";
// import SelectedVariant from "./components/mainContent/tests/selectedTest";
import SelectedVariant from "./components/mainContent/tests/selectedVariant/selactedVariant";
import ContainerForMathTest from "./components/mainContent/tests/containerForMathTests";
import LocalTest from "./components/mainContent/tests/localTest/localTest";
// import SignUp from "./components/account/signUp";
// import SingIn from "./components/account/singIn";

const AppRouter = () => {
  console.log("Current pathname:", window.location.pathname);
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/main" replace />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/allTest" element={<AllTest />} />
        <Route path="/newVariant" element={<AddNewVariant />} />
        <Route path="/students" element={<StudentsProfil />} />
        <Route
          path="/allTest/selectedVariant/:type/:variant"
          element={
            <VariantContextWrapperFromParams>
              <Outlet /> {/* усі дочірні компоненти бачать контекст */}
            </VariantContextWrapperFromParams>
          }
        >
          <Route index element={<SelectedVariant />} />
          <Route path="localTest" element={<LocalTest />} />
        </Route>
        {/* 404 */}
        {/* <Route path="*" element={<MainPage />} /> */}

        {/* <Route path="/tests" element={<Tests />} />
      <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </div>
  );
};
export default AppRouter;
