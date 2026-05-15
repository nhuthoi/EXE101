// Contact Form Handler
const form = document.querySelector('.contact-form');

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const business_name = form.querySelector('input[placeholder="Tên doanh nghiệp"]').value.trim();
    const email = form.querySelector('input[placeholder="Email liên hệ"]').value.trim();
    const needs = form.querySelector('textarea[placeholder*="nhu cầu"]').value.trim();

    // Validation
    if (!business_name || !email || !needs) {
      showNotification('Vui lòng điền đầy đủ thông tin', 'error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showNotification('Email không hợp lệ', 'error');
      return;
    }

    // Disable submit button
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Đang gửi...';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business_name, email, needs })
      });

      const data = await response.json();

      if (response.ok) {
        showNotification(data.message || 'Cảm ơn! Yêu cầu của bạn đã được ghi nhận.', 'success');
        form.reset();
      } else {
        showNotification(data.error || 'Lỗi gửi yêu cầu. Vui lòng thử lại.', 'error');
      }
    } catch (error) {
      showNotification('Lỗi kết nối. Vui lòng thử lại sau.', 'error');
      console.error('Contact form error:', error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

// Notification System
function showNotification(message, type = 'info') {
  // Remove existing notification
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
      <span>${message}</span>
    </div>
  `;

  document.body.appendChild(notification);

  // Add styles if not already present
  if (!document.querySelector('style[data-notifications]')) {
    const style = document.createElement('style');
    style.setAttribute('data-notifications', 'true');
    style.textContent = `
      .notification {
        position: fixed;
        top: 2rem;
        right: 2rem;
        max-width: 400px;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        animation: slideInRight 0.4s ease;
      }

      .notification-content {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .notification-icon {
        font-weight: 700;
        font-size: 1.2rem;
      }

      .notification-success {
        background: rgba(130, 255, 202, 0.15);
        border: 1px solid rgba(130, 255, 202, 0.3);
        color: #82ffca;
      }

      .notification-error {
        background: rgba(255, 107, 107, 0.15);
        border: 1px solid rgba(255, 107, 107, 0.3);
        color: #ff6b6b;
      }

      .notification-info {
        background: rgba(61, 178, 255, 0.15);
        border: 1px solid rgba(61, 178, 255, 0.3);
        color: #3db2ff;
      }

      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(40px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @media (max-width: 768px) {
        .notification {
          top: auto;
          bottom: 2rem;
          right: 1rem;
          left: 1rem;
          max-width: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideInRight 0.4s ease reverse';
    setTimeout(() => notification.remove(), 400);
  }, 5000);
}

// Page View Analytics
if (typeof fetch !== 'undefined') {
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ page: window.location.pathname })
  }).catch(() => {});
}

// Service Card Animations
document.addEventListener('DOMContentLoaded', () => {
  const serviceCards = document.querySelectorAll('.service-card');
  
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100);
      }
    });
  }, observerOptions);

  serviceCards.forEach((card) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });
});

// Form Input Enhancement
function enhanceForm() {
  const inputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea');
  
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.style.borderColor = 'var(--blue)';
    });

    input.addEventListener('blur', function() {
      this.parentElement.style.borderColor = 'var(--border)';
    });
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', enhanceForm);

// Accessibility: Focus visible styles
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-nav');
  }
});

document.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-nav');
});

// Performance: Lazy load images
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}