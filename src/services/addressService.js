import axios from 'axios';

const BASE_URL = 'http://thanhvu1406-001-site1.qtempurl.com';

export const addressService = {
  // Lấy danh sách địa chỉ - sử dụng endpoint /api/diachi
  getAddresses: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/diachi`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('Address API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching addresses:', error);
      if (error.response?.status === 401) {
        throw { success: false, message: 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại', code: 401 };
      }
      
      // Nếu vẫn thất bại, trả về lỗi nhưng không làm gián đoạn luồng
      return { success: false, message: 'Không thể tải danh sách địa chỉ', data: [] };
    }
  },

  // Thêm địa chỉ mới - sử dụng endpoint /api/diachi với phương thức POST
  addAddress: async (addressData) => {
    try {
      console.log('Thêm địa chỉ mới với dữ liệu:', addressData);
      
      // Gửi POST request theo tài liệu API
      const response = await axios.post(
        `${BASE_URL}/api/diachi`,
        addressData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Thêm địa chỉ thành công:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding address:', error);
      if (error.response?.status === 401) {
        throw { success: false, message: 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại', code: 401 };
      }
      throw error.response?.data || { success: false, message: 'Không thể thêm địa chỉ' };
    }
  },

  // Cập nhật địa chỉ
  updateAddress: async (addressId, addressData) => {
    try {
      const params = new URLSearchParams();
      Object.entries(addressData).forEach(([key, value]) => {
        if (typeof value === 'boolean') {
          params.append(key, value ? 'true' : 'false');
        } else {
          params.append(key, value);
        }
      });
      
      const response = await axios.get(`${BASE_URL}/api/DiaChi/CapNhatDiaChi/${addressId}?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating address:', error);
      if (error.response?.status === 401) {
        throw { success: false, message: 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại', code: 401 };
      }
      throw error.response?.data || { success: false, message: 'Không thể cập nhật địa chỉ' };
    }
  },

  // Xóa địa chỉ - sử dụng endpoint /api/diachi/{id}
  deleteAddress: async (addressId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/api/diachi/${addressId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting address:', error);
      if (error.response?.status === 401) {
        throw { success: false, message: 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại', code: 401 };
      }
      throw error.response?.data || { success: false, message: 'Không thể xóa địa chỉ' };
    }
  },

  // Đặt địa chỉ mặc định - sử dụng endpoint /api/diachi/sua-dia-chi-mac-dinh/{id}
  setDefaultAddress: async (addressId) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/diachi/sua-dia-chi-mac-dinh/${addressId}`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error setting default address:', error);
      if (error.response?.status === 401) {
        throw { success: false, message: 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại', code: 401 };
      }
      throw error.response?.data || { success: false, message: 'Không thể đặt địa chỉ mặc định' };
    }
  }
}; 