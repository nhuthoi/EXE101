/**
 * API Helper - Centralized API calls
 * Usage: import { API } from './components/api.js'
 */

const API_BASE = '/api';

export const API = {
  // Authentication
  async register(username, email, password, full_name, business_type) {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, full_name, business_type })
    });
    return response.json();
  },

  async login(username, password) {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return response.json();
  },

  // Profile
  async getProfile() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  async updateProfile(full_name, business_type) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ full_name, business_type })
    });
    return response.json();
  },

  // Services
  async getServices() {
    const response = await fetch(`${API_BASE}/services`);
    return response.json();
  },

  // Contact
  async submitContact(business_name, email, needs) {
    const response = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ business_name, email, needs })
    });
    return response.json();
  },

  // Campaigns
  async getCampaigns() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/campaigns`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  async createCampaign(name, platform, goal, start_date, end_date) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/campaigns`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, platform, goal, start_date, end_date })
    });
    return response.json();
  },

  async updateCampaign(id, name, platform, goal, start_date, end_date, status) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/campaigns/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, platform, goal, start_date, end_date, status })
    });
    return response.json();
  },

  async deleteCampaign(id) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/campaigns/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  // Clients
  async getClients() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/clients`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  async createClient(business_name, contact_name, email, phone, service, notes) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/clients`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ business_name, contact_name, email, phone, service, notes })
    });
    return response.json();
  },

  async updateClient(id, business_name, contact_name, email, phone, service, notes, status) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/clients/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ business_name, contact_name, email, phone, service, notes, status })
    });
    return response.json();
  },

  async deleteClient(id) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/clients/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  // Admin
  async getAdminContacts() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/admin/contacts`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  async getAdminAnalytics() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/admin/analytics`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  // Auth helpers
  setToken(token) {
    localStorage.setItem('token', token);
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
// admin control all campaigns and clients
 async getAdminCampaigns() {
  const token = this.getToken(); // Lấy token từ localStorage[cite: 1]
  const response = await fetch(`${API_BASE}/admin/campaigns`, {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
},

  // Admin: Lấy tất cả khách hàng của toàn bộ user
  async getAdminClients() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/admin/clients`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },
  
  // Hàm quan trọng: Kiểm tra xem người đang đăng nhập có phải Admin không
  isAdmin() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role === 'admin'; 
  },

  async getAdminUsers() {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_BASE}/admin/users`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  return response.json();
},

};


export default API;