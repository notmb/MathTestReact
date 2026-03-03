import { useVariantContext } from "./variantContext";
import LocalMathTest from "./mathTests";

const ContainerForLocalMathTest = (props: { selectedVariant: string }) => {
  const { tasks } = useVariantContext();

  return (
    <>
      <LocalMathTest
        tasks={tasks}
        selectedVariant={props.selectedVariant}
      ></LocalMathTest>
    </>
  );
};

export default ContainerForLocalMathTest;
