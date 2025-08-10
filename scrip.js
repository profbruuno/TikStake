// Smooth scroll to sections
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

// State variables
let selectedAsset = null;
let selectedPeriod = null;

// Asset selection
function selectAsset(asset) {
  selectedAsset = asset;
  document.querySelectorAll('.asset-card').forEach(card => {
    card.classList.remove('selected');
    if (
      card.querySelector('img') &&
      card.querySelector('img').alt === asset
    ) {
      card.classList.add('selected');
    }
  });

  // Show the lock duration view and update title
  document.getElementById('lock-duration-container').style.display = 'block';
  document.getElementById('selectedAssetName').textContent = asset;

  // Hide deposit address view if previously shown
  document.getElementById('deposit-address-container').style.display = 'none';
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
  // Hide lock duration, show deposit address
  document.getElementById('lock-duration-container').style.display = 'none';
  document.getElementById('deposit-address-container').style.display = 'block';
  document.getElementById('finalAsset').textContent = selectedAsset;
  document.getElementById('finalPeriod').textContent = selectedPeriod;

  // Address generation placeholder logic
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
  return 'To be provided after KYC';
}
