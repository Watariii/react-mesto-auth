import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Main from "./Main/Main.js";
import PopupWithForm from "./PopUpWithForm/PopUpWithForm.js";
import ImagePopup from "./ImagePopup/ImagePopup.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import api from "../utils/api.js";
import EditProfilePopup from "./EditProfilePopup/EditProfilePopup.js";
import EditAvatarPopup from "./EditAvatarPopup/EditAvatarPopup.js";
import AddPlacePopup from "./AddPlacePopup/AddPlacePopup.js";
import Login from "./Login/Login.js";
import Register from "./Register/Register.js";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute.js";
import { getUsersMe } from "../utils/auth.js";
import InfoTooltip from "./InfoTooltip/InfoTooltip.js";

function App() {
  const [isEditProfilePopUpOpen, setIsEditProfilePopUpOpen] =
    React.useState(false);
  const [isAddCardPopUpOpen, setIsAddCardPopUpOpen] = React.useState(false);
  const [isEditAvatarPopUpOpen, setIsEditAvatarPopUpOpen] =
    React.useState(false);
  const [isImagePopUpOpen, setIsImagePopUpOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({
    name: "",
    link: "#",
  });

  const [currentUser, setCurrentUser] = React.useState({
    name: "",
    about: "",
    avatar: "",
  });
  const [cards, setCards] = React.useState([]);

  const [loggedIn, setLoggedIn] = React.useState(false);

  const [userEmail, setUserEmail] = React.useState("");

  const navigate = useNavigate();

  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false);

  const [regStatus, setRegStatus] = React.useState(true);

  //монтирование
  React.useEffect(() => {
    Promise.all([api.getInitialCards(), api.getUserInfo()])
      .then(([cards, userData]) => {
        setCurrentUser(userData);
        setCards(cards);
      })
      .catch((err) => {
        alert(err);
      });
  }, []);

  function handleEditProfileClick() {
    setIsEditProfilePopUpOpen(!isEditProfilePopUpOpen);
  }
  function handleAddCardClick() {
    setIsAddCardPopUpOpen(!isAddCardPopUpOpen);
  }
  function handleEditAvatarClick() {
    setIsEditAvatarPopUpOpen(!isEditAvatarPopUpOpen);
  }

  function handleCardClick(card) {
    setIsImagePopUpOpen(!isImagePopUpOpen);
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setIsEditProfilePopUpOpen(false);
    setIsAddCardPopUpOpen(false);
    setIsEditAvatarPopUpOpen(false);
    setIsImagePopUpOpen(false);
    setIsInfoTooltipOpen(false);
    setTimeout(() => setSelectedCard({ name: "", link: "#" }), 400);
  }
  function handleCardLike(card) {
    const isLiked = card.likes.some((item) => item._id === currentUser._id);

    api
      .changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setCards((stateCard) =>
          stateCard.map((item) => (item._id === card._id ? newCard : item))
        );
      })
      .catch((err) => {
        alert(err);
      });
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((stateCard) =>
          stateCard.filter((item) => item._id !== card._id)
        );
      })
      .catch((err) => {
        alert(err);
      });
  }

  function handleUpdateUser(inputValues) {
    api
      .editUserInfo(inputValues)
      .then((userData) => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch((err) => {
        alert(err);
      });
  }

  function handleUpdateAvatar(inputValue) {
    api
      .updateAvatar(inputValue)
      .then((userData) => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch((err) => {
        alert(err);
      });
  }

  function handleAddPlaceSubmit(newCard) {
    api
      .addNewCard(newCard)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        alert(err);
      });
  }

  function handleLogin({ email }) {
    setLoggedIn(true);
    setUserEmail(email);
  }
  function handleLogout() {
    const token = localStorage.getItem("token");
    if (token) {
      localStorage.removeItem("token");
    }
  }

  function checkToken() {
    const token = localStorage.getItem("token");
    if (token) {
      getUsersMe(token)
        .then(({ data }) => {
          handleLogin(data);
          navigate("/");
        })
        .catch((err) => {
          alert(err);
        });
    }
  }

  function handleShowInfoTooltip() {
    setIsInfoTooltipOpen(true);
  }

  function handleRegStatus(status) {
    setRegStatus(status);
  }

  React.useEffect(() => {
    checkToken();
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Routes>
        //защищает компонент main от ввода url вручную
        <Route
          path="/"
          element={
            <ProtectedRoute
              Component={Main}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddCardClick}
              onEditAvatar={handleEditAvatarClick}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
              cards={cards}
              loggedIn={loggedIn}
              userEmail={userEmail}
              handleLogout={handleLogout}
            />
          }
        />
        //направляет пользователя на '/' или '/sign-in' в зависимости от
        авторизации , если тот введёт несуществующую ссылку после типа
        '/fdgfdgd'
        <Route
          path="*"
          element={
            loggedIn ? <Navigate to="/" /> : <Navigate to="/sign-in" replace />
          }
        />
        <Route
          //авторизация
          path="/sign-in"
          element={<Login handleLogin={handleLogin} handleShowInfoTooltip={handleShowInfoTooltip} handleRegStatus={handleRegStatus} />}
        />
        <Route
          //регистрация
          path="/sign-up"
          element={<Register handleShowInfoTooltip={handleShowInfoTooltip} handleRegStatus={handleRegStatus} />}
        />
      </Routes>
      <EditProfilePopup
        isOpen={isEditProfilePopUpOpen}
        onClose={closeAllPopups}
        onUpdateUser={handleUpdateUser}
      />
      <AddPlacePopup
        isOpen={isAddCardPopUpOpen}
        onClose={closeAllPopups}
        onAddPlace={handleAddPlaceSubmit}
      />

      <PopupWithForm
        name="delete-card"
        title="Вы уверены?"
        buttonText="Да"
      ></PopupWithForm>

      <EditAvatarPopup
        isOpen={isEditAvatarPopUpOpen}
        onClose={closeAllPopups}
        onUpdateAvatar={handleUpdateAvatar}
      />

      <ImagePopup
        isOpen={isImagePopUpOpen}
        card={selectedCard}
        onClose={closeAllPopups}
      />
      <InfoTooltip isOpen={isInfoTooltipOpen} onClose={closeAllPopups} regStatus={regStatus} />
    </CurrentUserContext.Provider>
  );
}

export default App;
