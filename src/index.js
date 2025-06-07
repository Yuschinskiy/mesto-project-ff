// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

import './pages/index.css'; 

import { initialCards } from './components/cards.js'; 
import { createCard, handleLikeCard, handleDeleteCard } from './components/card.js'; 
import { openPopup, closePopup, setPopupCloseByOverlay } from './components/modal.js'; 

import logo from './images/logo.svg'; 
import avatar from './images/avatar.jpg'; 

console.log('Hello, World!'); 

// Установка логотипа и аватара 
const logoImg = document.querySelector('.header__logo'); 
logoImg.src = logo; 

const profileImage = document.querySelector('.profile__image'); 
profileImage.style.backgroundImage = `url(${avatar})`; 

// Получение элементов попапов и кнопок 
const editButton = document.querySelector('.profile__edit-button'); 
const addButton = document.querySelector('.profile__add-button'); 
const popupEdit = document.querySelector('.popup_type_edit'); 
const popupNewCard = document.querySelector('.popup_type_new-card'); 
const popupImage = document.querySelector('.popup_type_image'); 

const placesList = document.querySelector('.places__list'); 

// --- Определяем коллекцию всех попапов --- 
const popups = document.querySelectorAll('.popup'); 

// --- Добавляем класс для плавной анимации открытия/закрытия попапов --- 
popups.forEach(popup => {
  popup.classList.add('popup_is-animated');
});

// --- Установка закрытия по оверлею для всех попапов --- 
popups.forEach(setPopupCloseByOverlay); 

// --- Функция открытия попапа с большим изображением --- 
function openImagePopup(link, name) { 
  const image = popupImage.querySelector('.popup__image'); 
  const caption = popupImage.querySelector('.popup__caption'); 

  image.src = link; 
  image.alt = name; 
  caption.textContent = name; 

  openPopup(popupImage); 
} 

// --- Рендер карточек --- 
function renderCards(cards) { 
  cards.forEach(cardData => { 
    // Передаём в createCard функции для удаления, лайка и открытия изображения
    const cardElement = createCard(cardData, handleDeleteCard, handleLikeCard, openImagePopup); 

    // Обработчик клика по изображению добавляется внутри createCard

    placesList.append(cardElement); 
  }); 
} 

// --- Инициализация карточек --- 
renderCards(initialCards); 

// --- Работа с формами --- 
const formEditProfile = popupEdit.querySelector('.popup__form'); 
const nameInput = popupEdit.querySelector('input[name="name"]'); 
const descriptionInput = popupEdit.querySelector('input[name="description"]'); 
const profileName = document.querySelector('.profile__title'); 
const profileDescription = document.querySelector('.profile__description'); 

const formNewPlace = popupNewCard.querySelector('.popup__form'); 
const placeNameInput = popupNewCard.querySelector('input[name="place-name"]'); 
const placeLinkInput = popupNewCard.querySelector('input[name="link"]'); 

// Обработчики открытия попапов с формами 
editButton.addEventListener('click', () => { 
  openPopup(popupEdit); 
  nameInput.value = profileName.textContent; 
  descriptionInput.value = profileDescription.textContent; 
}); 

addButton.addEventListener('click', () => { 
  openPopup(popupNewCard); 
  formNewPlace.reset(); 
}); 

// Обработчики закрытия попапов по кнопке крестика 
const closeButtons = document.querySelectorAll('.popup__close'); 
closeButtons.forEach(button => { 
  button.addEventListener('click', () => { 
    const popup = button.closest('.popup'); 
    closePopup(popup); 
  }); 
}); 

// Обработчик сабмита формы редактирования профиля 
formEditProfile.addEventListener('submit', (evt) => { 
  evt.preventDefault(); 
  profileName.textContent = nameInput.value; 
  profileDescription.textContent = descriptionInput.value; 
  closePopup(popupEdit); 
}); 

// Обработчик сабмита формы добавления новой карточки 
formNewPlace.addEventListener('submit', (evt) => { 
  evt.preventDefault(); 

  const newCardData = { 
    name: placeNameInput.value, 
    link: placeLinkInput.value 
  }; 

  // Передаём openImagePopup в createCard для добавления обработчика клика по изображению
  const cardElement = createCard(newCardData, handleDeleteCard, handleLikeCard, openImagePopup); 

  placesList.prepend(cardElement); 
  formNewPlace.reset(); 
  closePopup(popupNewCard); 
}); 


