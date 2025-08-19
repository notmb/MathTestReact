import { MathJax } from "better-react-mathjax";
import { Comparison } from "../../types";
//КОМПОНЕНТ СПИСКИ ДЛЯ СПІВСТАВЛЕННЯ
const ComparisonData = (props: {
  comparisonTable: Comparison;
  selectedVariant: string;
}) => {
  const mark = ["А", "Б", "В", "Г", "Д"];
  return (
    <div className="comparison_table">
      <div className="box_for_list1">
        <ul className="list1">
          {props.comparisonTable.list1.texts &&
            props.comparisonTable.list1.texts.map((item, index) => (
              <li key={index} className="item_of_comparison">
                {index + 1}) <MathJax dynamic>{item}</MathJax>
              </li>
            ))}
        </ul>
      </div>
      <div className="box_for_list2">
        <ul className="list2">
          {props.comparisonTable.list2.texts &&
            props.comparisonTable.list2.texts.map((item, index) => (
              <li key={index} className="item_of_comparison">
                {mark[index]}) <MathJax dynamic>{item}</MathJax>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};
//КОМПОНЕНТ СПИСКИ ДЛЯ СПІВСТАВЛЕННЯ
export default ComparisonData;
