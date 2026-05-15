/**
 * Clients Management Module
 * Usage: import { ClientsManager } from './components/clients-manager.js'
 */

import { API } from './api.js';
import { Notification } from './notifications.js';

export const ClientsManager = {
  clients: [],

  // Load clients from API
  async load() {
  try {
    if (API.isAdmin()) {
      this.clients = await API.getAdminClients();
    } else {
      this.clients = await API.getClients();
    }
    return this.clients;
  } catch (error) {
    Notification.error('Lỗi tải khách hàng: ' + error.message);
    return [];
  }
},

  // Create new client
  async create(business_name, contact_name, email, phone, service, notes) {
    try {
      const result = await API.createClient(business_name, contact_name, email, phone, service, notes);
      if (result.success) {
        Notification.success('Khách hàng được thêm thành công!');
        await this.load();
        return result;
      } else {
        Notification.error(result.error || 'Không thể thêm khách hàng');
        return null;
      }
    } catch (error) {
      Notification.error('Lỗi: ' + error.message);
      return null;
    }
  },

  // Update client
  async update(id, business_name, contact_name, email, phone, service, notes, status) {
    try {
      const result = await API.updateClient(id, business_name, contact_name, email, phone, service, notes, status);
      if (result.success) {
        Notification.success(result.message || 'Cập nhật thành công');
        await this.load();
        return result;
      } else {
        Notification.error(result.error || 'Không thể cập nhật khách hàng');
        return null;
      }
    } catch (error) {
      Notification.error('Lỗi: ' + error.message);
      return null;
    }
  },

  // Delete client
  async delete(id) {
    if (!confirm('Bạn chắc chắn muốn xóa khách hàng này?')) {
      return false;
    }

    try {
      const result = await API.deleteClient(id);
      if (result.success) {
        Notification.success(result.message || 'Xóa thành công');
        await this.load();
        return true;
      } else {
        Notification.error(result.error || 'Không thể xóa khách hàng');
        return false;
      }
    } catch (error) {
      Notification.error('Lỗi: ' + error.message);
      return false;
    }
  },

  // Search clients
  search(query) {
    if (!query) return this.clients;
    
    const q = query.toLowerCase();
    return this.clients.filter(c => 
      c.business_name.toLowerCase().includes(q) ||
      c.contact_name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  },

  // Get all clients
  getAll() {
    return this.clients;
  },

  // Get client by ID
  getById(id) {
    return this.clients.find(c => c.id === id);
  }
};

export default ClientsManager;