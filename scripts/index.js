document.addEventListener('DOMContentLoaded', function(){
    
const urlParams = new URLSearchParams(window.location.search);
const operation = urlParams.get('operation');

if (operation === 'successful') {
    const notification = document.getElementById('successNotification');
    notification.style.display = 'block';

    // Скрыть уведомление через 3 секунды
    setTimeout(() => {
        notification.style.display = 'none';
        // Удаление параметра из URL
        const newUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
    }, 3000);
}
})

function openModal() {
    document.getElementById('productModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}

// Закрытие при клике вне модального окна
window.addEventListener('click', function (event) {
    const modal = document.querySelector('.edit-modal-container');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});
const form = document.querySelector('#productModal form');

form.addEventListener('submit', (e) => {
    e.preventDefault(); // Отменяем стандартное действие формы

    // Получаем данные из формы
    const title = document.querySelector('#title').value.trim();
    const price = parseFloat(document.querySelector('#price').value);
    const discount = parseFloat(document.querySelector('#discount').value) || 0;
    const isNew = parseInt(document.querySelector('#new').value, 10);

    const imagesInput = document.querySelector('#images');
    const images = Array.from(imagesInput.files).map(file => URL.createObjectURL(file));

    // Обрабатываем изображения
    let finalImages = images;
    if (images.length === 1) {
        // Если только одно изображение, дублируем его для зацикленности
        finalImages = [images[0], images[0]];
    } else if (images.length === 0) {
        // Если изображений нет, использовать заглушку
        finalImages = ['./placeholder-image.jpg', './placeholder-image.jpg'];
    }

    // Создаем объект товара
    const product = {
        id: Date.now(), // Уникальный ID товара
        title,
        price,
        discount,
        isNew,
        images: finalImages,
    };

    // Получаем текущий список товаров из localStorage
    const products = JSON.parse(localStorage.getItem('products')) || [];

    // Добавляем новый товар в массив
    products.push(product);

    // Сохраняем обновленный массив в localStorage
    localStorage.setItem('products', JSON.stringify(products));

    // Очищаем форму
    form.reset();

    // Закрываем модальное окно
    closeModal();

    // Добавляем новый товар в слайдер
    addProductToSlider(product);
});

// Функция для добавления товара в слайдер
function addProductToSlider(product) {
    const swiperWrapper = document.querySelector('.swiper-wrapper');

    // Создаем новый слайд
    const slide = document.createElement('div');
    slide.classList.add('swiper-slide');

    // Проверяем, сколько изображений добавлено
    const images = product.images.length > 0
        ? product.images
        : [product.images[0], product.images[0]]; // Дублируем изображение, если только одно

    // Создаем разметку для изображений
    const imagesHTML = images.map((img, index) => `
        <div class="swiper-slide">
            <img src="${img}" alt="${product.title} фото ${index + 1}">
        </div>
    `).join('');

    // Заполняем HTML-контент слайда
    slide.innerHTML = `
        <div class="product-card">
                        
                        <div class="image-cont">
                            <div class="card-stickers">
                                <div class="sticker"><img src="./Photos/photo_2024-12-23_15-19-16.jpg" alt=""></div>
                                <div class="sticker"><img src="./Photos/photo_2024-12-23_15-18-51.jpg" alt=""></div>
                            </div>
                            <div class="card-imgs">
                                
                                   ${imagesHTML}
                                
                            </div>
                            <div class="paginator-for-slider">
                                <div class="bullet bullet-active bullet-left"></div>
                                <div class="bullet bullet-right"></div>
                            </div>
                        </div>
                        <div class="product-text">
                            <p class="product-name">${product.title}</p>
                            <div class="product-prices">
                                <p class="product-size">42 класс 4 мм</p>
                                <p class="product-price">${product.price} ₽/м²</p>
                            </div>
                            <button class="buy-button">Купить</button>
                        </div>
                    </div>
    `;

    // Добавляем новый слайд в обертку Swiper
    swiperWrapper.appendChild(slide);

    // Переинициализируем основной слайдер
    reinitializeSwiper();
}

// Функция для переинициализации Swiper после добавления нового слайда
function reinitializeSwiper() {
    // Убедимся, что Swiper уже инициализирован
    if (typeof Swiper !== 'undefined') {
        const swiper = new Swiper('.swiper', {
            slidesPerView: 4, // Количество слайдов на экране
            spaceBetween: 40, // Расстояние между слайдами
            loop: true, // Цикличность
            navigation: {
              prevEl: '.btn-prev',
              nextEl: '.btn-next'
            },
            breakpoints: {
              1440: {
                slidesPerView: 4,
              },
              1020: {
                slidesPerView: 3,
              },
              766: {
                slidesPerView: 2,
                spaceBetween: 30
              },
              300: {
                slidesPerView: 2,
                spaceBetween: 20
              },
              100: {
                slidesPerView: 1,
                spaceBetween: 20
              },
            }
          });
        // Обновление слайдов
        
    }
}
