// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

import './pages/index.css'; // если есть стили
import { createCard } from './components/card.js';
import logo from './images/logo.svg';
import {
  getUserInfo,
  getInitialCards,
  updateUserInfo,
  addNewCard,
  addLike,
  removeLike,
  deleteCard
} from './components/api.js';
import { openPopup, closePopup, setPopupCloseByOverlay } from './components/modal.js';
import { enableValidation, clearValidation, validationConfig } from './components/validation.js';

const logoImg = document.querySelector('.header__logo');
const profileImage = document.querySelector('.profile__image');
const editButton = document.querySelector('.profile__edit-button');
const addButton = document.querySelector('.profile__add-button');
const popupEdit = document.querySelector('.popup_type_edit');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupImage = document.querySelector('.popup_type_image');
const placesList = document.querySelector('.places__list');
const popups = document.querySelectorAll('.popup');

const formEditProfile = popupEdit.querySelector('.popup__form');
const nameInput = popupEdit.querySelector('input[name="name"]');
const descriptionInput = popupEdit.querySelector('input[name="description"]');
const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

const formNewPlace = popupNewCard.querySelector('.popup__form');
const placeNameInput = popupNewCard.querySelector('input[name="place-name"]');
const placeLinkInput = popupNewCard.querySelector('input[name="link"]');

const popupConfirmDelete = document.querySelector('#popupConfirmDelete');
const confirmDeleteForm = popupConfirmDelete.querySelector('.popup__form');
const cancelDeleteButton = popupConfirmDelete.querySelector('.popup__cancel-button');

let currentUserId = null;
let cardIdToDelete = null;
let cardElementToDelete = null;

logoImg.src = logo;

// Функция открытия попапа с изображением
function openImagePopup(link, name) {
  const image = popupImage.querySelector('.popup__image');
  const caption = popupImage.querySelector('.popup__caption');
  image.src = link;
  image.alt = name;
  caption.textContent = name;
  openPopup(popupImage);
}

// Функция обработки лайка карточки
function handleLikeCard(cardId, isLiked) {
  if (isLiked) {
    return removeLike(cardId);
  } else {
    return addLike(cardId);
  }
}

// Открыть попап подтверждения удаления карточки
function openDeletePopup(cardId, cardElement) {
  cardIdToDelete = cardId;
  cardElementToDelete = cardElement;
  openPopup(popupConfirmDelete);
}

// Обработчик удаления карточки после подтверждения
confirmDeleteForm.addEventListener('submit', evt => {
  evt.preventDefault();
  if (!cardIdToDelete) return;

  deleteCard(cardIdToDelete)
    .then(() => {
      cardElementToDelete.remove();
      closePopup(popupConfirmDelete);
    })
    .catch(err => {
      console.error('Ошибка удаления карточки:', err);
    })
    .finally(() => {
      cardIdToDelete = null;
      cardElementToDelete = null;
    });
});

// Отмена удаления
cancelDeleteButton.addEventListener('click', () => {
  closePopup(popupConfirmDelete);
  cardIdToDelete = null;
  cardElementToDelete = null;
});

// Рендер массива карточек
function renderCards(cards) {
  cards.forEach(cardData => {
    const cardElement = createCard(cardData, handleDeleteCard, handleLikeCard, openImagePopup, currentUserId, openDeletePopup);
    placesList.append(cardElement);
  });
}

// Получить и отобразить инфо пользователя и карточки
Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cardsData]) => {
    currentUserId = userData._id;

    profileName.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileImage.style.backgroundImage = `url(${userData.avatar})`;

    placesList.innerHTML = '';
    renderCards(cardsData);
  })
  .catch(err => {
    console.error('Ошибка загрузки данных:', err);
  });

// Обработчик редактирования профиля
editButton.addEventListener('click', () => {
  openPopup(popupEdit);
  nameInput.value = profileName.textContent;
  descriptionInput.value = profileDescription.textContent;
  clearValidation(formEditProfile, validationConfig);
});

formEditProfile.addEventListener('submit', evt => {
  evt.preventDefault();
  updateUserInfo(nameInput.value, descriptionInput.value)
    .then(updatedUser => {
      profileName.textContent = updatedUser.name;
      profileDescription.textContent = updatedUser.about;
      closePopup(popupEdit);
    })
    .catch(err => console.error(err));
});

// Обработчик добавления новой карточки
addButton.addEventListener('click', () => {
  openPopup(popupNewCard);
  formNewPlace.reset();
  clearValidation(formNewPlace, validationConfig);
});

formNewPlace.addEventListener('submit', evt => {
  evt.preventDefault();
  addNewCard({ name: placeNameInput.value, link: placeLinkInput.value })
    .then(newCard => {
      const cardElement = createCard(newCard, handleDeleteCard, handleLikeCard, openImagePopup, currentUserId, openDeletePopup);
      placesList.prepend(cardElement);
      formNewPlace.reset();
      clearValidation(formNewPlace, validationConfig);
      closePopup(popupNewCard);
    })
    .catch(err => console.error(err));
});

// Обработчик закрытия попапов по кнопкам закрытия
popups.forEach(popup => {
  popup.querySelector('.popup__close').addEventListener('click', () => closePopup(popup));
  setPopupCloseByOverlay(popup);
});

// Заглушка для handleDeleteCard — в карточках удаление обрабатывается через попап, так что можно просто вернуть Promise.resolve()
function handleDeleteCard(cardId) {
  return Promise.resolve();
}

// Включаем валидацию форм
enableValidation(validationConfig);