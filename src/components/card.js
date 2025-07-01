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

  // Обновляет отображение лайков и кнопки
  function updateLikes() {
    likeCount.textContent = cardData.likes ? cardData.likes.length : 0;
    const liked = cardData.likes && cardData.likes.some(user => user._id === currentUserId);
    if (liked) {
      likeButton.classList.add('card__like-button_is-active');
    } else {
      likeButton.classList.remove('card__like-button_is-active');
    }
  }

  updateLikes();

  likeButton.addEventListener('click', () => { 
    const liked = cardData.likes && cardData.likes.some(user => user._id === currentUserId);

    handleLikeCard(cardData._id, liked) 
      .then(updatedCard => { 
        cardData.likes = updatedCard.likes; // обновляем лайки в локальном объекте
        updateLikes();
      }) 
      .catch(err => console.error('Ошибка при обновлении лайка:', err)); 
  }); 

  if (cardData.owner && cardData.owner._id !== currentUserId) { 
    deleteButton.classList.add('card__delete-button_hidden');
  } else { 
    deleteButton.classList.remove('card__delete-button_hidden');
    deleteButton.addEventListener('click', () => { 
      openDeletePopup(cardData._id, cardElement); 
    }); 
  } 

  cardImage.addEventListener('click', () => { 
    openImagePopup(cardData.link, cardData.name); 
  }); 

  return cardElement; 
}
