document.addEventListener("DOMContentLoaded", () => {
    let allFlights = []; // Lưu trữ mảng gốc để lọc/tìm kiếm không cần gọi lại API
    const flightContainer = document.getElementById("flightContainer");
    const loadingSpinner = document.getElementById("loadingSpinner");
    const errorMessage = document.getElementById("errorMessage");
    
    const searchInput = document.getElementById("searchFlight");
    const filterSelect = document.getElementById("filterCategory");
    const detailModal = new bootstrap.Modal(document.getElementById('detailModal'));

    // 1. Fetch lấy dữ liệu từ MockAPI
    api.getTrips()
        .then(data => {
            loadingSpinner.classList.add("d-none");
            allFlights = data;
            renderFlights(allFlights);
        })
        .catch(error => {
            loadingSpinner.classList.add("d-none");
            errorMessage.classList.remove("d-none");
            errorMessage.innerText = error.message;
        });

    // 2. Hàm render danh sách Card chuyến bay kèm hiệu ứng CSS Hover
    function renderFlights(flights) {
        if (flights.length === 0) {
            flightContainer.innerHTML = `<div class="col-12 class='text-center text-muted'"><p>Không tìm thấy chuyến bay nào thích hợp.</p></div>`;
            return;
        }

        let htmlContent = "";
        flights.forEach(flight => {
            htmlContent += `
                <div class="col-12 col-md-6 col-lg-4">
                    <div class="card h-100 shadow-sm border-0 card-flight-hover">
                        <img src="${flight.image || 'https://via.placeholder.com/300x180'}" class="card-img-top" style="height: 180px; object-fit: cover;">
                        <div class="card-body d-flex flex-column">
                            <span class="badge bg-sub-brand mb-2 text-primary fw-bold" style="background-color: #e3f2fd; width: fit-content;">${flight.category || 'Chuyến Bay'}</span>
                            <h5 class="card-title fw-bold text-dark">${flight.title}</h5>
                            <p class="card-text text-muted flex-grow-1">${flight.description || 'Chưa có mô tả lịch trình cụ thể.'}</p>
                            <p class="fw-bold text-danger fs-5 mb-3">${Number(flight.budget).toLocaleString()} VND</p>
                            <button class="btn btn-outline-primary btn-sm btn-view-detail w-100 mt-auto" data-id="${flight.id}">Xem Chi Tiết</button>
                        </div>
                    </div>
                </div>
            `;
        });
        flightContainer.innerHTML = htmlContent;

        // Sự kiện Xem Chi Tiết bằng Modal
        document.querySelectorAll(".btn-view-detail").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = e.target.getAttribute("data-id");
                const selected = allFlights.find(f => f.id == id);
                if (selected) {
                    document.getElementById("detailTitle").innerText = selected.title;
                    document.getElementById("detailBody").innerHTML = `
                        <img src="${selected.image}" class="img-fluid rounded mb-3 shadow-sm" style="max-height: 250px; object-fit: cover;">
                        <h5 class="text-primary fw-bold">${Number(selected.budget).toLocaleString()} VND</h5>
                        <p class="badge bg-secondary">${selected.category || 'Phổ thông'}</p>
                        <p class="text-dark border-top pt-2 mt-2">${selected.description || 'Hành trình bay nội địa/quốc tế chất lượng cao.'}</p>
                    `;
                    detailModal.show();
                }
            });
        });
    }

    // 3. Sự kiện Tìm kiếm (input event) & Lọc danh mục (change event) - JS Thuần
    function handleFilterAndSearch() {
        const keyword = searchInput.value.toLowerCase().trim();
        const selectedCat = filterSelect.value;

        const filtered = allFlights.filter(flight => {
            const matchesSearch = flight.title.toLowerCase().includes(keyword) || (flight.description && flight.description.toLowerCase().includes(keyword));
            const matchesCategory = (selectedCat === "all" || flight.category === selectedCat);
            return matchesSearch && matchesCategory;
        });
        
        renderFlights(filtered);
    }

    searchInput.addEventListener("input", handleFilterAndSearch);
    filterSelect.addEventListener("change", handleFilterAndSearch);
});

// 4. jQuery xử lý tính năng chia tiền và hiệu ứng chuyển động ẩn/hiện
$(document).ready(function() {
    $("#btnToggleSplit").on("click", function() {
        $("#splitSection").slideToggle(300);
    });

    $("#btnCalculate").click(function() {
        const total = $("#inputTotalAmount").val();
        const people = $("#inputPeople").val();
        const result = utils.calculateSplitExpense(total, people);

        if (result === 0) {
            $("#splitResult").text("Vui lòng kiểm tra lại thông tin nhập vào!").css("color", "red");
        } else {
            $("#splitResult").hide().html(`👉 Mỗi người nhận chia: ${result.toLocaleString()} VND`).fadeIn(400).css("color", "#198754");
        }
    });
});