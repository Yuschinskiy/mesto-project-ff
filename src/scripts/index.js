// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

console.log('Hello, World!');

import logo from '../images/logo.svg';
import avatar from '../images/avatar.jpg';
import 'regenerator-runtime/runtime';
import 'core-js/stable';
import '../pages/index.css'; // добавьте импорт главного файла стилей
import { initialCards } from './cards.js';
console.log(initialCards);

const numbers = [2, 3, 5];

// Стрелочная функция. Не запнётся ли на ней Internet Explorer?
const doubledNumbers = numbers.map(number => number * 2);

console.log(doubledNumbers); // 4, 6, 10

const logoImg = document.querySelector('.header__logo');
logoImg.src = logo;

const profileImage = document.querySelector('.profile__image');
profileImage.style.backgroundImage = `url(${avatar})`;

// --- Получаем элементы попапов и кнопок ---
const editButton = document.querySelector('.profile__edit-button');
const addButton = document.querySelector('.profile__add-button');
const popupEdit = document.querySelector('.popup_type_edit');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupImage = document.querySelector('.popup_type_image');

// --- Функции открытия и закрытия попапов ---
function openPopup(popup) {
  popup.classList.add('popup_is-opened');
  document.addEventListener('keydown', handleEscClose);
}

function closePopup(popup) {
  popup.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', handleEscClose);
}

// --- Открытие попапов ---
editButton.addEventListener('click', () => {
  openPopup(popupEdit);
  const nameInput = popupEdit.querySelector('input[name="name"]');
  const descriptionInput = popupEdit.querySelector('input[name="description"]');
  nameInput.value = document.querySelector('.profile__title').textContent;
  descriptionInput.value = document.querySelector('.profile__description').textContent;
});

addButton.addEventListener('click', () => {
  openPopup(popupNewCard);
  popupNewCard.querySelector('form').reset();
});

// --- Закрытие попапов по крестику ---
const closeButtons = document.querySelectorAll('.popup__close');
closeButtons.forEach(button => {
  button.addEventListener('click', () => {
    const popup = button.closest('.popup');
    closePopup(popup);
  });
});

// --- Закрытие попапа при клике на оверлей ---
document.querySelectorAll('.popup').forEach(popup => {
  popup.addEventListener('mousedown', (evt) => {
    if (evt.target === popup) {
      closePopup(popup);
    }
  });
});

// --- Функция для создания карточки ---
function createCard(cardData, handleDeleteCard, handleLikeCard) {
  const cardTemplate = document.querySelector('#card-template').content.querySelector('.card');
  const cardElement = cardTemplate.cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button'); // кнопка лайка

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;


  // Открытие попапа с изображением
  cardImage.addEventListener('click', () => {
    openImagePopup(cardData.link, cardData.name);
  });

  deleteButton.addEventListener('click', () => {
    handleDeleteCard(cardElement);
  });

// Обработчик лайка
  likeButton.addEventListener('click', () => {
    handleLikeCard(likeButton);
  });

  return cardElement;
}

// --- Изменение лайка ---
function handleLikeCard(likeButton) {
  likeButton.classList.toggle('card__like-button_is-active');
}

// --- Функция для удаления карточки ---
function deleteCard(cardElement) {
  cardElement.remove();
}

// --- Открытие попапа с изображением ---
function openImagePopup(link, name) {
  const imagePopup = document.querySelector('.popup_type_image');
  const image = imagePopup.querySelector('.popup__image');
  const caption = imagePopup.querySelector('.popup__caption');

  image.src = link;
  image.alt = name;
  caption.textContent = name;

  openPopup(imagePopup);
}

// --- Добавление карточек на страницу ---
const placesList = document.querySelector('.places__list');

initialCards.forEach(cardData => {
  const cardElement = createCard(cardData, deleteCard, handleLikeCard);
  placesList.append(cardElement);
});

// При добавлении новой карточки тоже передаем обработчик лайка
formNewPlace.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const newCardData = {
    name: placeNameInput.value,
    link: placeLinkInput.value
  };

  const cardElement = createCard(newCardData, deleteCard, handleLikeCard);
  placesList.prepend(cardElement);

  formNewPlace.reset();
  closePopup(popupNewCard);
});

// Открытие попапа редактирования профиля
editButton.addEventListener('click', () => {
  openPopup(popupEdit);
  const nameInput = popupEdit.querySelector('input[name="name"]');
  const descriptionInput = popupEdit.querySelector('input[name="description"]');
  nameInput.value = profileName.textContent;
  descriptionInput.value = profileDescription.textContent;
});

// Обработчик отправки формы редактирования профиля
const formEditProfile = popupEdit.querySelector('.popup__form');
const nameInput = popupEdit.querySelector('input[name="name"]');
const descriptionInput = popupEdit.querySelector('input[name="description"]');
const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

formEditProfile.addEventListener('submit', (evt) => {
  evt.preventDefault();
  profileName.textContent = nameInput.value;
  profileDescription.textContent = descriptionInput.value;
  closePopup(popupEdit);
});

// Открытие попапа добавления новой карточки
addButton.addEventListener('click', () => {
  openPopup(popupNewCard);
  popupNewCard.querySelector('form').reset();
});

// Обработчик отправки формы добавления новой карточки
const formNewPlace = popupNewCard.querySelector('.popup__form');
const placeNameInput = popupNewCard.querySelector('input[name="place-name"]');
const placeLinkInput = popupNewCard.querySelector('input[name="link"]');

formNewPlace.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const newCardData = {
    name: placeNameInput.value,
    link: placeLinkInput.value
  };

  const cardElement = createCard(newCardData, deleteCard);
  placesList.prepend(cardElement);

  formNewPlace.reset();
  closePopup(popupNewCard);
});



