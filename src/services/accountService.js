import axios from 'axios';

const BASE_URL = 'http://thanhvu1406-001-site1.qtempurl.com';

export const accountService = {
  // Lấy thông tin tài khoản
  getProfile: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/Account/GetUserInfo`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 401) {
        throw { success: false, message: 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại', code: 401 };
      }
      throw error.response?.data || { success: false, message: 'Không thể tải thông tin tài khoản' };
    }
  },

  // Cập nhật thông tin tài khoản
  updateProfile: async (userData) => {
    try {
      const response = await axios.put(`${BASE_URL}/api/Account/UpdateProfile`, userData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response?.status === 401) {
        throw { success: false, message: 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại', code: 401 };
      }
      throw error.response?.data || { success: false, message: 'Không thể cập nhật thông tin' };
    }
  },

  // Đổi mật khẩu
  changePassword: async (passwordData) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/Account/ChangePassword`, passwordData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      if (error.response?.status === 401) {
        throw { success: false, message: 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại', code: 401 };
      } else if (error.response?.status === 400) {
        throw { success: false, message: error.response.data.message || 'Mật khẩu hiện tại không đúng' };
      }
      throw error.response?.data || { success: false, message: 'Không thể đổi mật khẩu' };
    }
  },
  
  // Lấy lịch sử đơn hàng
  getOrderHistory: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/Account/OrderHistory`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching order history:', error);
      if (error.response?.status === 401) {
        throw { success: false, message: 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại', code: 401 };
      }
      throw error.response?.data || { success: false, message: 'Không thể tải lịch sử đơn hàng' };
    }
  },
  
  // Kiểm tra trạng thái đăng nhập
  checkLoginStatus: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    // Kiểm tra token có hết hạn chưa (có thể bổ sung logic kiểm tra JWT expiration)
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const expiration = tokenPayload.exp * 1000; // Convert to milliseconds
      
      return expiration > Date.now();
    } catch (error) {
      console.error('Error checking token validity:', error);
      return false;
    }
  }
}; 