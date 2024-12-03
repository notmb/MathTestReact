import "./signUp.css";
import PersonalAccount from "./personalAccount";

const SingUp = () => {
  return (
    <PersonalAccount>
      <div className="sing_up_lod_in">
        <form className="form_for_login_signup">
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
              type="text"
              className="user_email"
              id="useremail"
              name="useremail"
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
          <button className="button_for_log_in">Sing Up</button>
        </form>
      </div>
    </PersonalAccount>
  );
};

export default SingUp;
