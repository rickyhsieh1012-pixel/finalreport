        const SHIPPING_FEE = 60;
        const CART_STORAGE_KEY = 'hype_cart';

        function getCart() {
            return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
        }

        function displayOrderSummary() {
            const orderList = document.getElementById('orderList');
            const priceDetails = document.getElementById('priceDetails');
            const emptyMessage = document.getElementById('emptyMessage');
            const cart = getCart();
            
            if (cart.length === 0) {
                orderList.innerHTML = '';
                emptyMessage.style.display = 'block';
                priceDetails.style.display = 'none';
                return;
            }

            emptyMessage.style.display = 'none';
            priceDetails.style.display = 'block';
            orderList.innerHTML = '';
            let totalAmount = 0; 

            cart.forEach(item => {
                const quantity = parseInt(item.quantity) || 1;
                const price = parseFloat(item.price) || 0;
                
                const itemSubtotal = price * quantity;
                totalAmount += itemSubtotal;

                orderList.innerHTML += `
                    <div class="order-item">
                        <div class="item-name">${item.name}</div> 
                        <div class="item-details">
                            <div class="item-qty-price">$ ${price.toLocaleString()} x ${quantity}</div>
                            <div class="item-subtotal">$ ${itemSubtotal.toLocaleString()}</div>
                        </div>
                    </div>
                `;
            });

            const finalTotal = totalAmount + SHIPPING_FEE;

            document.getElementById('subTotal').textContent = `$ ${totalAmount.toLocaleString()}`;
            document.getElementById('shippingFee').textContent = `$ ${SHIPPING_FEE.toLocaleString()}`;
            document.getElementById('finalTotal').textContent = `$ ${finalTotal.toLocaleString()}`;
        }

        function processCheckout() {
            const cart = getCart();
            if (cart.length === 0) {
                alert('購物車是空的，無法結帳喔！');
                return;
            }
            
            alert('感謝您的購買！訂單已提交。');
            
            localStorage.removeItem(CART_STORAGE_KEY); 
            window.location.href = 'index.html'; 
        }

        displayOrderSummary();
   