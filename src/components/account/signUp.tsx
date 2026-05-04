import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import PersonalAccount from "./personalAccount";

const SignUp = (props: { navigate: (path: string) => void }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      props.navigate("/MathTestReact/main");
    } catch (error) {
      console.error("Sign up error:", error);
      alert("Sign up failed: " + (error as Error).message);
    }
  };

  return (
    <PersonalAccount
      title="Створити акаунт"
      subtitle="Зареєструйтеся, щоб зберігати учнів, тести та результати."
    >
      <form className="account-form" onSubmit={handleSignUp}>
        <label className="account-field" htmlFor="username">
          <span>Ім'я</span>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Ваше ім'я"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label className="account-field" htmlFor="useremail">
          <span>Email</span>
          <input
            id="useremail"
            name="useremail"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="account-field" htmlFor="userpassword">
          <span>Пароль</span>
          <input
            id="userpassword"
            name="password"
            type="password"
            placeholder="Мінімум 6 символів"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button className="account-primary-button" type="submit">
          Зареєструватися
        </button>
      </form>

      <p className="account-switch-text">
        Вже маєте акаунт?{" "}
        <button
          type="button"
          onClick={() => props.navigate("/MathTestReact/account/login")}
        >
          Увійти
        </button>
      </p>
    </PersonalAccount>
  );
};

export default SignUp;
