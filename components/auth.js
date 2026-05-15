/**
 * Authentication Helper Component
 * Usage: import { Auth } from './components/auth.js'
 */

export const Auth = {
  // Check if user is logged in
  isLoggedIn() {
    return !!localStorage.getItem('token');
  },

  // Get current user
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Get token
  getToken() {
    return localStorage.getItem('token');
  },

  // Save login data
  saveLogin(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Logout
  logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
},

  // Require login - redirect if not authenticated
  requireLogin() {
    if (!this.isLoggedIn()) {
      window.location.href = '/auth.html';
      return false;
    }
    return true;
  },

  // Require admin - redirect if not admin
  requireAdmin() {
    if (!this.isLoggedIn()) {
      window.location.href = '/auth.html';
      return false;
    }

    const user = this.getUser();
    if (user.is_admin) {
  window.location.href = '/admin.html';
} else {
  window.location.href = '/dashboard.html';
}

    return true;
  },

  // Get authorization header
  getAuthHeader() {
    return {
      'Authorization': `Bearer ${this.getToken()}`
    };
  }
};

export default Auth;
