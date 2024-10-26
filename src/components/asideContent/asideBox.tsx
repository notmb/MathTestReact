import "./asideBox.css";
import AddTask from "../mainContent/addTask";
import AsideNavigate from "./asideNavigate";

const AsideBox = (prop: { navigate: (path: string) => void }) => {
  return (
    <div className="aside_box">
      <AsideNavigate navigate={prop.navigate} />
      {/* <AddTask /> */}
    </div>
  );
};
export default AsideBox;
