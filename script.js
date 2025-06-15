document.addEventListener('DOMContentLoaded', () => {
  //  Topbar component for every file...
  fetch('topbar.html')
    .then(response => response.text())
    .then(data => {
      document.body.insertAdjacentHTML('afterbegin', data);
      initializeTopbar(); 
    })
    .catch(error => console.error('Error loading topbar:', error));

  // Loading Screen 
  const loadingScreen = document.getElementById('loading-screen');
  const terminalText = document.querySelector('.terminal-text');
  const percentageText = document.querySelector('.percentage-text');

  const terminalMessages = [
    'Initializing system...',
    'Loading assets...',
    'Connecting to server...',
    'Finalizing setup...',
  ];
  let messageIndex = 0;

  function updateTerminal() {
    if (messageIndex < terminalMessages.length) {
      terminalText.textContent += terminalMessages[messageIndex] + '\n';
      messageIndex++;
      setTimeout(updateTerminal, 600);
    }
  }
  updateTerminal();

  let percentage = 0;
  const duration = 3000;
  const startTime = performance.now();

  function updatePercentage(timestamp) {
    const elapsed = timestamp - startTime;
    percentage = Math.min((elapsed / duration) * 100, 100);
    percentageText.textContent = `${Math.floor(percentage)}%`;

    if (percentage < 100) {
      requestAnimationFrame(updatePercentage);
    } else {
      loadingScreen.classList.add('hidden');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
        const topbar = document.querySelector('.topbar');
        if (topbar) topbar.classList.remove('hidden');
      }, 500);
    }
  }
  requestAnimationFrame(updatePercentage);

  // initialize overlay logic...
  function initializeTopbar() {
    const menuBtn = document.getElementById('menu-btn');
    const contactBtn = document.getElementById('contact-btn');
    const menuOverlay = document.getElementById('menu-overlay');
    const contactOverlay = document.getElementById('contact-overlay');

    if (menuBtn && contactBtn && menuOverlay && contactOverlay) {
      menuBtn.addEventListener('click', () => {
        if (menuOverlay.classList.contains('active')) {
          menuOverlay.classList.remove('active');
          menuBtn.textContent = 'Menu';
        } else {
          menuOverlay.classList.add('active');
          contactOverlay.classList.remove('active');
          menuBtn.textContent = 'Close';
          contactBtn.textContent = 'Contact';
        }
      });

      contactBtn.addEventListener('click', () => {
        if (contactOverlay.classList.contains('active')) {
          contactOverlay.classList.remove('active');
          contactBtn.textContent = 'Contact';
        } else {
          contactOverlay.classList.add('active');
          menuOverlay.classList.remove('active');
          contactBtn.textContent = 'Close';
          menuBtn.textContent = 'Menu';
        }
      });
    }
  }

  // Pixel line trail 
  let lastX = 0;
  let lastY = 0;
  let lastTrailTime = 0;

  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastTrailTime < 10) return;
    lastTrailTime = now;

    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.max(1, Math.floor(distance * 2));

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = Math.round(lastX + dx * t) - 2;
      const y = Math.round(lastY + dy * t) - 2;

      const pixel = document.createElement('div');
      pixel.className = 'pixel-line';
      pixel.style.left = `${x}px`;
      pixel.style.top = `${y}px`;
      document.body.appendChild(pixel);

      setTimeout(() => {
        pixel.remove();
      }, 500);
    }

    lastX = e.clientX;
    lastY = e.clientY;
  });
});