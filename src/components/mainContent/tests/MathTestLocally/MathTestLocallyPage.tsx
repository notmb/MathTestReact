import { useVariantContext } from "../variantContext";
import "./styleMathTestLocally.css";
import LocalMathTest from "./components/LocalMathTest";
const MathTestLocallyPage = () => {
  const { tasks, dataVariant, isLoading, errorMessage } = useVariantContext();

  if (isLoading) {
    return <div className="local-test-status">Завантаження тесту...</div>;
  }

  if (errorMessage) {
    return <div className="local-test-status">{errorMessage}</div>;
  }

  return (
    <LocalMathTest tasks={tasks} dataVariant={dataVariant}></LocalMathTest>
  );
};
export default MathTestLocallyPage;
