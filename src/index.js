import './pages/index.css'; 

import { createCard } from './components/card.js'; 

import logo from './images/logo.svg'; 

import { 
  getUserInfo, 
  getInitialCards, 
  updateUserInfo, 
  addNewCard, 
  addLike, 
  removeLike, 
  deleteCard, 
  updateUserAvatar 
} from './components/api.js'; 

import { openPopup, closePopup, setPopupCloseByOverlay, openImagePopup } from './components/modal.js';

import { enableValidation, clearValidation } from './components/validation.js'; 

import avatar from './images/avatar.jpg'; 

// --- Находим DOM-элементы ---

const logoImg = document.querySelector('.header__logo'); 

const profileAvatarImage = document.querySelector('.profile__image'); 
const avatarEditButton = document.querySelector('.profile__avatar-edit-button'); 
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
// const cancelDeleteButton = popupConfirmDelete.querySelector('.popup__cancel-button'); // Убрано, кнопки нет

const popupEditAvatar = document.querySelector('.popup_type_edit-avatar'); 
const formEditAvatar = popupEditAvatar.querySelector('.popup__form'); 
const avatarInput = formEditAvatar.querySelector('input[name="avatar-link"]'); 

// Получаем кнопки отправки форм
const profileSubmitButton = formEditProfile.querySelector('.popup__submit');
const newPlaceSubmitButton = formNewPlace.querySelector('.popup__submit');
const avatarSubmitButton = formEditAvatar.querySelector('.popup__submit');

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__submit',
  inactiveButtonClass: 'popup__submit_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

// Для popupImage: найдём элементы один раз
const popupImageImg = popupImage.querySelector('.popup__image');
const popupImageCaption = popupImage.querySelector('.popup__caption');

let currentUserId = null; 
let cardIdToDelete = null; 
let cardElementToDelete = null; 

// --- Устанавливаем логотип ---
logoImg.src = logo; 

// Устанавливаем аватар по умолчанию (локальный файл)
if (profileAvatarImage) {
  profileAvatarImage.style.backgroundImage = `url(${avatar})`;
}

function renderLoading(buttonElement, isLoading, loadingText = 'Сохранение...') {
  if (!buttonElement.dataset.originalText) {
    buttonElement.dataset.originalText = buttonElement.textContent;
  }
  if (isLoading) {
    buttonElement.textContent = loadingText;
    buttonElement.disabled = true;
  } else {
    buttonElement.textContent = buttonElement.dataset.originalText;
    buttonElement.disabled = false;
  }
}

// --- Обработчик редактирования профиля ---
formEditProfile.addEventListener('submit', evt => {
  evt.preventDefault();
  renderLoading(profileSubmitButton, true);

  updateUserInfo(nameInput.value, descriptionInput.value)
    .then(updatedUser => {
      profileName.textContent = updatedUser.name;
      profileDescription.textContent = updatedUser.about;
      closePopup(popupEdit);
    })
    .catch(err => console.error(err))
    .finally(() => {
      renderLoading(profileSubmitButton, false);
    });
});

// --- Обработчик добавления новой карточки ---
formNewPlace.addEventListener('submit', evt => {
  evt.preventDefault();
  renderLoading(newPlaceSubmitButton, true);

  addNewCard({ name: placeNameInput.value, link: placeLinkInput.value })
    .then(newCard => {
      const cardElement = createCard(newCard, null, handleLikeCard, openImagePopup, currentUserId, openDeletePopup);
      placesList.prepend(cardElement);
      formNewPlace.reset();
      closePopup(popupNewCard);
    })
    .catch(err => console.error(err))
    .finally(() => {
      renderLoading(newPlaceSubmitButton, false);
    });
});

// --- Обработка отправки формы обновления аватара ---
formEditAvatar.addEventListener('submit', evt => {
  evt.preventDefault();
  renderLoading(avatarSubmitButton, true);

  updateUserAvatar(avatarInput.value)
    .then(updatedUser => {
      if (profileAvatarImage) {
        profileAvatarImage.style.backgroundImage = `url(${updatedUser.avatar})`;
      }
      closePopup(popupEditAvatar);
    })
    .catch(err => console.error('Ошибка обновления аватара:', err))
    .finally(() => {
      renderLoading(avatarSubmitButton, false);
    });
});

// --- Функция открытия попапа с изображением ---
function handleOpenImagePopup(link, name) {
  popupImageImg.src = link;
  popupImageImg.alt = name;
  popupImageCaption.textContent = name;
  openPopup(popupImage);
}

// --- Обработчик лайка карточки ---
function handleLikeCard(cardId, isLiked) {
  if (isLiked) {
    return removeLike(cardId);
  } else {
    return addLike(cardId);
  }
}

// --- Открыть попап подтверждения удаления карточки ---
function openDeletePopup(cardId, cardElement) {
  cardIdToDelete = cardId;
  cardElementToDelete = cardElement;
  openPopup(popupConfirmDelete);
}

// --- Обработчик удаления карточки после подтверждения ---
confirmDeleteForm.addEventListener('submit', evt => {
  evt.preventDefault();
  if (!cardIdToDelete) return;

  deleteCard(cardIdToDelete)
    .then(() => {
      cardElementToDelete.remove();
      closePopup(popupConfirmDelete);
      cardIdToDelete = null;
      cardElementToDelete = null;
    })
    .catch(err => {
      console.error('Ошибка удаления карточки:', err);
      // Переменные не очищаем, чтобы можно было повторить попытку
    });
});

// --- Рендер массива карточек ---
function renderCards(cards) {
  cards.forEach(cardData => {
    // Передаём все 6 аргументов в правильном порядке
    const cardElement = createCard(cardData, null, handleLikeCard, openImagePopup, currentUserId, openDeletePopup);
    placesList.append(cardElement);
  });
}

// --- Получить и отобразить инфо пользователя и карточки ---
Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cardsData]) => {
    currentUserId = userData._id;

    profileName.textContent = userData.name;
    profileDescription.textContent = userData.about;

    if (profileAvatarImage) {
      profileAvatarImage.style.backgroundImage = `url(${userData.avatar})`;
    }

    placesList.innerHTML = '';
    renderCards(cardsData);
  })
  .catch(err => {
    console.error('Ошибка загрузки данных:', err);
  });

// --- Обработчик редактирования профиля ---
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

// --- Обработчик добавления новой карточки ---
addButton.addEventListener('click', () => {
  openPopup(popupNewCard);
  formNewPlace.reset();
  clearValidation(formNewPlace, validationConfig);
});

// --- Обработчик закрытия попапов по кнопкам закрытия и оверлею ---
popups.forEach(popup => {
  popup.querySelector('.popup__close').addEventListener('click', () => closePopup(popup));
  setPopupCloseByOverlay(popup);
});

// --- Открытие попапа редактирования аватара ---
function openEditAvatarPopup() {
  openPopup(popupEditAvatar);
  formEditAvatar.reset();
  clearValidation(formEditAvatar, validationConfig);
}

if (profileAvatarImage) {
  profileAvatarImage.addEventListener('click', openEditAvatarPopup);
}

if (avatarEditButton) {
  avatarEditButton.addEventListener('click', openEditAvatarPopup);
}

// --- Обработка отправки формы обновления аватара ---
formEditAvatar.addEventListener('submit', evt => {
  evt.preventDefault();
  const avatarUrl = avatarInput.value;
  updateUserAvatar(avatarUrl)
    .then(updatedUser => {
      if (profileAvatarImage) {
        profileAvatarImage.style.backgroundImage = `url(${updatedUser.avatar})`;
      }
      closePopup(popupEditAvatar);
    })
    .catch(err => console.error('Ошибка обновления аватара:', err));
});

// --- Включаем валидацию форм ---
enableValidation(validationConfig);