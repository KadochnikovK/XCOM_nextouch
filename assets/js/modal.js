document.addEventListener("DOMContentLoaded", function () {
    initForm("main-form");

    function initForm(formId) {
        const form = document.getElementById(formId);
        if (!form) return;

        const formItems = form.querySelectorAll(".form__item");

        function clearErrors() {
            formItems.forEach((item) => {
                item.classList.remove("form__item--not-valid");
                const errorElement = item.querySelector(".error-message");
                if (errorElement) {
                    errorElement.style.display = "none";
                }
            });
        }

        function addError(element, message) {
            const formItem = element.closest(".form__item");
            formItem.classList.add("form__item--not-valid");

            let errorElement = formItem.querySelector(".error-message");
            if (!errorElement) {
                errorElement = document.createElement("div");
                errorElement.className = "error-message";
                formItem.appendChild(errorElement);
            }

            errorElement.textContent = message;
            errorElement.style.display = "block";
        }


        const phoneInput = form.querySelector('input[name="phone"]');
        if (phoneInput) {
            phoneInput.addEventListener('input', function (e) {
                let value = e.target.value.replace(/\D/g, '');

                if (value.length === 0) {
                    e.target.value = '';
                    return;
                }


                let formattedValue = '+7';

                if (value.length > 1) {
                    formattedValue += ' (' + value.substring(1, 4);
                }
                if (value.length >= 5) {
                    formattedValue += ') ' + value.substring(4, 7);
                }
                if (value.length >= 8) {
                    formattedValue += '-' + value.substring(7, 9);
                }
                if (value.length >= 10) {
                    formattedValue += '-' + value.substring(9, 11);
                }

                e.target.value = formattedValue;
            });
        }


        const inputs = form.querySelectorAll("input, textarea");
        inputs.forEach((input) => {
            input.addEventListener("focus", handleInputFocus);
            input.addEventListener("blur", handleInputBlur);
        });

        function handleInputFocus(e) {
            const formItem = e.target.closest(".form__item");
            if (formItem) {
                formItem.classList.add("form__item--focused");
            }
        }

        function handleInputBlur(e) {
            const formItem = e.target.closest(".form__item");
            if (formItem) {
                formItem.classList.remove("form__item--focused");
            }
        }

        function validateField(field) {
            const value = field.value.trim();
            const name = field.name;
            const type = field.type;
            const isRequired = field.hasAttribute('required');


            if (!isRequired && value === '') {
                return true;
            }

            if (type === "checkbox") {
                if (!field.checked) {
                    addError(field, "Необходимо дать согласие");
                    return false;
                }
                return true;
            }
            console.log('value', value.length)

            if (isRequired && !value && value.length === 0) {
                addError(field, "Это поле обязательно для заполнения");
                return false;
            }


            switch (name) {
                case "email":
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                        addError(field, "Введите корректный email");
                        return false;
                    }
                    break;

                case "phone":
                    const phoneDigits = value.replace(/\D/g, '');
                    if (phoneDigits.length !== 11) {
                        addError(field, "Введите корректный номер телефона (11 цифр)");
                        return false;
                    }
                    break;

                case "taxId":
                    if (value && !/^\d+$/.test(value)) {
                        addError(field, "ИНН должен содержать только цифры");
                        return false;
                    }
                    if (value && value.length !== 10 && value.length !== 12) {
                        addError(field, "ИНН должен содержать 10 или 12 цифр");
                        return false;
                    }
                    break;

                case "surname":
                case "name":
                    if (value && !/^[а-яА-ЯёЁa-zA-Z\- ]+$/.test(value)) {
                        addError(field, "Допускаются только буквы и дефисы");
                        return false;
                    }
                    break;
            }

            return true;
        }

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            clearErrors();

            let isValid = true;
            const fields = form.querySelectorAll("input:not([type=submit]), textarea");

            fields.forEach((field) => {
                if (!validateField(field)) {
                    isValid = false;
                }
            });

            if (isValid) {
                const formData = collectFormData(form);

                console.log("Данные формы:", formData);

                showModal(
                    "Регистрация прошла успешно",
                    `Спасибо за регистрацию, ${formData.name} ${formData.surname}!\n\nВаши данные успешно отправлены. Мы свяжемся с вами в ближайшее время`,
                    "Хорошо"
                );

                form.reset();
            }
        });

        function collectFormData(form) {
            return {
                surname: form.elements.surname.value.trim(),
                name: form.elements.name.value.trim(),
                phone: form.elements.phone.value.trim(),
                email: form.elements.email.value.trim(),
                company: form.elements.company.value.trim(),
                position: form.elements.position.value.trim(),
                taxId: form.elements.taxId.value.trim(),
                privacyPolicy: form.elements["privacy-policy"].checked,
            };
        }

        // Очистка ошибок при вводе
        form.addEventListener("input", function (e) {
            if (e.target.tagName === "INPUT") {
                const formItem = e.target.closest(".form__item");
                formItem.classList.remove("form__item--not-valid");
                const errorElement = formItem.querySelector(".error-message");
                if (errorElement) {
                    errorElement.style.display = "none";
                }
            }
        });

        const checkbox = form.querySelector('input[type="checkbox"]');
        if (checkbox) {
            checkbox.addEventListener("change", function (e) {
                const formItem = e.target.closest(".form__item");
                formItem.classList.remove("form__item--not-valid");
                const errorElement = formItem.querySelector(".error-message");
                if (errorElement) {
                    errorElement.style.display = "none";
                }
            });
        }
    }

    function showModal(title, text, buttonText) {
        const modal = document.querySelector(".modal");
        if (!modal) {
            console.warn("Модальное окно не найдено на странице");
            return;
        }

        const modalWindow = modal.querySelector(".modal__window");
        const modalHeadline = modal.querySelector(".modal__headline");
        const modalText = modal.querySelector(".modal__text");
        const modalButton = modal.querySelector(".modal__button");
        const modalClose = modal.querySelector(".modal__close");

        modalHeadline.textContent = title;
        modalText.textContent = text;
        modalButton.textContent = buttonText;

        modal.style.display = "flex";
        modalText.innerHTML = text.replace(/\n/g, '<br>');

        setTimeout(() => {
            modal.classList.remove("animate__fadeIn", "animate__fadeOut");
            modalWindow.classList.remove("animate__fadeInUp", "animate__fadeOutDown");
            modalWindow.classList.add("animate__fadeInUp", 'modal__window--active');
            modal.classList.add("animate__fadeIn");

        }, 10);

        function closeModal() {
            modal.classList.remove("animate__fadeIn");
            modalWindow.classList.remove("animate__fadeInUp", 'modal__window--active');
            modalWindow.classList.add("animate__fadeOutDown");
            modal.classList.add("animate__fadeOut");


            setTimeout(() => {
                modal.style.display = "none";
                modal.classList.remove("animate__fadeOut");
                modalWindow.classList.remove("animate__fadeOutDown");
            }, 500);
        }

        modalButton.onclick = closeModal;
        if (modalClose) {
            modalClose.onclick = closeModal;
        }

        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
});