import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Header from "../Header/Header.js";
import { register } from "../../utils/auth.js";

function Register({ handleShowInfoTooltip, handleRegStatus }) {
  const [formValue, setFormValue] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  function handleChangeForm(evt) {
    const { name, value } = evt.target;
    setFormValue({ ...formValue, [name]: value });
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    const { email, password } = formValue;
    register({ email, password })
      .then(() => {
        handleRegStatus(true);
        handleShowInfoTooltip();
        navigate("/sign-in", { replace: true });
      })
      .catch((err) => {
        handleRegStatus(false); 
        handleShowInfoTooltip();
        setFormValue({
          email: "",
          password: "",
        })
        console.log(err);
      });
  }

  return (
    <>
      <Header navText="Войти" adress="sign-in" />
      <section className="sign">
        <div className="sign__container">
          <h1 className="sign__title">Регистрация</h1>
          <form
            onChange={handleChangeForm}
            onSubmit={handleSubmit}
            className="sign__form"
          >
            <input
              className="sign__input"
              name="email"
              type="'email"
              placeholder="Email"
              required
            ></input>
            <input
              className="sign__input"
              name="password"
              type="password"
              minLength="2"
              maxLength="30"
              placeholder="Пароль"
              required
            ></input>
            <button className="sign__button">Зарегистрироваться</button>
          </form>
          <p className="sign__text">
            Уже зарегистрированы?{" "}
            <Link to="/sign-in" className="sign__link">
              Войти
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
export default Register;
