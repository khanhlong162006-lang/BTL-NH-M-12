document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("adminTripTable");
    const tripForm = document.getElementById("tripForm");
    const btnLoadMore = document.getElementById("btnLoadMore");
    
    const tripBootstrapModal = new bootstrap.Modal(document.getElementById('tripModal'));
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
    const actionToast = new bootstrap.Toast(document.getElementById('actionToast'));

    let deleteIdTarget = null;
    let displayLimit = 5; // Số lượng phần tử hiển thị lúc đầu (Tính năng tải thêm)
    let totalCachedTrips = [];

    function showToast(msg, isSuccess = true) {
        const toastEl = document.getElementById("actionToast");
        document.getElementById("toastMessage").innerText = msg;
        if(isSuccess) {
            toastEl.classList.replace("bg-danger", "bg-success");
        } else {
            toastEl.classList.replace("bg-success", "bg-danger");
        }
        actionToast.show();
    }

    function renderAdminTable() {
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-secondary">Đang nạp danh sách chuyến bay...</td></tr>`;
        api.getTrips().then(trips => {
            totalCachedTrips = trips;
            tableBody.innerHTML = "";
            
            // Cắt mảng để thực hiện tính năng "Tải thêm / Load more"
            const limitedList = trips.slice(0, displayLimit);
            
            if (displayLimit >= trips.length) {
                btnLoadMore.classList.add("d-none");
            } else {
                btnLoadMore.classList.remove("d-none");
            }

            limitedList.forEach(trip => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${trip.id}</td>
                    <td><img src="${trip.image || 'https://via.placeholder.com/60'}" width="60" height="40" style="object-fit:cover" class="rounded"></td>
                    <td>
                        <div class="fw-bold">${trip.title}</div>
                        <small class="text-muted">${trip.category || 'Chưa phân loại'}</small>
                    </td>
                    <td class="fw-bold text-dark">${Number(trip.budget).toLocaleString()} VND</td>
                    <td>
                        <button class="btn btn-warning btn-sm btn-edit" data-id="${trip.id}">Sửa</button>
                        <button class="btn btn-danger btn-sm btn-delete" data-id="${trip.id}">Xóa</button>
                    </td>
                `;
                tableBody.appendChild(tr);
            });
            attachRowEvents();
        }).catch(err => showToast(err.message, false));
    }

    // Tăng lượng hiển thị khi nhấn nút "Tải thêm"
    btnLoadMore.addEventListener("click", () => {
        displayLimit += 5;
        renderAdminTable();
    });

    function attachRowEvents() {
        document.querySelectorAll(".btn-delete").forEach(btn => {
            btn.addEventListener("click", (e) => {
                deleteIdTarget = e.target.getAttribute("data-id");
                deleteModal.show(); // Hiển thị popup modal xác nhận xóa thay cho confirm()
            });
        });

        document.querySelectorAll(".btn-edit").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = e.target.getAttribute("data-id");
                const trip = totalCachedTrips.find(t => t.id == id);
                if(trip) {
                    document.getElementById("tripId").value = trip.id;
                    document.getElementById("tripTitle").value = trip.title;
                    document.getElementById("tripCategory").value = trip.category || "Vietnam Airlines";
                    document.getElementById("tripDesc").value = trip.description || "";
                    document.getElementById("tripBudget").value = trip.budget;
                    document.getElementById("tripImage").value = trip.image;
                    
                    document.getElementById("tripModalLabel").innerText = "Chỉnh sửa thông tin chuyến bay 📝";
                    clearErrors();
                    tripBootstrapModal.show();
                }
            });
        });
    }

    // Thực thi xóa khi nhấn nút "Đồng ý" trong modal xác nhận
    document.getElementById("btnConfirmDelete").addEventListener("click", () => {
        if(deleteIdTarget) {
            api.deleteTrip(deleteIdTarget).then(() => {
                deleteModal.hide();
                showToast("Đã xóa chuyến bay khỏi hệ thống thành công!");
                renderAdminTable();
            }).catch(err => showToast(err.message, false));
        }
    });

    document.getElementById("btnOpenAddModal").addEventListener("click", () => {
        tripForm.reset();
        document.getElementById("tripId").value = "";
        document.getElementById("tripModalLabel").innerText = "Thêm chuyến bay mới 🛫";
        clearErrors();
    });

    function clearErrors() {
        ['Title', 'Budget', 'Image'].forEach(f => document.getElementById(`error${f}`).classList.add("d-none"));
    }

    tripForm.addEventListener("submit", (e) => {
        e.preventDefault();
        clearErrors();

        const id = document.getElementById("tripId").value;
        const title = document.getElementById("tripTitle").value;
        const category = document.getElementById("tripCategory").value;
        const desc = document.getElementById("tripDesc").value;
        const budget = document.getElementById("tripBudget").value;
        const image = document.getElementById("tripImage").value;

        let isFormValid = true;

        if (utils.isEmpty(title)) {
            document.getElementById("errorTitle").innerText = "Hành trình bay không được trống!";
            document.getElementById("errorTitle").classList.remove("d-none");
            isFormValid = false;
        }
        if (!utils.isValidBudget(budget)) {
            document.getElementById("errorBudget").innerText = "Giá vé phải là số dương lớn hơn 0!";
            document.getElementById("errorBudget").classList.remove("d-none");
            isFormValid = false;
        }
        if (utils.isEmpty(image) || !image.startsWith("http")) {
            document.getElementById("errorImage").innerText = "URL hình ảnh không hợp lệ!";
            document.getElementById("errorImage").classList.remove("d-none");
            isFormValid = false;
        }

        if (isFormValid) {
            const flightData = { title, category, description: desc, budget: Number(budget), image };
            
            if (id) {
                api.updateTrip(id, flightData).then(() => {
                    tripBootstrapModal.hide();
                    showToast("Cập nhật thông tin chuyến bay thành công!");
                    renderAdminTable();
                }).catch(err => showToast(err.message, false));
            } else {
                api.createTrip(flightData).then(() => {
                    tripBootstrapModal.hide();
                    showToast("Thêm mới chuyến bay thành công!");
                    renderAdminTable();
                }).catch(err => showToast(err.message, false));
            }
        }
    });

    renderAdminTable();
});
document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("adminTripTable");
    const watcherTableBody = document.getElementById("adminWatcherTable");
    const tripForm = document.getElementById("tripForm");
    const btnLoadMore = document.getElementById("btnLoadMore");
    
    const tripBootstrapModal = new bootstrap.Modal(document.getElementById('tripModal'));
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
    const actionToast = new bootstrap.Toast(document.getElementById('actionToast'));

    let deleteIdTarget = null;
    let isDeletingWatcher = false; // Cờ phân biệt xóa Chuyến bay hay xóa Watcher
    let displayLimit = 5; 
    let totalCachedTrips = [];

    // Hàm hiển thị Toast thông báo chung
    function showToast(msg, isSuccess = true) {
        const toastEl = document.getElementById("actionToast");
        document.getElementById("toastMessage").innerText = msg;
        if(isSuccess) {
            toastEl.classList.replace("bg-danger", "bg-success");
        } else {
            toastEl.classList.replace("bg-success", "bg-danger");
        }
        actionToast.show();
    }

    // === HÀM 1: Render bảng Chuyến bay chính ===
    function renderAdminTable() {
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-secondary">Đang tải danh sách chuyến bay...</td></tr>`;
        api.getTrips().then(trips => {
            totalCachedTrips = trips;
            tableBody.innerHTML = "";
            
            const limitedList = trips.slice(0, displayLimit);
            btnLoadMore.classList.toggle("d-none", displayLimit >= trips.length);

            limitedList.forEach(trip => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${trip.id}</td>
                    <td><img src="${trip.image || 'https://via.placeholder.com/60'}" width="60" height="40" style="object-fit:cover" class="rounded"></td>
                    <td>
                        <div class="fw-bold">${trip.title}</div>
                        <small class="text-muted">${trip.category || 'Chưa phân loại'}</small>
                    </td>
                    <td class="fw-bold text-dark">${Number(trip.budget).toLocaleString()} VND</td>
                    <td>
                        <button class="btn btn-warning btn-sm btn-edit" data-id="${trip.id}">Sửa</button>
                        <button class="btn btn-danger btn-sm btn-delete-trip" data-id="${trip.id}">Xóa</button>
                        <button class="btn btn-info btn-sm btn-add-watch text-white" data-id="${trip.id}">⚡ Theo dõi</button>
                    </td>
                `;
                tableBody.appendChild(tr);
            });
            attachRowEvents();
        }).catch(err => showToast(err.message, false));
    }

    // === HÀM 2: Render bảng Flight Watcher (MỚI BỔ SUNG) ===
    function renderWatcherTable() {
        watcherTableBody.innerHTML = `<tr><td colspan="5" class="text-center text-secondary">Đang tải danh sách theo dõi...</td></tr>`;
        api.getWatchers().then(watchers => {
            watcherTableBody.innerHTML = "";
            if (watchers.length === 0) {
                watcherTableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">Chưa có chuyến bay nào được thêm vào danh sách theo dõi đặc biệt.</td></tr>`;
                return;
            }

            watchers.forEach(w => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>#${w.id}</td>
                    <td class="fw-bold text-primary">${w.flightTitle || 'Chuyến bay #' + w.flightId}</td>
                    <td><span class="badge bg-warning text-dark">${w.status || 'Đang giám sát giá vé'}</span></td>
                    <td><small class="fw-semibold text-secondary">${w.agent || 'Admin Hệ Thống'}</small></td>
                    <td>
                        <button class="btn btn-outline-danger btn-sm btn-delete-watcher" data-id="${w.id}">Bỏ theo dõi</button>
                    </td>
                `;
                watcherTableBody.appendChild(tr);
            });

            // Gán sự kiện xóa riêng cho bảng Watcher
            document.querySelectorAll(".btn-delete-watcher").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    deleteIdTarget = e.target.getAttribute("data-id");
                    isDeletingWatcher = true; // Đánh dấu xóa từ bảng Watcher
                    deleteModal.show();
                });
            });
        }).catch(err => showToast(err.message, false));
    }

    // Gán sự kiện cho các hàng dữ liệu chuyến bay
    function attachRowEvents() {
        // Sự kiện yêu cầu xóa Chuyến Bay
        document.querySelectorAll(".btn-delete-trip").forEach(btn => {
            btn.addEventListener("click", (e) => {
                deleteIdTarget = e.target.getAttribute("data-id");
                isDeletingWatcher = false; // Đánh dấu xóa từ bảng Chuyến bay chính
                deleteModal.show();
            });
        });

        // Tính năng tương tác liên kết: Click nút "Theo dõi" ở bảng trên -> Tự động thêm vào bảng dưới
        document.querySelectorAll(".btn-add-watch").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = e.target.getAttribute("data-id");
                const trip = totalCachedTrips.find(t => t.id == id);
                if (trip) {
                    const newWatcher = {
                        flightId: trip.id,
                        flightTitle: trip.title,
                        status: "Đang kiểm tra biến động giá",
                        agent: "Admin giám sát"
                    };
                    api.addWatcher(newWatcher).then(() => {
                        showToast(`Đã đưa chuyến bay [${trip.title}] vào danh sách Watcher thành công!`);
                        renderWatcherTable();
                    }).catch(err => showToast(err.message, false));
                }
            });
        });

        // Sự kiện bấm nút Sửa
        document.querySelectorAll(".btn-edit").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = e.target.getAttribute("data-id");
                const trip = totalCachedTrips.find(t => t.id == id);
                if(trip) {
                    document.getElementById("tripId").value = trip.id;
                    document.getElementById("tripTitle").value = trip.title;
                    document.getElementById("tripCategory").value = trip.category || "Vietnam Airlines";
                    document.getElementById("tripDesc").value = trip.description || "";
                    document.getElementById("tripBudget").value = trip.budget;
                    document.getElementById("tripImage").value = trip.image;
                    
                    document.getElementById("tripModalLabel").innerText = "Chỉnh sửa thông tin chuyến bay 📝";
                    clearErrors();
                    tripBootstrapModal.show();
                }
            });
        });
    }

    // Xử lý sự kiện đồng ý xóa trên Modal Xác nhận chung
    document.getElementById("btnConfirmDelete").addEventListener("click", () => {
        if (!deleteIdTarget) return;

        if (isDeletingWatcher) {
            // Thực hiện tác vụ xóa Watcher
            api.deleteWatcher(deleteIdTarget).then(() => {
                deleteModal.hide();
                showToast("Đã gỡ chuyến bay khỏi danh sách giám sát đặc biệt!");
                renderWatcherTable();
            }).catch(err => showToast(err.message, false));
        } else {
            // Thực hiện tác vụ xóa Chuyến bay chính
            api.deleteTrip(deleteIdTarget).then(() => {
                deleteModal.hide();
                showToast("Xóa chuyến bay khỏi danh mục chính thành công!");
                renderAdminTable();
            }).catch(err => showToast(err.message, false));
        }
    });

    // Các logic form validation & Tải thêm giữ nguyên...
    btnLoadMore.addEventListener("click", () => { displayLimit += 5; renderAdminTable(); });
    document.getElementById("btnOpenAddModal").addEventListener("click", () => {
        tripForm.reset(); document.getElementById("tripId").value = ""; clearErrors();
    });
    function clearErrors() { ['Title', 'Budget', 'Image'].forEach(f => document.getElementById(`error${f}`).classList.add("d-none")); }

    tripForm.addEventListener("submit", (e) => {
        e.preventDefault(); clearErrors();
        const id = document.getElementById("tripId").value;
        const title = document.getElementById("tripTitle").value;
        const category = document.getElementById("tripCategory").value;
        const desc = document.getElementById("tripDesc").value;
        const budget = document.getElementById("tripBudget").value;
        const image = document.getElementById("tripImage").value;

        let isFormValid = true;
        if (utils.isEmpty(title)) { document.getElementById("errorTitle").classList.remove("d-none"); isFormValid = false; }
        if (!utils.isValidBudget(budget)) { document.getElementById("errorBudget").classList.remove("d-none"); isFormValid = false; }
        if (utils.isEmpty(image) || !image.startsWith("http")) { document.getElementById("errorImage").classList.remove("d-none"); isFormValid = false; }

        if (isFormValid) {
            const flightData = { title, category, description: desc, budget: Number(budget), image };
            if (id) {
                api.updateTrip(id, flightData).then(() => { tripBootstrapModal.hide(); showToast("Cập nhật thành công!"); renderAdminTable(); });
            } else {
                api.createTrip(flightData).then(() => { tripBootstrapModal.hide(); showToast("Thêm mới thành công!"); renderAdminTable(); });
            }
        }
    });

    // Chạy khởi tạo đồng thời cả 2 bảng dữ liệu thời gian thực
    renderAdminTable();
    renderWatcherTable();
});