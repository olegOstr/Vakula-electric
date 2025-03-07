document.addEventListener('DOMContentLoaded', () => {
    // Инициализация маски для телефона
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        const maskOptions = {
            mask: '+1 (000) 000-0000',
            lazy: false
        };
        
        const mask = IMask(input, maskOptions);
        
        // Добавляем placeholder
        input.placeholder = '+1 (___) ___-____';
        
        // Добавляем обработчик фокуса
        input.addEventListener('focus', () => {
            if (!input.value) {
                mask.value = '+1 ';
            }
        });
        
        // Добавляем обработчик потери фокуса
        input.addEventListener('blur', () => {
            if (input.value === '+1 ') {
                mask.value = '';
            }
        });
    });

    // Проверяем наличие Fancybox
    if (typeof Fancybox !== 'undefined') {
        Fancybox.bind('[data-fancybox]', {
            // Опции Fancybox
            loop: true,
            buttons: [
                'zoom',
                'slideShow',
                'fullScreen',
                'close'
            ],
            animationEffect: 'fade',
            transitionEffect: 'fade',
            preventCaptionOverlap: true,
            arrows: true,
            infobar: true,
            toolbar: true,
            click: null,
            clickSlide: false,
            mobile: {
                click: null,
                clickSlide: false,
                dblclick: null,
                dblclickSlide: false,
                swipe: 'slide'
            }
        });
    }

    // Инициализация мобильного меню
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-list');
    const header = document.querySelector('.header');

    if (mobileMenuBtn && navList) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navList.classList.toggle('active');
            header.classList.toggle('menu-open');
        });

        // Закрытие мобильного меню при клике по ссылке
        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navList.classList.remove('active');
                header.classList.remove('menu-open');
            });
        });

        // Закрытие мобильного меню при клике вне его
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-list') && !e.target.closest('.mobile-menu-btn')) {
                mobileMenuBtn.classList.remove('active');
                navList.classList.remove('active');
                header.classList.remove('menu-open');
            }
        });
    }
    // Кнопка прокрутки вверх
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// Preloader
document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.querySelector('.preloader');
    
    // Скрываем прелоадер после загрузки всех ресурсов
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 500); // Небольшая задержка для плавности
    });
});

// Плавная прокрутка для якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const header = document.querySelector('.header');
            const isHeaderHidden = header.classList.contains('header-hidden');
            const headerOffset = isHeaderHidden ? 0 : 80; // Учитываем высоту шапки только если она видима
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Инициализация EmailJS
document.addEventListener('DOMContentLoaded', () => {
    // Инициализируем EmailJS с вашим публичным ключом
    emailjs.init("YOUR_PUBLIC_KEY"); // Замените на ваш публичный ключ из EmailJS
});

// Обработка форм
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Валидация формы
        const isValid = validateForm(form);
        if (!isValid) return;

        // Сбор данных формы
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            // Отправляем email через EmailJS
            await emailjs.send(
                "YOUR_SERVICE_ID", // Замените на ID вашего сервиса из EmailJS
                "YOUR_TEMPLATE_ID", // Замените на ID вашего шаблона из EmailJS
                {
                    from_name: data.name,
                    from_email: data.email,
                    message: data.message,
                    phone: data.phone
                }
            );

            showNotification('success', 'Message sent successfully!');
            form.reset();
        } catch (error) {
            console.error('Error submitting form:', error);
            showNotification('error', 'An error occurred while sending the message.');
        }
    });
});

// Валидация формы
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input, textarea');

    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
            showError(input, 'This field is required');
        } else if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                isValid = false;
                showError(input, 'Please enter a valid email address');
            }
        }
    });

    return isValid;
}

// Показ ошибки валидации
function showError(input, message) {
    const errorDiv = input.nextElementSibling?.classList.contains('error-message')
        ? input.nextElementSibling
        : document.createElement('div');

    if (!input.nextElementSibling?.classList.contains('error-message')) {
        errorDiv.classList.add('error-message');
        input.parentNode.insertBefore(errorDiv, input.nextSibling);
    }

    errorDiv.textContent = message;
    input.classList.add('error');

    input.addEventListener('input', function removeError() {
        input.classList.remove('error');
        errorDiv.remove();
        input.removeEventListener('input', removeError);
    });
}

// Показ уведомлений
function showNotification(type, message) {
    const notification = document.createElement('div');
    notification.classList.add('notification', type);
    notification.textContent = message;

    document.body.appendChild(notification);

    // Удаление уведомления через 3 секунды
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Ленивая загрузка изображений
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
});

// Header scroll behavior
let lastScrollTop = 0;
const header = document.querySelector('.header');
const heroH1 = document.querySelector('.hero h1');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    const heroH1Position = heroH1 ? heroH1.getBoundingClientRect().top + window.pageYOffset : 0;

    // Показываем шапку если скролл меньше позиции h1
    if (currentScroll < heroH1Position) {
        header.classList.remove('header-hidden');
        return;
    }

    // Определяем направление скролла
    if (currentScroll > lastScrollTop) {
        // Скролл вниз
        header.classList.add('header-hidden');
    } else {
        // Скролл вверх
        header.classList.remove('header-hidden');
    }

    lastScrollTop = currentScroll;
});

// Обработка кнопки "Показать больше"
document.addEventListener('DOMContentLoaded', () => {
    const showMoreBtn = document.querySelector('.show-more-btn');
    const servicesGrid = document.querySelector('.services-grid');

    if (showMoreBtn && servicesGrid) {
        showMoreBtn.addEventListener('click', () => {
            servicesGrid.classList.add('expanded');
            showMoreBtn.style.display = 'none';
        });
    }
}); 