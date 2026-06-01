/* MockAPI access and flight CRUD operations. */
const API_URL = 'https://69f9a6dcc509a40d3aa2eff4.mockapi.io/api/v1/chuyenbay';
function seedFlights() {
    return [
        {id:1,from:'HAN',to:'SGN',dep:'06:30',arr:'08:40',dur:'2h10m',flightNo:'SK212',cur:1190000,tgt:990000,type:'domestic',seatClass:'economy',note:'Bay buổi sáng sớm'},
        {id:2,from:'SGN',to:'DAD',dep:'07:00',arr:'08:20',dur:'1h20m',flightNo:'SK108',cur:790000,tgt:750000,type:'domestic',seatClass:'economy',note:''},
        {id:3,from:'HAN',to:'PQC',dep:'22:15',arr:'00:05',dur:'1h50m',flightNo:'SK362',cur:1350000,tgt:1200000,type:'domestic',seatClass:'economy',note:'Chuyến đêm'},
        {id:4,from:'SGN',to:'CXR',dep:'09:00',arr:'10:05',dur:'1h05m',flightNo:'SK525',cur:680000,tgt:750000,type:'domestic',seatClass:'economy',note:''},
        {id:5,from:'HAN',to:'DAD',dep:'23:40',arr:'01:10',dur:'1h30m',flightNo:'SK214',cur:890000,tgt:900000,type:'domestic',seatClass:'economy',note:'Chuyến đêm'},
        {id:6,from:'SGN',to:'PQC',dep:'08:20',arr:'09:25',dur:'1h05m',flightNo:'SK341',cur:820000,tgt:850000,type:'domestic',seatClass:'business',note:''},
        {id:7,from:'HAN',to:'BKK',dep:'10:00',arr:'13:30',dur:'3h30m',flightNo:'SK510',cur:2450000,tgt:2000000,type:'international',seatClass:'economy',note:'Quốc tế'},
        {id:8,from:'SGN',to:'CXR',dep:'14:30',arr:'15:30',dur:'1h00m',flightNo:'SK612',cur:770000,tgt:790000,type:'domestic',seatClass:'economy',note:''},
    ];
}

/* ═══════════════════════════════════
   FLIGHT LIST – RENDER
═══════════════════════════════════ */
function normalizeFlight(raw) {
    return {
        id: raw.id ?? Date.now(),
        from: (raw.from || raw.fromCity || '').toUpperCase(),
        to: (raw.to || raw.toCity || '').toUpperCase(),
        dep: raw.dep || raw.departureTime || '06:00',
        arr: raw.arr || raw.arrivalTime || '08:00',
        dur: raw.dur || raw.duration || calcDur(raw.dep || raw.departureTime || '06:00', raw.arr || raw.arrivalTime || '08:00'),
        flightNo: raw.flightNo || raw.code || `SK${raw.id ?? Math.floor(Math.random() * 900 + 100)}`,
        cur: Number(raw.cur ?? raw.currentPrice ?? raw.price ?? 0),
        tgt: Number(raw.tgt ?? raw.targetPrice ?? raw.price ?? 0),
        type: raw.type || 'domestic',
        seatClass: raw.seatClass || raw.class || 'economy',
        note: raw.note || ''
    };
}

async function requestApi(path = '', options = {}) {
    const response = await fetch(`${API_URL}${path}`, {
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
        ...options
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    if (response.status === 204) return null;
    return response.json();
}

async function loadFlights() {
    try {
        const data = await requestApi();
        flights = Array.isArray(data) && data.length ? data.map(normalizeFlight) : seedFlights();
    } catch (error) {
        console.warn('Không thể tải dữ liệu từ MockAPI, dùng dữ liệu mẫu:', error);
        flights = seedFlights();
    }
    renderGrid();
    updateSelectBtn();
}

function readFlightForm() {
    const dep = document.getElementById('m-dep').value;
    const arr = document.getElementById('m-arr').value;
    return {
        from: document.getElementById('m-from').value.trim().toUpperCase(),
        to: document.getElementById('m-to').value.trim().toUpperCase(),
        dep,
        arr,
        dur: document.getElementById('m-dur').value.trim() || calcDur(dep, arr),
        flightNo: document.getElementById('m-flight-no').value.trim().toUpperCase(),
        cur: Number(document.getElementById('m-cur').value),
        tgt: Number(document.getElementById('m-tgt').value),
        type: document.getElementById('m-type').value,
        seatClass: document.getElementById('m-class').value,
        note: document.getElementById('m-note').value.trim()
    };
}

async function saveFlight() {
    const payload = readFlightForm();
    if (!payload.from || !payload.to || !payload.flightNo || !payload.cur || !payload.tgt) {
        showToast('Vui lòng nhập đủ thông tin chặng bay!', 'error');
        return;
    }

    const localFlight = normalizeFlight({ ...payload, id: editingId || Date.now() });
    if (editingId) {
        flights = flights.map(f => String(f.id) === String(editingId) ? localFlight : f);
    } else {
        flights.push(localFlight);
    }

    try {
        const saved = await requestApi(editingId ? `/${editingId}` : '', {
            method: editingId ? 'PUT' : 'POST',
            body: JSON.stringify(payload)
        });
        const normalized = normalizeFlight(saved || localFlight);
        flights = editingId
            ? flights.map(f => String(f.id) === String(editingId) ? normalized : f)
            : flights.map(f => String(f.id) === String(localFlight.id) ? normalized : f);
    } catch (error) {
        console.warn('Không thể đồng bộ MockAPI, đã lưu tạm trên giao diện:', error);
    }

    closeFlightModal();
    renderGrid();
    updateSelectBtn();
    showToast(editingId ? 'Đã cập nhật chặng bay!' : 'Đã thêm chặng bay!', 'success');
}

function confirmDelete(id) {
    const flight = flights.find(f => String(f.id) === String(id));
    openConfirm('Xóa chặng bay', `Bạn có chắc muốn xóa chặng <strong>${flight ? `${flight.from} → ${flight.to}` : id}</strong>?`, () => deleteFlight(id));
}

async function deleteFlight(id) {
    flights = flights.filter(f => String(f.id) !== String(id));
    selectedIds.delete(String(id));
    try {
        await requestApi(`/${id}`, { method: 'DELETE' });
    } catch (error) {
        console.warn('Không thể xóa trên MockAPI, đã xóa tạm trên giao diện:', error);
    }
    renderGrid();
    updateSelectBtn();
    showToast('Đã xóa chặng bay!', 'info');
}

function deleteSelected() {
    if (!selectedIds.size) return;
    openConfirm('Xóa các chặng đã chọn', `Xóa <strong>${selectedIds.size}</strong> chặng bay đã chọn?`, async () => {
        const ids = [...selectedIds];
        flights = flights.filter(f => !selectedIds.has(String(f.id)));
        selectedIds.clear();
        await Promise.allSettled(ids.map(id => requestApi(`/${id}`, { method: 'DELETE' })));
        renderGrid();
        updateSelectBtn();
        showToast('Đã xóa các chặng đã chọn!', 'info');
    });
}

