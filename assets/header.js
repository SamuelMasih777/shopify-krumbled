document.addEventListener('DOMContentLoaded', () => {
  /* --- 1. SETUP --- */
  const pills = document.querySelectorAll('.brand-pills .pill');
  const promoBar = document.getElementById('promoBar');
  const headerWrapper = document.querySelector('.site-header');
  const overlay = document.createElement('div'); // Optional: dark overlay if needed later

  /* --- 1.5. DETECT CURRENT PAGE AND SET ACTIVE TAB --- */
  function setActiveTabFromCurrentPage() {
    const currentPath = window.location.pathname;
    const currentFullPath = window.location.pathname + window.location.search;
    const rootUrl = window.location.origin;
    
    let activeIndex = -1;
    
    pills.forEach((pill, idx) => {
      const brandUrl = pill.dataset.brandUrl || pill.getAttribute('href');
      const index = pill.dataset.index;
      const bg = pill.dataset.colorBg || '#eb4586';
      const text = pill.dataset.colorText || '#ffffff';
      const announcementColor = pill.dataset.announcementColor || '#ffffff';
      const announcementFont = pill.dataset.announcementFont || 'inherit';
      
      // Check if current page matches this brand's URL
      let isActive = false;
      
      if (brandUrl) {
        // Normalize URLs
        let normalizedBrandUrl = brandUrl;
        if (normalizedBrandUrl.startsWith('http')) {
          try {
            const urlObj = new URL(normalizedBrandUrl);
            normalizedBrandUrl = urlObj.pathname;
          } catch(e) {
            // If URL parsing fails, use as is
          }
        }
        
        // Remove trailing slashes for comparison
        normalizedBrandUrl = normalizedBrandUrl.replace(/\/$/, '');
        const normalizedCurrentPath = currentPath.replace(/\/$/, '');
        
        // Check if current path matches brand URL
        // Handle root URL properly
        const isRootUrl = normalizedBrandUrl === '/' || normalizedBrandUrl === '' || 
                         normalizedBrandUrl === rootUrl || normalizedBrandUrl === rootUrl + '/';
        
        if (isRootUrl) {
          // Homepage check - only match if we're on the homepage
          if (normalizedCurrentPath === '/' || normalizedCurrentPath === '') {
            isActive = true;
          }
        } else {
          // Check if current path starts with brand URL or vice versa
          if (normalizedCurrentPath.startsWith(normalizedBrandUrl) || 
              normalizedBrandUrl.startsWith(normalizedCurrentPath)) {
            isActive = true;
          }
        }
      }
      
      if (isActive && activeIndex === -1) {
        activeIndex = parseInt(index);
        
        // Set this pill as active
        pills.forEach(p => {
          p.classList.remove('active');
          // Inactive pills keep their full brand colors - no opacity change
        });
        
        pill.classList.add('active');
        // Active pill gets its brand colors (already set in inline styles)
        pill.style.backgroundColor = bg;
        pill.style.color = text;
        
        // Update promo bar (only this changes color)
        if (promoBar) {
          promoBar.style.backgroundColor = bg;
          promoBar.style.color = announcementColor;
          promoBar.style.fontFamily = announcementFont;
        }
        
        // Show corresponding menu and logo
        document.querySelectorAll('.brand-menu-list').forEach(menu => {
          menu.style.display = (menu.dataset.index === index) ? 'flex' : 'none';
        });
        
        document.querySelectorAll('.brand-logo-item').forEach(logo => {
          logo.style.display = (logo.dataset.index === index) ? 'block' : 'none';
        });
      }
    });
    
    // If no active tab found, check for default active
    if (activeIndex === -1) {
      pills.forEach(pill => {
        if (pill.classList.contains('default-active')) {
          const index = pill.dataset.index;
          const bg = pill.dataset.colorBg || '#eb4586';
          const text = pill.dataset.colorText || '#ffffff';
          const announcementColor = pill.dataset.announcementColor || '#ffffff';
          const announcementFont = pill.dataset.announcementFont || 'inherit';
          
          // Remove active from all, keep their brand colors
          pills.forEach(p => {
            p.classList.remove('active');
            // Inactive pills keep their full brand colors - no opacity change
          });
          pill.classList.add('active');
          pill.style.backgroundColor = bg;
          pill.style.color = text;
          
          if (promoBar) {
            promoBar.style.backgroundColor = bg;
            promoBar.style.color = announcementColor;
            promoBar.style.fontFamily = announcementFont;
          }
          
          document.querySelectorAll('.brand-menu-list').forEach(menu => {
            menu.style.display = (menu.dataset.index === index) ? 'flex' : 'none';
          });
          
          document.querySelectorAll('.brand-logo-item').forEach(logo => {
            logo.style.display = (logo.dataset.index === index) ? 'block' : 'none';
          });
        }
      });
    }
    
    // Ensure inactive pills keep their original colors (from inline styles)
    // Remove any opacity that might have been set - pills should have full color
    pills.forEach(p => {
      // Remove any opacity - all pills should have full color
      p.style.opacity = '';
    });
  }
  
  // Set active tab on page load
  setActiveTabFromCurrentPage();

  /* --- 2. BRAND PILL LOGIC (Persistent Colors) --- */
  if (pills.length > 0) {
    pills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        const index = pill.dataset.index;
        const bg = pill.dataset.colorBg || '#eb4586';
        const text = pill.dataset.colorText || '#ffffff';
        const announcementColor = pill.dataset.announcementColor || '#ffffff';
        const announcementFont = pill.dataset.announcementFont || 'inherit';
        let href = pill.getAttribute('href');
        
        // Always allow navigation - don't prevent default for any URL
        // The page will reload and setActiveTabFromCurrentPage will handle the active state
        if (href && href !== '#') {
          // Update colors before navigation (will be set on new page load)
          if (promoBar) {
            promoBar.style.backgroundColor = bg;
            promoBar.style.color = announcementColor;
            promoBar.style.fontFamily = announcementFont;
          }
          // Don't prevent default - let the link work
          return true;
        }
        
        // Otherwise, prevent default and do tab switching
        e.preventDefault();

        // Update Active Class and Order (Visuals)
        pills.forEach(p => {
          p.classList.remove('active');
          // Inactive pills keep their full brand colors - no opacity change
        });
        pill.classList.add('active');
        
        // Active pill gets its brand colors (already set in inline styles)
        pill.style.backgroundColor = bg;
        pill.style.color = text;

        // Update Promo Bar
        if (promoBar) {
           promoBar.style.backgroundColor = bg;
           promoBar.style.color = announcementColor;
           promoBar.style.fontFamily = announcementFont;
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


  /* --- 4. ANNOUNCEMENT CAROUSEL --- */
  const promoTexts = document.querySelectorAll('.promo-text-item');
  const promoBarEl = document.getElementById('promoBar');
  // Get carousel settings from data attributes or use defaults
  const carouselSpeed = promoBarEl ? parseInt(promoBarEl.dataset.carouselSpeed) || 4000 : 4000;
  const carouselAutoplay = promoBarEl ? promoBarEl.dataset.carouselAutoplay !== 'false' : true;
  let currentPromoIndex = 0;
  let carouselInterval = null;
  
  function showPromoText(index) {
    // Basic cycling, but we need to know previous to animate out
    // The previous index is implicitly the one that is currently active
    const currentActive = promoBarEl ? promoBarEl.querySelector('.promo-text-item.active') : null;
    const nextItem = promoTexts[index];
    
    if (!nextItem) return;

    // Determine direction (default/initial load doesn't slide)
    const isInitial = !currentActive;

    if (currentActive && currentActive !== nextItem) {
      // Setup Exit Animation
      currentActive.classList.remove('active');
      currentActive.classList.add('slide-out-left');
      
      // Cleanup after animation matches CSS duration
      setTimeout(() => {
        currentActive.classList.remove('slide-out-left');
      }, 600);
    }
    
    // Setup Enter Animation
    nextItem.classList.remove('slide-out-left'); // Safety
    nextItem.classList.add('active');
    
    if (!isInitial) {
       nextItem.classList.add('slide-in-right');
       setTimeout(() => {
          nextItem.classList.remove('slide-in-right');
       }, 600);
    }
  }
  
  function nextPromoText() {
    if (promoTexts.length <= 1) return;
    currentPromoIndex = (currentPromoIndex + 1) % promoTexts.length;
    showPromoText(currentPromoIndex);
  }
  
  // Initialize carousel
  if (promoTexts.length > 0) {
    // Show first item
    showPromoText(0);
    
    // Start auto carousel if enabled and multiple items
    if (carouselAutoplay && promoTexts.length > 1) {
      carouselInterval = setInterval(nextPromoText, carouselSpeed);
      
      // Pause on hover (optional enhancement)
      if (promoBarEl) {
        promoBarEl.addEventListener('mouseenter', () => {
          if (carouselInterval) {
            clearInterval(carouselInterval);
            carouselInterval = null;
          }
        });
        
        promoBarEl.addEventListener('mouseleave', () => {
          if (carouselAutoplay && promoTexts.length > 1 && !carouselInterval) {
            carouselInterval = setInterval(nextPromoText, carouselSpeed);
          }
        });
      }
    }
  }

  /* --- 5. CART COUNT --- */
  function updateCartCount() {
    fetch('/cart.js')
      .then(response => response.json())
      .then(cart => {
        const badge = document.getElementById('cartCountBadge');
        if (badge) {
          const itemCount = cart.item_count || 0;
          if (itemCount > 0) {
            badge.textContent = itemCount;
            badge.style.display = 'flex';
          } else {
            badge.textContent = '';
            badge.style.display = 'none';
          }
        }
      })
      .catch(error => {
        console.log('Cart count error:', error);
      });
  }
  
  // Update cart count on load
  updateCartCount();
  
  // Listen for cart updates (Shopify cart events)
  document.addEventListener('cart:updated', updateCartCount);
  
  // Also check periodically (fallback)
  setInterval(updateCartCount, 2000);

  /* --- 6. MOBILE MENU --- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu'); // Ensure this element exists in liquid if using it
  
  if (hamburger) {
      hamburger.addEventListener('click', () => {
         // Basic toggle logic - refine if you have a specific mobile drawer structure
         alert('Mobile menu toggle'); 
      });
  }
});
