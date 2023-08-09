'use strict';
window.onload = () => {
    document.getElementById('name').onkeydown = (event) => {
        if (!isNaN(parseInt(event.key))) {
            return false;
        }
    }
    document.getElementById('username').onkeydown = (event) => {
        if (event.key === '.' || event.key === ',') {
            return false;
        }
    }
    const form = document.getElementsByTagName('form')[0];
    const signUpInputs = document.querySelectorAll('input');
    const formFieldErrors = document.querySelectorAll('.form__input-error');
    const popup = document.getElementById('popup');
    const link = document.getElementById('form__link');
    const title = document.getElementById('main__title');
    const button = document.getElementById('submit');
    const inputsValidation = {
        fullName: {
            regExp: /^[а-яa-z\s]*$/i,
            errorText: 'Full Name может содержать только буквы и пробел'
        },
        yourUserName: {
            regExp: /^[а-я\w-]*$/i,
            errorText: 'Your username может содержать только буквы, цифры, символ подчеркивания и тире'
        },
        email: {
            regExp: /^[^@\s]+@[^@\s]+\.[^@\s]+$/i,
            errorText: 'В e-mail допускается один символ @ и любые другие символы, кроме пробелов.'
        },
        password: {
            regExp: /(?=.*[A-Z])(?=.*\d)(?=.*[-\(\)\.,:;\?!\*\+%<>@\[\]{}\/\\_\{\}\$#])/,
            errorText: 'Пароль должен содержать не менее 8 символов, включая хотя бы одну заглавную букву, хотя бы одну цифру и хотя бы один из следующих спецсимволов: ( . , : ; ? ! * + % - < > @ [ ] { } / \\ _ { } $ # )',
            minLength: 8
        },
        repeatPassword: {
            errorText: 'Пароли не совпадают'
        }
    }
    let hasError;
    form.onsubmit = function(e) {
        e.preventDefault();
        removeFormFieldErrors();
        hasError = false;
        let password = '';
        signUpInputs.forEach((item) => {
            if (isEmptyInputValue(item)) {
                return;
            }
            switch (item.previousSibling.nodeValue.trim()) {
                case 'Full Name':
                    isInvalidInputValue(item, inputsValidation.fullName.regExp, inputsValidation.fullName.errorText);
                    break;
                case 'Your username':
                    isInvalidInputValue(item, inputsValidation.yourUserName.regExp, inputsValidation.yourUserName.errorText);
                    break;
                case 'E-mail':
                    isInvalidInputValue(item, inputsValidation.email.regExp, inputsValidation.email.errorText);
                    break;
                case 'Password':
                    isInvalidInputValue(item, inputsValidation.password.regExp, inputsValidation.password.errorText);
                    isPasswordLengthInvalid(item, inputsValidation.password.minLength, inputsValidation.password.errorText);
                    password = item.value;
                    break;
                case 'Repeat Password':
                    arePasswordsDifferent(password, item, inputsValidation.repeatPassword.errorText);
                    break;
                default:
                    isUserAgreed(item);
            }
        });
        if (!hasError) {
            popup.classList.add('popup-visible');
            let newClient = {
                fullName: signUpInputs[0].value,
                userName: signUpInputs[1].value,
                email: signUpInputs[2].value,
                password: signUpInputs[3].value,
            }
            let clients = [];
            let localStorageClients = localStorage.getItem('clients');
            if (localStorageClients) {
                clients = JSON.parse(localStorageClients);
            }
            clients.push(newClient);
            localStorage.setItem('clients', JSON.stringify(clients));
            form.reset();
        }
    }
    function removeFormFieldErrors() {
        formFieldErrors.forEach((elem) => {
            elem.style.display = 'none';
            elem.previousElementSibling.style.borderBottomColor = '#C6C6C4';
        });
    }
    function isEmptyInputValue(input) {
        if (!input.value) {
            input.parentElement.nextElementSibling.innerText = 'Заполните поле ' + input.previousSibling.data.trim();
            input.parentElement.nextElementSibling.style.display = 'block';
            hasError = true;
            return true;
        }
    }
    function isInvalidInputValue(input, inputRegExp, errorText) {
        if (!input.value.match(inputRegExp)) {
            input.parentElement.nextElementSibling.innerText = errorText;
            input.parentElement.nextElementSibling.style.display = 'block';
            hasError = true;
        }
    }
    function isPasswordLengthInvalid(passwordInput, minPasswordLength, errorText) {
        if (passwordInput.value.length < minPasswordLength) {
            passwordInput.parentElement.nextElementSibling.innerText = errorText;
            passwordInput.parentElement.nextElementSibling.style.display = 'block';
            hasError = true;
        }
    }
    function arePasswordsDifferent(PasswordInputValue, repeatPasswordInput, errorText) {
        if (repeatPasswordInput.value !== PasswordInputValue) {
            repeatPasswordInput.parentElement.nextElementSibling.innerText = errorText;
            repeatPasswordInput.parentElement.nextElementSibling.style.display = 'block';
            hasError = true;
        }
    }
    function isUserAgreed(checkbox) {
        if (!checkbox.checked) {
            checkbox.parentElement.nextElementSibling.style.display = 'block';
            hasError = true;
        }
    }
    document.getElementById('popup-button').onclick = () => {
        popup.classList.remove('popup-visible');
        form.reset();
        moveToLogin();
    }
    link.onmousedown = () => {
        moveToLogin();
        removeFormFieldErrors();
    };
    function moveToLogin() {
        title.innerText = 'Log in to the system';
        for (let input of signUpInputs) {
            if (input.previousSibling.nodeValue.trim() === 'Your username' || input.previousSibling.nodeValue.trim() === 'Password') {
                continue;
            }
            input.parentElement.parentElement.remove(); 
        }
        button.innerText = 'Sign in';
        title.scrollIntoView({behavior: "smooth"});
        link.innerText = 'Registration';
        link.onmousedown = () => { 
            window.location.reload(); 
        };
        form.onsubmit = ((e) => {
            e.preventDefault();
            removeFormFieldErrors();
            hasError = false;
            const signInInputs = document.getElementsByTagName('input');
            for (let elem of signInInputs) {
                if (isEmptyInputValue(elem)) {
                    elem.parentElement.style.borderBottomColor = 'red';
                }
            }

            if (!hasError) {
                let clients = localStorage.getItem('clients');
                let userNameIndex = clients.indexOf(`"userName":"${signInInputs[0].value}"`); 

                if (~userNameIndex) {
                    signInInputs[0].parentElement.style.borderBottomColor = '#C6C6C4';
                    let client = JSON.parse(clients.slice(clients.lastIndexOf('{', userNameIndex), clients.indexOf('}', userNameIndex) + 1));

                    if (client.password === signInInputs[1].value) {
                        signInInputs[1].parentElement.style.borderBottomColor = '#C6C6C4';
                        moveToPersonalAccount(client);
                    } else {
                        showSignInError(signInInputs[1], 'Неверный пароль');
                    }
                } else {
                    showSignInError(signInInputs[0], 'Такой пользователь не зарегистрирован');
                }

            }

        });
        form.reset();
    }
    function showSignInError(input, textError) {
        input.parentElement.style.borderBottomColor = 'red';
        input.parentElement.nextElementSibling.innerText = textError;
        input.parentElement.nextElementSibling.style.display = 'block';
    }
    function moveToPersonalAccount(clientData) {
        title.innerText = `Welcome, ${clientData.fullName}!`;
        button.innerText = 'Exit';
        form.onclick = () => {
            window.location.reload();
        }
        form.previousElementSibling.remove();
        form.innerHTML = '';
        form.appendChild(button.parentElement);
    }
}