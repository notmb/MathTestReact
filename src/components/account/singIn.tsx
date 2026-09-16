import { signInWithEmailAndPassword } from "firebase/auth";
import { useImmer } from "use-immer";
import { auth } from "../../firebaseConfig";
import PersonalAccount from "./personalAccount";

const DEMO_LOGIN = "demouser@gmail.com";
const DEMO_PASS = "DEMOuser";
// const DEMO_PASS = "";

const SingIn = (props: { navigate: (path: string) => void }) => {
  const [formData, updateFormData] = useImmer({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData((draft) => {
      if (name === "email" || name === "password") {
        draft[name] = value;
      }
    });
  };

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      props.navigate("/MathTestReact/main");
    } catch (error) {
      console.error("Sign in error:", error);
      alert("Sign in failed: " + (error as Error).message);
    }
  };

  const handleDemoUserSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, DEMO_LOGIN, DEMO_PASS);
      props.navigate("/MathTestReact/main");
    } catch (error) {
      console.error("Sign in error:", error);
      alert("Sign in failed: " + (error as Error).message);
    }
  };

  return (
    <PersonalAccount
      title="Вхід до кабінету"
      subtitle="Увійдіть, щоб керувати тестами."
    >
      <form className="account-form" onSubmit={handleSignIn}>
        <label className="account-field" htmlFor="useremail">
          <span>Email</span>
          <input
            id="useremail"
            name="email"
            type="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </label>

        <label className="account-field" htmlFor="userpassword">
          <span>Пароль</span>
          <input
            id="userpassword"
            type="password"
            name="password"
            placeholder="Введіть пароль"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </label>

        <button className="account-primary-button" type="submit">
          Увійти
        </button>
      </form>

      <div className="account-divider">
        <span>або</span>
      </div>

      <button
        className="account-secondary-button"
        type="button"
        onClick={handleDemoUserSignIn}
      >
        Переглянути демо
      </button>

      {/* <p className="account-switch-text">
        Немає акаунта?{" "}
        <button
          type="button"
          onClick={() => props.navigate("/MathTestReact/account/singup")}
        >
          Зареєструватися
        </button>
      </p> */}
    </PersonalAccount>
  );
};

export default SingIn;
