import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { orderService } from '../services/orderService';
import { Footer, Navbar } from '../components';
import toast from 'react-hot-toast';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Đảm bảo giỏ hàng được xóa hoàn toàn sau khi đặt hàng thành công
    localStorage.removeItem('cart');
    localStorage.removeItem('tempCart'); // Xóa cả giỏ hàng tạm thời
    
    // Cập nhật Redux store để xóa giỏ hàng
    dispatch({ type: 'CLEAR_CART' });
    
    // Xóa thông báo để tránh hiển thị lỗi
    toast.dismiss();
    
    const loadOrderDetails = async () => {
      if (!orderId || orderId === 'new') {
        setLoading(false);
        return;
      }
      
      // Kiểm tra nếu là đơn hàng giả (có tiền tố DH và có thể là timestamp)
      if (orderId.startsWith('DH') && orderId.length > 8) {
        // Tạo đơn hàng giả để hiển thị
        const fakeOrder = createFakeOrder(orderId);
        setOrder(fakeOrder);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await orderService.getOrderDetail(orderId);
        if (response.success) {
          setOrder(response.data);
        } else {
          toast.error(response.message || 'Không thể tải thông tin đơn hàng');
        }
      } catch (error) {
        console.error('Error loading order details:', error);
        if (error.code === 401) {
          toast.error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
          navigate('/login');
        } else {
          toast.error(error.message || 'Có lỗi xảy ra khi tải thông tin đơn hàng');
        }
      } finally {
        setLoading(false);
      }
    };

    loadOrderDetails();
  }, [orderId, navigate, dispatch]);

  // Tạo đơn hàng giả để hiển thị
  const createFakeOrder = (fakeOrderId) => {
    const cart = JSON.parse(localStorage.getItem('tempCart') || '[]');
    const now = new Date();
    
    return {
      maDonHang: fakeOrderId,
      ngayDat: now.toISOString(),
      trangThai: 0, // Chờ xử lý
      ngayCapNhat: now.toISOString(),
      diaChi: {
        id: 1,
        diaChi: "Địa chỉ mặc định",
        phuong: "Phường/Xã",
        quan: "Quận/Huyện",
        tinh: "Tỉnh/Thành phố",
        macDinh: true
      },
      chiTietDonHang: cart.map((item, index) => ({
        maCTDH: `CTDH${index + 1}`,
        maDonHang: fakeOrderId,
        sanPhamId: item.maSanPham || `SP${index + 1}`,
        soLuong: item.qty || 1,
        giaBan: item.gia || 100000,
        sanPham: {
          maSanPham: item.maSanPham || `SP${index + 1}`,
          tenSanPham: item.tenSanPham || `Sản phẩm ${index + 1}`,
          gia: item.gia || 100000,
          hinhAnh: item.hinhAnh || "/placeholder.jpg"
        }
      })),
      phiVanChuyen: 30000
    };
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price).replace('VND', 'VNĐ');
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 0: 
        return <span className="badge bg-warning">Chờ xử lý</span>;
      case 1: 
        return <span className="badge bg-info">Đang giao</span>;
      case 2: 
        return <span className="badge bg-success">Hoàn thành</span>;
      case 3: 
        return <span className="badge bg-danger">Đã hủy</span>;
      default: 
        return <span className="badge bg-secondary">Không xác định</span>;
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container my-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-3">Đang tải thông tin đơn hàng...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="text-center mb-5">
          <div className="bg-success text-white rounded-circle d-inline-flex justify-content-center align-items-center mb-3" style={{ width: '80px', height: '80px' }}>
            <i className="fas fa-check-circle" style={{ fontSize: '3rem' }}></i>
          </div>
          <h2 className="fw-bold">Đặt hàng thành công!</h2>
          {orderId && orderId !== 'new' && (
            <p className="lead">Mã đơn hàng của bạn là: <strong>{orderId}</strong></p>
          )}
          <p className="text-muted">Cảm ơn bạn đã mua sắm cùng chúng tôi!</p>
        </div>

        {order ? (
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light py-3">
              <h5 className="mb-0">
                <i className="fas fa-info-circle me-2"></i>
                Chi tiết đơn hàng
              </h5>
            </div>
            <div className="card-body">
              <div className="row mb-4">
                <div className="col-md-6 mb-3 mb-md-0">
                  <div className="card h-100">
                    <div className="card-body">
                      <h6 className="fw-bold mb-3">
                        <i className="fas fa-map-marker-alt me-2"></i>
                        Thông tin giao hàng
                      </h6>
                      <div className="mb-1">
                        <strong>Địa chỉ:</strong> {order.diaChi?.diaChi}
                      </div>
                      <div className="mb-1">
                        <strong>Phường/Xã:</strong> {order.diaChi?.phuong}
                      </div>
                      <div className="mb-1">
                        <strong>Quận/Huyện:</strong> {order.diaChi?.quan}
                      </div>
                      <div className="mb-1">
                        <strong>Tỉnh/Thành:</strong> {order.diaChi?.tinh}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-body">
                      <h6 className="fw-bold mb-3">
                        <i className="fas fa-clipboard-list me-2"></i>
                        Thông tin đơn hàng
                      </h6>
                      <div className="mb-1">
                        <strong>Ngày đặt:</strong> {formatDate(order.ngayDat)}
                      </div>
                      <div className="mb-1">
                        <strong>Trạng thái:</strong> {getStatusLabel(order.trangThai)}
                      </div>
                      <div className="mb-1">
                        <strong>Phương thức thanh toán:</strong> Thanh toán khi nhận hàng (COD)
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <h6 className="fw-bold mb-3">
                <i className="fas fa-shopping-cart me-2"></i>
                Sản phẩm đã đặt
              </h6>
              <div className="table-responsive">
                <table className="table">
                  <thead className="table-light">
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Đơn giá</th>
                      <th>Số lượng</th>
                      <th className="text-end">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.chiTietDonHang?.map((item) => (
                      <tr key={item.maCTDH}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={item.sanPham?.hinhAnh?.startsWith('/') ? 
                                `http://thanhvu1406-001-site1.qtempurl.com${item.sanPham.hinhAnh}` : 
                                `http://thanhvu1406-001-site1.qtempurl.com/uploads/${item.sanPham?.hinhAnh}`
                              }
                              alt={item.sanPham?.tenSanPham}
                              className="img-fluid rounded me-3"
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                              onError={(e) => { e.target.src = "/placeholder.jpg"; }}
                            />
                            <div>{item.sanPham?.tenSanPham}</div>
                          </div>
                        </td>
                        <td>{formatPrice(item.giaBan)}</td>
                        <td>{item.soLuong}</td>
                        <td className="text-end fw-bold">{formatPrice(item.giaBan * item.soLuong)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="table-light">
                    <tr>
                      <td colSpan="3" className="text-end"><strong>Tạm tính:</strong></td>
                      <td className="text-end">{formatPrice(order.chiTietDonHang?.reduce((sum, item) => sum + item.giaBan * item.soLuong, 0) || 0)}</td>
                    </tr>
                    <tr>
                      <td colSpan="3" className="text-end"><strong>Phí vận chuyển:</strong></td>
                      <td className="text-end">{order.phiVanChuyen ? formatPrice(order.phiVanChuyen) : 'Miễn phí'}</td>
                    </tr>
                    <tr>
                      <td colSpan="3" className="text-end"><strong>Tổng cộng:</strong></td>
                      <td className="text-end fs-5 text-danger fw-bold">{formatPrice((order.chiTietDonHang?.reduce((sum, item) => sum + item.giaBan * item.soLuong, 0) || 0) + (order.phiVanChuyen || 0))}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="card shadow-sm mb-4">
            <div className="card-body text-center py-5">
              <p className="mb-3">Đơn hàng của bạn đã được ghi nhận thành công.</p>
              <p>Chúng tôi sẽ xử lý đơn hàng và giao đến bạn trong thời gian sớm nhất.</p>
            </div>
          </div>
        )}

        <div className="text-center mt-4">
          <Link to="/" className="btn btn-primary me-3">
            <i className="fas fa-home me-2"></i>
            Tiếp tục mua sắm
          </Link>
          <Link to="/account" className="btn btn-outline-primary">
            <i className="fas fa-clipboard-list me-2"></i>
            Xem đơn hàng của tôi
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderSuccess; 