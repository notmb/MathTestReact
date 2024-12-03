import "./logIn.css";
import PersonalAccount from "./personalAccount";

const LogIn = (prop: { navigate: (path: string) => void }) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Запобігає оновленню сторінки
    console.log("Form submitted!");
  };

  return (
    <PersonalAccount>
      <div className="sing_up_lod_in">
        <form className="form_for_login_signup" onSubmit={handleSubmit}>
          <label htmlFor="username">
            User Name:
            <input
              type="text"
              className="user_name"
              id="username"
              name="username"
            />
          </label>

          <label htmlFor="userpassword">
            Password:
            <input
              type="text"
              className="user_password"
              id="userpassword"
              name="username"
            ></input>
          </label>
          <button className="button_for_log_in">Log In</button>
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
export default LogIn;
