(function () {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileCanvas = document.getElementById('mobileCanvas');
  const closeCanvas = document.getElementById('closeCanvas');
  const overlay = document.getElementById('overlay');
  const mobileShopToggle = document.getElementById('mobileShopToggle');
  const mobileShopPanel = document.getElementById('mobileShopPanel');
  const mobileShopIcon = document.getElementById('mobileShopIcon');

  // Open drawer
  mobileMenuBtn.addEventListener('click', () => {
    mobileCanvas.style.right = '0';
    overlay.classList.remove('pointer-events-none');
    overlay.classList.add('opacity-50');
    collapseShopPanel();
  });

  // Close drawer
  function closeDrawer() {
    mobileCanvas.style.right = '-100%';
    overlay.classList.add('pointer-events-none');
    overlay.classList.remove('opacity-50');
  }
  closeCanvas.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  // Shop accordion
  mobileShopToggle.addEventListener('click', () => {
    const isOpen = mobileShopPanel.style.maxHeight && mobileShopPanel.style.maxHeight !== '0px';
    isOpen ? collapseShopPanel() : expandShopPanel();
  });
  function expandShopPanel() {
    mobileShopPanel.style.maxHeight = mobileShopPanel.scrollHeight + 'px';
    mobileShopIcon.classList.add('-rotate-180');
  }
  function collapseShopPanel() {
    mobileShopPanel.style.maxHeight = '0';
    mobileShopIcon.classList.remove('-rotate-180');
  }

  // Reset layout on resize (fix stuck view)
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) closeDrawer();
  });

  // Close with Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });
})();