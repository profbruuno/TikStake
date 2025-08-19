/* Simple front-end only version (local mode).
   Images are static in index.html now. */

let currentUser = null;
const LOCAL_KEY = "locks_local";

const qs = (s,c=document)=>c.querySelector(s);
const qsa = (s,c=document)=>Array.from(c.querySelectorAll(s));

/* THEME */
(function(){
  const html=document.documentElement;
  const saved=localStorage.getItem("tikstake-theme");
  if(saved) html.setAttribute("data-theme",saved);
  qs(".theme-toggle")?.addEventListener("click",()=>{
    const next=(html.getAttribute("data-theme")==="dark")?"light":"dark";
    html.setAttribute("data-theme",next);
    localStorage.setItem("tikstake-theme",next);
  });
})();

/* ELEMENTS */
const authBtn=qs("#auth-btn");
const logoutBtn=qs("#logout-btn");
const authForm=qs("#auth-form");
const authError=qs("#auth-error");
const authModeToggle=qs("#auth-mode-toggle");
const authModalTitle=qs("#auth-modal-title");
const authSubmitBtn=qs("#auth-submit-btn");
const authToggleMsg=qs("#auth-toggle-msg");
let authMode="signin";

const lockForm=qs("#lock-form");
const lockError=qs("#lock-error");
const locksWrapper=qs("#locks-wrapper");
const locksEmpty=qs("#locks-empty");
const locksTbody=qs("#locks-tbody");
const receiptDetails=qs("#receipt-details");

/* UTIL */
function openModal(id){
  const m=qs("#"+id); if(!m) return;
  m.classList.add("open"); m.setAttribute("aria-hidden","false");
  document.body.style.overflow="hidden";
  m.querySelector('button,[href],input,select,textarea')?.focus({preventScroll:true});
}
function closeModal(m){
  if(!m) return;
  m.classList.remove("open"); m.setAttribute("aria-hidden","true");
  if(!qsa(".modal.open").length) document.body.style.overflow="";
}
function humanDuration(m){m=parseInt(m,10); if(m<12)return m+"m"; const y=m/12; return y===1?"1y":y+"y";}
function isoShort(s){return s?.split("T")[0]||"-";}

/* LOCAL STORAGE */
function loadLocalLocks(uid){
  const raw=localStorage.getItem(LOCAL_KEY);
  if(!raw) return [];
  try{return JSON.parse(raw).filter(l=>l.user_id===uid);}catch{return [];}  
}
function saveLocalLock(lock){
  let arr=[];
  try{arr=JSON.parse(localStorage.getItem(LOCAL_KEY)||"[]");}catch{}
  arr.push(lock);
  localStorage.setItem(LOCAL_KEY,JSON.stringify(arr));
}

/* AUTH */
authModeToggle?.addEventListener("click",()=>{
  authMode = authMode==="signin"?"register":"signin";
  const sign = authMode==="signin";
  authModalTitle.textContent= sign?"Sign In":"Register";
  authSubmitBtn.textContent= sign?"Sign In":"Create Account";
  authToggleMsg.textContent= sign?"Need an account?":"Already have an account?";
  authModeToggle.textContent= sign?"Register":"Sign In";
  authError.classList.add("hidden");
});
authForm?.addEventListener("submit",e=>{
  e.preventDefault();
  authError.classList.add("hidden");
  currentUser={local_id:"user-"+Math.random().toString(36).slice(2)};
  updateAuthUI();
  closeModal(qs("#auth-modal"));
});
logoutBtn?.addEventListener("click",()=>{
  currentUser=null;
  updateAuthUI();
});

/* UPDATE AUTH UI */
function updateAuthUI(){
  if(currentUser){
    authBtn.classList.add("hidden");
    logoutBtn.classList.remove("hidden");
  } else {
    authBtn.classList.remove("hidden");
    logoutBtn.classList.add("hidden");
  }
  refreshLocks();
}

/* LOCKS */
function refreshLocks(){
  if(!currentUser){renderLocks([]);return;}
  const list=loadLocalLocks(currentUser.local_id);
  renderLocks(list);
}
function renderLocks(list){
  locksTbody.innerHTML="";
  if(!list.length){
    locksWrapper.classList.add("hidden");
    locksEmpty.classList.remove("hidden");
    return;
  }
  locksEmpty.classList.add("hidden");
  locksWrapper.classList.remove("hidden");
  list.sort((a,b)=>new Date(a.end_at)-new Date(b.end_at));
  list.forEach(l=>{
    const tr=document.createElement("tr");
    tr.innerHTML=`
      <td>${l.asset}</td>
      <td>${humanDuration(l.duration_months)}</td>
      <td>${isoShort(l.start_at)}</td>
      <td>${isoShort(l.end_at)}</td>
      <td><span class="status-badge">${l.status||'locked'}</span></td>
    `;
    locksTbody.appendChild(tr);
  });
}

/* CREATE LOCK */
lockForm?.addEventListener("submit",e=>{
  e.preventDefault();
  lockError.classList.add("hidden");
  if(!currentUser){
    lockError.textContent="Sign in first.";
    lockError.classList.remove("hidden");
    return;
  }
  const asset=lockForm.asset.value;
  const dur=parseInt(lockForm.duration.value,10);
  if(!asset||!dur){
    lockError.textContent="Pick asset and duration.";
    lockError.classList.remove("hidden");
    return;
  }
  const now=new Date();
  const end=new Date(now); end.setMonth(end.getMonth()+dur);
  const rec={
    id:"loc-"+Date.now(),
    user_id:currentUser.local_id,
    asset,
    duration_months:dur,
    start_at:now.toISOString(),
    end_at:end.toISOString(),
    status:"locked"
  };
  try{
    saveLocalLock(rec);
    receiptDetails.innerHTML=[
      `Asset: ${asset}`,
      `Duration: ${humanDuration(dur)}`,
      `Start: ${now.toISOString()}`,
      `End: ${end.toISOString()}`,
      `Status: locked`
    ].map(x=>x.replace(/^(.*?):/, '<strong>$1:</strong>')).join("<br>");
    lockForm.reset();
    closeModal(qs("#lock-modal"));
    openModal("receipt-modal");
    refreshLocks();
  }catch(err){
    console.error(err);
    lockError.textContent="Could not save.";
    lockError.classList.remove("hidden");
  }
});

/* NAV & MODALS */
authBtn?.addEventListener("click",()=>openModal("auth-modal"));
qsa("[data-modal]").forEach(btn=>{
  btn.addEventListener("click",e=>{
    const id=btn.getAttribute("data-modal");
    if(id==="lock-modal" && !currentUser){
      openModal("auth-modal");
    } else {
      openModal(id);
    }
    e.preventDefault();
  });
});
qsa(".modal-close").forEach(c=>c.addEventListener("click",()=>closeModal(c.closest(".modal"))));
document.addEventListener("keydown",e=>{
  if(e.key==="Escape") qsa(".modal.open").forEach(m=>closeModal(m));
});
qsa(".modal").forEach(m=>{
  m.addEventListener("click",e=>{
    if(e.target===m) closeModal(m);
  });
});
const navToggle=qs(".nav-toggle");
const navLinks=qs(".nav-links");
avgToggle?.addEventListener("click",()=>{
  const open=navToggle.getAttribute("aria-expanded")==="true";
  navToggle.setAttribute("aria-expanded",String(!open));
  navLinks.classList.toggle("open");
});
document.addEventListener("click",e=>{
  if(navLinks && !navLinks.contains(e.target) && !navToggle.contains(e.target)){
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded","false");
  }
});
qsa("[data-scroll]").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const t=qs(btn.getAttribute("data-scroll"));
    t?.scrollIntoView({behavior:"smooth"});
  });
});

/* INIT */
currentUser={local_id:"guest-"+Math.random().toString(36).slice(2)};
updateAuthUI();
refreshLocks();
console.log("TikStake simple mode loaded.");