// Animate cards on scroll-in using Intersection Observer
document.addEventListener("DOMContentLoaded", function () {
  // Animated Hero Background
  function setupHeroAnimation() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resizeCanvas() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3})`;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.1) this.size -= 0.02;
      }
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function handleParticles() {
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].size <= 0.1) {
          particles.splice(i, 1);
          i--;
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (particles.length < 100) {
        for (let i = 0; i < 3; i++) {
          particles.push(new Particle());
        }
      }
      handleParticles();
      requestAnimationFrame(animate);
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();
  }
  setupHeroAnimation();

  // Animate cards
  const cards = document.querySelectorAll('.card');
  const observer = new window.IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    },
    {
      threshold: 0.12,
    }
  );
  cards.forEach((card) => {
    observer.observe(card);
  });

  // Hamburger menu behaviour
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-links');
  menuToggle.addEventListener('click', function (e) {
    e.stopPropagation();
    navMenu.classList.toggle('open');
    menuToggle.classList.toggle('open');
  });

  // Close mobile menu when clicking outside or on a nav link
  document.addEventListener('click', function (e) {
    if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
      navMenu.classList.remove('open');
      menuToggle.classList.remove('open');
    }
  });
  document.querySelectorAll('.nav-links > li > a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 600) {
        navMenu.classList.remove('open');
        menuToggle.classList.remove('open');
      }
    });
  });

  // Dropdown open/close (click/tap for mobile, hover for desktop)
  document.querySelectorAll('.dropdown').forEach(drop => {
    const toggle = drop.querySelector('.dropdown-toggle');
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation(); // Prevent document click from closing it immediately
      // Close others
      document.querySelectorAll('.dropdown').forEach(d => {
        if (d !== drop) d.classList.remove('open');
      });
      drop.classList.toggle('open');
    });
  });
  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    document.querySelectorAll('.dropdown').forEach(drop => {
      if (!drop.contains(e.target)) {
        drop.classList.remove('open');
      }
    });
  });

  // Menu Bubble Animation
  const menuLinks = document.querySelectorAll('.fancy-menu li a:not(.dropdown-toggle)');
  const bubble = document.querySelector('.menu-bubble');
  const fancyMenu = document.querySelector('.fancy-menu');

  function positionBubble(target) {
    if (!target || !bubble) return;
    const linkCoords = target.getBoundingClientRect();
    const menuCoords = fancyMenu.getBoundingClientRect();
    bubble.style.width = `${linkCoords.width}px`;
    bubble.style.transform = `translateX(${linkCoords.left - menuCoords.left}px)`;
  }

  menuLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      if (this.closest('.dropdown-menu')) return;
      e.preventDefault();
      menuLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      positionBubble(this);
    });
  });

  // Set initial bubble position
  const initialActiveLink = document.querySelector('.fancy-menu a.active');
  if (initialActiveLink) {
    setTimeout(() => positionBubble(initialActiveLink), 50);
  }
  window.addEventListener('resize', () => positionBubble(document.querySelector('.fancy-menu a.active')));


  // ASSET CARD -> OPEN LOCK MODAL
  const assetCards = document.querySelectorAll('.asset-card');
  const lockModal = document.getElementById('lock-modal');
  const assetNameSpan = document.getElementById('asset-name');
  let selectedAsset = "";
  assetCards.forEach(card => {
    card.addEventListener('click', function() {
      selectedAsset = card.dataset.asset;
      assetNameSpan.textContent = card.querySelector('p').textContent;
      lockModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });

  // MODAL CLOSE
  document.querySelectorAll('.modal-close, .modal-back').forEach(btn => {
    btn.addEventListener('click', function() {
      btn.closest('.modal').style.display = 'none';
      document.body.style.overflow = '';
    });
  });
  window.addEventListener('keydown', function(e) {
    if (e.key === "Escape") {
      document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
      document.body.style.overflow = '';
    }
  });

  // Duration Buttons
  const durationContainer = document.querySelector('.duration-options');
  const durationButtons = durationContainer.querySelectorAll('.duration-btn');
  const hiddenDurationInput = document.getElementById('duration-hidden-input');

  durationContainer.addEventListener('click', (e) => {
    const clickedButton = e.target.closest('.duration-btn');
    if (!clickedButton) return;

    durationButtons.forEach(button => button.classList.remove('active'));
    clickedButton.classList.add('active');
    hiddenDurationInput.value = clickedButton.dataset.value;
  });

  // LOCK FORM SUBMIT
  const lockForm = document.getElementById('lock-form');
  lockForm.addEventListener('submit', function(e) {
    e.preventDefault();
    // Simulate receipt
    const fd = new FormData(lockForm);
    const durationValue = fd.get('duration');
    const selectedBtn = durationContainer.querySelector(`.duration-btn[data-value='${durationValue}']`);
    const durationLabelText = selectedBtn.textContent;
    const txhash = fd.get('txhash');
    const email = fd.get('email');
    const kin = fd.get('kin');
    const kinemail = fd.get('kinemail');
    const asset = assetNameSpan.textContent;

    // File name, not image upload
    const proofimg = lockForm.proofimg.files[0] ? lockForm.proofimg.files[0].name : "(image attached)";

    // Generate receipt
    document.getElementById('lock-modal').style.display = 'none';
    document.body.style.overflow = '';
    const receipt = `
      <strong>Asset:</strong> ${asset}<br>
      <strong>Duration:</strong> ${durationLabelText}<br>
      <strong>Transaction Hash:</strong> ${txhash}<br>
      <strong>Email:</strong> ${email}<br>
      <strong>Proof Image:</strong> ${proofimg}<br>
      <strong>Next of Kin:</strong> ${kin} (${kinemail})<br>
      <strong>Receipt ID:</strong> #TSK${Date.now().toString().slice(-6)}<br>
      <em>Thank you for trusting TikStake. Keep this receipt for your records.</em>
    `;
    document.getElementById('receipt-details').innerHTML = receipt;
    document.getElementById('receipt-modal').style.display = 'flex';
    lockForm.reset();
    // Reset buttons to default
    durationButtons.forEach(button => button.classList.remove('active'));
    durationContainer.querySelector('.duration-btn[data-value="12"]').classList.add('active');
    hiddenDurationInput.value = "12";
  });

  // White Paper Modal
  const whitepaperLink = document.getElementById('whitepaper-link');
  const whitepaperModal = document.getElementById('whitepaper-modal');
  if (whitepaperLink && whitepaperModal) {
    whitepaperLink.addEventListener('click', function(e) {
      e.preventDefault();
      whitepaperModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
    whitepaperModal.querySelector('.modal-close').addEventListener('click', function() {
      whitepaperModal.style.display = 'none';
      document.body.style.overflow = '';
    });
  }
});
