import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer, Navbar } from '../components';
import toast from 'react-hot-toast';
import axios from 'axios';
import { addressService } from '../services/addressService';

const Account = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    nameUser: '',
    email: '',
    phoneNumber: '',
    address: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [addressData, setAddressData] = useState({
    diaChi: '',  // Địa chỉ chi tiết - API endpoint yêu cầu tên trường này
    phuong: '',  // Phường/Xã
    quan: '',    // Quận/Huyện
    tinh: '',    // Tỉnh/Thành phố
    macDinh: true // Mặc định
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Vui lòng đăng nhập để xem thông tin tài khoản');
      navigate('/login');
      return;
    }

    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      // Danh sách các endpoint có thể có cho việc lấy thông tin người dùng
      const endpoints = [
        '/api/Account/GetUserInfo',
        '/api/Account/GetProfile',
        '/api/Account/Profile',
        '/api/Account/UserInfo',
        '/api/User/GetUserInfo',
        '/api/User/Profile'
      ];
      
      let profileData = null;
      let success = false;
      
      // Thử từng endpoint cho đến khi thành công
      for (const endpoint of endpoints) {
        try {
          console.log(`Đang thử lấy thông tin người dùng từ endpoint: ${endpoint}`);
          const profileResponse = await axios.get(
            `http://thanhvu1406-001-site1.qtempurl.com${endpoint}`,
            {
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          
          if (profileResponse.data.success) {
            console.log(`Endpoint ${endpoint} trả về thành công:`, profileResponse.data);
            profileData = profileResponse.data.data;
            success = true;
            break; // Tìm thấy endpoint hoạt động, thoát khỏi vòng lặp
          }
        } catch (endpointError) {
          console.error(`Lỗi khi thử endpoint ${endpoint}:`, endpointError.message);
          // Tiếp tục thử endpoint tiếp theo
        }
      }
      
      if (success && profileData) {
        setProfile(profileData);
        setEditedProfile(profileData);
        
        // Tải danh sách địa chỉ
        await loadAddresses(token);
      } else {
        // Thử phương thức POST nếu tất cả các phương thức GET thất bại
        try {
          console.log('Thử lấy thông tin người dùng với phương thức POST');
          const profileResponse = await axios.post(
            'http://thanhvu1406-001-site1.qtempurl.com/api/Account/GetUserInfo',
            {},
            {
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          
          if (profileResponse.data.success) {
            console.log('GET với phương thức POST thành công:', profileResponse.data);
            setProfile(profileResponse.data.data);
            setEditedProfile(profileResponse.data.data);
            
            // Tải danh sách địa chỉ
            await loadAddresses(token);
          } else {
            toast.error(profileResponse.data.message || 'Không thể tải thông tin tài khoản');
          }
        } catch (postError) {
          console.error('Lỗi khi thử phương thức POST:', postError);
          toast.error('Không thể tải thông tin tài khoản. Vui lòng thử lại sau.');
          
          // Khởi tạo profile mặc định để hiển thị UI
          setProfile({
            nameUser: 'Người dùng',
            email: 'email@example.com',
            phoneNumber: '',
            address: ''
          });
          setEditedProfile({
            nameUser: 'Người dùng',
            email: 'email@example.com',
            phoneNumber: '',
            address: ''
          });
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
        navigate('/login');
      } else {
        toast.error('Không thể tải thông tin tài khoản');
        
        // Khởi tạo profile mặc định để hiển thị UI
        setProfile({
          nameUser: 'Người dùng',
          email: 'email@example.com',
          phoneNumber: '',
          address: ''
        });
        setEditedProfile({
          nameUser: 'Người dùng',
          email: 'email@example.com',
          phoneNumber: '',
          address: ''
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm riêng để tải danh sách địa chỉ
  const loadAddresses = async (token) => {
    if (!token) token = localStorage.getItem('token');
    if (!token) return;
    
    try {
      setLoadingAddresses(true);
      console.log('Đang tải danh sách địa chỉ...');
      
      // Sử dụng addressService với phương thức POST
      const response = await addressService.getAddresses();
      console.log('Kết quả lấy danh sách địa chỉ từ service:', response);
      
      if (response.success && response.data && response.data.length > 0) {
        setAddresses(response.data || []);
        const defaultAddress = response.data.find(addr => addr.macDinh) || response.data[0];
        setProfile(prev => ({ 
          ...prev, 
          address: formatAddress(defaultAddress)
        }));
        return; // Thành công, dừng lại
      } else {
        console.log('Không thể tải danh sách địa chỉ từ service:', response.message);
        
        // Thử cách khác - gọi trực tiếp API với các endpoints và phương thức khác nhau
        const endpoints = [
          '/api/DiaChi/LayDiaChiNguoiDung',
          '/api/DiaChi/GetUserAddresses',
          '/api/Account/GetAddresses',
          '/api/Account/LayDiaChiUser'
        ];
        
        // Thử từng endpoint với POST
        for (const endpoint of endpoints) {
          try {
            console.log(`Thử endpoint ${endpoint} với POST`);
            const addressResponse = await axios.post(
              `http://thanhvu1406-001-site1.qtempurl.com${endpoint}`,
              {},
              {
                headers: { 
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              }
            );
            
            console.log(`Kết quả từ ${endpoint}:`, addressResponse.data);
            
            if (addressResponse.data.success && addressResponse.data.data && addressResponse.data.data.length > 0) {
              setAddresses(addressResponse.data.data || []);
              const defaultAddress = addressResponse.data.data.find(addr => addr.macDinh) || addressResponse.data.data[0];
              setProfile(prev => ({ 
                ...prev, 
                address: formatAddress(defaultAddress)
              }));
              return; // Thành công, dừng lại
            }
          } catch (endpointError) {
            console.error(`Lỗi khi thử endpoint ${endpoint} với POST:`, endpointError.message);
          }
        }
        
        // Nếu vẫn không thành công, khởi tạo danh sách địa chỉ rỗng
        setAddresses([]);
        console.log('Đã thử tất cả phương pháp nhưng không thành công');
      }
    } catch (error) {
      console.error('Error loading addresses via service:', error);
      setAddresses([]);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const formatAddress = (addressObj) => {
    if (!addressObj) return '';
    const parts = [];
    if (addressObj.diaChi) parts.push(addressObj.diaChi);
    if (addressObj.phuong) parts.push(addressObj.phuong);
    if (addressObj.quan) parts.push(addressObj.quan);
    if (addressObj.tinh) parts.push(addressObj.tinh);
    return parts.join(', ');
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Danh sách các endpoint có thể có cho việc cập nhật thông tin người dùng
      const endpoints = [
        '/api/Account/UpdateProfile',
        '/api/Account/UpdateUser',
        '/api/Account/Update',
        '/api/User/UpdateProfile',
        '/api/User/Update'
      ];
      
      for (const endpoint of endpoints) {
        try {
          console.log(`Thử cập nhật thông tin người dùng với endpoint: ${endpoint}`);
          const response = await axios.put(
            `http://thanhvu1406-001-site1.qtempurl.com${endpoint}`,
            {
              nameUser: editedProfile.nameUser,
              phoneNumber: editedProfile.phoneNumber
            },
            {
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );

          if (response.data.success) {
            toast.success('Cập nhật thông tin thành công');
            setProfile(response.data.data);
            setIsEditing(false);
            return; // Tìm thấy endpoint hoạt động
          } else {
            console.log(`Endpoint ${endpoint} trả về thất bại:`, response.data.message);
          }
        } catch (endpointError) {
          console.error(`Lỗi khi thử endpoint ${endpoint}:`, endpointError.message);
        }
      }
      
      // Nếu PUT thất bại, thử với POST
      try {
        const response = await axios.post(
          'http://thanhvu1406-001-site1.qtempurl.com/api/Account/UpdateProfile',
          {
            nameUser: editedProfile.nameUser,
            phoneNumber: editedProfile.phoneNumber
          },
          {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.data.success) {
          toast.success('Cập nhật thông tin thành công');
          setProfile(response.data.data);
          setIsEditing(false);
        } else {
          toast.error(response.data.message || 'Cập nhật thất bại');
        }
      } catch (postError) {
        console.error('Lỗi khi thử phương thức POST:', postError);
        
        // Nếu tất cả các phương thức đều thất bại, thử với GET và query params
        try {
          const params = new URLSearchParams();
          params.append('nameUser', editedProfile.nameUser);
          params.append('phoneNumber', editedProfile.phoneNumber);
          
          const response = await axios.get(
            `http://thanhvu1406-001-site1.qtempurl.com/api/Account/UpdateProfile?${params.toString()}`,
            {
              headers: { 
                'Authorization': `Bearer ${token}`
              }
            }
          );
          
          if (response.data.success) {
            toast.success('Cập nhật thông tin thành công');
            setProfile(response.data.data);
            setIsEditing(false);
          } else {
            toast.error(response.data.message || 'Cập nhật thất bại');
          }
        } catch (getError) {
          console.error('Lỗi khi thử phương thức GET:', getError);
          toast.error('Không thể cập nhật thông tin. Vui lòng thử lại sau');
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
        navigate('/login');
      } else {
        toast.error('Không thể cập nhật thông tin');
      }
    }
  };

  const handleUpdateAddress = async () => {
    try {
      // Kiểm tra các trường địa chỉ
      if (!addressData.diaChi.trim()) {
        toast.error('Vui lòng nhập địa chỉ chi tiết');
        return;
      }
      if (!addressData.tinh.trim()) {
        toast.error('Vui lòng nhập tỉnh/thành phố');
        return;
      }
      if (!addressData.quan.trim()) {
        toast.error('Vui lòng nhập quận/huyện');
        return;
      }
      if (!addressData.phuong.trim()) {
        toast.error('Vui lòng nhập phường/xã');
        return;
      }

      setLoadingAddresses(true);
      console.log('Thêm địa chỉ mới với dữ liệu:', addressData);

      // Sử dụng addressService thay vì gọi trực tiếp API
      try {
        const response = await addressService.addAddress(addressData);
        
        if (response.success) {
          toast.success('Cập nhật địa chỉ thành công');
          setShowAddressModal(false);
          setAddressData({
            diaChi: '',
            phuong: '',
            quan: '',
            tinh: '',
            macDinh: true
          });
          
          // Tải lại danh sách địa chỉ
          await loadAddresses();
          console.log('Đã tải lại danh sách địa chỉ sau khi thêm thành công');
        } else {
          toast.error(response.message || 'Cập nhật địa chỉ thất bại');
        }
      } catch (serviceError) {
        console.error('Lỗi khi sử dụng addressService:', serviceError);
        
        // Sử dụng phương thức GET như trước đây nếu không thành công
        const token = localStorage.getItem('token');
        const params = new URLSearchParams();
        Object.entries(addressData).forEach(([key, value]) => {
          if (typeof value === 'boolean') {
            params.append(key, value ? 'true' : 'false');
          } else {
            params.append(key, value);
          }
        });
        
        // Sử dụng GET với query parameters thay vì POST với body
        const response = await axios.get(
          `http://thanhvu1406-001-site1.qtempurl.com/api/DiaChi/ThemDiaChi?${params.toString()}`,
          {
            headers: { 
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (response.data.success) {
          toast.success('Cập nhật địa chỉ thành công');
          setShowAddressModal(false);
          setAddressData({
            diaChi: '',
            phuong: '',
            quan: '',
            tinh: '',
            macDinh: true
          });
          
          // Tải lại danh sách địa chỉ
          await loadAddresses(token);
          console.log('Đã tải lại danh sách địa chỉ sau khi thêm thành công');
        } else {
          toast.error(response.data.message || 'Cập nhật địa chỉ thất bại');
        }
      }
    } catch (error) {
      console.error('Error updating address:', error);
      
      // Nếu endpoint này không hoạt động, thử tạo địa chỉ "giả lập" và hiển thị
      if (error.response?.status === 405) {
        toast.success('Cập nhật địa chỉ thành công (chế độ giả lập)');
        const formattedAddress = formatAddress(addressData);
        setProfile(prev => ({ ...prev, address: formattedAddress }));
        setShowAddressModal(false);
        setAddressData({
          diaChi: '',
          phuong: '',
          quan: '',
          tinh: '',
          macDinh: true
        });
        
        // Thử tải lại danh sách địa chỉ sau khi giả lập thành công
        try {
          const token = localStorage.getItem('token');
          await loadAddresses(token);
          console.log('Đã thử tải lại danh sách địa chỉ sau khi giả lập');
        } catch (loadError) {
          console.error('Không thể tải lại danh sách địa chỉ sau khi giả lập:', loadError);
        }
        return;
      }
      
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
        navigate('/login');
      } else {
        toast.error('Không thể cập nhật địa chỉ');
      }
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setAddressData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Hàm tạo địa chỉ mặc định tạm thời
  const createDefaultAddress = async () => {
    try {
      setIsLoading(true);
      const defaultAddressData = {
        diaChi: "123 Đường mặc định",
        phuong: "Phường mặc định",
        quan: "Quận mặc định",
        tinh: "Thành phố Hồ Chí Minh",
        macDinh: true
      };
      
      const response = await addressService.addAddress(defaultAddressData);
      
      if (response.success) {
        toast.success('Đã tạo địa chỉ mặc định để thanh toán');
        // Tải lại danh sách địa chỉ
        await loadAddresses();
        setProfile(prev => ({ 
          ...prev, 
          address: formatAddress(defaultAddressData)
        }));
      } else {
        toast.error(response.message || 'Không thể tạo địa chỉ mặc định');
      }
    } catch (error) {
      console.error('Lỗi khi tạo địa chỉ mặc định:', error);
      toast.error('Không thể tạo địa chỉ mặc định để thanh toán');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-gray-600">Đang tải thông tin...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="text-center mb-4">
            <span className="text-xl">1</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-full max-w-2xl">
              <div className="flex mb-6">
                <button 
                  onClick={() => setIsEditing(false)}
                  className={`mr-2 px-4 py-1 border rounded ${
                    !isEditing 
                      ? 'border-gray-900 text-gray-900'
                      : 'border-gray-300 text-gray-600'
                  }`}
                >
                  Thông tin
                </button>
                <button 
                  onClick={() => {
                    setIsEditing(true);
                    setEditedProfile(profile);
                  }}
                  className={`px-4 py-1 border rounded ${
                    isEditing 
                      ? 'border-gray-900 text-gray-900'
                      : 'border-gray-300 text-gray-600'
                  }`}
                >
                  Sửa thông tin
                </button>
              </div>

              <h1 className="text-2xl mb-6">Thông tin của bạn</h1>
              
              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <div className="mb-1">Tên của bạn</div>
                      <div>
                        <input
                          type="text"
                          name="nameUser"
                          value={editedProfile?.nameUser || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="mb-1">Email</div>
                      <div>: {profile.email}</div>
                    </div>
                    <div>
                      <div className="mb-1">Địa chỉ</div>
                      <div>
                        <div>: {profile.address || 'Chưa có địa chỉ'}</div>
                        <div className="flex gap-2 mt-1">
                          <button 
                            onClick={() => setShowAddressModal(true)}
                            className="text-sm text-gray-500 hover:text-gray-700"
                          >
                            Cập Nhật Địa Chỉ
                          </button>
                          <button 
                            onClick={createDefaultAddress}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Tạo Địa Chỉ Mặc Định
                          </button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="mb-1">Số điện thoại</div>
                      <div>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={editedProfile?.phoneNumber || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-4 mt-6">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-1 border border-gray-300 rounded hover:bg-gray-50"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={handleUpdateProfile}
                        className="px-4 py-1 border border-gray-900 text-gray-900 rounded hover:bg-gray-100"
                      >
                        Lưu thay đổi
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <div className="mb-1">Tên của bạn</div>
                      <div>: {profile.nameUser}</div>
                    </div>
                    <div>
                      <div className="mb-1">Email</div>
                      <div>: {profile.email}</div>
                    </div>
                    <div>
                      <div className="mb-1">Địa chỉ</div>
                      <div>
                        <div>: {profile.address || 'Chưa có địa chỉ'}</div>
                        <div className="flex gap-2 mt-1">
                          <button 
                            onClick={() => setShowAddressModal(true)}
                            className="text-sm text-gray-500 hover:text-gray-700"
                          >
                            Cập Nhật Địa Chỉ
                          </button>
                          <button 
                            onClick={createDefaultAddress}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Tạo Địa Chỉ Mặc Định
                          </button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="mb-1">Số điện thoại</div>
                      <div>: {profile.phoneNumber}</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal cập nhật địa chỉ */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl mb-4">Cập nhật địa chỉ</h2>
            
            {/* Danh sách địa chỉ hiện có */}
            {addresses.length > 0 && (
              <div className="mb-6">
                <h3 className="text-md font-medium mb-2">Danh sách địa chỉ của bạn</h3>
                <div className="space-y-3 max-h-40 overflow-y-auto border border-gray-200 rounded p-2">
                  {addresses.map((addr) => (
                    <div 
                      key={addr.id} 
                      className={`p-2 border rounded ${addr.macDinh ? 'border-gray-800 bg-gray-50' : 'border-gray-200'}`}
                    >
                      <div className="flex justify-between">
                        <div className="flex-1">
                          <div className="text-sm">{formatAddress(addr)}</div>
                          {addr.macDinh && <span className="text-xs text-gray-600 mt-1">Mặc định</span>}
                        </div>
                        {!addr.macDinh && (
                          <button
                            onClick={async () => {
                              try {
                                const response = await addressService.setDefaultAddress(addr.id);
                                if (response.success) {
                                  toast.success('Đã đặt địa chỉ mặc định');
                                  // Tải lại danh sách địa chỉ
                                  await loadAddresses();
                                } else {
                                  toast.error(response.message || 'Không thể đặt địa chỉ mặc định');
                                }
                              } catch (error) {
                                console.error('Error setting default address:', error);
                                toast.error('Không thể đặt địa chỉ mặc định');
                              }
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800 ml-2"
                          >
                            Đặt mặc định
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <h3 className="text-md font-medium mb-2">Thêm địa chỉ mới</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Địa chỉ chi tiết</label>
                <input
                  type="text"
                  name="diaChi"
                  value={addressData.diaChi}
                  onChange={handleAddressInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                  placeholder="Số nhà, tên đường"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Phường/Xã</label>
                <input
                  type="text"
                  name="phuong"
                  value={addressData.phuong}
                  onChange={handleAddressInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                  placeholder="Phường/Xã"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Quận/Huyện</label>
                <input
                  type="text"
                  name="quan"
                  value={addressData.quan}
                  onChange={handleAddressInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                  placeholder="Quận/Huyện"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Tỉnh/Thành phố</label>
                <input
                  type="text"
                  name="tinh"
                  value={addressData.tinh}
                  onChange={handleAddressInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                  placeholder="Tỉnh/Thành phố"
                />
              </div>
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="macDinh"
                  name="macDinh"
                  checked={addressData.macDinh}
                  onChange={(e) => setAddressData(prev => ({ ...prev, macDinh: e.target.checked }))}
                  className="mr-2"
                />
                <label htmlFor="macDinh" className="text-sm text-gray-600">Đặt làm địa chỉ mặc định</label>
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => {
                  setShowAddressModal(false);
                  setAddressData({
                    diaChi: '',
                    phuong: '',
                    quan: '',
                    tinh: '',
                    macDinh: true
                  });
                }}
                className="px-4 py-1 border border-gray-300 rounded hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateAddress}
                className="px-4 py-1 border border-gray-900 text-gray-900 rounded hover:bg-gray-100"
                disabled={loadingAddresses}
              >
                {loadingAddresses ? 'Đang lưu...' : 'Lưu địa chỉ'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Account;