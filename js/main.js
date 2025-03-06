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

// Мобильное меню
document.addEventListener('DOMContentLoaded', () => {
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

// Анимация появления элементов при прокрутке
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach((element) => {
    observer.observe(element);
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
            // Здесь будет отправка данных на сервер
            console.log('Form data:', data);
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

// Кнопка возврата наверх
const scrollToTopButton = document.querySelector('.scroll-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopButton.classList.add('visible');
    } else {
        scrollToTopButton.classList.remove('visible');
    }
});

scrollToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Инициализация слайдера
const swiper = new Swiper('.swiper-container', {
    effect: 'slide',
    speed: 800,
    loop: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
    },
    on: {
        init: function () {
            updateProjectDescription(this.realIndex + 1);
        },
        slideChange: function () {
            updateProjectDescription(this.realIndex + 1);
        }
    }
});

// Функция обновления описания проекта
function updateProjectDescription(projectId) {
    // Скрываем все описания
    document.querySelectorAll('.project-content').forEach(content => {
        content.style.display = 'none';
        content.classList.remove('active');
    });

    // Показываем нужное описание
    const activeDescription = document.querySelector(`.project-content[data-project-id="${projectId}"]`);
    if (activeDescription) {
        activeDescription.style.display = 'block';
        // Добавляем небольшую задержку перед добавлением класса active для анимации
        setTimeout(() => {
            activeDescription.classList.add('active');
        }, 50);
    }
}

// Добавляем эффект параллакса для фона слайдов
swiper.on('progress', function (progress) {
    for (let i = 0; i < swiper.slides.length; i++) {
        const slideProgress = swiper.slides[i].progress;
        const innerOffset = swiper.width * 0.5;
        const innerTranslate = slideProgress * innerOffset;

        swiper.slides[i].querySelector('.slide-inner').style.transform =
            `translate3d(${innerTranslate}px, 0, 0) scale(${1 - Math.abs(slideProgress * 0.1)})`;
    }
});

swiper.on('touchStart', function () {
    for (let i = 0; i < swiper.slides.length; i++) {
        swiper.slides[i].style.transition = '';
    }
});

// Fade in sections on scroll
function handleScrollAnimation() {
    const sections = document.querySelectorAll('.services, .slider-section, .about-preview, .contact-section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, {
        threshold: 0.15 // Trigger when 15% of the section is visible
    });

    sections.forEach(section => {
        section.classList.add('fade-in-section');
        observer.observe(section);
    });
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', () => {
    handleScrollAnimation();
});

// Header scroll behavior
let lastScrollTop = 0;
const header = document.querySelector('.header');
const scrollThreshold = 50; // минимальное расстояние скролла для срабатывания

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    // Показываем шапку если скролл меньше threshold
    if (currentScroll < scrollThreshold) {
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