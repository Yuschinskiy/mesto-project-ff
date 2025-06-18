const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__submit',
  inactiveButtonClass: 'popup__submit_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

// Регулярное выражение для поля "Название" (латиница, кириллица, дефисы, пробелы)
const validPattern = /^[а-яёa-z\s-]+$/i;

// Показывает ошибку под инпутом
function showInputError(formElement, inputElement, errorMessage, validationConfig) {
  const errorElement = formElement.querySelector(`.${inputElement.name}-error`);
  inputElement.classList.add(validationConfig.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(validationConfig.errorClass);
}

// Скрывает ошибку под инпутом
function hideInputError(formElement, inputElement, validationConfig) {
  const errorElement = formElement.querySelector(`.${inputElement.name}-error`);
  inputElement.classList.remove(validationConfig.inputErrorClass);
  errorElement.textContent = '';
  errorElement.classList.remove(validationConfig.errorClass);
}

// Проверяет валидность конкретного инпута в зависимости от формы
function checkInputValidity(formElement, inputElement, validationConfig) {
  const value = inputElement.value.trim();

  if (!value) {
    inputElement.setCustomValidity('');
    if (!inputElement.validity.valid) {
      showInputError(formElement, inputElement, inputElement.validationMessage, validationConfig);
    } else {
      hideInputError(formElement, inputElement, validationConfig);
    }
    return;
  }

  if (formElement.getAttribute('name') === 'new-place') {
    // Валидация формы "Новое место"
    if (inputElement.name === 'place-name') {
      if (!validPattern.test(value)) {
        const message = 'Разрешены только латинские, кириллические буквы, дефисы и пробелы';
        inputElement.setCustomValidity(message);
        showInputError(formElement, inputElement, message, validationConfig);
        return;
      }
      if (value.length < 2 || value.length > 30) {
        const message = 'Должно быть от 2 до 30 символов';
        inputElement.setCustomValidity(message);
        showInputError(formElement, inputElement, message, validationConfig);
        return;
      }
    } else if (inputElement.name === 'link') {
      // Проверка валидного URL через стандартную валидацию браузера
      inputElement.setCustomValidity('');
      if (!inputElement.validity.valid) {
        showInputError(formElement, inputElement, inputElement.validationMessage, validationConfig);
        return;
      }
    }
  } else if (formElement.getAttribute('name') === 'edit-profile') {
    // Валидация формы "Редактировать профиль"
    if ((inputElement.name === 'name' || inputElement.name === 'description') && !validPattern.test(value)) {
      const message = 'Разрешены только латинские, кириллические буквы, дефисы и пробелы';
      inputElement.setCustomValidity(message);
      showInputError(formElement, inputElement, message, validationConfig);
      return;
    }
    if (inputElement.name === 'name' && (value.length < 2 || value.length > 40)) {
      const message = 'Должно быть от 2 до 40 символов';
      inputElement.setCustomValidity(message);
      showInputError(formElement, inputElement, message, validationConfig);
      return;
    }
    if (inputElement.name === 'description' && (value.length < 2 || value.length > 200)) {
      const message = 'Должно быть от 2 до 200 символов';
      inputElement.setCustomValidity(message);
      showInputError(formElement, inputElement, message, validationConfig);
      return;
    }
  }

  // Если ошибок нет, сбрасываем кастомное сообщение и ошибки
  inputElement.setCustomValidity('');
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, validationConfig);
  } else {
    hideInputError(formElement, inputElement, validationConfig);
  }
}

// Проверяет, есть ли невалидные поля в форме
function hasInvalidInput(inputList) {
  return inputList.some((inputElement) => !inputElement.validity.valid);
}

// Активирует или деактивирует кнопку сабмита
function toggleButtonState(inputList, buttonElement, validationConfig) {
  if (hasInvalidInput(inputList)) {
    buttonElement.classList.add(validationConfig.inactiveButtonClass);
    buttonElement.disabled = true;
  } else {
    buttonElement.classList.remove(validationConfig.inactiveButtonClass);
    buttonElement.disabled = false;
  }
}

// Назначает обработчики всем инпутам формы
function setEventListeners(formElement, validationConfig) {
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
  const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, validationConfig);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      checkInputValidity(formElement, inputElement, validationConfig);
      toggleButtonState(inputList, buttonElement, validationConfig);
    });
  });
}

// Включает валидацию для всех форм на странице
function enableValidation(validationConfig) {
  const formList = Array.from(document.querySelectorAll(validationConfig.formSelector));
  formList.forEach((formElement) => {
    formElement.addEventListener('submit', (evt) => {
      evt.preventDefault();
    });
    setEventListeners(formElement, validationConfig);
  });
}

// Очищает ошибки и деактивирует кнопку (для вызова при открытии формы)
function clearValidation(formElement, validationConfig) {
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
  const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);

  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, validationConfig);
    inputElement.setCustomValidity('');
  });

  buttonElement.classList.add(validationConfig.inactiveButtonClass);
  buttonElement.disabled = true;
}

export { enableValidation, clearValidation, validationConfig };