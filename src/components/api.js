const config = {
  baseUrl: 'https://nomoreparties.co/v1/wff-cohort-41',
  headers: {
    authorization: 'e5c9c284-f911-40be-bad2-37d729b321df',
    'Content-Type': 'application/json'
  }
};

// Универсальная проверка ответа сервера
function checkResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
}

// Получить информацию о текущем пользователе
export const getUserInfo = () => {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers
  }).then(checkResponse);
};

// Получить начальные карточки
export const getInitialCards = () => {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers
  }).then(checkResponse);
};

// Обновить информацию пользователя (имя и описание)
export const updateUserInfo = (name, about) => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({ name, about })
  }).then(checkResponse);
};

// Добавить новую карточку с названием и ссылкой
export const addNewCard = ({ name, link }) => {
  return fetch(`${config.baseUrl}/cards`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({ name, link })
  }).then(checkResponse);
};

// Поставить лайк карточке по ID
export const addLike = (cardId) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'PUT',
    headers: config.headers
  }).then(checkResponse);
};

// Убрать лайк с карточки по ID
export const removeLike = (cardId) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'DELETE',
    headers: config.headers
  }).then(checkResponse);
};

// Удалить карточку по ID
export const deleteCard = (cardId) => {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers: config.headers
  }).then(checkResponse);
};
