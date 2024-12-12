import "./signUp.css";
import { useState, useEffect } from "react";
import PersonalAccount from "./personalAccount";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";

const SingUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    console.log("sing");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("User registered successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <PersonalAccount>
      <div className="sing_up_sing_in">
        <form className="form_for_singin_signup">
          <label htmlFor="username">
            User Name:
            <input
              type="text"
              className="user_name"
              id="username"
              name="username"
            />
          </label>

          <label htmlFor="useremail">
            Your email:
            <input
              id="useremail"
              className="user_email"
              name="useremail"
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
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </label>
          <button className="button_for_log_in" onClick={handleSignUp}>
            Sing Up
          </button>
        </form>
      </div>
    </PersonalAccount>
  );
};

export default SingUp;
