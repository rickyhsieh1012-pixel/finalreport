document.addEventListener('DOMContentLoaded', function () {
    const STORAGE_KEY = 'userProductReviews'; 
    const modal = document.getElementById('reviewModal');
    const openBtn = document.getElementById('openModalBtn');
    const closeBtn = document.getElementById('closeReviewModal');
    const submitBtn = document.getElementById('submitReviewBtn');
    const reviewList = document.getElementById('reviewList');

    function getReviews() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    }

    function renderReviews() {
        const reviews = getReviews();
        reviewList.innerHTML = ''; 

        if (reviews.length === 0) {
            reviewList.innerHTML = '<p style="text-align:center; color:#888;">暫無評論紀錄。</p>';
            return;
        }

        reviews.forEach((rev, index) => {
            let starsHtml = '';
            for (let i = 1; i <= 5; i++) {
                starsHtml += `<i class="fas fa-star ${i <= rev.rating ? 'active' : ''}"></i>`;
            }

            const reviewItem = document.createElement('div');
            reviewItem.className = 'review-item';
            reviewItem.innerHTML = `
                <div class="review-header">
                    <span class="product-name">
                        <a href="#">${rev.productName}</a>
                        <span class="review-category" style="font-size: 0.8em; color: #888; margin-left: 10px;">(${rev.category})</span>
                    </span>
                    <div class="review-meta">
                        <div class="stars">${starsHtml} (${rev.rating}.0)</div>
                        <span class="review-date">${rev.date}</span>
                    </div>
                </div>
                <p class="review-text">${rev.text}</p>
                <div class="review-actions">
                    <button class="action-btn" onclick="editReview(${index})"><i class="fas fa-edit"></i> 編輯</button>
                    <button class="action-btn" onclick="deleteReview(${index})" style="color:red; margin-left:10px;"><i class="fas fa-trash"></i> 刪除</button>
                </div>
            `;
            reviewList.appendChild(reviewItem);
        });
    }

    submitBtn.onclick = function() {
        const productName = document.getElementById('inputProductName').value.trim();
        const category = document.getElementById('inputProductType').value.trim();
        const rating = document.getElementById('reviewRating').value;
        const text = document.getElementById('reviewTextArea').value.trim();
        const editIdx = parseInt(document.getElementById('editIndex').value);

        if (!productName || !text) return alert('請完整填寫商品名稱與評論內容！');

        const reviews = getReviews();
        const newReview = {
            productName: productName,
            category: category || "一般",
            rating: parseInt(rating),
            text: text,
            date: new Date().toLocaleDateString(), 
            reviewer: "會員" 
        };

        if (editIdx > -1) {
            reviews[editIdx] = newReview; 
        } else {
            reviews.unshift(newReview); 
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
        modal.classList.remove('active');
        clearForm();
        renderReviews();
        alert('評論已成功發佈！現在去首頁點開任何商品都能看到這則評論。');
    };

    window.editReview = function(index) {
        const reviews = getReviews();
        const rev = reviews[index];
        document.getElementById('inputProductName').value = rev.productName;
        document.getElementById('inputProductType').value = rev.category;
        document.getElementById('reviewRating').value = rev.rating;
        document.getElementById('reviewTextArea').value = rev.text;
        document.getElementById('editIndex').value = index;
        modal.classList.add('active');
    };

    window.deleteReview = function(index) {
        if(confirm('確定要刪除這筆評論嗎？')) {
            const reviews = getReviews();
            reviews.splice(index, 1);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
            renderReviews();
        }
    };

    function clearForm() {
        document.getElementById('inputProductName').value = '';
        document.getElementById('inputProductType').value = '';
        document.getElementById('reviewTextArea').value = '';
        document.getElementById('editIndex').value = '-1';
    }

    if (openBtn) openBtn.onclick = () => { clearForm(); modal.classList.add('active'); };
    if (closeBtn) closeBtn.onclick = () => modal.classList.remove('active');
    
    renderReviews();
});