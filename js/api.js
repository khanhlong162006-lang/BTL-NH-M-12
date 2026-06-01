const BASE_URL = "https://69f9a6dcc509a40d3aa2eff4.mockapi.io/api/v1/Chuyenbay"; 

const api = {
    // === ENDPOINT 1: CHUYẾN BAY CHÍNH (/Chuyenbay) ===
    getTrips: () => {
        return fetch(`${BASE_URL}/Chuyenbay`).then(res => {
            if (!res.ok) throw new Error("Không thể tải dữ liệu chuyến bay!");
            return res.json();
        });
    },
    createTrip: (data) => {
        return fetch(`${BASE_URL}/Chuyenbay`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(res => { if (!res.ok) throw new Error("Không thể thêm chuyến bay!"); return res.json(); });
    },
    updateTrip: (id, data) => {
        return fetch(`${BASE_URL}/Chuyenbay/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(res => { if (!res.ok) throw new Error("Không thể cập nhật chuyến bay!"); return res.json(); });
    },
    deleteTrip: (id) => {
        return fetch(`${BASE_URL}/Chuyenbay/${id}`, { method: 'DELETE' })
            .then(res => { if (!res.ok) throw new Error("Không thể xóa chuyến bay!"); return res.json(); });
    },

    // === ENDPOINT 2: DANH SÁCH THEO DÕI (/FlightWatcher) - MỚI BỔ SUNG ===
    getWatchers: () => {
        return fetch(`${BASE_URL}/FlightWatcher`).then(res => {
            if (!res.ok) throw new Error("Không thể tải danh sách theo dõi!");
            return res.json();
        });
    },
    addWatcher: (watcherData) => {
        return fetch(`${BASE_URL}/FlightWatcher`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(watcherData)
        }).then(res => { if (!res.ok) throw new Error("Không thể thêm vào danh sách theo dõi!"); return res.json(); });
    },
    deleteWatcher: (id) => {
        return fetch(`${BASE_URL}/FlightWatcher/${id}`, { method: 'DELETE' })
            .then(res => { if (!res.ok) throw new Error("Không thể xóa khỏi danh sách theo dõi!"); return res.json(); });
    }
};
