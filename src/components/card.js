export function createCard(cardData, handleDeleteCard, handleLikeCard, openImagePopup, currentUserId, openDeletePopup) {
  const template = document.querySelector('#card-template').content.querySelector('.card');
  const cardElement = template.cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCount = cardElement.querySelector('.card__like-count');
  const deleteButton = cardElement.querySelector('.card__delete-button');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likeCount.textContent = cardData.likes.length;

  // Проверяем, поставил ли текущий пользователь лайк
  const userHasLiked = cardData.likes.some(user => user._id === currentUserId);
  if (userHasLiked) {
    likeButton.classList.add('card__like-button_active');
  }

  // Обработчик лайка
  likeButton.addEventListener('click', () => {
    handleLikeCard(cardData._id, userHasLiked)
      .then(updatedCard => {
        likeCount.textContent = updatedCard.likes.length;
        if (updatedCard.likes.some(user => user._id === currentUserId)) {
          likeButton.classList.add('card__like-button_active');
        } else {
          likeButton.classList.remove('card__like-button_active');
        }
      })
      .catch(err => console.error(err));
  });

  // Показываем кнопку удаления только если карточка принадлежит текущему пользователю
  if (cardData.owner._id !== currentUserId) {
    deleteButton.style.display = 'none';
  } else {
    deleteButton.style.display = 'block';
    deleteButton.addEventListener('click', () => {
      openDeletePopup(cardData._id, cardElement);
    });
  }

  // Открытие попапа с картинкой
  cardImage.addEventListener('click', () => {
    openImagePopup(cardData.link, cardData.name);
  });

  return cardElement;
}