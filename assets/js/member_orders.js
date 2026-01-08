
        const allOrders = [
            { id: 'HYPE20251101A', date: '2025/11/01', total: '$3,280', status: '已出貨', statusClass: 'status-shipped', items: ['落肩連帽外套 x1', '基礎高磅短T x2'] },
            { id: 'HYPE20250915B', date: '2025/09/15', total: '$6,500', status: '已完成', statusClass: 'status-completed', items: ['寬版西裝長褲 x1', '皮革切爾西靴 x1'] },
            { id: 'HYPE20250805C', date: '2025/08/05', total: '$1,890', status: '已取消', statusClass: 'status-cancelled', items: ['運動束口褲 x1'] },
            { id: 'HYPE20250720D', date: '2025/07/20', total: '$2,100', status: '已完成', statusClass: 'status-completed', items: ['重磅大學T x1'] },
            { id: 'HYPE20250610E', date: '2025/06/10', total: '$4,200', status: '已完成', statusClass: 'status-completed', items: ['刷毛防風外套 x1'] },
            { id: 'HYPE20250501F', date: '2025/05/01', total: '$980', status: '已完成', statusClass: 'status-completed', items: ['老帽 x1'] }
        ];

        const rowsPerPage = 3; 
        let currentPage = 1;

        function displayOrders(page) {
            const tableBody = document.getElementById('orderTableBody');
            tableBody.innerHTML = "";
            page--;

            let start = rowsPerPage * page;
            let end = start + rowsPerPage;
            let paginatedItems = allOrders.slice(start, end);

            paginatedItems.forEach(order => {
                let tr = document.createElement('tr');
                tr.innerHTML = `
                    <td data-label="訂單編號">${order.id}</td>
                    <td data-label="訂購日期">${order.date}</td>
                    <td data-label="總金額">${order.total}</td>
                    <td data-label="狀態"><span class="${order.statusClass}">${order.status}</span></td>
                    <td data-label="操作"><button class="detail-btn" onclick="showOrderDetail('${order.id}')">查看詳情</button></td>
                `;
                tableBody.appendChild(tr);
            });

            setupPagination();
        }

        function setupPagination() {
            const paginationEl = document.getElementById('pagination');
            paginationEl.innerHTML = "";

            let pageCount = Math.ceil(allOrders.length / rowsPerPage);

            let prev = document.createElement('a');
            prev.innerHTML = "&laquo;";
            prev.href = "#";
            if (currentPage === 1) prev.className = "disabled";
            prev.onclick = () => { if(currentPage > 1) { currentPage--; displayOrders(currentPage); } };
            paginationEl.appendChild(prev);

            for (let i = 1; i <= pageCount; i++) {
                let btn = document.createElement('a');
                btn.innerText = i;
                btn.href = "#";
                if (currentPage === i) btn.className = "active";
                btn.onclick = () => {
                    currentPage = i;
                    displayOrders(currentPage);
                };
                paginationEl.appendChild(btn);
            }

            let next = document.createElement('a');
            next.innerHTML = "&raquo;";
            next.href = "#";
            if (currentPage === pageCount) next.className = "disabled";
            next.onclick = () => { if(currentPage < pageCount) { currentPage++; displayOrders(currentPage); } };
            paginationEl.appendChild(next);
        }

        function showOrderDetail(orderId) {
            const order = allOrders.find(o => o.id === orderId);
            const content = document.getElementById('orderDetailContent');
            
            let itemsHtml = order.items.map(item => `<div class="order-detail-item"><span>${item}</span></div>`).join('');
            
            content.innerHTML = `
                <p><strong>訂單編號：</strong> ${order.id}</p>
                <p><strong>下單時間：</strong> ${order.date}</p>
                <p><strong>目前狀態：</strong> ${order.status}</p>
                <div style="margin-top:15px; background:#f9f9f9; padding:15px; border-radius:5px;">
                    <p style="margin-bottom:10px; border-bottom:1px solid #ddd;"><strong>商品清單：</strong></p>
                    ${itemsHtml}
                    <p style="text-align:right; margin-top:10px; font-weight:bold;">總計：${order.total}</p>
                </div>
            `;
            
            document.getElementById('orderModal').classList.add('active');
        }

        document.getElementById('closeOrderModal').onclick = () => {
            document.getElementById('orderModal').classList.remove('active');
        }

        displayOrders(currentPage);