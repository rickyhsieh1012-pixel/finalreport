document.addEventListener('DOMContentLoaded', function () {
    const CART_STORAGE_KEY = 'hype_cart';

    function getCart() {
        return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
    }

    function updateCartCount() {
        const cart = getCart();
        const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        const cartCountEl = document.getElementById('cartCount');
        if (cartCountEl) cartCountEl.textContent = totalQuantity;
    }

    function addToCart(product) {
        let cart = getCart();
        const existingItemIndex = cart.findIndex(item => item.id === product.id);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            product.quantity = 1;
            cart.push(product);
        }

        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        updateCartCount();
        alert(`${product.name} 已成功加入購物車！`);
    }

    updateCartCount();

    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const dotsContainer = document.getElementById('carousel-dots');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const slideCount = slides.length;
    let currentIndex = 0;
    let slideInterval;

    if (track) {
        track.style.width = `${slideCount * 100}%`;
    }

    function moveToSlide(index) {
        if (index < 0) {
            index = slideCount - 1;
        } else if (index >= slideCount) {
            index = 0;
        }
        currentIndex = index;
        const offset = -(currentIndex * (100 / slideCount));
        if (track) {
            track.style.transform = `translateX(${offset}%)`;
        }
        updateDots(currentIndex);
    }

    function updateDots(index) {
        document.querySelectorAll('.dot').forEach(dot => {
            dot.classList.remove('active');
        });
        const activeDot = document.querySelector(`.dot[data-slide="${index + 1}"]`);
        if (activeDot) {
            activeDot.classList.add('active');
        }
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            moveToSlide(currentIndex - 1);
            resetInterval();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            moveToSlide(currentIndex + 1);
            resetInterval();
        });
    }

    if (dotsContainer) {
        dotsContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('dot')) {
                const slideIndex = parseInt(e.target.getAttribute('data-slide')) - 1;
                moveToSlide(slideIndex);
                resetInterval();
            }
        });
    }

    function startInterval() {
        slideInterval = setInterval(() => {
            moveToSlide(currentIndex + 1);
        }, 5000);
    }

    function resetInterval() {
        clearInterval(slideInterval);
        startInterval();
    }

    if (track) {
        startInterval();
    }

    const modal = document.getElementById('productModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const addToCartBtn = document.getElementById('addToCartBtn');
    
    const modalTitle = document.getElementById('modalTitle');
    const modalPrice = document.getElementById('modalPrice');
    const modalImage = document.getElementById('modalImage');
    const modalDescription = document.getElementById('modalDescription');
    const reviewListContainer = document.getElementById('reviewList'); 
    
    let currentProduct = {};

    function openModal(productData) {
        currentProduct = productData;
        
        modalTitle.textContent = currentProduct.name;
        modalPrice.textContent = currentProduct.priceDisplay;
        modalImage.src = currentProduct.imageSrc;
        modalImage.alt = currentProduct.name;
        modalDescription.textContent = currentProduct.description || '此商品暫無詳細說明。';
        
        const dynamicReviews = reviewListContainer.querySelectorAll('.dynamic-review');
        dynamicReviews.forEach(el => el.remove());

        const savedReviews = JSON.parse(localStorage.getItem('userProductReviews')) || [];

        savedReviews.forEach(rev => {
            const reviewItem = document.createElement('div');
            reviewItem.className = 'review-item dynamic-review'; 
            
            let starsHtml = '';
            for(let i=0; i<5; i++) {
                starsHtml += `<i class="fas fa-star ${i < rev.rating ? 'active' : ''}"></i>`;
            }

            reviewItem.innerHTML = `
                <div class="review-header">
                    <span class="reviewer-name">${rev.reviewer || '會員'}**</span> 
                    <span class="review-category">(${rev.category || '購買商品'})</span> 
                    <div class="stars">${starsHtml}</div>
                    <span class="review-date">${rev.date}</span>
                </div>
                <p class="review-text">${rev.text}</p>
            `;

            reviewListContainer.prepend(reviewItem);
        });

        modal.classList.add('active');
    }

    function closeModal() {
        modal.classList.remove('active');
        currentProduct = {};
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            if (currentProduct.id) {
                const productToCart = {
                    id: currentProduct.id,
                    name: currentProduct.name,
                    price: currentProduct.price,
                    imageSrc: currentProduct.imageSrc,
                };
                addToCart(productToCart);
                closeModal();
            }
        });
    }

    document.addEventListener('click', function(e) {
        const productLink = e.target.closest('.product-link');
        
        if (productLink) {
            e.preventDefault();
            
            let productData = {};

            if (productLink.dataset.id && productLink.dataset.name) {
                productData = {
                    id: productLink.dataset.id, 
                    name: productLink.dataset.name,
                    price: parseInt(productLink.dataset.price),
                    priceDisplay: `$ ${productLink.dataset.price} TWD`,
                    imageSrc: productLink.dataset.img,
                    description: productLink.dataset.description 
                };
            } else {
                const card = productLink.closest('.product-card');
                if (card) {
                    const titleElement = card.querySelector('.product-name');
                    const priceElement = card.querySelector('.product-price');
                    const imageElement = card.querySelector('img');
                    
                    if (titleElement && priceElement && imageElement) {
                        productData = {
                            id: card.dataset.id, 
                            name: titleElement.textContent.trim(),
                            price: parseInt(priceElement.dataset.price),
                            priceDisplay: priceElement.textContent.trim() + ' TWD',
                            imageSrc: imageElement.getAttribute('src'),
                            description: card.dataset.description 
                        };
                    }
                }
            }

            if (productData.id) {
                openModal(productData);
            }
        }
    });
});