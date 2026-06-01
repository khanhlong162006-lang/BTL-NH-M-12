   <script>
        const API_URL = "https://69f9a6dcc509a40d3aa2eff4.mockapi.io/api/v1/chuyenbay";
        let flightsDataCache = []; // Mảng chứa dữ liệu thô tải từ server về

        // 1. Quản lý Đổi Tab Sidebar
        const menuItems = document.querySelectorAll('.menu-item');
        const tabContents = document.querySelectorAll('.tab-content');

        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                menuItems.forEach(i => i.classList.remove('active'));
                tabContents.forEach(t => t.classList.remove('active'));

                item.classList.add('active');
                const tabId = item.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });

        // 2. Fetch dữ liệu bất đồng bộ từ Mock API thực tế của bạn
        async function fetchFlights() {
            const gridContainer = document.getElementById('flights-card-grid');
            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error("Mạng không ổn định hoặc sai Endpoint dữ liệu.");
                
                flightsDataCache = await response.json();
                renderFlights(flightsDataCache); // Hiển thị toàn bộ dữ liệu khi tải trang xong
            } catch (error) {
                console.error("Lỗi liên kết API:", error);
                gridContainer.innerHTML = `
                    <div class="status-message" style="color:var(--danger)">
                        <i class="fa-solid fa-circle-exclamation"></i><br>
                        Không thể truy xuất dữ liệu từ máy chủ API.<br>
                        <small style="display:block; margin-top:5px;">Chi tiết: ${error.message}</small>
                    </div>`;
            }
        }

        // 3. Đổ dữ liệu động vào giao diện cấu trúc CSS Card của bạn
        function renderFlights(flightsList) {
            const gridContainer = document.getElementById('flights-card-grid');
            
            if (!flightsList || flightsList.length === 0) {
                gridContainer.innerHTML = `
                    <div class="status-message">
                        <i class="fa-solid fa-plane-slash"></i><br>Không tìm thấy lịch bay thích hợp với tuyến đường này.
                    </div>`;
                return;
            }

            gridContainer.innerHTML = flightsList.map(flight => {
                // Ánh xạ các key dữ liệu từ Mock API đề phòng trùng hoặc khác tên (fallback)
                const id = flight.flightNo || flight.id || 'SL-' + Math.floor(Math.random() * 900 + 100);
                const from = flight.fromCity || flight.from || 'Chưa rõ';
                const to = flight.toCity || flight.to || 'Chưa rõ';
                const dTime = flight.departureTime || '08:00';
                const aTime = flight.arrivalTime || '10:15';
                const duration = flight.duration || '2h 15m';
                
                // Chuẩn hóa định dạng tiền tệ Việt Nam Đồng (VND)
                const priceFormatted = flight.price 
                    ? Number(flight.price).toLocaleString('vi-VN') + " đ" 
                    : "Hết chỗ";

                return `
                    <div class="flight-item">
                        <div class="fi-header">
                            <div>
                                <div class="fi-route">${from} ➔ ${to}</div>
                                <div class="fi-flight-no">Mã hành trình: ${id}</div>
                            </div>
                            <div class="fi-icon-wrap"><i class="fa-solid fa-plane"></i></div>
                        </div>
                        <div class="flight-item-body">
                            <div class="fi-time-row">
                                <div class="fi-time-block">
                                    <h2>${dTime}</h2>
                                    <p>${from}</p>
                                </div>
                                <div class="fi-duration-block">
                                    <span>${duration}</span>
                                    <i class="fa-solid fa-ellipsis"></i>
                                </div>
                                <div class="fi-time-block">
                                    <h2>${aTime}</h2>
                                    <p>${to}</p>
                                </div>
                            </div>
                        </div>
                        <div class="fi-footer">
                            <div class="fi-price">${priceFormatted}</div>
                            <button class="btn-gold" style="padding: 8px 16px; font-size:12px; border:none; border-radius:6px; font-weight:600; cursor:pointer;">Đặt Vé</button>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // 4. Lọc dữ liệu khách hàng chọn trên bộ lọc Frontend
        document.getElementById('btn-search').addEventListener('click', () => {
            const fromSelected = document.getElementById('from-city').value;
            const toSelected = document.getElementById('to-city').value;

            const filteredResult = flightsDataCache.filter(flight => {
                const flightFrom = (flight.fromCity || flight.from || '').toLowerCase();
                const flightTo = (flight.toCity || flight.to || '').toLowerCase();
                
                // So khớp chuỗi lọc (nếu chọn "Tất cả" thì bỏ qua điều kiện đó)
                const matchFrom = !fromSelected || flightFrom.includes(fromSelected.toLowerCase());
                const matchTo = !toSelected || flightTo.includes(toSelected.toLowerCase());
                
                return matchFrom && matchTo;
            });

            renderFlights(filteredResult);
        });

        // 5. Tự động chạy lệnh gọi API ngay khi cấu trúc DOM sẵn sàng
        window.addEventListener('DOMContentLoaded', fetchFlights);
    </script>
