import axios from 'axios';
const api = axios.create({
  baseURL: 'http://thanhvu1406-001-site1.qtempurl.com/api',
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export const login = async (credentials) => {
  try {
    const response = await api.post('/Account/DangNhap', credentials);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const registerUser = async (userData) => {
  try {
    // Đảm bảo payload khớp chính xác với yêu cầu của API
    const payload = {
      NameUser: userData.nameUser,
      UserName: userData.userName,
      BirthDay: userData.birthDay,
      Email: userData.email,
      PhoneNumber: userData.phoneNumber,
      Password: userData.password,
      ComfrimPassword: userData.comfrimPassword
    };
    
    console.log('Sending registration data:', payload);
    
    const response = await fetch('http://thanhvu1406-001-site1.qtempurl.com/api/Account/DangKi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload),
      mode: 'cors'
    });
    
    const data = await response.json();
    console.log('API Response:', data);
    
    if (response.ok) {
      return {
        success: true,
        message: 'Đăng ký thành công',
        data: data
      };
    } else {
      // Xử lý các trường hợp lỗi từ API
      let errorMessage = data.message || 'Đăng ký thất bại';
      
      if (data.errors) {
        // Nếu API trả về object errors, ghép các lỗi lại
        errorMessage = Object.values(data.errors).flat().join(', ');
      }
      
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('Registration error:', error);
    
    // Xử lý các trường hợp lỗi cụ thể
    let errorMessage = error.message || 'Đăng ký thất bại';
    
    if (error.message.includes('duplicate') || error.message.includes('already exists')) {
      errorMessage = 'Email hoặc tên đăng nhập đã được sử dụng';
    }
    
    throw new Error(errorMessage);
  }
};

export default api;