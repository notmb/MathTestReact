import "./singIn.css";
import { useState, useEffect } from "react";
import { auth } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import PersonalAccount from "./personalAccount";

const SingIn = (prop: { navigate: (path: string) => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Запобігає оновленню сторінки
    console.log("Form submitted!");
  };

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Signed in successfully!");
    } catch (error) {
      console.error(error);
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
              name="username"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label htmlFor="userpassword">
            Password:
            <input
              id="userpassword"
              className="user_password"
              name="username"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </label>
          <button className="button_for_sing_in" onClick={handleSignIn}>
            Sing In
          </button>
        </form>
        <div className="conteiner_for_text">
          <p>У Вас немає акаута, тоді потрібно</p>
          <div
            onClick={() => prop.navigate("/account/singup")}
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
