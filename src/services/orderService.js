import axios from 'axios';

const BASE_URL = 'http://thanhvu1406-001-site1.qtempurl.com';

export const orderService = {
  // Đặt hàng từ giỏ hàng
  placeOrder: async (addressId) => {
    try {
      console.log('Placing order with addressId:', addressId);
      
      // Theo tài liệu API, cần gửi một request không có body, chỉ cần token trong header và addressId trong query params
      const response = await axios.get(
        `${BASE_URL}/api/DonHang/DatHang?addressId=${addressId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      console.log('Order API response:', response.data);
      
      // Response có định dạng { success: true, message: "Đặt hàng thành công!", DonHangId: "DH123456" }
      return {
        success: response.data.success,
        message: response.data.message,
        donHangId: response.data.DonHangId
      };
    } catch (error) {
      console.error('Lỗi đặt hàng:', error);
      
      // Xử lý các lỗi cụ thể từ API
      if (error.response) {
        const errorData = error.response.data;
        if (error.response.status === 401) {
          throw { success: false, message: 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại', code: 401 };
        } else if (errorData) {
          // Trả về thông báo lỗi từ API
          throw errorData;
        }
      }
      
      // Nếu không có response hoặc response không có data
      throw { success: false, message: 'Có lỗi xảy ra khi đặt hàng' };
    }
  },

  // Lấy danh sách đơn hàng
  getOrders: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/DonHang/DanhSach`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi lấy danh sách đơn hàng:', error);
      if (error.response?.status === 401) {
        throw { success: false, message: 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại', code: 401 };
      }
      throw error.response?.data || { success: false, message: 'Không thể tải danh sách đơn hàng' };
    }
  },

  // Lấy chi tiết đơn hàng
  getOrderDetail: async (orderId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/DonHang/ChiTiet/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Lỗi lấy chi tiết đơn hàng ${orderId}:`, error);
      if (error.response?.status === 401) {
        throw { success: false, message: 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại', code: 401 };
      }
      throw error.response?.data || { success: false, message: 'Không thể tải chi tiết đơn hàng' };
    }
  },

  // Tạo đơn hàng mẫu (cho testing)
  createSampleOrder: async (addressId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/DonHang/TaoDonHangMau?addressId=${addressId}`, 
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Lỗi tạo đơn hàng mẫu:', error);
      throw error.response?.data || { success: false, message: 'Không thể tạo đơn hàng mẫu' };
    }
  },
  
  // Kiểm tra trạng thái thanh toán
  checkPaymentStatus: async (orderId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/DonHang/TrangThaiThanhToan/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Lỗi kiểm tra trạng thái thanh toán đơn hàng ${orderId}:`, error);
      throw error.response?.data || { success: false, message: 'Không thể kiểm tra trạng thái thanh toán' };
    }
  }
}; 