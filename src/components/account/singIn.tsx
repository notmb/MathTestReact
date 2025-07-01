import "./personalAccount";
import { useImmer } from "use-immer";
import { auth } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import PersonalAccount from "./personalAccount";

const SingIn = (prop: { navigate: (path: string) => void }) => {
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Запобігає оновленню сторінки
    console.log("Form submitted!");
  };

  const handleSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // якщо кнопка в формі — блокуємо сабміт форми

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;
      console.log("User signed in:", user);
      alert("Sign in successful!");

      // тут можеш викликати navigate або завантажити роль користувача
      // props.navigate("/MathTestReact/main");
    } catch (error) {
      console.error("Sign in error:", error);
      alert("Sign in failed: " + (error as any).message);
    }
  };

  return (
    <PersonalAccount>
      <div className="sing_up_sing_in">
        <form className="form_for_singin_signup" onSubmit={handleSubmit}>
          <label htmlFor="username">
            User Name:
            <input
              className="user_name"
              id="username"
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </label>

          <label htmlFor="userpassword">
            Password:
            <input
              id="userpassword"
              className="user_password"
              type="password"
              name="password"
              placeholder="Email"
              value={formData.password}
              onChange={handleInputChange}
            ></input>
          </label>
          <button className="button_for_sing_in" onClick={handleSignIn}>
            Sing In
          </button>
        </form>
        <div className="conteiner_for_text">
          <p>У Вас немає акаута, тоді потрібно</p>
          <div
            onClick={() => prop.navigate("/MathTestReact/account/singup")}
            className="conteiner_text_sing_up"
          >
            <p className="text_sing_up">Зареєструватись</p>
          </div>
        </div>
      </div>
    </PersonalAccount>
  );
};
export default SingIn;
