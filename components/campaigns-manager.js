/**
 * Campaigns Management Module
 * Usage: import { CampaignsManager } from './components/campaigns-manager.js'
 */

import { API } from './api.js';
import { Notification } from './notifications.js';

export const CampaignsManager = {
  campaigns: [],

  // Load campaigns from API
  async load() {
  try {
    // Rẽ nhánh logic tại đây
    if (API.isAdmin()) {
      this.campaigns = await API.getAdminCampaigns(); // Gọi hàm admin mới
    } else {
      this.campaigns = await API.getCampaigns(); // Gọi hàm user cũ
    }
    return this.campaigns;
  } catch (error) {
    Notification.error('Lỗi tải dữ liệu: ' + error.message);
    return [];
  }
},

  // Create new campaign
  async create(name, platform, goal, start_date, end_date) {
    try {
      const result = await API.createCampaign(name, platform, goal, start_date, end_date);
      if (result.success) {
        Notification.success('Chiến dịch được tạo thành công!');
        await this.load();
        return result;
      } else {
        Notification.error(result.error || 'Không thể tạo chiến dịch');
        return null;
      }
    } catch (error) {
      Notification.error('Lỗi: ' + error.message);
      return null;
    }
  },

  // Update campaign
  async update(id, name, platform, goal, start_date, end_date, status) {
    try {
      const result = await API.updateCampaign(id, name, platform, goal, start_date, end_date, status);
      if (result.success) {
        Notification.success(result.message || 'Cập nhật thành công');
        await this.load();
        return result;
      } else {
        Notification.error(result.error || 'Không thể cập nhật chiến dịch');
        return null;
      }
    } catch (error) {
      Notification.error('Lỗi: ' + error.message);
      return null;
    }
  },

  // Delete campaign
  async delete(id) {
    if (!confirm('Bạn chắc chắn muốn xóa chiến dịch này?')) {
      return false;
    }

    try {
      const result = await API.deleteCampaign(id);
      if (result.success) {
        Notification.success(result.message || 'Xóa thành công');
        await this.load();
        return true;
      } else {
        Notification.error(result.error || 'Không thể xóa chiến dịch');
        return false;
      }
    } catch (error) {
      Notification.error('Lỗi: ' + error.message);
      return false;
    }
  },

  // Get all campaigns
  getAll() {
    return this.campaigns;
  },

  // Get campaign by ID
  getById(id) {
    return this.campaigns.find(c => c.id === id);
  }
};

export default CampaignsManager;