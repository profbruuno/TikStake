const state = {};

// ensure views exist before init
document.addEventListener('DOMContentLoaded', () => {
  showView('view-assets');
});

// show one flow-view
function showView(id) {
  document.querySelectorAll('.flow-view')
    .forEach(v => v.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// smooth scroll
function scrollTo(sectionId) {
  document.getElementById(sectionId)
    .scrollIntoView({ behavior: 'smooth' });
}

// 1) select asset
window.selectAsset = asset => {
  state.asset = asset;
  document.getElementById('lock-title').textContent = `Lock ${asset} For…`;
  showView('view-lock');
  scrollTo('flow');
};

// 2) select a predefined period
window.selectPeriod = period => {
  state.period = period;
  renderAddress();
};

// 3) select a custom period
window.selectCustomPeriod = () => {
  const custom = document.getElementById('customPeriod').value.trim();
  if (!custom) return alert('Please enter a custom period');
  state.period = custom;
  renderAddress();
};

// render deposit address view
function renderAddress() {
  document.getElementById('finalAsset').textContent = state.asset;
  document.getElementById('finalPeriod').textContent = state.period;
  document.getElementById('depositAddress').textContent = generateAddress(state.asset);
  showView('view-address');
}

// dummy address generator
function generateAddress(asset) {
  const rnd = () => Math.random().toString(16).substr(2, 16);
  if (asset === 'Ethereum') return '0x' + rnd() + rnd();
  if (asset === 'Bitcoin')  return 'bc1' + rnd() + rnd();
  if (asset === 'Solana')   return rnd() + rnd() + rnd();
  return rnd() + rnd() + rnd() + rnd();
}

// copy to clipboard
window.copyAddress = () => {
  const addr = document.getElementById('depositAddress').textContent;
  navigator.clipboard.writeText(addr)
    .then(() => alert('Address copied!'))
    .catch(() => alert('Copy failed'));
};
```[43dcd9a7-70db-4a1f-b0ae-981daa162054](https://github.com/Joey-Ren/myBlog/tree/5b527b28c51d44db56e899ef89c12b987f4e5d96/src%2Fcomponents%2FJavaScript-library%2FjQuery%2FjQuery-base.md?citationMarker=43dcd9a7-70db-4a1f-b0ae-981daa162054 "1")[43dcd9a7-70db-4a1f-b0ae-981daa162054](https://github.com/RafaelAugustScherer/trybe-exercises/tree/4b611f8a77de6d7f04f843c9b147a400993c61e5/01-web_development_fundamentals%2Fblock06-forms_&_flexbox%2Fday05-exercises%2Fexercises%2Fexercise02%2FREADME.md?citationMarker=43dcd9a7-70db-4a1f-b0ae-981daa162054 "2")[43dcd9a7-70db-4a1f-b0ae-981daa162054](https://github.com/szerintedmi/roadmap-radar-chart/tree/45ee5f9f7a1d44100313358e369abb025b935cea/README.md?citationMarker=43dcd9a7-70db-4a1f-b0ae-981daa162054 "3")
