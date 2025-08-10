const state = {};

// Ensure DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  showView('view-assets');
});

// Show only one view (assets, lock, or address)
function showView(id) {
  document.querySelectorAll('.flow-view').forEach(v => v.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// Smooth scroll to a section
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// 1) User picks an asset
window.selectAsset = asset => {
  state.asset = asset;
  document.getElementById('lock-title').textContent = `Lock ${asset} For…`;
  showView('view-lock');
  scrollToSection('flow');
};

// 2) User picks a predefined lock period
window.selectPeriod = period => {
  state.period = period;
  renderAddressView();
};

// 3) User enters a custom period
window.selectCustomPeriod = () => {
  const custom = document.getElementById('customPeriod').value.trim();
  if (!custom) return alert('Please enter a custom period');
  state.period = custom;
  renderAddressView();
};

// 4) Build and show the deposit address screen
function renderAddressView() {
  document.getElementById('finalAsset').textContent = state.asset;
  document.getElementById('finalPeriod').textContent = state.period;
  document.getElementById('depositAddress').textContent = generateAddress(state.asset);
  showView('view-address');
}

// Dummy address generator per coin
function generateAddress(asset) {
  const rnd = () => Math.random().toString(16).substr(2, 16);
  if (asset === 'Ethereum') return '0x' + rnd() + rnd();
  if (asset === 'Bitcoin')  return 'bc1' + rnd() + rnd();
  if (asset === 'Solana')   return rnd() + rnd() + rnd();
  return rnd() + rnd() + rnd() + rnd();
}

// Copy deposit address to clipboard
window.copyAddress = () => {
  const addr = document.getElementById('depositAddress').textContent;
  navigator.clipboard.writeText(addr)
    .then(() => alert('Address copied!'))
    .catch(() => alert('Copy failed'));
};
