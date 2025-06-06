// Функция создания карточки
function createCard(cardData, handleDeleteCard, handleLikeCard) {
  const cardTemplate = document.querySelector('#card-template').content.querySelector('.card');
  const cardElement = cardTemplate.cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  // Обработчики лайка и удаления карточки
  deleteButton.addEventListener('click', () => {
    handleDeleteCard(cardElement);
  });

  likeButton.addEventListener('click', () => {
    handleLikeCard(likeButton);
  });

  // Возвращаем элемент карточки
  return cardElement;
}

// Функция обработки лайка
function handleLikeCard(likeButton) {
  likeButton.classList.toggle('card__like-button_is-active');
}

// Функция удаления карточки
function handleDeleteCard(cardElement) {
  cardElement.remove();
}

// Экспортируем функции
export { createCard, handleLikeCard, handleDeleteCard };