/**
 * Notification System Component
 * Usage: import { Notification } from './components/notifications.js'
 */

export const Notification = {
  show(message, type = 'info', duration = 5000) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${this._getIcon(type)}</span>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: inherit; cursor: pointer; font-size: 1.2rem; padding: 0; margin-left: auto;">×</button>
      </div>
    `;

    // Add styles if not present
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
          border-left: 4px solid;
        }

        .notification-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .notification-icon {
          font-weight: 700;
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .notification-success {
          background: rgba(130, 255, 202, 0.15);
          border-color: #82ffca;
          color: #82ffca;
        }

        .notification-error {
          background: rgba(255, 107, 107, 0.15);
          border-color: #ff6b6b;
          color: #ff6b6b;
        }

        .notification-warning {
          background: rgba(255, 193, 7, 0.15);
          border-color: #ffc107;
          color: #ffc107;
        }

        .notification-info {
          background: rgba(61, 178, 255, 0.15);
          border-color: #3db2ff;
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

    document.body.appendChild(notification);

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        notification.style.animation = 'slideInRight 0.4s ease reverse';
        setTimeout(() => notification.remove(), 400);
      }, duration);
    }
  },

  success(message, duration = 5000) {
    this.show(message, 'success', duration);
  },

  error(message, duration = 5000) {
    this.show(message, 'error', duration);
  },

  warning(message, duration = 5000) {
    this.show(message, 'warning', duration);
  },

  info(message, duration = 5000) {
    this.show(message, 'info', duration);
  },

  _getIcon(type) {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    return icons[type] || 'ℹ';
  }
};

export default Notification;
