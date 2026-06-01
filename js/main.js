/* Page interaction and rendering logic. */

/* ═══════════════════════════════════
   MOBILE MENU LOGIC
═══════════════════════════════════ */
function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobile-overlay');
    
    sidebar.classList.toggle('open');
    if (sidebar.classList.contains('open')) {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    } else {
        overlay.classList.remove('active');
        document.body.style.overflow = ''; 
    }
}

/* ═══════════════════════════════════
   NAVIGATION
═══════════════════════════════════ */
const BREADCRUMBS = {
    'home-tab':'Trang chủ','booking-tab':'Mua vé','services-tab':'Dịch vụ bổ trợ',
    'itinerary-tab':'Hành trình','experience-tab':'Trải nghiệm bay',
    'lotusmiles-tab':'Lotusmiles','help-tab':'Trợ giúp','flight-list-tab':'Danh sách chặng',
};

function switchTab(tabId, clickedEl) {
    document.querySelectorAll('.flyout').forEach(f => f.style.display='none');
    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active','submenu-active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    
    const tab = document.getElementById(tabId);
    if (tab) tab.classList.add('active');
    
    if (clickedEl && clickedEl.classList && clickedEl.classList.contains('menu-item')) {
        clickedEl.classList.add('active');
    }
    
    const bc = document.getElementById('breadcrumb-current');
    if (bc) bc.textContent = BREADCRUMBS[tabId] || '';
    
    window.scrollTo(0,0);
    if (tabId === 'flight-list-tab') renderGrid();
    
    if (window.innerWidth <= 800) {
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('mobile-overlay').classList.remove('active');
        document.body.style.overflow = '';
    }
}

function toggleFlyout(id, clickedEl) {
    const fly = document.getElementById(id);
    const isOpen = fly.style.display === 'block';
    document.querySelectorAll('.flyout').forEach(f => f.style.display='none');
    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active','submenu-active'));
    if (!isOpen) {
        fly.style.display = 'block';
        clickedEl.classList.add('submenu-active');
        const rect = clickedEl.getBoundingClientRect();
        let top = rect.top - 15;
        if (top < 10) top = 10;
        const maxTop = window.innerHeight - fly.scrollHeight - 10;
        fly.style.top = Math.min(top, Math.max(10, maxTop)) + 'px';
    }
}
function closeFlyout(id) {
    document.getElementById(id).style.display='none';
    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('submenu-active'));
}
document.addEventListener('click', function(e) {
    if (!e.target.closest('.flyout') && !e.target.closest('.menu-item') && !e.target.closest('.mobile-menu-btn')) {
        document.querySelectorAll('.flyout').forEach(f => f.style.display='none');
        document.querySelectorAll('.menu-item.submenu-active').forEach(m => m.classList.remove('submenu-active'));
    }
});

/* ═══════════════════════════════════
   TOPBAR SEARCH
═══════════════════════════════════ */
function onTopbarSearch() {
    const q = document.getElementById('topbar-q').value.trim();
    if (q.length >= 2) {
        switchTab('flight-list-tab', document.getElementById('mn-flightlist'));
        document.getElementById('fl-search').value = q;
        renderGrid();
    }
}

/* ═══════════════════════════════════
   NEWS TICKER
═══════════════════════════════════ */
const tickerItems = [
    'Sân bay Liên Khương tạm dừng hoạt động để nâng cấp đường băng từ 01/06/2026.',
    'Flash Sale cuối tuần: Giảm 30% tất cả chuyến bay nội địa từ 23–25/05/2026.',
    'SkyLeap mở thêm 5 đường bay quốc tế mới đến Bangkok, Seoul, Tokyo từ tháng 7/2026.',
];
let tickerIdx = 0;
function changeTicker(dir) {
    tickerIdx = (tickerIdx + dir + tickerItems.length) % tickerItems.length;
    document.getElementById('ticker-text').textContent = tickerItems[tickerIdx];
    document.getElementById('ticker-page').textContent = (tickerIdx+1) + ' / ' + tickerItems.length;
}
setInterval(() => changeTicker(1), 5000);

/* ═══════════════════════════════════
   HOME: search tabs & filter pills
═══════════════════════════════════ */
document.querySelectorAll('.search-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.search-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
    });
});
document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', function() {
        document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        this.classList.add('active');
    });
});

/* ═══════════════════════════════════
   FAQ
═══════════════════════════════════ */
function toggleFaq(item) {
    const ans = item.nextElementSibling;
    if (!ans || !ans.classList.contains('faq-answer')) return;
    const isOpen = ans.classList.contains('open');
    document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) { ans.classList.add('open'); item.classList.add('open'); }
}

/* ═══════════════════════════════════
   AUTH MODAL
═══════════════════════════════════ */
function openAuth(mode) { document.getElementById('auth-modal').classList.remove('hidden'); switchAuthMode(mode); }
function closeAuth() { document.getElementById('auth-modal').classList.add('hidden'); }
function switchAuthMode(mode) {
    const isLogin = mode === 'login';
    document.getElementById('auth-title').textContent = isLogin ? 'Đăng nhập tài khoản' : 'Đăng ký tài khoản';
    document.getElementById('tab-login').classList.toggle('active', isLogin);
    document.getElementById('tab-register').classList.toggle('active', !isLogin);
    document.getElementById('login-form').classList.toggle('active', isLogin);
    document.getElementById('reg-form').classList.toggle('active', !isLogin);
    document.getElementById('login-msg').textContent = '';
    document.getElementById('reg-msg').textContent = '';
}
function doLogin(e) {
    e.preventDefault();
    const email = document.getElementById('ln-email').value.trim();
    const pw = document.getElementById('ln-pw').value.trim();
    const msg = document.getElementById('login-msg');
    if (!email||!pw) { msg.style.color='var(--danger)'; msg.textContent='Vui lòng nhập đầy đủ thông tin.'; return; }
    msg.style.color='var(--success)'; msg.textContent='✓ Đăng nhập thành công!';
    setTimeout(closeAuth, 900);
}
function doRegister(e) {
    e.preventDefault();
    const name = document.getElementById('rg-name').value.trim();
    const email = document.getElementById('rg-email').value.trim();
    const pw = document.getElementById('rg-pw').value;
    const cf = document.getElementById('rg-cf').value;
    const msg = document.getElementById('reg-msg');
    if (!name||!email||!pw||!cf) { msg.style.color='var(--danger)'; msg.textContent='Vui lòng điền đầy đủ thông tin.'; return; }
    if (pw.length < 6) { msg.style.color='var(--danger)'; msg.textContent='Mật khẩu phải có ít nhất 6 ký tự.'; return; }
    if (pw !== cf) { msg.style.color='var(--danger)'; msg.textContent='Mật khẩu xác nhận không khớp.'; return; }
    msg.style.color='var(--success)'; msg.textContent='✓ Tạo tài khoản thành công!';
    setTimeout(closeAuth, 900);
}
document.getElementById('auth-modal').addEventListener('click', function(e) { if(e.target===this) closeAuth(); });

/* ═══════════════════════════════════
   FLIGHT LIST – DATA
═══════════════════════════════════ */

let flights = [], savedRoutes = [], routeStops = [];
let currentFilter = 'all', selectedIds = new Set(), editingId = null;
let routePanelOpen = false;

function renderCard(f) {
    const good = f.cur <= f.tgt;
    const ratio = f.cur / f.tgt;
    const pct = Math.min(Math.round(ratio * 70), 100);
    const barColor = good ? 'var(--success)' : ratio > 1.25 ? 'var(--danger)' : 'var(--accent)';
    const statusDot = good ? 'good' : ratio > 1.25 ? 'high' : 'wait';
    const statusText = good ? 'Đạt mục tiêu' : ratio > 1.25 ? 'Giá cao' : 'Đang chờ';
    const night = isNight(f.dep);
    const checked = selectedIds.has(f.id);
    const diff = Math.abs(f.cur - f.tgt);

    return `<div class="flight-item${checked?' selected':''}" id="fi-${f.id}">
        <div class="fi-header">
            <div>
                <div class="fi-route">${f.from} → ${f.to}</div>
                <div class="fi-flight-no">${f.flightNo} · ${TYPE_LBL[f.type]||f.type}</div>
            </div>
            <div class="fi-actions-header">
                <div class="fi-check${checked?' checked':''}" onclick="toggleSelect('${f.id}')"><i class="fa-solid fa-check"></i></div>
                <button class="fi-icon-btn" onclick="openFlightModal('${f.id}')" title="Sửa"><i class="fa-solid fa-pen"></i></button>
<button class="fi-icon-btn del" onclick="confirmDelete('${f.id}')" title="Xóa"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>
        <div class="fi-body">
            <div class="fi-times">
                <div class="fi-time"><div class="t">${f.dep}</div><div class="ap">${f.from}</div></div>
                <div class="fi-line">
                    <div class="dur">${f.dur}</div>
                    <div class="line"></div>
                </div>
                <div class="fi-time" style="text-align:right"><div class="t">${f.arr}</div><div class="ap">${f.to}</div></div>
            </div>
            <div class="fi-prices">
                <div class="fi-price-block">
                    <div class="lbl">Hiện tại</div>
                    <div class="val current">${(f.cur/1e6).toFixed(3).replace('.',',')}M</div>
                </div>
                <div class="fi-divider"></div>
                <div class="fi-price-block">
                    <div class="lbl">Mục tiêu</div>
                    <div class="val ${good?'good':'target'}">${(f.tgt/1e6).toFixed(3).replace('.',',')}M</div>
                </div>
                <div class="fi-divider"></div>
                <div class="fi-price-block">
                    <div class="lbl">${good?'Tiết kiệm':'Chênh lệch'}</div>
                    <div class="val" style="color:${good?'var(--success)':'var(--danger)'};font-size:14px;">${good?'+':'-'}${Math.round(diff/1000)}K</div>
                </div>
            </div>
            <div class="fi-progress">
                <div class="lbl"><span><span class="status-dot ${statusDot}"></span>${statusText}</span><span>${pct}%</span></div>
                <div class="progress-bar"><div class="progress-fill" style="width:${pct}%;background:${barColor};"></div></div>
            </div>
            <div class="fi-footer">
                <div class="fi-tags">
                    <span class="badge badge-${good?'success':'muted'}">${good?'✅ Giá tốt':'⏳ Chờ giảm'}</span>
                    ${night?'<span class="badge badge-night">🌙 Đêm</span>':''}
                    <span class="badge badge-primary">${CLASS_LBL[f.seatClass]||f.seatClass}</span>
                </div>
                <div class="fi-footer-actions">
                    <button class="fi-btn-edit" onclick="openFlightModal('${f.id}')"><i class="fa-solid fa-pen"></i> Sửa</button>
                    <button class="fi-btn-book" onclick="switchTab('booking-tab',null)"><i class="fa-solid fa-ticket"></i> Đặt vé</button>
                </div>
            </div>
            ${f.note?`<div style="margin-top:8px;font-size:12px;color:var(--txt-muted);padding:6px 10px;background:var(--bg);border-radius:6px;"><i class="fa-solid fa-note-sticky" style="color:var(--accent)"></i> ${f.note}</div>`:''}
        </div>
</div>`;
}

function getFiltered() {
    const q = (document.getElementById('fl-search')?.value||'').toLowerCase();
    const sort = document.getElementById('fl-sort')?.value||'idx';
    let list = flights.filter(f => {
        if (currentFilter==='good'  && !(f.cur<=f.tgt)) return false;
        if (currentFilter==='wait'  && f.cur<=f.tgt)    return false;
        if (currentFilter==='night' && !isNight(f.dep)) return false;
        if (q && !`${f.from}${f.to}${f.flightNo}${f.note}`.toLowerCase().includes(q)) return false;
        return true;
    });
    return [...list].sort((a,b) => {
        if (sort==='price-asc')  return a.cur-b.cur;
        if (sort==='price-desc') return b.cur-a.cur;
        if (sort==='time-asc')   return a.dep.localeCompare(b.dep);
        if (sort==='time-desc')  return b.dep.localeCompare(a.dep);
        if (sort==='name')       return `${a.from}${a.to}`.localeCompare(`${b.from}${b.to}`);
        return flights.indexOf(a)-flights.indexOf(b);
    });
}

function renderGrid() {
    const list = getFiltered();
    const grid = document.getElementById('flights-card-grid');
    const empty = document.getElementById('fl-empty');
    if (!grid) return;
    if (list.length===0) { grid.innerHTML=''; empty.style.display='block'; }
    else { empty.style.display='none'; grid.innerHTML=list.map(renderCard).join(''); }
    updateFlStats();
}

function updateFlStats() {
    const total=flights.length, good=flights.filter(f=>f.cur<=f.tgt).length;
    const wait=flights.filter(f=>f.cur>f.tgt).length, night=flights.filter(f=>isNight(f.dep)).length;
    ['hs-total','fs-total'].forEach(id=>{ const el=document.getElementById(id); if(el) el.textContent=total; });
    ['hs-good','fs-good'].forEach(id=>{ const el=document.getElementById(id); if(el) el.textContent=good; });
    const hsr=document.getElementById('hs-routes'); if(hsr) hsr.textContent=savedRoutes.length;
    const fsw=document.getElementById('fs-wait'); if(fsw) fsw.textContent=wait;
    const fsn=document.getElementById('fs-night'); if(fsn) fsn.textContent=night;
    const sc=document.getElementById('sidebar-count'); if(sc) sc.textContent=total;
}

/* ═══════════════════════════════════
   FILTER / SELECT
═══════════════════════════════════ */
function setFilter(f, btn) {
    currentFilter = f;
    document.querySelectorAll('.fl-filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderGrid();
}

function toggleSelect(id) {
    // Ép kiểu String do MockAPI trả ID dạng String
    const strId = String(id);
    if (selectedIds.has(strId)) selectedIds.delete(strId); else selectedIds.add(strId);
    const btn = document.getElementById('btn-del-selected');
    const cnt = document.getElementById('sel-count');
    cnt.textContent = selectedIds.size;
btn.style.display = selectedIds.size > 0 ? 'inline-flex' : 'none';
    renderGrid();
}

/* ═══════════════════════════════════
   FLIGHT MODAL
═══════════════════════════════════ */
function openFlightModal(id) {
    editingId = id ? String(id) : null;
    document.getElementById('fm-title').textContent = id ? '✏️ Chỉnh sửa chặng bay' : '✈ Thêm chặng mới';
    if (id) {
        const f = flights.find(x=> String(x.id) === String(id));
        if (!f) return;
        document.getElementById('m-from').value = f.from;
        document.getElementById('m-to').value = f.to;
        document.getElementById('m-dep').value = f.dep;
        document.getElementById('m-arr').value = f.arr;
        document.getElementById('m-dur').value = f.dur;
        document.getElementById('m-flight-no').value = f.flightNo;
        document.getElementById('m-cur').value = f.cur;
        document.getElementById('m-tgt').value = f.tgt;
        document.getElementById('m-type').value = f.type;
        document.getElementById('m-class').value = f.seatClass;
        document.getElementById('m-note').value = f.note||'';
    } else {
        ['m-from','m-to','m-dur','m-flight-no','m-cur','m-tgt','m-note'].forEach(i=>document.getElementById(i).value='');
        document.getElementById('m-dep').value='06:00';
        document.getElementById('m-arr').value='08:00';
        document.getElementById('m-type').value='domestic';
        document.getElementById('m-class').value='economy';
    }
    document.getElementById('flight-modal').classList.remove('hidden');
}
function closeFlightModal() { document.getElementById('flight-modal').classList.add('hidden'); editingId=null; }

function calcDur(dep,arr) {
    try {
        const [dh,dm]=dep.split(':').map(Number);
        const [ah,am]=arr.split(':').map(Number);
        let mins=(ah*60+am)-(dh*60+dm);
        if(mins<0) mins+=1440;
        return `${Math.floor(mins/60)}h${mins%60?String(mins%60).padStart(2,'0')+'m':''}`;
    } catch { return ''; }
}

document.getElementById('flight-modal').addEventListener('click',function(e){if(e.target===this)closeFlightModal();});

/* ═══════════════════════════════════
   CONFIRM MODAL
═══════════════════════════════════ */

function toggleRoutePanel() {
    routePanelOpen=!routePanelOpen;
    document.getElementById('route-panel-wrap').style.display=routePanelOpen?'block':'none';
    document.getElementById('btn-toggle-route').innerHTML=routePanelOpen
        ?'<i class="fa-solid fa-xmark"></i> Đóng lộ trình'
        :'<i class="fa-solid fa-route"></i> Tạo lộ trình';
    if(routePanelOpen && routeStops.length===0){ addRouteStop(); addRouteStop(); }
    updateRouteSummary();
}

function renderRouteStops() {
    const list=document.getElementById('route-stops-list');
    if(!list) return;
    list.innerHTML=routeStops.map((s,i)=>`
        <div class="route-stop">
            <div class="stop-num">${i+1}</div>
            <input type="text" placeholder="Mã sân bay (HAN)" value="${s.airport}" oninput="updateStop(${i},'airport',this.value)" style="text-transform:uppercase;">
            <input type="text" placeholder="Tên điểm đến" value="${s.city}" oninput="updateStop(${i},'city',this.value)">
            <input type="date" value="${s.date}" oninput="updateStop(${i},'date',this.value)">
            <input type="time" value="${s.time}" oninput="updateStop(${i},'time',this.value)">
            <button class="stop-del" onclick="removeStop(${i})"><i class="fa-solid fa-xmark"></i></button>
        </div>`).join('');
    updateRouteSummary();
}
function updateStop(i,key,val) {
    routeStops[i][key]=val;
    const code=val.toUpperCase();
    if(key==='airport' && AIRPORTS[code]) routeStops[i].city=AIRPORTS[code];
    updateRouteSummary();
}
function addRouteStop() { routeStops.push({airport:'',city:'',date:'',time:''}); renderRouteStops(); }
function removeStop(i) {
    if(routeStops.length<=2){ showToast('Lộ trình cần ít nhất 2 điểm!','warning'); return; }
    routeStops.splice(i,1); renderRouteStops();
}
function clearRoute() {
    openConfirm('Xóa lộ trình','Xóa toàn bộ điểm dừng?',()=>{
        routeStops=[]; document.getElementById('route-name').value='';
        renderRouteStops(); showToast('Đã xóa lộ trình!','info');
    });
}
function updateRouteSummary() {
    const stops=routeStops.filter(s=>s.airport);
    const box=document.getElementById('route-summary-box');
    const path=document.getElementById('route-path');
    if(!box||!path) return;
    if(stops.length<2){ box.style.display='none'; return; }
    box.style.display='block';
    path.innerHTML=stops.map((s,i)=>`
        <div class="route-path-stop">
            <i class="fa-solid fa-location-dot" style="color:var(--primary)"></i>
            <strong>${s.airport.toUpperCase()}</strong>
            ${s.city?`<span style="font-weight:400;color:var(--txt-muted)">(${s.city})</span>`:''}
        </div>
        ${i<stops.length-1?'<div class="route-path-arrow"><i class="fa-solid fa-arrow-right"></i></div>':''}`
    ).join('');
}
function saveRoute() {
    const name=document.getElementById('route-name').value.trim();
    const type=document.getElementById('route-type').value;
    const stops=routeStops.filter(s=>s.airport);
    if(!name){ showToast('Vui lòng nhập tên hành trình!','error'); return; }
    if(stops.length<2){ showToast('Lộ trình cần ít nhất 2 điểm dừng!','error'); return; }
    savedRoutes.push({id:Date.now(),name,type,stops:[...routeStops]});
    renderSavedRoutes(); updateFlStats();
    showToast(`Đã lưu lộ trình "${name}"!`,'success');
    routeStops=[]; document.getElementById('route-name').value=''; renderRouteStops();
}
function renderSavedRoutes() {
    const wrap=document.getElementById('saved-routes-section');
    const list=document.getElementById('saved-routes-list');
    if(!wrap||!list) return;
    wrap.style.display=savedRoutes.length?'block':'none';
    list.innerHTML=savedRoutes.map(r=>{
        const path=r.stops.filter(s=>s.airport).map(s=>s.airport).join(' → ');
        return `<div class="saved-route-chip">
            <div class="sic"><i class="fa-solid fa-route"></i></div>
            <div class="si"><h5>${r.name}</h5><p>${r.type} · ${path}</p></div>
            <button class="sdel" onclick="deleteSavedRoute(${r.id})"><i class="fa-solid fa-xmark"></i></button>
        </div>`;
    }).join('');
}
function deleteSavedRoute(id) {
    savedRoutes=savedRoutes.filter(r=>r.id!==id);
    renderSavedRoutes(); updateFlStats();
    showToast('Đã xóa lộ trình!','info');
}

function updateSelectBtn() {
    const btn=document.getElementById('btn-del-selected');
    const cnt=document.getElementById('sel-count');
    if(btn){ btn.style.display=selectedIds.size>0?'inline-flex':'none'; }
    if(cnt) cnt.textContent=selectedIds.size;
}

/* ═══════════════════════════════════
   TOAST
═══════════════════════════════════ */

loadFlights();

