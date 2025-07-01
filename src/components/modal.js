// Обработчик закрытия по Escape
function handleCloseByEscape(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');
    if (openedPopup) {
      closePopup(openedPopup);
    }
  }
}

// Функция открытия попапа
function openPopup(popup) {
  popup.classList.add('popup_is-opened');
  document.addEventListener('keydown', handleCloseByEscape);
}

// Функция закрытия попапа
function closePopup(popup) {
  popup.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', handleCloseByEscape);
}

// Обработчик закрытия по клику на оверлей
function setPopupCloseByOverlay(popup) {
  popup.addEventListener('mousedown', (evt) => {
    if (evt.target === popup) {
      closePopup(popup);
    }
  });
}

function openImagePopup(link, name) {
  const popup = document.querySelector('.popup_type_image'); // класс вашего попапа с картинкой
  const popupImage = popup.querySelector('.popup__image');
  const popupCaption = popup.querySelector('.popup__caption');

  popupImage.src = link;
  popupImage.alt = name;
  popupCaption.textContent = name;

  openPopup(popup);
}

export { openPopup, closePopup, setPopupCloseByOverlay, openImagePopup };