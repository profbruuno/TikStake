// --- Responsive Navigation ---
function gotoPage(page) {
  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
  const pageMap = {
    home: 'homePage',
    overview: 'overviewPage',
    about: 'aboutPage',
    contact: 'contactPage',
    whitepaper: 'whitepaperPage',
    userArea: 'userAreaPage'
  };
  if (pageMap[page]) {
    document.getElementById(pageMap[page]).style.display = 'block';
    if(page === 'userArea') showUserLogin();
  }
}
function toggleMenu() {
  var navLinks = document.querySelector('.nav-links');
  navLinks.classList.toggle('active');
}
document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelector('.nav-links').classList.remove('active');
    });
  });
  // User login feedback clear on typing
  if (document.getElementById('loginEmail')) {
    document.getElementById('loginEmail').addEventListener('input', () => {
      document.getElementById('userLoginMessage').textContent = '';
    });
  }
  if (document.getElementById('loginPassword')) {
    document.getElementById('loginPassword').addEventListener('input', () => {
      document.getElementById('userLoginMessage').textContent = '';
    });
  }
});
// --- Demo user and User Auth Logic ---
function ensureDemoUser() {
  let users = localStorage.getItem('tikstake_users');
  users = users ? JSON.parse(users) : [];
  if (!users.find(u => u.email === 'brunomujuni6@gmail.com')) {
    users.push({
      email: 'brunomujuni6@gmail.com',
      password: '123456',
      locks: [
        {
          crypto: "Ethereum",
          icon: "Ξ",
          amount: 1.5,
          duration: "2 years",
          start: "2024-01-01",
          end: "2026-01-01",
          gain: 220,
          loss: 0,
          withdrawal: "Locked",
          timesLocked: 1
        }
      ]
    });
    localStorage.setItem('tikstake_users', JSON.stringify(users));
  }
}
ensureDemoUser();
function getUsers() {
  let users = localStorage.getItem('tikstake_users');
  users = users ? JSON.parse(users) : [];
  if (!users.find(u => u.email === 'brunomujuni6@gmail.com')) {
    users.push({
      email: 'brunomujuni6@gmail.com',
      password: '123456',
      locks: [
        {
          crypto: "Ethereum",
          icon: "Ξ",
          amount: 1.5,
          duration: "2 years",
          start: "2024-01-01",
          end: "2026-01-01",
          gain: 220,
          loss: 0,
          withdrawal: "Locked",
          timesLocked: 1
        }
      ]
    });
    localStorage.setItem('tikstake_users', JSON.stringify(users));
  }
  return users;
}
function saveUsers(users) {
  localStorage.setItem('tikstake_users', JSON.stringify(users));
}
function getCurrentUser() {
  let user = localStorage.getItem('tikstake_current_user');
  return user ? JSON.parse(user) : null;
}
function setCurrentUser(user) {
  if (user) localStorage.setItem('tikstake_current_user', JSON.stringify(user));
  else localStorage.removeItem('tikstake_current_user');
}
function showUserLogin() {
  document.getElementById('userLoginForm').style.display = '';
  document.getElementById('userRegisterForm').style.display = 'none';
  document.getElementById('userLoginMessage').textContent = '';
  document.getElementById('showLoginTab').classList.add('btn-primary');
  document.getElementById('showRegisterTab').classList.remove('btn-primary');
}
function showUserRegister() {
  document.getElementById('userLoginForm').style.display = 'none';
  document.getElementById('userRegisterForm').style.display = '';
  document.getElementById('userLoginMessage').textContent = '';
  document.getElementById('showRegisterTab').classList.add('btn-primary');
  document.getElementById('showLoginTab').classList.remove('btn-primary');
}
function userRegister(event) {
  event.preventDefault();
  const email = document.getElementById('registerEmail').value.trim().toLowerCase();
  const password = document.getElementById('registerPassword').value;
  let users = getUsers();
  if (users.find(u => u.email === email)) {
    document.getElementById('userLoginMessage').style.color = '#dc2626';
    document.getElementById('userLoginMessage').textContent = 'Account already exists. Please log in.';
    showUserLogin();
    return;
  }
  let user = { email, password, locks: [] };
  users.push(user);
  saveUsers(users);
  setCurrentUser(user);
  document.getElementById('userLoginMessage').style.color = '#16a34a';
  document.getElementById('userLoginMessage').textContent = 'Account created and logged in!';
  showUserDashboard();
  document.getElementById('userAreaPage').style.display = 'block';
}
function userLogin(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;
  const msg = document.getElementById('userLoginMessage');
  msg.textContent = '';
  msg.style.color = "#6366f1";
  msg.textContent = "Logging in...";
  setTimeout(() => {
    let users = getUsers();
    let user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      msg.style.color = "#16a34a";
      msg.textContent = "Login successful!";
      showUserDashboard();
      document.getElementById('userAreaPage').style.display = 'block';
    } else {
      msg.style.color = "#dc2626";
      msg.textContent = "Invalid email or password.";
    }
  }, 400);
}
function showUserDashboard() {
  document.getElementById('userAccountCard').style.display = 'none';
  document.getElementById('userDashboard').style.display = '';
  let user = getCurrentUser();
  document.getElementById('dashboardUserEmail').textContent = user.email;
  renderUserLockCards(user.locks);
}
function userLogout() {
  setCurrentUser(null);
  document.getElementById('userAccountCard').style.display = '';
  document.getElementById('userDashboard').style.display = 'none';
  showUserLogin();
}
function renderUserLockCards(locks) {
  const cont = document.getElementById('userCardsContainer');
  cont.innerHTML = '';
  if (!locks || locks.length === 0) {
    cont.innerHTML = '<div class="overview-card intro-card">No crypto locks found for this account.</div>';
    return;
  }
  locks.forEach(lock => {
    const gainOrLoss = lock.gain > 0
      ? `<span class="user-lock-gain">+$${lock.gain.toFixed(2)} gain</span>`
      : lock.loss > 0
        ? `<span class="user-lock-loss">-$${lock.loss.toFixed(2)} loss</span>`
        : `<span>-</span>`;
    const statusColor = lock.withdrawal === "Unlocked"
      ? "style='color:#16a34a;'" : lock.withdrawal === "Pending"
      ? "style='color:#ca8a04;'" : "style='color:#6366f1;'";
    const status = `<span class="user-lock-status" ${statusColor}>${lock.withdrawal}</span>`;
    cont.innerHTML += `
      <div class="user-lock-card">
        <div class="user-lock-icon">${lock.icon}</div>
        <div class="user-lock-info">
          <div class="user-lock-title">${lock.crypto} (${lock.amount})</div>
          <div class="user-lock-meta">
            Locked for: <b>${lock.duration}</b><br>
            Start: ${lock.start} &nbsp; End: ${lock.end}<br>
            Times Locked: <b>${lock.timesLocked || 1}</b><br>
            ${gainOrLoss}<br>
            Withdrawal Status: ${status}
          </div>
        </div>
      </div>
    `;
  });
}
// --- Period/Deposit (asset lock) logic ---
let selectedAsset = null;
let selectedPeriod = null;
function openPeriod(asset) {
  selectedAsset = asset;
  selectedPeriod = null;
  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
  document.getElementById('periodPage').style.display = 'block';
  if (document.getElementById('selectedAssetTitle')) document.getElementById('selectedAssetTitle').textContent = asset;
  if (document.getElementById('depositArea')) document.getElementById('depositArea').style.display = 'none';
  if (document.getElementById('addressBox')) document.getElementById('addressBox').style.display = 'none';
  if (document.getElementById('otherHelp')) document.getElementById('otherHelp').style.display = 'none';
  if (document.getElementById('proofForm')) document.getElementById('proofForm').reset();
  if (document.getElementById('proofMsg')) document.getElementById('proofMsg').textContent = '';
  const assetHint = document.getElementById('selectedAssetHint');
  if (assetHint) assetHint.textContent = asset;
  const addrBtn = document.getElementById('showAddressBtn');
  const addrSpinner = document.getElementById('addressSpinner');
  const addrRevealed = document.getElementById('addressRevealed');
  if (addrBtn) addrBtn.style.display = '';
  if (addrSpinner) addrSpinner.style.display = 'none';
  if (addrRevealed) addrRevealed.style.display = 'none';
  toggleProofButton();
}
function closePeriod() { gotoPage('home'); }
function selectPeriod(period) {
  if (period === 'custom') {
    document.getElementById('customPeriod').style.display = '';
    document.getElementById('customPeriod').focus();
  } else {
    document.getElementById('customPeriod').style.display = 'none';
    selectedPeriod = period;
    showDepositArea();
  }
}
function selectCustomPeriod() {
  const val = document.getElementById('customPeriod').value.trim();
  if (val) {
    selectedPeriod = val;
    showDepositArea();
  }
}
function showDepositArea() {
  if (document.getElementById('depositArea')) document.getElementById('depositArea').style.display = 'block';
  if (selectedAsset === 'Other') {
    if (document.getElementById('addressBox')) document.getElementById('addressBox').style.display = 'none';
    if (document.getElementById('otherHelp')) document.getElementById('otherHelp').style.display = 'block';
  } else {
    if (document.getElementById('addressBox')) document.getElementById('addressBox').style.display = 'flex';
    if (document.getElementById('otherHelp')) document.getElementById('otherHelp').style.display = 'none';
    const addrBtn = document.getElementById('showAddressBtn');
    const addrSpinner = document.getElementById('addressSpinner');
    const addrRevealed = document.getElementById('addressRevealed');
    if (addrBtn) addrBtn.style.display = '';
    if (addrSpinner) addrSpinner.style.display = 'none';
    if (addrRevealed) addrRevealed.style.display = 'none';
  }
  if (document.getElementById('proofMsg')) document.getElementById('proofMsg').textContent = '';
  if (document.getElementById('proofForm')) document.getElementById('proofForm').reset();
  toggleProofButton();
}
function revealAddress() {
  const addrBtn = document.getElementById('showAddressBtn');
  const addrSpinner = document.getElementById('addressSpinner');
  const addrRevealed = document.getElementById('addressRevealed');
  if (addrBtn) addrBtn.style.display = 'none';
  if (addrSpinner) addrSpinner.style.display = '';
  if (addrRevealed) addrRevealed.style.display = 'none';
  setTimeout(() => {
    if (addrSpinner) addrSpinner.style.display = 'none';
    if (addrRevealed) {
      const address = generateAddress(selectedAsset);
      addrRevealed.querySelector('.address-text').textContent = address;
      addrRevealed.style.display = '';
    }
  }, 2000);
}
function copyAddress() {
  const addr = document.getElementById('addressRevealed').querySelector('.address-text').textContent;
  if (!addr) return;
  navigator.clipboard.writeText(addr);
  const btn = document.querySelector('.copy-btn-modern');
  if (btn) {
    btn.textContent = '✔';
    setTimeout(() => { btn.textContent = '📋'; }, 1400);
  }
}
function generateAddress(asset) {
  if (asset === 'Ethereum') return '0xe46cb5bf7e87eabe8909854a79971a61d0c27109';
  if (asset === 'Bitcoin') return 'bc1q7kpveyg6pj5dkls70k9l0ncs2frkk2c3dxc5yq';
  if (asset === 'Solana') return 'CNz5yg8aqTbZ4T86doU6uUctLNvwojQZ7V4FvaYvPjEy';
  return '';
}
function toggleProofButton() {
  const txHash = document.getElementById('txHash')?.value.trim();
  const fromAddress = document.getElementById('fromAddress')?.value.trim();
  const btn = document.getElementById('proofSubmitBtn');
  if (btn && txHash && fromAddress) {
    btn.disabled = false;
  } else if (btn) {
    btn.disabled = true;
  }
}
function submitProof(event) {
  event.preventDefault();
  const txHash = document.getElementById('txHash')?.value.trim();
  const fromAddress = document.getElementById('fromAddress')?.value.trim();
  const picInput = document.getElementById('paymentPic');
  const userEmail = document.getElementById('userEmail')?.value.trim();
  const nextOfKinEmail = document.getElementById('nextOfKinEmail')?.value.trim();
  if (!txHash || !fromAddress || !picInput?.files.length) {
    document.getElementById('proofMsg').textContent = 'Please fill in all required fields and attach a screenshot.';
    document.getElementById('proofMsg').style.color = '#dc2626';
    return;
  }
  document.getElementById('proofMsg').textContent = 'Thank you! Proof received. Our team will review and confirm your lock.';
  document.getElementById('proofMsg').style.color = '#16a34a';
  document.getElementById('proofForm').reset();
  toggleProofButton();
}
// On load, show dashboard if already logged in
window.onload = function() {
  let user = getCurrentUser();
  if (user) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById('userAreaPage').style.display = 'block';
    showUserDashboard();
  } else {
    gotoPage('home');
  }
};
