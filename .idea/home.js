document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelector('.banner-slides');
    const dots = document.querySelectorAll('.banner-dot');
    const arrows = document.querySelectorAll('.banner-arrow');
    let currentSlide = 0;
    const slideCount = document.querySelectorAll('.banner-slide').length;
    let slideInterval;

    function goToSlide(index) {
        if (index < 0) {
            index = slideCount - 1;
        } else if (index >= slideCount) {
            index = 0;
        }

        slides.style.transform = `translateX(-${index * 33.333}%)`;

        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');

        currentSlide = index;
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function startSlideShow() {
        slideInterval = setInterval(nextSlide, 20000);
    }

    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const slideIndex = parseInt(this.getAttribute('data-slide'));
            goToSlide(slideIndex);
            clearInterval(slideInterval);
            startSlideShow();
        });
    });

    arrows.forEach(arrow => {
        arrow.addEventListener('click', function() {
            if (this.classList.contains('left')) {
                goToSlide(currentSlide - 1);
            } else {
                goToSlide(currentSlide + 1);
            }
            clearInterval(slideInterval);
            startSlideShow();
        });
    });

    startSlideShow();

    const banner = document.querySelector('.banner');
    banner.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });

    banner.addEventListener('mouseleave', () => {
        startSlideShow();
    });

    const cartCount = document.querySelector('.cart-count');
    let cartItems = 0;

    // 获取所有加减按钮
    const minusButtons = document.querySelectorAll('.quantity-btn.minus');
    const plusButtons = document.querySelectorAll('.quantity-btn.plus');

    // 为每个减按钮添加事件监听器
    minusButtons.forEach(button => {
        button.addEventListener('click', function() {
            const quantityDisplay = this.nextElementSibling;
            let quantity = parseInt(quantityDisplay.textContent);

            if (quantity > 0) {
                quantity--;
                quantityDisplay.textContent = quantity;
                cartItems--;
                cartCount.textContent = cartItems;
            }
        });
    });

    // 为每个加按钮添加事件监听器
    plusButtons.forEach(button => {
        button.addEventListener('click', function() {
            const quantityDisplay = this.previousElementSibling;
            let quantity = parseInt(quantityDisplay.textContent);

            quantity++;
            quantityDisplay.textContent = quantity;
            cartItems++;
            cartCount.textContent = cartItems;

            // 播放动画效果
            const productCard = this.closest('.product-card');
            const productImage = productCard.querySelector('img').src;
            const productName = productCard.querySelector('.product-name').textContent;

            const anim = document.createElement('div');
            anim.classList.add('cart-animation');
            anim.innerHTML = `<img src="${productImage}" alt="${productName}">`;
            document.body.appendChild(anim);

            const rect = this.getBoundingClientRect();
            const cartRect = document.querySelector('.fa-shopping-cart').closest('a').getBoundingClientRect();

            anim.style.position = 'fixed';
            anim.style.left = `${rect.left + rect.width/2}px`;
            anim.style.top = `${rect.top + rect.height/2}px`;
            anim.style.width = '50px';
            anim.style.height = '50px';
            anim.style.borderRadius = '50%';
            anim.style.overflow = 'hidden';
            anim.style.zIndex = '1000';
            anim.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

            // 触发动画
            setTimeout(() => {
                anim.style.left = `${cartRect.left + cartRect.width/2}px`;
                anim.style.top = `${cartRect.top + cartRect.height/2}px`;
                anim.style.width = '10px';
                anim.style.height = '10px';
                anim.style.opacity = '0.5';
            }, 10);

            // 移除动画元素
            setTimeout(() => {
                anim.remove();
            }, 800);
        });
    });

    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
});