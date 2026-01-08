 function saveCart(cart) {
            localStorage.setItem('hype_cart', JSON.stringify(cart));
        }
        
        function getCart() {
            return JSON.parse(localStorage.getItem('hype_cart')) || [];
        }

        function displayCart() {
            const cartList = document.getElementById('cartList');
            const summary = document.getElementById('cartSummary');
            const emptyMessage = document.getElementById('emptyMessage');
            let cart = getCart();
            
            if (cart.length === 0) {
                cartList.innerHTML = '';
                emptyMessage.style.display = 'block';
                summary.style.display = 'none';
                return;
            }

            emptyMessage.style.display = 'none';
            summary.style.display = 'block';
            cartList.innerHTML = '';
            let total = 0;

            cart.forEach((item, index) => {
                item.quantity = parseInt(item.quantity) || 1; 

                const itemSubtotal = item.price * item.quantity;
                total += itemSubtotal;
                
                cartList.innerHTML += `
                    <div class="cart-item" data-index="${index}">
                        <div class="item-details">
                            <div class="cart-details">
                                <div class="cart-name">${item.name}</div>
                            </div>
                        </div>
                        <div class="cart-price">$ ${item.price.toLocaleString()}</div>
                        
                        <div class="quantity-control">
                            <button onclick="updateQuantity(${index}, -1)">-</button>
                            <input type="number" 
                                class="quantity-input" 
                                value="${item.quantity}" 
                                min="1" 
                                onchange="updateQuantityByInput(${index}, this.value)">
                            <button onclick="updateQuantity(${index}, 1)">+</button>
                        </div>
                        
                        <div class="cart-subtotal">$ ${itemSubtotal.toLocaleString()}</div>
                        <button class="remove-btn" onclick="removeItem(${index})">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                `;
            });
            document.getElementById('totalPrice').textContent = `總計: $ ${total.toLocaleString()}`;
        }

        function updateQuantity(index, delta) {
            let cart = getCart();
            if (cart[index]) {
                let newQuantity = cart[index].quantity + delta;
                if (newQuantity < 1) {
                    newQuantity = 1; 
                }
                cart[index].quantity = newQuantity;
                saveCart(cart);
                displayCart(); 
            }
        }

        function updateQuantityByInput(index, value) {
            let cart = getCart();
            if (cart[index]) {
                let newQuantity = parseInt(value) || 1;
                newQuantity = Math.max(1, newQuantity); 
                
                cart[index].quantity = newQuantity;
                saveCart(cart);
                displayCart(); 
            }
        }

        function removeItem(index) {
            let cart = getCart();
            if (confirm(`確定要移除商品：${cart[index].name} 嗎？`)) {
                cart.splice(index, 1);
                saveCart(cart);
                displayCart();
            }
        }

        function clearCart() {
            if(confirm('確定要清空購物車內所有商品嗎？')) {
                localStorage.removeItem('hype_cart');
                displayCart();
            }
        }

        function checkout() {
            if(getCart().length === 0) {
                 alert('購物車是空的，無法結帳喔！');
                 return;
            }
            alert('導向結帳頁面中');
            window.location.href = 'checkout.html';
        }

        displayCart();