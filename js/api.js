const BASE_URL = "https://69f9a6dcc509a40d3aa2eff4.mockapi.io/api/v1/Chuyenbay"; 

// 1. Hàm Tải dữ liệu từ API
async function loadFlights() {
    try {
        const res = await fetch(API_URL);
        if(res.ok) {
            flights = await res.json();
        } else {
            flights = seedFlights(); // Fallback nếu API lỗi
        }
        renderGrid();
        updateFlStats();
    } catch(e) {
        console.error("Lỗi khi tải dữ liệu API:", e);
        flights = seedFlights();
renderGrid();
        updateFlStats();
    }
}

// 2. Hàm Ghi đè Cập nhật/Thêm mới qua API
async function saveFlight() {
    const from = document.getElementById('m-from').value.trim().toUpperCase();
    const to   = document.getElementById('m-to').value.trim().toUpperCase();
    const dep  = document.getElementById('m-dep').value;
    const arr  = document.getElementById('m-arr').value;
    const dur  = document.getElementById('m-dur').value.trim() || calcDur(dep,arr);
    const flightNo = document.getElementById('m-flight-no').value.trim() || `SK${Math.floor(Math.random()*900)+100}`;
    const cur  = parseInt(document.getElementById('m-cur').value)||0;
    const tgt  = parseInt(document.getElementById('m-tgt').value)||0;
    const type = document.getElementById('m-type').value;
    const seatClass = document.getElementById('m-class').value;
    const note = document.getElementById('m-note').value.trim();
    
    if (!from||!to) { showToast('Vui lòng nhập mã sân bay đi và đến!','error'); return; }
    if (!cur)       { showToast('Vui lòng nhập giá hiện tại!','error'); return; }
    if (!tgt)       { showToast('Vui lòng nhập giá mục tiêu!','error'); return; }
    
    const flightData = {from, to, dep, arr, dur, flightNo, cur, tgt, type, seatClass, note};

    try {
        if (editingId) {
            // PUT: Cập nhật
            await fetch(`${API_URL}/${editingId}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(flightData)
            });
            showToast('Đã cập nhật chặng bay trên API!','success');
        } else {
            // POST: Thêm mới
            await fetch(API_URL, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(flightData)
            });
            showToast('Đã thêm chặng bay mới lên API!','success');
        }
        closeFlightModal();
        loadFlights(); // Tải lại dữ liệu từ API
    } catch (error) {
        showToast('Lỗi kết nối đến API!','error');
        console.error(error);
    }
}


function confirmDelete(id) {
    const f = flights.find(x => String(x.id) === String(id));
    openConfirm('Xóa chặng bay',`Xóa chặng <strong>${f.from} → ${f.to}</strong> (${f.flightNo})?`, async () => {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            selectedIds.delete(String(id));
            updateSelectBtn();
            loadFlights(); // Tải lại sau khi xóa
            showToast('Đã xóa chặng bay khỏi API!','info');
        } catch (error) {
            showToast('Lỗi khi xóa trên API!','error');
        }
    });
}


function deleteSelected() {
    if(!selectedIds.size) return;
    const cnt = selectedIds.size;
openConfirm('Xóa nhiều chặng',`Xóa <strong>${cnt}</strong> chặng đã chọn?`, async () => {
        try {
           
            const deletePromises = Array.from(selectedIds).map(id => fetch(`${API_URL}/${id}`, { method: 'DELETE' }));
            await Promise.all(deletePromises);
            
            selectedIds.clear();
            updateSelectBtn();
            loadFlights();
            showToast(`Đã xóa ${cnt} chặng!`,'info');
        } catch (error) {
            showToast('Lỗi khi xóa nhiều trên API!','error');
        }
    });
}


function clearAllFlights() {
    if(!flights.length){ showToast('Chưa có chặng nào!','warning'); return; }
    openConfirm('Xóa tất cả chặng',`Xóa toàn bộ <strong>${flights.length}</strong> chặng bay?`, async () => {
        try {
            
            const deletePromises = flights.map(f => fetch(`${API_URL}/${f.id}`, { method: 'DELETE' }));
            await Promise.all(deletePromises);
            
            selectedIds.clear();
            updateSelectBtn();
            loadFlights();
            showToast('Đã xóa tất cả chặng!','info');
        } catch (error) {
            showToast('Lỗi khi xóa toàn bộ trên API!','error');
        }
    });
}

// Khởi chạy App
loadFlights();
