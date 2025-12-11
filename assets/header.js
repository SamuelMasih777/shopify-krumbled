document.addEventListener('DOMContentLoaded', () => {
  /* --- 1. SETUP --- */
  const pills = document.querySelectorAll('.brand-pills .pill');
  const promoBar = document.getElementById('promoBar');
  const headerWrapper = document.querySelector('.site-header');
  const overlay = document.createElement('div'); // Optional: dark overlay if needed later

  /* --- 2. BRAND PILL LOGIC (Persistent Colors) --- */
  if (pills.length > 0) {
    console.log('🎯 Brand Pills Found:', pills.length);
    
    pills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        console.log('🔘 Pill Clicked!');
        console.log('  - Tag:', pill.tagName);
        console.log('  - Index:', pill.dataset.index);
        console.log('  - Href:', pill.getAttribute('href'));
        
        const index = pill.dataset.index;
        const bg = pill.dataset.colorBg || '#eb4586';
        const text = pill.dataset.colorText || '#ffffff';
        let href = pill.getAttribute('href');
        
        // Check if this pill has a URL (is an <a> tag with href that's not just homepage or default root)
        const defaultRootUrl = '{{ routes.root_url }}';
        const hasUrl = pill.tagName === 'A' && 
                      href && 
                      href !== '#' && 
                      href !== '/' && 
                      href !== defaultRootUrl && 
                      href.trim() !== '';
        
        console.log('  - Has URL?', hasUrl);
        console.log('  - Href value:', href);
        
        // If it has a URL, allow navigation - don't prevent default
        if (hasUrl) {
          console.log('✅ Allowing navigation to:', href);
          // Update colors before navigation
          if (promoBar) {
            promoBar.style.backgroundColor = bg;
            promoBar.style.color = text;
          }
          // Don't prevent default - let the link work
          return true;
        }
        
        console.log('🔄 Tab switching mode - preventing navigation');
        // Otherwise, prevent default and do tab switching
        e.preventDefault();

        // Update Active Class and Order (Visuals)
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        
        // Active Color (Safety, though inline style persists)
        pill.style.backgroundColor = bg;
        pill.style.color = text;

        // Update Promo Bar
        if (promoBar) {
           promoBar.style.backgroundColor = bg;
           promoBar.style.color = text;
        }

        // Swap Content (Menus & Logos)
        document.querySelectorAll('.brand-menu-list').forEach(menu => {
          menu.style.display = (menu.dataset.index === index) ? 'flex' : 'none';
        });

        document.querySelectorAll('.brand-logo-item').forEach(logo => {
            logo.style.display = (logo.dataset.index === index) ? 'block' : 'none';
        });

        // Close any open Mega Menus when switching brands
        closeAllMegaMenus();
      });
    });
  }

  /* --- 3. MEGA MENU LOGIC --- */
  // Event Delegation for dynamic menu triggers
  if (headerWrapper) {
      headerWrapper.addEventListener('click', (e) => {
          const trigger = e.target.closest('[data-mega-trigger="true"]');
          
          if (trigger) {
              e.preventDefault(); // Prevent navigation if it's a link
              const brandIndex = trigger.dataset.brandIndex;
              toggleMegaMenu(brandIndex);
          }
      });
  }

  function toggleMegaMenu(index) {
      const allMenus = document.querySelectorAll('.mega-menu-wrapper');
      const targetMenu = document.querySelector(`.mega-menu-wrapper[data-brand-index="${index}"]`);
      
      // If target is already open, close it. Otherwise open it and close others.
      const isOpen = targetMenu && targetMenu.classList.contains('open');

      closeAllMegaMenus();

      if (!isOpen && targetMenu) {
          targetMenu.classList.add('open');
      }
  }

  function closeAllMegaMenus() {
      document.querySelectorAll('.mega-menu-wrapper').forEach(menu => {
          menu.classList.remove('open');
      });
  }

  // Close on Click Outside
  document.addEventListener('click', (e) => {
      if (!e.target.closest('.site-header')) {
          closeAllMegaMenus();
      }
  });


  /* --- 4. CAROUSEL --- */
  const promoTexts = document.querySelectorAll('.promo-text-item');
  let currentPromoIndex = 0;
  if (promoTexts.length > 1) {
    promoTexts[0].classList.add('active');
    setInterval(() => {
      promoTexts[currentPromoIndex].classList.remove('active');
      currentPromoIndex = (currentPromoIndex + 1) % promoTexts.length;
      promoTexts[currentPromoIndex].classList.add('active');
    }, 4000);
  } else if (promoTexts.length === 1) {
      promoTexts[0].classList.add('active');
  }

  /* --- 5. MOBILE MENU --- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu'); // Ensure this element exists in liquid if using it
  
  if (hamburger) {
      hamburger.addEventListener('click', () => {
         // Basic toggle logic - refine if you have a specific mobile drawer structure
         alert('Mobile menu toggle'); 
      });
  }
});
