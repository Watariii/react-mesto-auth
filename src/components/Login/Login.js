import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authorize } from "../../utils/auth.js";

import Header from "../Header/Header.js";
import InfoTooltip from "../InfoTooltip/InfoTooltip.js";

function Login({ handleLogin, handleShowInfoTooltip, handleRegStatus }) {
  const [formValue, setFormValue] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formValue;
  const navigate = useNavigate();

  function handleChangeForm(evt) {
    const { name, value } = evt.target;
    setFormValue({ ...formValue, [name]: value });
  }
  function handleSubmit(evt) {
    evt.preventDefault();
    const { email, password } = formValue;
    authorize({ email, password })
      .then((data) => {
        handleLogin(formValue);
        localStorage.setItem("token", data.token);
        navigate("/");
      })
      .catch((err) => {
        handleRegStatus(false);
        handleShowInfoTooltip();
        setFormValue({
          email: "",
          password: "",
        });
        console.log(err);
      });
  }
  return (
    <>
      <Header navText="Регистрация" adress="sign-up" />
      <section className="sign">
        <div className="sign__container">
          <h1 className="sign__title">Вход</h1>
          <form
            onChange={handleChangeForm}
            onSubmit={handleSubmit}
            className="sign__form"
          >
            <input
              className="sign__input"
              name="email"
              type="email"
              placeholder="Email"
              required
              value={email}
            ></input>
            <input
              className="sign__input"
              name="password"
              type="password"
              minLength="2"
              maxLength="30"
              placeholder="Пароль"
              required
              value={password}
            ></input>
            <button className="sign__button">Войти</button>
          </form>
        </div>
      </section>
      <InfoTooltip />
    </>
  );
}

export default Login;
