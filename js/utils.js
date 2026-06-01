/* Shared constants and helper functions. */

const AIRPORTS = {
    HAN:'Hà Nội',SGN:'TP.HCM',DAD:'Đà Nẵng',PQC:'Phú Quốc',CXR:'Nha Trang',
    VII:'Vinh',HPH:'Hải Phòng',VCA:'Cần Thơ',DLI:'Đà Lạt',UIH:'Quy Nhơn',
    BMV:'Buôn Ma Thuột',BKK:'Bangkok',ICN:'Seoul',NRT:'Tokyo',SIN:'Singapore',
};
const CLASS_LBL  = {economy:'Phổ thông',premium:'Phổ thông ĐB',business:'Thương gia'};
const TYPE_LBL   = {domestic:'Nội địa',international:'Quốc tế'};

function isNight(dep) { const h = parseInt(dep); return h >= 21 || h <= 5; }

function openConfirm(title,msg,cb) {
    document.getElementById('confirm-title').textContent=title;
    document.getElementById('confirm-msg').innerHTML=msg;
    document.getElementById('confirm-ok').onclick=()=>{ closeConfirm(); cb(); };
    document.getElementById('confirm-modal').classList.remove('hidden');
}
function closeConfirm() { document.getElementById('confirm-modal').classList.add('hidden'); }
document.getElementById('confirm-modal').addEventListener('click',function(e){if(e.target===this)closeConfirm();});

/* ═══════════════════════════════════
   ROUTE BUILDER
═══════════════════════════════════ */

function showToast(msg,type='info') {
    const wrap=document.getElementById('toast-wrap');
    const icons={success:'fa-circle-check',error:'fa-circle-xmark',info:'fa-circle-info',warning:'fa-triangle-exclamation'};
    const t=document.createElement('div');
    t.className=`toast ${type}`;
    t.innerHTML=`<i class="fa-solid ${icons[type]||icons.info}"></i> ${msg}`;
    wrap.appendChild(t);
    setTimeout(()=>{t.style.animation='toastOut .3s ease forwards';setTimeout(()=>t.remove(),300);},3000);
}


// Khởi chạy App
