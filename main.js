/* =============================================
   FAITHOPS AI - MAIN JAVASCRIPT
   ============================================= */

// Email obfuscation - basic protection
function openEmail() {
  const parts = ['samuel', 'faithopsai', 'com'];
  window.location.href = 'mailto:' + parts[0] + '@' + parts[1] + '.' + parts[2];
}

// Update email display on page load
document.addEventListener('DOMContentLoaded', function() {
  const emailEl = document.getElementById('emailDisp');
  if (emailEl) {
    const parts = ['samuel', 'faithopsai', 'com'];
    emailEl.textContent = parts[0] + ' @ ' + parts[1] + '.' + parts[2];
  }
});

// ==================== VIDEO MANAGEMENT ====================
const videos = [
  document.getElementById('vid1'),
  document.getElementById('vid2')
];

let currentVideoIndex = 0;

function switchVideo() {
  if (!videos[0] || !videos[1]) return;
  
  const current = videos[currentVideoIndex];
  const next = videos[(currentVideoIndex + 1) % 2];
  
  // Fade out current, fade in next
  current.classList.remove('active');
  next.classList.add('active');
  
  // Start next video
  next.currentTime = 0;
  next.play().catch(err => {
    console.warn('Video playback failed:', err.message);
  });
  
  currentVideoIndex = (currentVideoIndex + 1) % 2;
}

// Initialize video system
if (videos[0] && videos[1]) {
  // Start first video
  videos[0].classList.add('active');
  videos[0].play().catch(err => {
    console.warn('Initial video playback failed:', err.message);
  });
  
  // Switch videos every 10 seconds
  setInterval(switchVideo, 10000);
  
  // Handle video errors gracefully
  videos.forEach((video, index) => {
    if (video) {
      video.addEventListener('error', function(e) {
        console.warn(`Video ${index + 1} error:`, e);
        // Don't alert user - videos are decorative background
      });
      
      video.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play().catch(err => {
          console.warn('Video replay failed:', err.message);
        });
      });
    }
  });
}

// ==================== STAT COUNTER ANIMATION ====================
function animateValue(id, start, end, duration, suffix = '') {
  const obj = document.getElementById(id);
  if (!obj) return;
  
  const range = end - start;
  let current = start;
  const increment = end > start ? 1 : -1;
  const stepTime = Math.abs(Math.floor(duration / range));
  
  const timer = setInterval(function() {
    current += increment;
    obj.textContent = current.toLocaleString() + suffix;
    if (current === end) {
      clearInterval(timer);
    }
  }, stepTime);
}

// Trigger counters when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateValue('s1', 0, 12, 1200);
      animateValue('s2', 0, 13, 1200, 'M+');
      animateValue('s3', 0, 1400, 1500);
      animateValue('s4', 0, 40, 1000, '/mo');
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
  statsObserver.observe(statsSection);
}

// ==================== CHART BAR ANIMATION ====================
const chartObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bars = entry.target.querySelectorAll('.bar');
      bars.forEach((bar, index) => {
        setTimeout(() => {
          const targetHeight = bar.getAttribute('data-h');
          if (targetHeight) {
            bar.style.height = targetHeight + '%';
          }
        }, index * 80);
      });
      chartObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const chartBars = document.getElementById('chartBars');
if (chartBars) {
  chartObserver.observe(chartBars);
}

// ==================== REVEAL ON SCROLL ====================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('vis');
      revealObserver.unobserve(entry.target);
    }
  });
}, { 
  threshold: 0.08,
  rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.reveal, .rl, .rr').forEach(el => {
  revealObserver.observe(el);
});

// ==================== CALCULATOR WITH VALIDATION ====================
function formatCurrency(value) {
  return '$' + Math.round(value).toLocaleString();
}

function validateInput(input) {
  const value = parseFloat(input.value);
  const min = parseFloat(input.min);
  const max = parseFloat(input.max);
  
  if (isNaN(value) || value < min || (max && value > max)) {
    input.setCustomValidity(`Please enter a valid number between ${min} and ${max || 'any value'}`);
    return false;
  }
  
  input.setCustomValidity('');
  return true;
}

function calc() {
  const sitesInput = document.getElementById('c-sites');
  const spendInput = document.getElementById('c-spend');
  
  // Validate inputs
  if (!validateInput(sitesInput) || !validateInput(spendInput)) {
    return;
  }
  
  const sites = parseInt(sitesInput.value) || 10;
  const spendPerSite = parseFloat(spendInput.value) || 800;
  const assetMultiplier = parseFloat(document.getElementById('c-type').value) || 0.32;
  const termYears = parseInt(document.getElementById('c-term').value) || 3;
  const govMultiplier = parseFloat(document.getElementById('c-gov').value) || 1.0;
  
  // Input bounds checking
  const safeSites = Math.max(1, Math.min(500, sites));
  const safeSpend = Math.max(100, Math.min(50000, spendPerSite));
  
  // Calculate leakage
  const monthlyLeakage = safeSites * safeSpend * assetMultiplier * govMultiplier;
  const annualSavings = monthlyLeakage * 12;
  const termSavings = annualSavings * termYears;
  const overageRecovery = monthlyLeakage * 0.45; // Estimated overage portion
  
  // Update display
  const resultMonthly = document.getElementById('r-mo');
  const resultYearly = document.getElementById('r-yr');
  const resultTerm = document.getElementById('r-tm');
  const resultOverage = document.getElementById('r-ov');
  
  if (resultMonthly) resultMonthly.textContent = formatCurrency(monthlyLeakage);
  if (resultYearly) resultYearly.textContent = formatCurrency(annualSavings);
  if (resultTerm) resultTerm.textContent = formatCurrency(termSavings);
  if (resultOverage) resultOverage.textContent = formatCurrency(overageRecovery);
}

// Form validation listeners
const calcForm = document.getElementById('calcForm');
if (calcForm) {
  const inputs = calcForm.querySelectorAll('input[type="number"]');
  inputs.forEach(input => {
    input.addEventListener('blur', function() {
      validateInput(this);
    });
  });
  
  // Run initial calculation
  calc();
}

// ==================== SMOOTH SCROLL ENHANCEMENT ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return; // Skip if it's just '#'
    
    e.preventDefault();
    const target = document.querySelector(href);
    
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      // Update focus for accessibility
      target.setAttribute('tabindex', '-1');
      target.focus();
    }
  });
});

// ==================== PERFORMANCE OPTIMIZATION ====================
// Lazy load images if IntersectionObserver is supported
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        imageObserver.unobserve(img);
      }
    });
  });
  
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ==================== ACCESSIBILITY ENHANCEMENTS ====================
// Add keyboard navigation support for custom buttons
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    if (e.target.tagName === 'BUTTON') {
      e.preventDefault();
      e.target.click();
    }
  }
});

// Announce dynamic content changes to screen readers
function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// ==================== ERROR HANDLING ====================
// Global error handler
window.addEventListener('error', function(e) {
  console.error('Global error:', e.message);
  // Don't expose errors to users - handle gracefully
});

// Log performance metrics (optional, for debugging)
if (window.performance && window.performance.timing) {
  window.addEventListener('load', function() {
    setTimeout(function() {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      console.log('Page load time:', pageLoadTime + 'ms');
    }, 0);
  });
}

console.log('FaithOps AI - Waste Spend Governance - Initialized');
