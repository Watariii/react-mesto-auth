import React from "react";
import Header from "./Header/Header.js";
import Main from "./Main/Main.js";
import Footer from "./Footer/Footer.js";
import PopupWithForm from "./PopUpWithForm/PopUpWithForm.js";
import ImagePopup from "./ImagePopup/ImagePopup.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import api from "../utils/api.js";
import EditProfilePopup from "./EditProfilePopup/EditProfilePopup.js";
import EditAvatarPopup from "./EditAvatarPopup/EditAvatarPopup.js";
import AddPlacePopup from "./AddPlacePopup/AddPlacePopup.js";

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

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header />

      <Main
        onEditProfile={handleEditProfileClick}
        onAddPlace={handleAddCardClick}
        onEditAvatar={handleEditAvatarClick}
        onCardClick={handleCardClick}
        onCardLike={handleCardLike}
        onCardDelete={handleCardDelete}
        cards={cards}
      />
      <Footer />

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
    </CurrentUserContext.Provider>
  );
}

export default App;
