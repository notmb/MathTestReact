import "./theoryPartStyle.css";

const TheoreticalPart = (props: { navigate: (path: string) => void }) => {
  return (
    <div className="theoretical_page h-screen bg-blue-100">
      <button
        className="h-10"
        onClick={() =>
          props.navigate("/MathTestReact/theory/createtheorypresentation")
        }
      >
        Створити презентацію
      </button>
      <button
        className="h-10"
        onClick={() =>
          props.navigate("/MathTestReact/theory/editortheorypresentation")
        }
      >
        Редагувати презентацію
      </button>
      <button
        className="h-10"
        onClick={() =>
          props.navigate("/MathTestReact/theory/viewerPresentationPage")
        }
      >
        Переглянути презентацію
      </button>
    </div>
  );
};

export default TheoreticalPart;
